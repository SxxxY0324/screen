package com.jwsxy.screenback.controller;

import com.jwsxy.screenback.dto.MaintenanceDataDTO;
import com.jwsxy.screenback.service.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 维保管理相关接口
 */
@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private static final Logger logger = LoggerFactory.getLogger(MaintenanceController.class);
    
    @Autowired
    private MaintenanceService maintenanceService;
    
    /**
     * 获取故障台数（state为1的设备数量）
     * 
     * @return 当前故障设备数量
     */
    @GetMapping("/fault-count")
    public ResponseEntity<?> getFaultCount() {
        logger.info("请求: 获取故障台数");
        try {
            MaintenanceDataDTO dataDTO = maintenanceService.getFaultCount();
            
            Map<String, Object> result = new HashMap<>();
            result.put("count", dataDTO.getFaultCount() != null ? dataDTO.getFaultCount() : 0);
            result.put("message", dataDTO.getMessage() != null ? dataDTO.getMessage() : "获取故障台数成功");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return handleError("获取故障台数", e);
        }
    }
    
    /**
     * 获取故障次数（数据库表中的总记录数）
     * 
     * @return 故障发生的次数
     */
    @GetMapping("/fault-times")
    public ResponseEntity<?> getFaultTimes() {
        logger.info("请求: 获取故障次数");
        try {
            MaintenanceDataDTO dataDTO = maintenanceService.getFaultTimes();
            
            Map<String, Object> result = new HashMap<>();
            result.put("count", dataDTO.getFaultTimes() != null ? dataDTO.getFaultTimes() : 0);
            result.put("message", dataDTO.getMessage() != null ? dataDTO.getMessage() : "获取故障次数成功");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return handleError("获取故障次数", e);
        }
    }
    
    /**
     * 获取故障时长
     * 
     * @return 故障总时长（小时）
     */
    @GetMapping("/fault-duration")
    public ResponseEntity<?> getFaultDuration() {
        logger.info("请求: 获取故障时长");
        try {
            MaintenanceDataDTO dataDTO = maintenanceService.getFaultDuration();
            
            Map<String, Object> result = new HashMap<>();
            result.put("hours", dataDTO.getFaultDuration() != null ? dataDTO.getFaultDuration() : 0);
            result.put("message", dataDTO.getMessage() != null ? dataDTO.getMessage() : "获取故障时长成功");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return handleError("获取故障时长", e);
        }
    }
    
    /**
     * 获取平均故障时长
     * 
     * @return 平均故障时长（小时）
     */
    @GetMapping("/avg-fault-time")
    public ResponseEntity<?> getAvgFaultTime() {
        logger.info("请求: 获取平均故障时长");
        try {
            MaintenanceDataDTO dataDTO = maintenanceService.getAvgFaultTime();
            
            Map<String, Object> result = new HashMap<>();
            result.put("hours", dataDTO.getAvgFaultTime() != null ? dataDTO.getAvgFaultTime() : 0);
            result.put("message", dataDTO.getMessage() != null ? dataDTO.getMessage() : "获取平均故障时长成功");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return handleError("获取平均故障时长", e);
        }
    }
    
    /**
     * 获取全部维保数据
     * 
     * @return 包含所有维保指标的数据
     */
    @GetMapping("/all-data")
    public ResponseEntity<?> getAllMaintenanceData() {
        logger.info("请求: 获取全部维保数据");
        try {
            MaintenanceDataDTO dataDTO = maintenanceService.getAllMaintenanceData();
            
            Map<String, Object> result = new HashMap<>();
            result.put("faultCount", dataDTO.getFaultCount() != null ? dataDTO.getFaultCount() : 0);
            result.put("faultTimes", dataDTO.getFaultTimes() != null ? dataDTO.getFaultTimes() : 0);
            result.put("faultDuration", dataDTO.getFaultDuration() != null ? dataDTO.getFaultDuration() : 0);
            result.put("avgFaultTime", dataDTO.getAvgFaultTime() != null ? dataDTO.getAvgFaultTime() : 0);
            result.put("message", dataDTO.getMessage() != null ? dataDTO.getMessage() : "获取全部维保数据成功");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return handleError("获取全部维保数据", e);
        }
    }
    
    /**
     * 获取故障设备清单
     * 
     * @return 故障设备清单数据
     */
    @GetMapping("/fault-equipment-list")
    public ResponseEntity<?> getFaultEquipmentList() {
        logger.info("请求: 获取故障设备清单");
        try {
            List<Map<String, Object>> faultList = maintenanceService.getFaultEquipmentList();
            
            Map<String, Object> result = new HashMap<>();
            result.put("data", faultList);
            result.put("count", faultList.size());
            result.put("message", "获取故障设备清单成功");
            
            logger.debug("故障设备清单查询成功，返回{}条记录", faultList.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return handleError("获取故障设备清单", e);
        }
    }
    
    /**
     * 统一处理控制器错误
     */
    private ResponseEntity<?> handleError(String operation, Exception e) {
        logger.error("{}失败: {}", operation, e.getMessage());
        
        Map<String, Object> errorResult = new HashMap<>();
        errorResult.put("error", operation + "失败");
        errorResult.put("message", e.getMessage());
        
        return ResponseEntity.badRequest().body(errorResult);
    }
} 