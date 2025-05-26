package com.jwsxy.screenback.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 能耗数据传输对象，用于向前端返回能耗数据
 */
public class EnergyConsumptionDTO {
    private List<DeviceEnergy> devices;   // 设备能耗列表

    /**
     * 设备能耗数据内部类
     */
    public static class DeviceEnergy {
        private String deviceId;  // 设备ID
        private Double energy;    // 设备能耗 (kWh)

        public DeviceEnergy() {
        }

        public DeviceEnergy(String deviceId, Double energy) {
            this.deviceId = deviceId;
            this.energy = energy;
        }

        public String getDeviceId() {
            return deviceId;
        }

        public void setDeviceId(String deviceId) {
            this.deviceId = deviceId;
        }

        public Double getEnergy() {
            return energy;
        }

        public void setEnergy(Double energy) {
            this.energy = energy;
        }

        /**
         * 转换为Map
         */
        public Map<String, Object> toMap() {
            Map<String, Object> map = new HashMap<>();
            map.put("deviceId", deviceId);
            map.put("energy", energy);
            return map;
        }
    }

    /**
     * 构造函数
     */
    public EnergyConsumptionDTO() {
        this.devices = new ArrayList<>();
    }

    /**
     * 将DTO转换为Map对象，用于返回JSON
     */
    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();
        
        // 转换设备列表
        List<Map<String, Object>> deviceMaps = new ArrayList<>();
        if (devices != null) {
            for (DeviceEnergy device : devices) {
                deviceMaps.add(device.toMap());
            }
        }
        result.put("devices", deviceMaps);
        
        return result;
    }

    public List<DeviceEnergy> getDevices() {
        return devices;
    }

    public void setDevices(List<DeviceEnergy> devices) {
        this.devices = devices;
    }
    
    /**
     * 添加设备能耗数据
     * 
     * @param deviceId 设备ID
     * @param energy 能耗 (kWh)
     */
    public void addDevice(String deviceId, Double energy) {
        if (this.devices == null) {
            this.devices = new ArrayList<>();
        }
        this.devices.add(new DeviceEnergy(deviceId, energy));
    }
} 