package com.jwsxy.screenback.repository.impl;

import com.jwsxy.screenback.repository.MonitorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 监控数据仓库实现类，使用JdbcTemplate访问数据库
 */
@Repository
public class MonitorRepositoryImpl implements MonitorRepository {

    private static final Logger logger = LoggerFactory.getLogger(MonitorRepositoryImpl.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 获取所有裁剪数据的汇总
     *
     * @return 所有裁剪数据汇总，包含各种时间指标
     */
    @Override
    public Map<String, Double> getTotalCutDataSummary() {
        Map<String, Double> result = new HashMap<>();
        // 设置默认值，防止查询结果为空
        result.put("cutPerimeter", 0.0);   // 切割周长
        result.put("moveSpeed", 0.0);      // 移动速度
        result.put("totalSeconds", 0.0);   // 总秒数

        try {
            // 直接从da_cut表查询数据
            String sql = "SELECT " +
                    "ISNULL(SUM(CutPerimeter), 0) AS TotalCutPerimeter, " +  // 切割周长
                    "ISNULL(AVG(MoveSpeed), 0) AS AvgMoveSpeed, " +          // 平均移动速度
                    "MIN(StartTime) AS MinStartTime, " +                     // 最早开始时间
                    "MAX(EndTime) AS MaxEndTime " +                          // 最晚结束时间
                    "FROM da_cut";
            
            List<Map<String, Object>> queryResults = jdbcTemplate.query(sql,
                    (rs, rowNum) -> {
                        Map<String, Object> rowData = new HashMap<>();
                        // 获取查询结果
                        rowData.put("cutPerimeter", rs.getDouble("TotalCutPerimeter"));
                        rowData.put("moveSpeed", rs.getDouble("AvgMoveSpeed"));
                        
                        // 计算开始时间和结束时间之间的秒数
                        java.sql.Timestamp minStartTime = rs.getTimestamp("MinStartTime");
                        java.sql.Timestamp maxEndTime = rs.getTimestamp("MaxEndTime");
                        
                        if (minStartTime != null && maxEndTime != null) {
                            // 计算两个时间之间的秒数差异
                            long diffInSeconds = (maxEndTime.getTime() - minStartTime.getTime()) / 1000;
                            rowData.put("totalSeconds", (double) diffInSeconds);
                        } else {
                            rowData.put("totalSeconds", 0.0);
                        }
                        
                        return rowData;
                    }
            );
            
            // 处理查询结果
            if (!queryResults.isEmpty()) {
                Map<String, Object> data = queryResults.get(0);
                // 将Object类型的值转换为Double类型
                data.forEach((key, value) -> result.put(key, value instanceof Number ? ((Number) value).doubleValue() : 0.0));
                logger.info("成功获取移动率数据");
            }
        } catch (Exception e) {
            logger.error("获取移动率数据时发生错误: {}", e.getMessage(), e);
        }

        return result;
    }

    /**
     * 获取所有裁剪数据的周长汇总
     *
     * @return 所有数据的周长汇总，包含总周长和平均周长等指标
     */
    @Override
    public Map<String, Object> getTotalPerimeterData() {
        Map<String, Object> result = new HashMap<>();
        // 设置默认值，防止查询结果为空
        result.put("totalCutPerimeter", 0.0);    // 总切割周长
        result.put("totalMarkPerimeter", 0.0);   // 总标记周长
        result.put("avgCutPerimeter", 0.0);      // 平均切割周长
        result.put("avgMarkPerimeter", 0.0);     // 平均标记周长
        result.put("totalPieces", 0);            // 总件数
        
        try {
            // 直接从da_cut表查询数据
            String sql = "SELECT " +
                    "ISNULL(SUM(CutPerimeter), 0) AS TotalCutPerimeter, " +
                    "ISNULL(SUM(MarkPerimeter), 0) AS TotalMarkPerimeter, " +
                    "ISNULL(AVG(CutPerimeter), 0) AS AvgCutPerimeter, " +
                    "ISNULL(AVG(MarkPerimeter), 0) AS AvgMarkPerimeter, " +
                    "ISNULL(COUNT(DISTINCT cutid), 0) AS TotalPieces " +
                    "FROM da_cut";
            
            // 使用query方法执行SQL查询
            List<Map<String, Object>> queryResults = jdbcTemplate.query(sql,
                    (rs, rowNum) -> {
                        Map<String, Object> rowData = new HashMap<>();
                        // 获取查询结果
                        rowData.put("totalCutPerimeter", rs.getDouble("TotalCutPerimeter"));
                        rowData.put("totalMarkPerimeter", rs.getDouble("TotalMarkPerimeter"));
                        rowData.put("avgCutPerimeter", rs.getDouble("AvgCutPerimeter"));
                        rowData.put("avgMarkPerimeter", rs.getDouble("AvgMarkPerimeter"));
                        rowData.put("totalPieces", rs.getInt("TotalPieces"));
                        return rowData;
                    }
            );
            
            // 处理查询结果
            if (!queryResults.isEmpty()) {
                // 将查询结果中的数据复制到结果Map中
                Map<String, Object> data = queryResults.get(0);
                result.putAll(data);
                logger.info("成功获取周长数据");
            }
        } catch (Exception e) {
            // 记录错误，但返回默认值
            logger.error("获取总周长数据时发生错误: {}", e.getMessage(), e);
        }
        
        return result;
    }
    
    /**
     * 获取机床状态数据
     * 从CutStateLast视图获取最新的机床状态数据
     * 
     * @return 包含机床状态数据的列表
     */
    @Override
    public List<Map<String, Object>> getMachineStatusData() {
        // 记录开始查询时间
        long startTime = System.currentTimeMillis();
        logger.info("开始查询裁床综合状态数据...");
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        try {
            // 优化：使用单一查询获取所有必要数据，减少数据库负担
            String sql = "SELECT c.StatusID, c.MachineSN, c.ModifyDate, c.online, c.isrun, c.runtime, c.power, " +
                         "ISNULL((SELECT AVG(d.CutPerimeter / NULLIF(DATEDIFF(MINUTE, d.StartTime, d.EndTime), 0)) " +
                         "        FROM da_cut d " +
                         "        WHERE d.cutid = c.MachineSN " +
                         "        AND d.CutPerimeter > 0 " +
                         "        AND d.StartTime IS NOT NULL " +
                         "        AND d.EndTime IS NOT NULL " +
                         "        AND DATEDIFF(MINUTE, d.StartTime, d.EndTime) > 0), 0) AS speed " +
                         "FROM CutStateLast c " +
                         "ORDER BY c.MachineSN";
            
            // 使用query方法执行SQL查询
            result = jdbcTemplate.query(sql,
                    (rs, rowNum) -> {
                        Map<String, Object> rowData = new HashMap<>();
                        // 获取查询结果 - 基本字段
                        String machineSN = rs.getString("MachineSN");
                        rowData.put("machineSN", machineSN);
                        rowData.put("modifyDate", rs.getTimestamp("ModifyDate"));
                        rowData.put("onlineStatus", rs.getInt("online"));
                        
                        // 获取runtime、power和speed字段值
                        double runtime = 0.0;
                        double power = 0.0;
                        double speed = 0.0;
                        
                        try {
                            runtime = rs.getDouble("runtime");
                            power = rs.getDouble("power");
                            speed = rs.getDouble("speed");
                            
                            // 将runtime(秒)转换为小时
                            double runningHours = runtime / 3600.0;
                            rowData.put("runningHours", runningHours);
                            rowData.put("power", power);
                            rowData.put("speed", speed);
                        } catch (Exception e) {
                            logger.warn("获取机床 {} 的数据字段失败: {}", machineSN, e.getMessage());
                        }
                        
                        // 设置默认车间信息
                        String workshop = "第一车间";
                        rowData.put("workshop", workshop);
                        
                        // 为了向后兼容，创建一个扩展的JSON结构
                        String statusJson = String.format(
                                "{\"online\":%d,\"energy\":%.2f,\"power\":%.2f,\"totalEnergy\":%.2f," +
                                "\"speed\":%.2f,\"runningHours\":%.1f,\"workshop\":\"%s\"}",
                                rs.getInt("online"),
                                power,
                                power,
                                power,
                                speed,
                                runtime / 3600.0,
                                workshop
                        );
                        rowData.put("statusTxt", statusJson);
                        
                        return rowData;
                    }
            );
            
            // 记录查询结果
            long endTime = System.currentTimeMillis();
            if (result.isEmpty()) {
                logger.warn("未找到任何裁床综合状态数据! 查询耗时: {}ms", (endTime - startTime));
            } else {
                logger.info("成功获取 {} 条裁床综合状态数据，查询耗时: {}ms", 
                        result.size(), (endTime - startTime));
            }
        } catch (Exception e) {
            // 记录错误，但返回空列表
            logger.error("获取裁床综合状态数据时发生错误: {}", e.getMessage(), e);
            
            // 尝试简化查询再次获取数据
            try {
                logger.info("尝试使用简化查询重新获取数据...");
                String simpleSql = "SELECT MachineSN, ModifyDate, online, power, runtime " +
                        "FROM CutStateLast " +
                        "ORDER BY MachineSN";
                
                // 使用简化查询再次尝试 - 不获取速度数据
                result = jdbcTemplate.query(simpleSql,
                        (rs, rowNum) -> {
                            Map<String, Object> rowData = new HashMap<>();
                            rowData.put("machineSN", rs.getString("MachineSN"));
                            rowData.put("modifyDate", rs.getTimestamp("ModifyDate"));
                            rowData.put("onlineStatus", rs.getInt("online"));
                            
                            // 获取power和runtime字段值
                            double power = 0.0;
                            double runtime = 0.0;
                            double speed = 0.0; // 简化版本默认速度为0
                            try {
                                power = rs.getDouble("power");
                                runtime = rs.getDouble("runtime");
                                // 将runtime(秒)转换为小时
                                double runningHours = runtime / 3600.0;
                                rowData.put("power", power);
                                rowData.put("runningHours", runningHours);
                                rowData.put("speed", speed);
                            } catch (Exception e2) {
                                logger.warn("简化查询中获取机床 {} 的字段失败: {}", rs.getString("MachineSN"), e2.getMessage());
                            }
                            
                            // 设置默认车间
                            rowData.put("workshop", "第一车间");
                            
                            // 创建包含能耗数据的JSON
                            String mockStatusJson = String.format(
                                    "{\"online\":%d,\"energy\":%.2f,\"power\":%.2f,\"totalEnergy\":%.2f,\"speed\":%.2f,\"runningHours\":%.1f,\"workshop\":\"第一车间\"}",
                                    rs.getInt("online"),
                                    power,
                                    power,
                                    power,
                                    speed,
                                    runtime / 3600.0
                            );
                            rowData.put("statusTxt", mockStatusJson);
                            
                            return rowData;
                        }
                );
                
                long endTime = System.currentTimeMillis();
                logger.info("简化查询获取到 {} 条数据，查询耗时: {}ms", result.size(), (endTime - startTime));
            } catch (Exception ex) {
                logger.error("简化查询也失败: {}", ex.getMessage(), ex);
            }
        }
        
        return result;
    }

    /**
     * 获取裁床运行数据，用于状态表格展示
     * 从CutStateLast视图获取裁床运行数据，包括设备ID、车间、速度和运行时长
     *
     * @return 包含裁床运行数据的列表
     */
    @Override
    public List<Map<String, Object>> getMachineRunningData() {
        // 使用默认分页参数调用分页方法
        return getMachineRunningData(1, 20);
    }

    /**
     * 获取裁床运行数据，支持分页
     * 从CutStateLast视图获取裁床运行数据，包括设备ID、车间、速度和运行时长
     *
     * @param page 页码（从1开始）
     * @param pageSize 每页记录数
     * @return 包含裁床运行数据的列表
     */
    @Override
    public List<Map<String, Object>> getMachineRunningData(int page, int pageSize) {
        // 确保参数有效
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 1000) pageSize = 1000; // 设置一个合理的上限
        
        // 计算SQL Server分页的OFFSET值
        int offset = (page - 1) * pageSize;
        
        // 记录开始查询时间
        long startTime = System.currentTimeMillis();
        logger.info("开始查询裁床运行数据 (页码: {}, 每页: {} 条)...", page, pageSize);
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        try {
            // 首先获取分页的MachineSN
            String paginationSql = "SELECT MachineSN " +
                    "FROM CutStateLast " +
                    "ORDER BY MachineSN " +
                    "OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";
            
            List<String> paginatedMachineSNs = jdbcTemplate.query(
                    paginationSql,
                    new Object[] { offset, pageSize },
                    (rs, rowNum) -> rs.getString("MachineSN")
            );
            
            // 如果没有数据，直接返回空结果
            if (paginatedMachineSNs.isEmpty()) {
                logger.warn("未找到任何裁床运行数据!");
                return result;
            }
            
            // 构建IN子句
            StringBuilder inClause = new StringBuilder();
            for (int i = 0; i < paginatedMachineSNs.size(); i++) {
                if (i > 0) inClause.append(",");
                inClause.append("'").append(paginatedMachineSNs.get(i)).append("'");
            }
            
            // 一次性获取所有需要的数据
            String sql = "SELECT cs.MachineSN AS machineId, " +
                    "'第一车间' AS workshop, " +
                    "cs.runtime / 3600.0 AS runningHours " +
                    "FROM CutStateLast cs " +
                    "WHERE cs.MachineSN IN (" + inClause.toString() + ") " +
                    "ORDER BY cs.MachineSN";
            
            // 执行查询获取基本数据
            List<Map<String, Object>> tempResults = jdbcTemplate.query(
                    sql,
                    (rs, rowNum) -> {
                        Map<String, Object> rowData = new HashMap<>();
                        rowData.put("machineId", rs.getString("machineId"));
                        rowData.put("workshop", rs.getString("workshop"));
                        rowData.put("runningHours", rs.getDouble("runningHours"));
                        return rowData;
                    }
            );
            
            // 批量获取速度信息
            String speedQuery = "WITH LatestCuts AS ( " +
                    "SELECT cutid, CutPerimeter, StartTime, EndTime, " +
                    "       ROW_NUMBER() OVER (PARTITION BY cutid ORDER BY EndTime DESC) AS rn " +
                    "FROM da_cut " +
                    "WHERE cutid IN (" + inClause.toString() + ") " +
                    "AND StartTime IS NOT NULL AND EndTime IS NOT NULL) " +
                    "SELECT cutid, " +
                    "CASE " +
                    "  WHEN CutPerimeter > 0 AND DATEDIFF(MINUTE, StartTime, EndTime) > 0 " +
                    "  THEN CONVERT(float, CutPerimeter) / NULLIF(DATEDIFF(MINUTE, StartTime, EndTime), 0) " +
                    "  ELSE 0 " +
                    "END AS speed " +
                    "FROM LatestCuts " +
                    "WHERE rn = 1";
            
            // 执行查询并构建速度映射
            Map<String, Double> speedMap = new HashMap<>();
            try {
                jdbcTemplate.query(
                        speedQuery,
                        (rs) -> {
                            String cutid = rs.getString("cutid");
                            double speed = rs.getDouble("speed");
                            speedMap.put(cutid, speed);
                        }
                );
            } catch (Exception e) {
                logger.error("批量获取速度数据失败: {}", e.getMessage(), e);
            }
            
            // 合并数据
            for (Map<String, Object> row : tempResults) {
                String machineId = (String) row.get("machineId");
                double speed = speedMap.getOrDefault(machineId, 0.0);
                row.put("speed", speed);
                result.add(row);
            }
            
            // 记录查询结果
            long endTime = System.currentTimeMillis();
            logger.info("成功获取第 {} 页裁床运行数据，共 {} 条，查询耗时: {}ms", 
                    page, result.size(), (endTime - startTime));
        } catch (Exception e) {
            // 记录错误
            logger.error("获取裁床运行数据时发生错误: {}", e.getMessage(), e);
            
            // 简化查询，不获取速度数据
            try {
                String simpleSql = "SELECT MachineSN AS machineId, " +
                        "'第一车间' AS workshop, " +
                        "0.0 AS speed, " +
                        "runtime / 3600.0 AS runningHours " +
                        "FROM CutStateLast " +
                        "ORDER BY MachineSN " +
                        "OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";
                
                result = jdbcTemplate.query(
                        simpleSql,
                        new Object[] { offset, pageSize },
                        (rs, rowNum) -> {
                            Map<String, Object> rowData = new HashMap<>();
                            rowData.put("machineId", rs.getString("machineId"));
                            rowData.put("workshop", rs.getString("workshop"));
                            rowData.put("speed", rs.getDouble("speed"));
                            rowData.put("runningHours", rs.getDouble("runningHours"));
                            return rowData;
                        }
                );
                
                logger.info("使用简化查询获取到 {} 条数据", result.size());
            } catch (Exception ex) {
                logger.error("简化查询也失败: {}", ex.getMessage(), ex);
            }
        }
        
        return result;
    }
    
