package com.jwsxy.screenback.controller;

import com.jwsxy.screenback.dto.CutTimeDTO;
import com.jwsxy.screenback.dto.EnergyConsumptionDTO;
import com.jwsxy.screenback.dto.MachineRunningDataDTO;
import com.jwsxy.screenback.dto.MachineStatusDTO;
import com.jwsxy.screenback.dto.MaterialUtilizationDTO;
import com.jwsxy.screenback.dto.PerimeterDataDTO;
import com.jwsxy.screenback.dto.CutSpeedDTO;
import com.jwsxy.screenback.dto.CutSetsDTO;
import com.jwsxy.screenback.service.MonitorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/monitor")
public class MonitorController {

    private static final Logger logger = LoggerFactory.getLogger(MonitorController.class);

    @Autowired
    private MonitorService monitorService;

    /**
     * 获取所有数据的移动率汇总
     */
    @GetMapping(value = "/material-utilization", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getMaterialUtilization() {
        MaterialUtilizationDTO dto = monitorService.getTotalMaterialUtilization();
        return ResponseEntity.ok(dto.toMap());
    }
    
    /**
     * 获取所有数据的周长汇总
     */
    @GetMapping(value = "/perimeter-data", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getPerimeterData() {
        PerimeterDataDTO dto = monitorService.getTotalPerimeterData();
        return ResponseEntity.ok(dto.toMap());
    }
    
    /**
     * 获取所有机床的能耗数据
     */
    @GetMapping(value = "/energy-consumption", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getEnergyConsumption() {
        EnergyConsumptionDTO dto = monitorService.getEnergyConsumptionData();
        return ResponseEntity.ok(dto.toMap());
    }
    
    /**
     * 获取综合监控数据
     * 包含移动率、周长、能耗、裁剪时间、裁剪速度、裁剪套数和裁床运行表格数据
     * 
     * @return 包含综合监控数据的响应
     */
    @GetMapping(value = "/data", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getMonitorData() {
        logger.debug("开始获取综合监控数据");
        long startTime = System.currentTimeMillis();
        
        try {
            // 并发获取所有数据 - 注意：不再重复获取裁床状态数据
            MaterialUtilizationDTO materialUtilizationDTO = monitorService.getTotalMaterialUtilization();
            PerimeterDataDTO perimeterDataDTO = monitorService.getTotalPerimeterData();
            EnergyConsumptionDTO energyConsumptionDTO = monitorService.getEnergyConsumptionData();
            CutTimeDTO cutTimeDTO = monitorService.getCutTimeData();
            CutSpeedDTO cutSpeedDTO = monitorService.getCutSpeedData();
            CutSetsDTO cutSetsDTO = monitorService.getCutSetsData();
            
            // 构建响应
            Map<String, Object> response = new HashMap<>();
            
            // 添加移动率数据
            if (materialUtilizationDTO != null) {
                response.put("efficiencyValue", materialUtilizationDTO.getMaterialUtilization());
            }
            
            // 添加周长数据
            if (perimeterDataDTO != null) {
                response.put("perimeterValue", perimeterDataDTO.getTotalCutPerimeter());
            }
            
            // 添加能耗数据
            if (energyConsumptionDTO != null) {
                // 计算总能耗
                double totalEnergy = 0.0;
                if (energyConsumptionDTO.getDevices() != null) {
                    totalEnergy = energyConsumptionDTO.getDevices().stream()
                        .mapToDouble(device -> device.getEnergy() != null ? device.getEnergy() : 0.0)
                        .sum();
                }
                response.put("energyValue", totalEnergy);
                response.put("deviceEnergyData", energyConsumptionDTO.getDevices());
            }
            
            // 添加裁剪时间数据
            if (cutTimeDTO != null) {
                response.put("cutTimeValue", cutTimeDTO.getCutTime());
            }
            
            // 添加裁剪速度数据
            if (cutSpeedDTO != null) {
                response.put("cutSpeedValue", cutSpeedDTO.getCutSpeed());
            }
            
            // 添加裁剪套数数据
            if (cutSetsDTO != null) {
                response.put("cutSetsValue", cutSetsDTO.getCutSets());
            }
            
            // 注意：不再获取和添加设备状态数据，因为：
            // 1. 前端已经通过单独的API(/api/monitor/machine-status)获取设备状态数据
            // 2. 避免重复请求和处理同一数据，减轻数据库负担
            // 3. 与前端数据获取模型保持一致
            
            // 获取裁床运行数据 - 分页方式
            MachineRunningDataDTO runningDataDTO = monitorService.getMachineRunningDataWithPagination(1, 20);
            if (runningDataDTO != null) {
                response.put("tableData", runningDataDTO.getTableData());
                response.put("totalItems", runningDataDTO.getTotalItems());
                response.put("totalPages", runningDataDTO.getTotalPages());
                response.put("currentPage", runningDataDTO.getCurrentPage());
                response.put("hasMoreData", runningDataDTO.getCurrentPage() < runningDataDTO.getTotalPages());
            }
            
            // 记录处理时间
            long endTime = System.currentTimeMillis();
            logger.info("成功获取综合监控数据，处理耗时: {}ms", (endTime - startTime));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            logger.error("获取综合监控数据时发生错误: {}, 处理耗时: {}ms", e.getMessage(), (endTime - startTime), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "获取综合监控数据失败: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }

    /**
     * 获取移动率MU数据 (兼容前端旧URL)
     * 已弃用，请使用getMaterialUtilization方法
     * 
     * @deprecated 此方法将在未来版本(v2.0)中移除。
     *             保留此方法仅为向后兼容旧版前端。
     *             新代码应该使用 {@link #getMaterialUtilization()} 方法和
     *             '/material-utilization' 端点获取相同功能。
     *             
     * @return 与getMaterialUtilization方法相同的响应
     */
    @Deprecated
    @GetMapping(value = "/moving-rate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getMovingRate() {
        logger.debug("已弃用的moving-rate端点被调用，请改用/material-utilization端点");
        return getMaterialUtilization();
    }

    /**
     * 获取所有裁床的运行状态
     */
    @GetMapping(value = "/machine-status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getMachineStatus() {
        logger.debug("开始获取裁床运行状态数据");
        
        // 记录性能日志
        long startTime = System.currentTimeMillis();
        
        try {
            MachineStatusDTO dto = monitorService.getMachineStatus();
            
            // 记录处理时间
            long endTime = System.currentTimeMillis();
            if (dto.getMachines() != null && !dto.getMachines().isEmpty()) {
                logger.info("成功获取 {} 台裁床运行状态数据, 控制器总处理耗时: {}ms", 
                        dto.getMachines().size(), (endTime - startTime));
            } else {
                logger.warn("未找到裁床运行状态数据, 控制器处理耗时: {}ms", (endTime - startTime));
            }
            
            return ResponseEntity.ok(dto.toMap());
        } catch (Exception e) {
            // 记录错误和处理时间
            long endTime = System.currentTimeMillis();
            logger.error("获取裁床运行状态数据时发生错误: {}, 耗时: {}ms", 
                    e.getMessage(), (endTime - startTime), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "获取裁床运行状态数据失败: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }

    /**
     * 获取裁床运行数据表格
     * 已弃用，请使用支持分页的版本：getMachineRunningDataWithPagination
     * 保留此方法仅为向后兼容
     */
    @GetMapping(value = "/machine-running-data", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getMachineRunningData() {
        logger.debug("开始获取裁床运行数据表格（默认分页）");
        
        // 重定向到分页版本的方法，使用默认参数
        return getMachineRunningDataWithPagination(1, 20);
    }
    
    /**
     * 获取裁床运行数据表格（支持分页）
     * 
     * @param page 页码（从1开始），默认为1
     * @param size 每页记录数，默认为20
     */
    @GetMapping(value = "/machine-running-data/page", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getMachineRunningDataWithPagination(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        logger.debug("开始获取裁床运行数据表格（分页 page={}, size={}）", page, size);
        
        try {
            MachineRunningDataDTO dto = monitorService.getMachineRunningDataWithPagination(page, size);
            return ResponseEntity.ok(dto.toMap());
        } catch (Exception e) {
            logger.error("获取裁床运行数据表格(分页)时发生错误: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "获取裁床运行数据表格(分页)失败: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }

    /**
     * 获取裁剪时间数据
     */
    @GetMapping(value = "/cut-time", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getCutTime() {
        logger.debug("开始获取裁剪时间数据");
        
        try {
            CutTimeDTO dto = monitorService.getCutTimeData();
            return ResponseEntity.ok(dto.toMap());
        } catch (Exception e) {
            logger.error("获取裁剪时间数据时发生错误: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "获取裁剪时间数据失败: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }

    /**
     * 获取裁剪速度数据
     */
    @GetMapping(value = "/cut-speed", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getCutSpeed() {
        logger.debug("开始获取裁剪速度数据");
        
        try {
            CutSpeedDTO dto = monitorService.getCutSpeedData();
            return ResponseEntity.ok(dto.toMap());
        } catch (Exception e) {
            logger.error("获取裁剪速度数据时发生错误: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "获取裁剪速度数据失败: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }

    /**
     * 获取裁剪套数数据
     */
    @GetMapping(value = "/cut-sets", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getCutSets() {
        logger.debug("开始获取裁剪套数数据");
        
        try {
            CutSetsDTO dto = monitorService.getCutSetsData();
            return ResponseEntity.ok(dto.toMap());
        } catch (Exception e) {
            logger.error("获取裁剪套数数据时发生错误: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "获取裁剪套数数据失败: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }
} 