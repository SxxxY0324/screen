package com.jwsxy.screenback.service;

import com.jwsxy.screenback.dto.MaintenanceDataDTO;
import java.util.List;
import java.util.Map;

/**
 * 维保服务接口，定义维保管理相关的业务逻辑
 */
public interface MaintenanceService {
    
    /**
     * 获取故障台数
     * 
     * @return 故障台数信息
     */
    MaintenanceDataDTO getFaultCount();
    
    /**
     * 获取故障次数
     * 
     * @return 故障次数信息
     */
    MaintenanceDataDTO getFaultTimes();
    
    /**
     * 获取故障时长
     * 
     * @return 故障时长信息
     */
    MaintenanceDataDTO getFaultDuration();
    
    /**
     * 获取平均故障时长
     * 
     * @return 平均故障时长信息
     */
    MaintenanceDataDTO getAvgFaultTime();
    
    /**
     * 获取所有维保指标数据
     * 包括故障台数、故障次数、故障时长和平均故障时长
     * 
     * @return 包含所有维保指标的传输对象
     */
    MaintenanceDataDTO getAllMaintenanceData();
    
    /**
     * 获取故障设备清单
     * 包含设备故障详细信息和位置信息
     * 
     * @return 故障设备清单数据
     */
    List<Map<String, Object>> getFaultEquipmentList();
} 