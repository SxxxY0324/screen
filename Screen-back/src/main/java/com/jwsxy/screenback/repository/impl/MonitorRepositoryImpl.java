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
        // 简化SQL查询，只获取真正需要的字段
        String sql = "SELECT " +
                "ISNULL(SUM(CutPerimeter), 0) AS TotalCutPerimeter, " +  // 切割周长
                "ISNULL(AVG(MoveSpeed), 0) AS AvgMoveSpeed, " +          // 平均移动速度
                "MIN(StartTime) AS MinStartTime, " +                     // 最早开始时间
                "MAX(EndTime) AS MaxEndTime " +                          // 最晚结束时间
                "FROM da_cut";

        Map<String, Double> result = new HashMap<>();
        // 设置默认值，防止查询结果为空
        result.put("cutPerimeter", 0.0);   // 切割周长
        result.put("moveSpeed", 0.0);      // 移动速度
        result.put("totalSeconds", 0.0);   // 总秒数

        try {
            // 使用query而不是queryForObject，避免没有结果时抛出异常
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
            }
        } catch (Exception e) {
            // 记录错误，但返回默认值
            logger.error("获取总裁剪数据时发生错误: {}", e.getMessage(), e);
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
        // SQL查询，获取周长相关数据
        String sql = "SELECT " +
                "ISNULL(SUM(CutPerimeter), 0) AS TotalCutPerimeter, " +      // 总切割周长
                "ISNULL(SUM(MarkPerimeter), 0) AS TotalMarkPerimeter, " +    // 总标记周长
                "ISNULL(AVG(CutPerimeter), 0) AS AvgCutPerimeter, " +        // 平均切割周长
                "ISNULL(AVG(MarkPerimeter), 0) AS AvgMarkPerimeter, " +      // 平均标记周长
                "ISNULL(COUNT(*), 0) AS TotalPieces " +                      // 总件数
                "FROM da_cut";
                
        Map<String, Object> result = new HashMap<>();
        // 设置默认值，防止查询结果为空
        result.put("totalCutPerimeter", 0.0);    // 总切割周长
        result.put("totalMarkPerimeter", 0.0);   // 总标记周长
        result.put("avgCutPerimeter", 0.0);      // 平均切割周长
        result.put("avgMarkPerimeter", 0.0);     // 平均标记周长
        result.put("totalPieces", 0);            // 总件数
        
        try {
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
            }
        } catch (Exception e) {
            // 记录错误，但返回默认值
            logger.error("获取总周长数据时发生错误: {}", e.getMessage(), e);
        }
        
        return result;
    }
    
    /**
     * 获取机床状态数据
     * 从da_Machine_Status表获取最新的机床状态数据
     * 
     * @return 包含机床状态JSON数据的列表
     */
    @Override
    public List<Map<String, Object>> getMachineStatusData() {
        // 记录开始查询时间
        long startTime = System.currentTimeMillis();
        logger.debug("开始查询机床状态数据...");
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        try {
            // 获取每台机床的最新状态记录
            String sql = "WITH LatestStatus AS ( " +
                    "    SELECT " +
                    "        MachineSN, " +
                    "        StatusTxt, " +
                    "        ModifyDate, " +
                    "        ROW_NUMBER() OVER (PARTITION BY MachineSN ORDER BY ModifyDate DESC) AS RowNum " +
                    "    FROM da_Machine_Status " +
                    "    WHERE StatusTxt IS NOT NULL AND StatusTxt <> '' " +
                    ") " +
                    "SELECT MachineSN, StatusTxt, ModifyDate " +
                    "FROM LatestStatus " +
                    "WHERE RowNum = 1 " +
                    "ORDER BY MachineSN";
            
            logger.debug("执行SQL: {}", sql);
            
            // 使用query方法执行SQL查询
            result = jdbcTemplate.query(sql,
                    (rs, rowNum) -> {
                        Map<String, Object> rowData = new HashMap<>();
                        // 获取查询结果
                        String machineSN = rs.getString("MachineSN");
                        String statusTxt = rs.getString("StatusTxt");
                        java.sql.Timestamp modifyDate = rs.getTimestamp("ModifyDate");
                        
                        rowData.put("machineSN", machineSN);
                        rowData.put("statusTxt", statusTxt);
                        rowData.put("modifyDate", modifyDate);
                        
                        // 打印每条记录的基本信息，避免日志过多
                        logger.trace("找到机床: {}, 数据更新时间: {}", machineSN, modifyDate);
                        
                        return rowData;
                    }
            );
            
            // 记录查询结果
            long endTime = System.currentTimeMillis();
            if (result.isEmpty()) {
                logger.warn("未找到任何机床状态数据! 查询耗时: {}ms", (endTime - startTime));
            } else {
                logger.info("成功获取 {} 条机床状态数据，查询耗时: {}ms", result.size(), (endTime - startTime));
            }
        } catch (Exception e) {
            // 记录错误，但返回空列表
            logger.error("获取机床状态数据时发生错误: {}", e.getMessage(), e);
            
            // 尝试简化查询再次获取数据
            try {
                logger.info("尝试使用简化查询重新获取数据...");
                String simpleSql = "SELECT TOP 10 MachineSN, StatusTxt, ModifyDate " +
                        "FROM da_Machine_Status " +
                        "WHERE StatusTxt IS NOT NULL AND StatusTxt <> '' " +
                        "ORDER BY ModifyDate DESC";
                
                logger.debug("执行SQL: {}", simpleSql);
                
                // 使用简化查询再次尝试
                result = jdbcTemplate.query(simpleSql,
                        (rs, rowNum) -> {
                            Map<String, Object> rowData = new HashMap<>();
                            rowData.put("machineSN", rs.getString("MachineSN"));
                            rowData.put("statusTxt", rs.getString("StatusTxt"));
                            rowData.put("modifyDate", rs.getTimestamp("ModifyDate"));
                            return rowData;
                        }
                );
                
                logger.info("简化查询获取到 {} 条数据", result.size());
            } catch (Exception ex) {
                logger.error("简化查询也失败: {}", ex.getMessage(), ex);
            }
        }
        
        return result;
    }
} 