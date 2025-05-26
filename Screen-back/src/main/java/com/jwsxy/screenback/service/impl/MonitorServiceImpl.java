package com.jwsxy.screenback.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.jwsxy.screenback.dto.EnergyConsumptionDTO;
import com.jwsxy.screenback.dto.MachineStatusDTO;
import com.jwsxy.screenback.dto.MaterialUtilizationDTO;
import com.jwsxy.screenback.dto.PerimeterDataDTO;
import com.jwsxy.screenback.repository.MonitorRepository;
import com.jwsxy.screenback.service.MonitorService;
import com.jwsxy.screenback.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 监控服务实现类，提供监控相关的业务逻辑实现
 */
@Service
public class MonitorServiceImpl implements MonitorService {

    private static final Logger logger = LoggerFactory.getLogger(MonitorServiceImpl.class);

    @Autowired
    private MonitorRepository monitorRepository;

    /**
     * 获取所有数据的移动率汇总
     *
     * @return 所有数据的移动率汇总传输对象
     */
    @Override
    public MaterialUtilizationDTO getTotalMaterialUtilization() {
        try {
            // 从仓库获取所有数据的汇总
            Map<String, Double> cutData = monitorRepository.getTotalCutDataSummary();
            
            // 创建DTO并设置从仓库获取的数据
            MaterialUtilizationDTO dto = new MaterialUtilizationDTO();
            
            // 设置基本数据
            double cutPerimeter = cutData.get("cutPerimeter");
            double moveSpeed = cutData.get("moveSpeed");
            double totalSeconds = cutData.get("totalSeconds");
            
            
            dto.setCutPerimeter(cutPerimeter);
            dto.setMoveSpeed(moveSpeed);
            dto.setTotalTime(totalSeconds);
            
            // 计算新的移动率
            double calculatedMoveTime = 0.0;
            double materialUtilization = 0.0;
            
            // 移动速度和总时间都必须大于0
            if (moveSpeed > 0 && totalSeconds > 0) {
                // 计算理论移动时间 = 切割周长 / 移动速度
                calculatedMoveTime = cutPerimeter / moveSpeed;
                
                // 计算移动率 = 理论移动时间 / 总时间 * 100%
                materialUtilization = (calculatedMoveTime / totalSeconds) * 100;
                
                // 四舍五入到小数点后两位
                materialUtilization = Math.round(materialUtilization * 100) / 100.0;
                calculatedMoveTime = Math.round(calculatedMoveTime * 100) / 100.0;
            }
            
            // 设置计算结果
            dto.setCalculatedMoveTime(calculatedMoveTime);
            dto.setMaterialUtilization(materialUtilization);
            
            // 如果数据不完整，设置提示信息
            if (totalSeconds <= 0 || moveSpeed <= 0) {
                dto.setMessage("Insufficient data for calculation");
            }
            
            return dto;
            
        } catch (Exception e) {
            // 处理异常情况
            MaterialUtilizationDTO dto = new MaterialUtilizationDTO();
            dto.setError("Error retrieving total data: " + e.getMessage());
            return dto;
        }
    }
    
    /**
     * 获取所有数据的周长汇总
     *
     * @return 所有数据的周长汇总传输对象
     */
    @Override
    public PerimeterDataDTO getTotalPerimeterData() {
        try {
            // 从仓库获取数据
            Map<String, Object> perimeterData = monitorRepository.getTotalPerimeterData();
            
            // 创建DTO并设置从仓库获取的数据
            PerimeterDataDTO dto = new PerimeterDataDTO();
            
            // 设置基本数据
            dto.setTotalCutPerimeter(getDoubleValue(perimeterData, "totalCutPerimeter"));
            dto.setTotalMarkPerimeter(getDoubleValue(perimeterData, "totalMarkPerimeter"));
            dto.setAverageCutPerimeter(getDoubleValue(perimeterData, "avgCutPerimeter"));
            dto.setAverageMarkPerimeter(getDoubleValue(perimeterData, "avgMarkPerimeter"));
            dto.setTotalPieces(getIntegerValue(perimeterData, "totalPieces"));
            
            // 将周长单位从KM转换为M (1 KM = 1000 M)
            if (dto.getTotalCutPerimeter() != null) {
                dto.setTotalCutPerimeter(dto.getTotalCutPerimeter() * 1000);
            }
            if (dto.getTotalMarkPerimeter() != null) {
                dto.setTotalMarkPerimeter(dto.getTotalMarkPerimeter() * 1000);
            }
            if (dto.getAverageCutPerimeter() != null) {
                dto.setAverageCutPerimeter(dto.getAverageCutPerimeter() * 1000);
            }
            if (dto.getAverageMarkPerimeter() != null) {
                dto.setAverageMarkPerimeter(dto.getAverageMarkPerimeter() * 1000);
            }
            
            // 如果数据不完整，设置提示信息
            if (dto.getTotalCutPerimeter() <= 0 && dto.getTotalMarkPerimeter() <= 0) {
                dto.setMessage("No perimeter data available");
            }
            
            return dto;
            
        } catch (Exception e) {
            // 处理异常情况
            PerimeterDataDTO dto = new PerimeterDataDTO();
            dto.setError("Error retrieving total perimeter data: " + e.getMessage());
            return dto;
        }
    }
    
