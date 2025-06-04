package com.jwsxy.screenback.service;

import com.jwsxy.screenback.dto.CutTimeDTO;
import com.jwsxy.screenback.dto.CutSpeedDTO;
import com.jwsxy.screenback.dto.CutSetsDTO;
import com.jwsxy.screenback.dto.EnergyConsumptionDTO;
import com.jwsxy.screenback.dto.MachineRunningDataDTO;
import com.jwsxy.screenback.dto.MachineStatusDTO;
import com.jwsxy.screenback.dto.MaterialUtilizationDTO;
import com.jwsxy.screenback.dto.PerimeterDataDTO;

import java.util.List;
import java.util.Map;

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
     * 获取裁剪时间数据
     *
     * @return 裁剪时间数据传输对象
     */
    CutTimeDTO getCutTimeData();
    
    /**
     * 获取裁剪速度数据
     * 
     * @return 裁剪速度数据传输对象
     */
    CutSpeedDTO getCutSpeedData();
    
    /**
     * 获取裁剪套数数据
     * 
     * @return 裁剪套数数据传输对象
     */
    CutSetsDTO getCutSetsData();
    
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
    
    /**
     * 获取裁床运行数据表格
     * 包含序号、车间、设备编号、速度、运行时长等数据
     *
     * @return 裁床运行数据表格DTO
     */
    MachineRunningDataDTO getMachineRunningData();
    
    /**
     * 获取裁床运行数据表格（支持分页）
     * 包含序号、车间、设备编号、速度、运行时长等数据
     *
     * @param page 页码（从1开始）
     * @param pageSize 每页记录数
     * @return 裁床运行数据表格DTO，包含分页信息
     */
    MachineRunningDataDTO getMachineRunningDataWithPagination(int page, int pageSize);
} 