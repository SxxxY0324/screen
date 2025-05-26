package com.jwsxy.screenback.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 裁床状态数据传输对象，用于向前端返回裁床运行状态数据
 * 简化版本：只包含设备编号和状态信息
 */
public class MachineStatusDTO {
    private List<MachineStatus> machines;   // 裁床状态列表
    private Map<String, Integer> statusSummary; // 状态汇总(各种状态的机器数量)
    private String error; // 错误信息
    
    /**
     * 机床状态内部类 - 简化版本
     */
    public static class MachineStatus {
        private String deviceId;      // 设备ID/序列号
        private Integer onlineStatus; // 在线状态码 (0-3)
        private String statusName;    // 状态名称
        
        public MachineStatus() {}
        
        public MachineStatus(String deviceId, Integer onlineStatus) {
            this.deviceId = deviceId;
            this.onlineStatus = onlineStatus;
            this.statusName = getMachineStatusName(onlineStatus);
        }
        
        /**
         * 根据状态码获取状态名称
         */
        public static String getMachineStatusName(Integer statusCode) {
            if (statusCode == null) return "未知状态";
            
            switch (statusCode) {
                case 0: return "裁剪中";
                case 1: return "待机中";
                case 2: return "非计划停机";
                case 3: return "计划停机";
                default: return "未知状态";
            }
        }
        
        // Getters and Setters
        public String getDeviceId() {
            return deviceId;
        }
        
        public void setDeviceId(String deviceId) {
            this.deviceId = deviceId;
        }
        
        public Integer getOnlineStatus() {
            return onlineStatus;
        }
        
        public void setOnlineStatus(Integer onlineStatus) {
            this.onlineStatus = onlineStatus;
            this.statusName = getMachineStatusName(onlineStatus);
        }
        
        public String getStatusName() {
            return statusName;
        }
        
        /**
         * 转换为Map
         */
        public Map<String, Object> toMap() {
            Map<String, Object> map = new HashMap<>();
            map.put("deviceId", deviceId);
            map.put("onlineStatus", onlineStatus);
            map.put("statusName", statusName);
            return map;
        }
    }
    
    // 构造函数
    public MachineStatusDTO() {
        this.machines = new ArrayList<>();
        this.statusSummary = new HashMap<>();
        // 初始化状态汇总
        statusSummary.put("cutting", 0);     // 裁剪中
        statusSummary.put("idle", 0);        // 待机中
        statusSummary.put("unplannedStop", 0); // 非计划停机
        statusSummary.put("plannedStop", 0);   // 计划停机
        statusSummary.put("unknown", 0);     // 未知状态
        statusSummary.put("total", 0);       // 总数
    }
    
    // 添加机床状态并更新汇总
    public void addMachineStatus(MachineStatus status) {
        if (status == null || status.getDeviceId() == null) {
            return;
        }
        
        this.machines.add(status);
        
        // 更新状态汇总
        Integer statusCode = status.getOnlineStatus();
        if (statusCode != null) {
            switch (statusCode) {
                case 0:
                    incrementStatusCount("cutting");
                    break;
                case 1:
                    incrementStatusCount("idle");
                    break;
                case 2:
                    incrementStatusCount("unplannedStop");
                    break;
                case 3:
                    incrementStatusCount("plannedStop");
                    break;
                default:
                    incrementStatusCount("unknown");
                    break;
            }
        } else {
            incrementStatusCount("unknown");
        }
        
        incrementStatusCount("total");
    }
    
    // 增加特定状态计数
    private void incrementStatusCount(String statusKey) {
        Integer count = statusSummary.getOrDefault(statusKey, 0);
        statusSummary.put(statusKey, count + 1);
    }
    
    /**
     * 将DTO转换为Map对象，用于返回JSON
     */
    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();
        
        // 转换机床列表
        List<Map<String, Object>> machineMaps = new ArrayList<>();
        if (machines != null) {
            for (MachineStatus machine : machines) {
                machineMaps.add(machine.toMap());
            }
        }
        result.put("machines", machineMaps);
        result.put("statusSummary", statusSummary);
        
        // 添加错误信息(如有)
        if (error != null && !error.isEmpty()) {
            result.put("error", error);
        }
        
        return result;
    }
    
    // Getters and Setters
    public List<MachineStatus> getMachines() {
        return machines;
    }
    
    public void setMachines(List<MachineStatus> machines) {
        this.machines = machines;
    }
    
    public Map<String, Integer> getStatusSummary() {
        return statusSummary;
    }
    
    public void setStatusSummary(Map<String, Integer> statusSummary) {
        this.statusSummary = statusSummary;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
} 