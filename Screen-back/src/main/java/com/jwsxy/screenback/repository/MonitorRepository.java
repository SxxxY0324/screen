package com.jwsxy.screenback.repository;

import java.util.List;
import java.util.Map;

/**
 * 监控数据仓库接口，负责访问监控相关数据
 */
public interface MonitorRepository {
    
    /**
     * 获取所有裁剪数据的汇总
     * 
     * @return 所有裁剪数据汇总，包含各种时间指标
     */
    Map<String, Double> getTotalCutDataSummary();
        
    /**
     * 获取所有裁剪数据的周长汇总
     * 
     * @return 所有数据的周长汇总，包含总周长和平均周长等指标
     */
    Map<String, Object> getTotalPerimeterData();
    
    /**
     * 获取机床状态数据
     * 从da_Machine_Status表获取最新的机床状态数据
     * 
     * @return 包含机床状态JSON数据的列表
     */
    List<Map<String, Object>> getMachineStatusData();
} 