    /**
     * 获取所有机床的能耗数据
     * 
     * @return 包含所有机床能耗数据的传输对象
     */
    @Override
    public EnergyConsumptionDTO getEnergyConsumptionData() {
        try {
            // 从仓库获取机床状态数据
            List<Map<String, Object>> machineStatusDataList = monitorRepository.getMachineStatusData();
            
            // 创建DTO
            EnergyConsumptionDTO dto = new EnergyConsumptionDTO();
            
            // 如果没有数据，返回空结果
            if (machineStatusDataList == null || machineStatusDataList.isEmpty()) {
                logger.info("未找到机床状态数据，返回空结果");
                return dto;
            }
            
            logger.debug("找到 {} 条机床状态数据", machineStatusDataList.size());
            int validDeviceCount = 0;
            
            // 处理每个机床的状态数据
            for (Map<String, Object> machineStatusData : machineStatusDataList) {
                String machineSN = (String) machineStatusData.get("machineSN");
                String statusTxt = (String) machineStatusData.get("statusTxt");
                
                // 基本验证
                if (machineSN == null || machineSN.trim().isEmpty()) {
                    logger.warn("警告: 发现机床SN为空的记录，跳过处理");
                    continue;
                }
                
                if (statusTxt == null || statusTxt.trim().isEmpty()) {
                    logger.warn("警告: 机床 {} 的状态数据为空，跳过处理", machineSN);
                    continue;
                }
                
                logger.debug("处理机床 {} 的状态数据", machineSN);
                
                // 解析JSON
                JsonNode statusJson = JsonUtils.parseJson(statusTxt);
                if (statusJson == null) {
                    logger.warn("警告: 机床 {} 的状态数据无法解析为JSON，跳过处理", machineSN);
                    continue;
                }
                
                // 提取能耗数据 - 尝试多个可能的字段名
                Double energy = JsonUtils.getDoubleValue(statusJson, "eng", "energy", "totalEnergy", "Energy", "TotalEnergy");
                
                // 添加到DTO
                if (energy > 0) {
                    dto.addDevice(machineSN, energy);
                    validDeviceCount++;
                    logger.debug("机床 {} 添加到结果集，能耗: {}", machineSN, energy);
                } else {
                    logger.debug("机床 {} 的能耗数据无效，跳过添加", machineSN);
                }
            }
            
            // 记录处理结果
            if (validDeviceCount > 0) {
                logger.info("成功处理 {} 台机床的能耗数据", validDeviceCount);
            } else {
                logger.warn("警告: 未找到任何有效的能耗数据");
            }
            
            return dto;
            
        } catch (Exception e) {
            logger.error("获取能耗数据时发生错误: {}", e.getMessage(), e);
            return new EnergyConsumptionDTO();
        }
    }
    
    /**
     * 获取所有裁床的运行状态数据
     * 
     * @return 包含所有裁床运行状态数据的传输对象
     */
    @Override
    public MachineStatusDTO getMachineStatus() {
        try {
            // 从仓库获取机床状态数据
            List<Map<String, Object>> machineStatusDataList = monitorRepository.getMachineStatusData();
            
            // 创建DTO
            MachineStatusDTO dto = new MachineStatusDTO();
            
            // 如果没有数据，返回空结果
            if (machineStatusDataList == null || machineStatusDataList.isEmpty()) {
                logger.info("未找到机床状态数据，返回空结果");
                return dto;
            }
            
            logger.debug("找到 {} 条机床状态数据", machineStatusDataList.size());
            
            // 处理每个机床的状态数据
            for (Map<String, Object> machineStatusData : machineStatusDataList) {
                String machineSN = (String) machineStatusData.get("machineSN");
                String statusTxt = (String) machineStatusData.get("statusTxt");
                
                // 基本验证
                if (machineSN == null || machineSN.trim().isEmpty() || 
                    statusTxt == null || statusTxt.trim().isEmpty()) {
                    logger.warn("警告: 发现无效机床数据记录，跳过处理");
                    continue;
                }
                
                logger.debug("处理机床 {} 的状态数据", machineSN);
                
                // 解析JSON
                JsonNode statusJson = JsonUtils.parseJson(statusTxt);
                if (statusJson == null) {
                    logger.warn("警告: 机床 {} 的状态数据无法解析为JSON，跳过处理", machineSN);
                    continue;
                }
                
                // 创建简化的机床状态对象
                MachineStatusDTO.MachineStatus machineStatus = new MachineStatusDTO.MachineStatus();
                machineStatus.setDeviceId(machineSN);
                
                // 提取online状态
                Integer onlineStatus = JsonUtils.getIntegerValue(statusJson, "online");
                machineStatus.setOnlineStatus(onlineStatus);
                
                // 添加到DTO
                dto.addMachineStatus(machineStatus);
                
                logger.debug("机床 {} 添加到结果集，状态: {}", machineSN, 
                        MachineStatusDTO.MachineStatus.getMachineStatusName(onlineStatus));
            }
            
            // 记录处理结果
            logger.info("成功处理 {} 台裁床的状态数据", dto.getMachines().size());
            
            return dto;
        } catch (Exception e) {
            // 处理异常
            logger.error("获取裁床状态数据时发生错误: {}", e.getMessage(), e);
            MachineStatusDTO dto = new MachineStatusDTO();
            dto.setError("处理裁床状态数据时出错: " + e.getMessage());
            return dto;
        }
    }
    
    /**
     * 从Map中安全地获取Double值
     * 
     * @param map 数据Map
     * @param key 键
     * @return Double值，如果不存在或类型不匹配则返回0.0
     */
    private Double getDoubleValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return 0.0;
    }
    
    /**
     * 从Map中安全地获取Integer值
     * 
     * @param map 数据Map
     * @param key 键
     * @return Integer值，如果不存在或类型不匹配则返回0
     */
    private Integer getIntegerValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        return 0;
    }
} 