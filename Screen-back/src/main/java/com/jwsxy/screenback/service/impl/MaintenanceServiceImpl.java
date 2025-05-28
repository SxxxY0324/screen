package com.jwsxy.screenback.service.impl;

import com.jwsxy.screenback.dto.MaintenanceDataDTO;
import com.jwsxy.screenback.repository.MaintenanceRepository;
import com.jwsxy.screenback.service.MaintenanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * 维保服务实现类，提供维保相关的业务逻辑实现
 */
@Service
public class MaintenanceServiceImpl implements MaintenanceService {

    private static final Logger logger = LoggerFactory.getLogger(MaintenanceServiceImpl.class);
    
    @Autowired
    private MaintenanceRepository maintenanceRepository;

    /**
     * 获取故障台数
     * 
     * @return 故障台数信息
     */
    @Override
    public MaintenanceDataDTO getFaultCount() {
        logger.info("Service层：开始获取故障台数");
        try {
            // 从仓库获取故障台数
            Integer count = maintenanceRepository.getFaultCount();
            
            // 创建DTO并设置数据
            MaintenanceDataDTO dto = new MaintenanceDataDTO();
            dto.setFaultCount(count);
            
            // 添加消息
            if (count != null && count > 0) {
                dto.setMessage("获取故障台数成功");
            } else {
                dto.setMessage("未找到故障设备");
            }
            
            logger.info("Service层：故障台数查询成功，结果: {}", count);
            return dto;
        } catch (Exception e) {
            // 处理异常情况
            logger.error("Service层：获取故障台数时发生错误: {}", e.getMessage(), e);
            MaintenanceDataDTO dto = new MaintenanceDataDTO();
            dto.setError("获取故障台数失败: " + e.getMessage());
            return dto;
        }
    }
    
    /**
     * 获取故障次数
     * 
     * @return 故障次数信息
     */
    @Override
    public MaintenanceDataDTO getFaultTimes() {
        logger.info("Service层：开始获取故障次数");
        try {
            // 从仓库获取故障次数
            Integer count = maintenanceRepository.getFaultTimes();
            
            // 创建DTO并设置数据
            MaintenanceDataDTO dto = new MaintenanceDataDTO();
            dto.setFaultTimes(count);
            
            // 添加消息
            if (count != null && count > 0) {
                dto.setMessage("获取故障次数成功");
            } else {
                dto.setMessage("未找到故障记录");
            }
            
            logger.info("Service层：故障次数查询成功，结果: {}", count);
            return dto;
        } catch (Exception e) {
            // 处理异常情况
            logger.error("Service层：获取故障次数时发生错误: {}", e.getMessage(), e);
            MaintenanceDataDTO dto = new MaintenanceDataDTO();
            dto.setError("获取故障次数失败: " + e.getMessage());
            return dto;
        }
    }
    
    /**
     * 获取故障时长
     * 
     * @return 故障时长信息
     */
    @Override
    public MaintenanceDataDTO getFaultDuration() {
        logger.info("Service层：开始获取故障时长");
        try {
            // 从仓库获取故障时长
            Double duration = maintenanceRepository.getFaultDuration();
            
            // 创建DTO并设置数据
            MaintenanceDataDTO dto = new MaintenanceDataDTO();
            dto.setFaultDuration(duration);
            
            // 添加消息
            if (duration != null && duration > 0) {
                dto.setMessage("获取故障时长成功");
            } else {
                dto.setMessage("未找到故障时长数据");
            }
            
            logger.info("Service层：故障时长查询成功，结果: {}小时", duration);
            return dto;
        } catch (Exception e) {
            // 处理异常情况
            logger.error("Service层：获取故障时长时发生错误: {}", e.getMessage(), e);
            MaintenanceDataDTO dto = new MaintenanceDataDTO();
            dto.setError("获取故障时长失败: " + e.getMessage());
            return dto;
        }
    }
    
    /**
     * 获取平均故障时长
     * 
     * @return 平均故障时长信息
     */
    @Override
    public MaintenanceDataDTO getAvgFaultTime() {
        logger.info("Service层：开始获取平均故障时长");
        try {
            // 从仓库获取平均故障时长
            Double avgTime = maintenanceRepository.getAvgFaultTime();
            
            // 创建DTO并设置数据
            MaintenanceDataDTO dto = new MaintenanceDataDTO();
            dto.setAvgFaultTime(avgTime);
            
            // 添加消息
            if (avgTime != null && avgTime > 0) {
                dto.setMessage("获取平均故障时长成功");
            } else {
                dto.setMessage("未找到平均故障时长数据");
            }
            
            logger.info("Service层：平均故障时长查询成功，结果: {}小时", avgTime);
            return dto;
        } catch (Exception e) {
            // 处理异常情况
            logger.error("Service层：获取平均故障时长时发生错误: {}", e.getMessage(), e);
            MaintenanceDataDTO dto = new MaintenanceDataDTO();
            dto.setError("获取平均故障时长失败: " + e.getMessage());
            return dto;
        }
    }
    
    /**
     * 获取所有维保指标数据
     * 包括故障台数、故障次数、故障时长和平均故障时长
     * 
     * @return 包含所有维保指标的传输对象
     */
    @Override
    public MaintenanceDataDTO getAllMaintenanceData() {
        logger.info("Service层：开始获取所有维保指标数据");
        try {
            // 从仓库获取所有数据
            Integer faultCount = maintenanceRepository.getFaultCount();
            Integer faultTimes = maintenanceRepository.getFaultTimes();
            Double faultDuration = maintenanceRepository.getFaultDuration();
            Double avgFaultTime = maintenanceRepository.getAvgFaultTime();
            
            logger.info("Service层：从Repository获取了所有维保数据");
            
            // 创建DTO并设置数据
            MaintenanceDataDTO dto = new MaintenanceDataDTO();
            dto.setFaultCount(faultCount);
            dto.setFaultTimes(faultTimes);
            dto.setFaultDuration(faultDuration);
            dto.setAvgFaultTime(avgFaultTime);
            
            // 添加消息
            dto.setMessage("获取维保数据成功");
            
            logger.info("Service层：所有维保指标数据查询成功，故障台数:{}, 故障次数:{}, 故障时长:{}小时, 平均故障时长:{}小时", 
                     faultCount, faultTimes, faultDuration, avgFaultTime);
            return dto;
        } catch (Exception e) {
            // 处理异常情况
            logger.error("Service层：获取维保数据时发生错误: {}", e.getMessage(), e);
            MaintenanceDataDTO dto = new MaintenanceDataDTO();
            dto.setError("获取维保数据失败: " + e.getMessage());
            return dto;
        }
    }
    
    /**
     * 获取故障设备清单
     * 包含设备故障详细信息和位置信息
     * 
     * @return 故障设备清单数据
     */
    @Override
    public List<Map<String, Object>> getFaultEquipmentList() {
        logger.info("Service层：开始获取故障设备清单");
        try {
            // 调用Repository层方法获取故障设备清单
            List<Map<String, Object>> faultList = maintenanceRepository.getFaultEquipmentList();
            
            if (faultList != null && !faultList.isEmpty()) {
                logger.info("Service层：成功获取到{}条故障设备记录", faultList.size());
            } else {
                logger.info("Service层：未找到故障设备记录");
            }
            
            return faultList;
        } catch (Exception e) {
            // 处理异常情况
            logger.error("Service层：获取故障设备清单时发生错误: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
} 