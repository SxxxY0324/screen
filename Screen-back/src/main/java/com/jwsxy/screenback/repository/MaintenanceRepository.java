package com.jwsxy.screenback.repository;

import java.util.List;
import java.util.Map;

/**
 * 维保数据仓库接口，负责访问维保相关数据
 */
public interface MaintenanceRepository {
    
    /**
     * 获取当前故障台数（state为1的设备数量）
     * 
     * @return 当前故障台数
     */
    Integer getFaultCount();
    
    /**
     * 获取故障次数（da_Machine_fault表总记录数）
     * 
     * @return 故障次数
     */
    Integer getFaultTimes();
    
    /**
     * 获取故障总时长
     * 基于Occurrence_Time和End_Time计算
     * 
     * @return 故障总时长（小时）
     */
    Double getFaultDuration();
    
    /**
     * 获取平均故障时长
     * 
     * @return 平均故障时长（小时）
     */
    Double getAvgFaultTime();
    
    /**
     * 获取故障设备列表
     * 从da_Machine_fault表获取故障设备详细信息
     * 
     * @return 故障设备列表
     */
    List<Map<String, Object>> getFaultEquipmentList();
    
    /**
     * 解析Description字段中的JSON数据
     * 
     * @param description Description字段JSON字符串
     * @return 解析后的Map对象
     */
    Map<String, Object> parseDescriptionJson(String description);
} 