    /**
     * 获取裁床运行数据的总记录数
     * 
     * @return 总记录数
     */
    @Override
    public int getMachineRunningDataCount() {
        try {
            // 从CutStateLast视图获取总记录数
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM CutStateLast",
                    Integer.class
            );
            logger.info("从CutStateLast视图获取到总记录数: {}", count != null ? count : 0);
            return count != null ? count : 0;
        } catch (Exception e) {
            logger.error("获取裁床运行数据总记录数时发生错误: {}", e.getMessage(), e);
            return 0;  // 出错时返回0
        }
    }

    /**
     * 获取裁剪总时间数据
     *
     * @return 裁剪总时间（小时）
     */
    @Override
    public Double getCutTimeData() {
        double totalCutTimeHours = 0.0;
        
        try {
            // 从CutStateLast视图查询数据
            String sql = "SELECT ISNULL(SUM(runtime), 0) AS TotalRuntime FROM CutStateLast";
            
            // 使用queryForObject方法直接获取总运行时间
            Double totalRuntime = jdbcTemplate.queryForObject(sql, Double.class);
            
            if (totalRuntime != null) {
                // 将秒转换为小时并保留一位小数
                totalCutTimeHours = totalRuntime / 3600.0;
                totalCutTimeHours = Math.round(totalCutTimeHours * 10) / 10.0;
                logger.info("成功获取裁剪总时间数据: {} 小时", totalCutTimeHours);
            }
        } catch (Exception e) {
            // 记录错误，但返回默认值
            logger.error("获取裁剪总时间数据时发生错误: {}", e.getMessage(), e);
        }
        
        return totalCutTimeHours;
    }

    /**
     * 获取裁剪速度数据
     *
     * @return 平均裁剪速度
     */
    @Override
    public Double getCutSpeedData() {
        double avgSpeed = 0.0;
        
        try {
            // 从da_cut表查询数据，计算平均裁剪速度
            // 裁剪速度 = 周长 / 裁剪时间(分钟)
            String sql = "WITH CutSpeedData AS (" +
                    "SELECT " +
                    "    CutPerimeter, " +
                    "    DATEDIFF(MINUTE, StartTime, EndTime) AS CutMinutes " +
                    "FROM da_cut " +
                    "WHERE CutPerimeter > 0 " +
                    "AND StartTime IS NOT NULL " +
                    "AND EndTime IS NOT NULL " +
                    "AND DATEDIFF(MINUTE, StartTime, EndTime) > 0" +
                    ") " +
                    "SELECT ISNULL(AVG(CutPerimeter / CutMinutes), 0) AS AvgSpeed " +
                    "FROM CutSpeedData";
            
            // 使用queryForObject方法直接获取平均速度
            Double speed = jdbcTemplate.queryForObject(sql, Double.class);
            
            if (speed != null) {
                // 保留两位小数
                avgSpeed = Math.round(speed * 100) / 100.0;
                logger.info("成功获取平均裁剪速度数据: {}", avgSpeed);
            }
        } catch (Exception e) {
            logger.error("获取平均裁剪速度数据时发生错误: {}", e.getMessage(), e);
        }
        
        return avgSpeed;
    }

    /**
     * 获取裁剪套数数据
     *
     * @return 裁剪套数（总件数）
     */
    @Override
    public Integer getCutSetsData() {
        int totalPieces = 0;
        
        try {
            // 从da_cut表查询裁剪套数数据
            String sql = "SELECT ISNULL(COUNT(DISTINCT cutid), 0) AS TotalPieces FROM da_cut";
            
            // 使用queryForObject方法直接获取总件数
            Integer pieces = jdbcTemplate.queryForObject(sql, Integer.class);
            
            if (pieces != null) {
                totalPieces = pieces;
                logger.info("成功获取裁剪套数数据: {} 套", totalPieces);
            }
        } catch (Exception e) {
            // 记录错误，但返回默认值
            logger.error("获取裁剪套数数据时发生错误: {}", e.getMessage(), e);
        }
        
        return totalPieces;
    }
} 