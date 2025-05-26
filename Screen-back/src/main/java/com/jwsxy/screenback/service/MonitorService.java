package com.jwsxy.screenback.service;

import com.jwsxy.screenback.dto.EnergyConsumptionDTO;
import com.jwsxy.screenback.dto.MachineStatusDTO;
import com.jwsxy.screenback.dto.MaterialUtilizationDTO;
import com.jwsxy.screenback.dto.PerimeterDataDTO;

/**
 * 监控服务接口，定义系统监控相关的业务逻辑
 */
public interface MonitorService {
    
    /**
     * 获取所有数据的移动率汇总
     * 
     * @return 所有数据的移动率汇总传输对象
     */
    MaterialUtilizationDTO getTotalMaterialUtilization();

    /**
     * 获取所有数据的周长汇总
     *
     * @return 所有数据的周长汇总传输对象
     */
    PerimeterDataDTO getTotalPerimeterData();
    
    /**
     * 获取所有机床的能耗数据
     * 
     * @return 包含所有机床能耗数据的传输对象
     */
    EnergyConsumptionDTO getEnergyConsumptionData();

    /**
     * 获取所有裁床的运行状态数据
     * 
     * @return 包含所有裁床运行状态数据的传输对象
     */
    MachineStatusDTO getMachineStatus();
} 