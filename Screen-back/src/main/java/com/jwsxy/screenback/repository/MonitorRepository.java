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
     * 获取裁剪总时间数据
     * 
     * @return 裁剪总时间（小时）
     */
    Double getCutTimeData();
    
    /**
     * 获取裁剪速度数据
     * 
     * @return 平均裁剪速度
     */
    Double getCutSpeedData();
    
    /**
     * 获取裁剪套数数据
     * 
     * @return 裁剪套数（总件数）
     */
    Integer getCutSetsData();
    
    /**
     * 获取机床状态数据
     * 从da_Machine_Status表获取最新的机床状态数据
     * 
     * @return 包含机床状态JSON数据的列表
     */
    List<Map<String, Object>> getMachineStatusData();
    
    /**
     * 获取裁床运行数据，用于状态表格展示
     * 从da_cut表获取裁床运行数据，包括设备ID、车间、速度和运行时长
     *
     * @return 包含裁床运行数据的列表
     */
    List<Map<String, Object>> getMachineRunningData();
    
    /**
     * 获取裁床运行数据，支持分页
     * 从da_cut表获取裁床运行数据，包括设备ID、车间、速度和运行时长
     *
     * @param page 页码（从1开始）
     * @param pageSize 每页记录数
     * @return 包含裁床运行数据的列表
     */
    List<Map<String, Object>> getMachineRunningData(int page, int pageSize);
    
    /**
     * 获取裁床运行数据的总记录数
     * 
     * @return 总记录数
     */
    int getMachineRunningDataCount();
} 