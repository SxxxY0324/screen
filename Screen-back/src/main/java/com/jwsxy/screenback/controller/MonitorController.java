package com.jwsxy.screenback.controller;

import com.jwsxy.screenback.dto.EnergyConsumptionDTO;
import com.jwsxy.screenback.dto.MachineStatusDTO;
import com.jwsxy.screenback.dto.MaterialUtilizationDTO;
import com.jwsxy.screenback.dto.PerimeterDataDTO;
import com.jwsxy.screenback.service.MonitorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/monitor")
public class MonitorController {

    private static final Logger logger = LoggerFactory.getLogger(MonitorController.class);

    @Autowired
    private MonitorService monitorService;

    /**
     * 获取所有数据的移动率汇总
     * 通过API端点：/api/monitor/material-utilization
     *
     * @return 包含所有数据移动率汇总的JSON响应
     */
    @GetMapping(value = "/material-utilization", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getMaterialUtilization() {
        // 调用服务层获取所有数据的移动率汇总
        MaterialUtilizationDTO dto = monitorService.getTotalMaterialUtilization();
        
        // 返回处理后的数据
        return ResponseEntity.ok(dto.toMap());
    }
    
    /**
     * 获取所有数据的周长汇总
     * 通过API端点：/api/monitor/perimeter-data
     *
     * @return 包含所有数据周长汇总的JSON响应
     */
    @GetMapping(value = "/perimeter-data", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getPerimeterData() {
        // 调用服务层获取所有数据的周长汇总
        PerimeterDataDTO dto = monitorService.getTotalPerimeterData();
        
        // 返回处理后的数据
        return ResponseEntity.ok(dto.toMap());
    }
    
    /**
     * 获取所有机床的能耗数据
     * 通过API端点：/api/monitor/energy-consumption
     *
     * @return 包含所有机床能耗数据的JSON响应
     */
    @GetMapping(value = "/energy-consumption", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getEnergyConsumption() {
        // 调用服务层获取能耗数据
        EnergyConsumptionDTO dto = monitorService.getEnergyConsumptionData();
        
        // 返回处理后的数据
        return ResponseEntity.ok(dto.toMap());
    }
    
    /**
     * 获取综合监控数据
     * 通过API端点：/api/monitor/data
     * 
     * @return 包含综合监控数据的JSON响应
     */
    @GetMapping(value = "/data", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getMonitorData() {
        logger.debug("开始获取综合监控数据");
        long startTime = System.currentTimeMillis();
        
        try {
            // 并发获取所有数据，减少重复调用
            MaterialUtilizationDTO materialUtilizationDTO = monitorService.getTotalMaterialUtilization();
            PerimeterDataDTO perimeterDataDTO = monitorService.getTotalPerimeterData();
            EnergyConsumptionDTO energyConsumptionDTO = monitorService.getEnergyConsumptionData();
            
            // 构建综合数据响应
            Map<String, Object> response = new HashMap<>();
            
            // 添加移动率数据
            response.put("efficiencyValue", materialUtilizationDTO.getMaterialUtilization());
            
            // 添加周长数据
            response.put("perimeterValue", perimeterDataDTO.getTotalCutPerimeter());
            
            // 计算总能耗
            double totalEnergy = 0.0;
            if (energyConsumptionDTO.getDevices() != null) {
                totalEnergy = energyConsumptionDTO.getDevices().stream()
                    .mapToDouble(device -> device.getEnergy() != null ? device.getEnergy() : 0.0)
                    .sum();
            }
            
            // 添加能耗数据
            response.put("energyValue", totalEnergy);
            
            // 添加设备能耗数据
            response.put("deviceEnergyData", energyConsumptionDTO.getDevices());
            
            long endTime = System.currentTimeMillis();
            logger.debug("综合监控数据获取完成，耗时: {}ms", (endTime - startTime));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取综合监控数据时发生错误: {}", e.getMessage(), e);
            
            // 返回错误响应
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "获取监控数据失败: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }

    /**
     * 获取移动率MU数据 (兼容前端旧URL)
     * 通过API端点：/api/monitor/moving-rate
     *
     * @return 包含移动率数据的JSON响应
     */
    @GetMapping(value = "/moving-rate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getMovingRate() {
        // 获取全局移动率数据
        MaterialUtilizationDTO dto = monitorService.getTotalMaterialUtilization();
        
        // 返回处理后的数据
        return ResponseEntity.ok(dto.toMap());
    }

    /**
     * 获取所有裁床的运行状态
     * 通过API端点：/api/monitor/machine-status
     *
     * @return 包含所有裁床运行状态的JSON响应
     */
    @GetMapping(value = "/machine-status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getMachineStatus() {
        logger.debug("开始获取裁床运行状态数据");
        
        try {
            // 调用服务层获取裁床状态数据
            MachineStatusDTO dto = monitorService.getMachineStatus();
            
            // 返回处理后的数据
            return ResponseEntity.ok(dto.toMap());
        } catch (Exception e) {
            logger.error("获取裁床运行状态数据时发生错误: {}", e.getMessage(), e);
            
            // 返回错误响应
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "获取裁床运行状态数据失败: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }
} 