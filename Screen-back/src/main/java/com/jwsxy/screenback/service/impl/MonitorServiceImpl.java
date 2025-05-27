package com.jwsxy.screenback.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.jwsxy.screenback.dto.CutTimeDTO;
import com.jwsxy.screenback.dto.CutSetsDTO;
import com.jwsxy.screenback.dto.EnergyConsumptionDTO;
import com.jwsxy.screenback.dto.MachineRunningDataDTO;
import com.jwsxy.screenback.dto.MachineStatusDTO;
import com.jwsxy.screenback.dto.MaterialUtilizationDTO;
import com.jwsxy.screenback.dto.PerimeterDataDTO;
import com.jwsxy.screenback.dto.CutSpeedDTO;
import com.jwsxy.screenback.repository.MonitorRepository;
import com.jwsxy.screenback.service.MonitorService;
import com.jwsxy.screenback.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    
    // 添加机床状态数据缓存
    private List<Map<String, Object>> machineStatusCache = null;
    private long machineStatusCacheTime = 0;
    private static final long CACHE_EXPIRY_MS = 5000; // 缓存过期时间5秒

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
                dto.setMessage("数据不足，无法计算移动率");
            }
            
            return dto;
            
        } catch (Exception e) {
            // 处理异常情况
            logger.error("获取移动率数据时发生错误: {}", e.getMessage(), e);
            MaterialUtilizationDTO dto = new MaterialUtilizationDTO();
            dto.setError("获取移动率数据失败: " + e.getMessage());
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
                dto.setMessage("未找到周长数据");
            }
            
            return dto;
            
        } catch (Exception e) {
            // 处理异常情况
            logger.error("获取周长数据时发生错误: {}", e.getMessage(), e);
            PerimeterDataDTO dto = new PerimeterDataDTO();
            dto.setError("获取周长数据失败: " + e.getMessage());
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
                
                // 基本验证
                if (machineSN == null || machineSN.trim().isEmpty()) {
                    logger.warn("警告: 发现机床SN为空的记录，跳过处理");
                    continue;
                }
                
                logger.debug("处理机床 {} 的能耗数据", machineSN);
                
                // 直接从查询结果获取power字段
                Double power = 0.0;
                Object powerObj = machineStatusData.get("power");
                if (powerObj instanceof Number) {
                    power = ((Number) powerObj).doubleValue();
                }
                
                // 添加到DTO
                if (power > 0) {
                    dto.addDevice(machineSN, power);
                    validDeviceCount++;
                    logger.debug("机床 {} 添加到结果集，能耗: {}", machineSN, power);
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
            // 记录方法开始时间
            long startTime = System.currentTimeMillis();
            logger.debug("开始获取裁床状态数据...");
            
            boolean usedCache = false;
            
            // 检查缓存
            if (machineStatusCache != null && System.currentTimeMillis() - machineStatusCacheTime < CACHE_EXPIRY_MS) {
                logger.debug("使用缓存中的机床状态数据");
                usedCache = true;
            } else {
                // 从仓库获取机床状态数据
                machineStatusCache = monitorRepository.getMachineStatusData();
                machineStatusCacheTime = System.currentTimeMillis();
                logger.debug("已更新机床状态数据缓存");
            }
            
            // 创建DTO
            MachineStatusDTO dto = new MachineStatusDTO();
            
            // 如果没有数据，返回空结果
            if (machineStatusCache == null || machineStatusCache.isEmpty()) {
                logger.info("未找到机床状态数据，返回空结果");
                return dto;
            }
            
            logger.debug("找到 {} 条机床状态数据", machineStatusCache.size());
            
            // 处理每个机床的状态数据
            for (Map<String, Object> machineStatusData : machineStatusCache) {
                String machineSN = (String) machineStatusData.get("machineSN");
                
                // 基本验证
                if (machineSN == null || machineSN.trim().isEmpty()) {
                    logger.warn("警告: 发现无效机床数据记录(缺少machineSN)，跳过处理");
                    continue;
                }
                
                // 创建简化的机床状态对象
                MachineStatusDTO.MachineStatus machineStatus = new MachineStatusDTO.MachineStatus();
                machineStatus.setDeviceId(machineSN);
                
                // 直接使用onlineStatus字段
                Integer onlineStatus = null;
                Object statusObj = machineStatusData.get("onlineStatus");
                if (statusObj instanceof Number) {
                    onlineStatus = ((Number) statusObj).intValue();
                }
                
                // 设置状态值
                if (onlineStatus != null) {
                    machineStatus.setOnlineStatus(onlineStatus);
                } else {
                    // 如果无法获取状态，默认设为待机状态(1)
                    machineStatus.setOnlineStatus(1);
                }
                
                // 直接从查询结果获取runningHours、车间信息等
                double runningHours = getDoubleValue(machineStatusData, "runningHours");
                String workshop = (String) machineStatusData.get("workshop");
                if (workshop == null || workshop.trim().isEmpty()) {
                    workshop = "未知车间";
                }
                
                // 设置值
                double speed = getDoubleValue(machineStatusData, "speed");
                machineStatus.setSpeed(speed);
                machineStatus.setRunningHours(runningHours);
                machineStatus.setWorkshop(workshop);
                
                // 添加到DTO
                dto.addMachineStatus(machineStatus);
            }
            
            // 记录处理时间和缓存使用情况
            long endTime = System.currentTimeMillis();
            logger.info("成功处理 {} 台裁床的状态数据，处理耗时: {}ms，{}使用缓存", 
                    dto.getMachines().size(), 
                    (endTime - startTime),
                    usedCache ? "已" : "未");
            
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
     * 获取裁床运行数据
     * 已弃用，请使用getMachineRunningDataWithPagination
     * 保留此方法仅为向后兼容
     * 
     * @return 包含裁床运行数据的DTO
     */
    @Override
    public MachineRunningDataDTO getMachineRunningData() {
        // 重定向到分页版本，使用默认参数
        return getMachineRunningDataWithPagination(1, 20);
    }
    
    /**
     * 获取裁床运行数据表格（支持分页）
     * 包含序号、车间、设备编号、速度、运行时长等数据
     *
     * @param page 页码（从1开始）
     * @param pageSize 每页记录数
     * @return 裁床运行数据表格DTO，包含分页信息
     */
    @Override
    public MachineRunningDataDTO getMachineRunningDataWithPagination(int page, int pageSize) {
        try {
            // 获取总记录数
            int totalItems = monitorRepository.getMachineRunningDataCount();
            
            // 从仓库获取裁床运行数据（带分页）
            List<Map<String, Object>> machineRunningDataList = monitorRepository.getMachineRunningData(page, pageSize);
            
            // 创建DTO对象
            MachineRunningDataDTO dto = new MachineRunningDataDTO();
            
            // 设置分页信息
            dto.setPagination(page, pageSize, totalItems);
            
            // 如果没有数据，返回空结果（但包含分页信息）
            if (machineRunningDataList == null || machineRunningDataList.isEmpty()) {
                logger.info("未找到裁床运行数据，返回空结果");
                return dto;
            }
            
            logger.debug("找到 {} 条裁床运行数据（第 {} 页，共 {} 条）", 
                    machineRunningDataList.size(), page, totalItems);
            
            // 处理每条裁床运行数据
            for (Map<String, Object> dataMap : machineRunningDataList) {
                String machineId = (String) dataMap.get("machineId");
                String workshop = (String) dataMap.get("workshop");
                Double speed = getDoubleValue(dataMap, "speed");
                Double runningHours = getDoubleValue(dataMap, "runningHours");
                
                // 基本验证
                if (machineId == null || machineId.trim().isEmpty()) {
                    logger.debug("跳过缺少机器ID的记录");
                    continue;
                }
                
                // 添加到DTO
                dto.addMachineData(
                    machineId,
                    workshop != null ? workshop : "默认车间",
                    speed != null ? speed : 0.0,
                    runningHours != null ? runningHours : 0.0
                );
            }
            
            // 记录处理结果
            int totalPages = (totalItems + pageSize - 1) / pageSize;
            logger.info("成功处理 {} 条裁床运行数据（第 {} 页，共 {} 页）", 
                    dto.getTableData().size(), page, totalPages);
            
            return dto;
        } catch (Exception e) {
            // 处理异常
            logger.error("获取裁床运行数据时发生错误: {}", e.getMessage(), e);
            
            MachineRunningDataDTO dto = new MachineRunningDataDTO();
            dto.setError("获取裁床运行数据失败: " + e.getMessage());
            return dto;
        }
    }
    
    /**
     * 获取裁剪时间数据
     *
     * @return 裁剪时间数据传输对象
     */
    @Override
    public CutTimeDTO getCutTimeData() {
        try {
            // 从仓库获取总裁剪时间数据
            Double totalCutTime = monitorRepository.getCutTimeData();
            
            // 创建DTO并设置总裁剪时间
            CutTimeDTO dto = new CutTimeDTO();
            dto.setCutTime(totalCutTime);
            
            // 如果数据不完整，设置提示信息
            if (totalCutTime <= 0) {
                dto.setMessage("未找到裁剪时间数据");
            }
            
            return dto;
            
        } catch (Exception e) {
            // 处理异常情况
            logger.error("获取裁剪时间数据时发生错误: {}", e.getMessage(), e);
            CutTimeDTO dto = new CutTimeDTO();
            dto.setError("获取裁剪时间数据失败: " + e.getMessage());
            return dto;
        }
    }
    
    /**
     * 获取裁剪速度数据
     *
     * @return 裁剪速度数据传输对象
     */
    @Override
    public CutSpeedDTO getCutSpeedData() {
        try {
            // 从仓库获取平均裁剪速度数据
            Double avgCutSpeed = monitorRepository.getCutSpeedData();
            
            // 创建DTO并设置裁剪速度
            CutSpeedDTO dto = new CutSpeedDTO();
            dto.setCutSpeed(avgCutSpeed);
            
            // 如果数据不完整，设置提示信息
            if (avgCutSpeed <= 0) {
                dto.setMessage("未找到裁剪速度数据");
            }
            
            return dto;
            
        } catch (Exception e) {
            // 处理异常情况
            logger.error("获取裁剪速度数据时发生错误: {}", e.getMessage(), e);
            CutSpeedDTO dto = new CutSpeedDTO();
            dto.setError("获取裁剪速度数据失败: " + e.getMessage());
            return dto;
        }
    }
    
    /**
     * 获取裁剪套数数据
     *
     * @return 裁剪套数数据传输对象
     */
    @Override
    public CutSetsDTO getCutSetsData() {
        try {
            // 从仓库获取裁剪套数数据
            Integer cutSets = monitorRepository.getCutSetsData();
            
            // 创建DTO并设置裁剪套数
            CutSetsDTO dto = new CutSetsDTO();
            dto.setCutSets(cutSets);
            
            // 如果数据不完整，设置提示信息
            if (cutSets <= 0) {
                dto.setMessage("未找到裁剪套数数据");
            }
            
            return dto;
            
        } catch (Exception e) {
            // 处理异常情况
            logger.error("获取裁剪套数数据时发生错误: {}", e.getMessage(), e);
            CutSetsDTO dto = new CutSetsDTO();
            dto.setError("获取裁剪套数数据失败: " + e.getMessage());
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