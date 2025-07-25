package com.jwsxy.screenback.repository.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jwsxy.screenback.repository.MaintenanceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 维保数据仓库接口实现类，负责实现维保数据的访问
 */
@Repository
public class MaintenanceRepositoryImpl implements MaintenanceRepository {

    private static final Logger logger = LoggerFactory.getLogger(MaintenanceRepositoryImpl.class);
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 获取当前故障台数（state为1的设备数量）
     * 
     * @return 当前故障台数
     */
    @Override
    public Integer getFaultCount() {
        logger.info("开始获取故障台数");
        try {
            // 查询具有故障记录的设备数量
            String sql = "SELECT COUNT(DISTINCT MachineID) FROM da_Machine_fault WHERE ISNULL(Description, '') <> ''";
                         
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
            logger.info("故障台数查询成功，结果: {}", count);
            return count != null ? count : 0;
        } catch (DataAccessException e) {
            logger.error("获取故障台数失败: {}", e.getMessage(), e);
            return 0;
        }
    }
    
    /**
     * 获取故障次数（da_Machine_fault表总记录数）
     * 
     * @return 故障次数
     */
    @Override
    public Integer getFaultTimes() {
        logger.info("开始获取故障次数");
        try {
            String sql = "SELECT COUNT(*) FROM da_Machine_fault";
            logger.info("执行SQL查询: {}", sql);
            
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
            logger.info("故障次数查询成功，结果: {}", count);
            return count != null ? count : 0;
        } catch (DataAccessException e) {
            logger.error("获取故障次数失败: {}", e.getMessage(), e);
            return 0;
        }
    }
    
    /**
     * 获取故障总时长
     * 基于Occurrence_Time和End_Time计算
     * 
     * @return 故障总时长（小时）
     */
    @Override
    public Double getFaultDuration() {
        logger.info("开始获取故障总时长");
        try {
            // 计算所有故障的总时长（小时）
            String sql = "SELECT ISNULL(SUM(DATEDIFF(MINUTE, Occurrence_Time, ISNULL(End_Time, GETDATE()))), 0) / 60.0 AS TotalFaultHours FROM da_Machine_fault WHERE Occurrence_Time IS NOT NULL";
            
            Double duration = jdbcTemplate.queryForObject(sql, Double.class);
            logger.info("故障总时长查询成功，结果: {}小时", duration);
            return duration != null ? duration : 0.0;
        } catch (DataAccessException e) {
            logger.error("获取故障总时长失败: {}", e.getMessage(), e);
            return 0.0;
        }
    }
    
    /**
     * 获取平均故障时长
     * 
     * @return 平均故障时长（小时）
     */
    @Override
    public Double getAvgFaultTime() {
        logger.info("开始获取平均故障时长");
        try {
            // 计算平均故障时长（小时）
            String sql = "SELECT ISNULL(AVG(DATEDIFF(MINUTE, Occurrence_Time, ISNULL(End_Time, GETDATE()))), 0) / 60.0 AS AvgFaultHours FROM da_Machine_fault WHERE Occurrence_Time IS NOT NULL";
            
            Double avgDuration = jdbcTemplate.queryForObject(sql, Double.class);
            logger.info("平均故障时长查询成功，结果: {}小时", avgDuration);
            return avgDuration != null ? avgDuration : 0.0;
        } catch (DataAccessException e) {
            logger.error("获取平均故障时长失败: {}", e.getMessage(), e);
            return 0.0;
        }
    }
    
    /**
     * 获取故障设备列表
     * 从da_Machine_fault表获取故障设备详细信息
     * 
     * @return 故障设备列表
     */
    @Override
    public List<Map<String, Object>> getFaultEquipmentList() {
        logger.info("开始获取故障设备列表");
        try {
            // 修改SQL查询：添加Description字段用于解析故障码
            String sql = "SELECT f.id AS serialNumber, " +
                         "l.location_Name AS workshop, " +
                         "f.MachineID AS equipmentId, " +
                         "f.Description, " +  // 添加Description字段用于解析
                         "f.Occurrence_Time AS startTime " +
                         "FROM da_Machine_fault f " +
                         "LEFT JOIN da_Machine m ON f.MachineID = m.MachineID " +
                         "LEFT JOIN da_Machine_location l ON m.Location = l.locationID " +
                         "ORDER BY f.Occurrence_Time DESC";
            logger.info("执行SQL查询: {}", sql);
            
            // 执行查询
            List<Map<String, Object>> faultList = jdbcTemplate.queryForList(sql);
            
            logger.info("获取到 {} 条故障设备记录", faultList.size());
            
            // 处理数据：解析Description字段获取故障码，格式化开始时间
            for (Map<String, Object> fault : faultList) {
                // 从Description字段解析故障码
                String description = (String) fault.get("Description");
                if (description != null && !description.isEmpty()) {
                    try {
                        // 解析JSON获取故障码
                        Map<String, Object> descJson = parseDescriptionJson(description);
                        if (descJson.containsKey("code")) {
                            fault.put("faultCode", descJson.get("code"));
                        } else {
                            fault.put("faultCode", "未知");
                        }
                        
                        // 可选：添加故障描述
                        if (descJson.containsKey("val")) {
                            fault.put("faultDescription", descJson.get("val"));
                        }
                    } catch (Exception e) {
                        logger.warn("解析Description JSON失败: {}", e.getMessage());
                        fault.put("faultCode", "解析错误");
                    }
                } else {
                    fault.put("faultCode", "未知");
                }
                
                // 移除原始Description字段，减少数据传输量
                fault.remove("Description");
                
                // 格式化开始时间显示
                if (fault.get("startTime") != null) {
                    fault.put("formattedStartTime", fault.get("startTime").toString());
                }
            }
            
            return faultList;
        } catch (DataAccessException e) {
            logger.error("获取故障设备列表失败: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
    
    /**
     * 解析Description字段中的JSON数据
     * 
     * @param description Description字段JSON字符串
     * @return 解析后的Map对象
     */
    @Override
    public Map<String, Object> parseDescriptionJson(String description) {
        try {
            if (description == null || description.trim().isEmpty()) {
                return Collections.emptyMap();
            }
            
            // 使用Jackson解析JSON
            Map<String, Object> result = objectMapper.readValue(description, Map.class);
            logger.debug("JSON解析成功: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("解析Description JSON失败: {}", e.getMessage(), e);
            return Collections.emptyMap();
        }
    }
} 