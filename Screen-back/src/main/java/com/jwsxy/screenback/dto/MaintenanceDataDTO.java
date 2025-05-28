package com.jwsxy.screenback.dto;

/**
 * 维保数据传输对象，用于封装维保相关指标
 */
public class MaintenanceDataDTO {
    
    // 故障台数
    private Integer faultCount;
    
    // 故障次数
    private Integer faultTimes;
    
    // 故障时长（小时）
    private Double faultDuration;
    
    // 平均故障时长（小时）
    private Double avgFaultTime;
    
    // 错误信息
    private String error;
    
    // 提示消息
    private String message;

    public MaintenanceDataDTO() {
        // 默认构造函数
    }

    public Integer getFaultCount() {
        return faultCount;
    }

    public void setFaultCount(Integer faultCount) {
        this.faultCount = faultCount;
    }

    public Integer getFaultTimes() {
        return faultTimes;
    }

    public void setFaultTimes(Integer faultTimes) {
        this.faultTimes = faultTimes;
    }

    public Double getFaultDuration() {
        return faultDuration;
    }

    public void setFaultDuration(Double faultDuration) {
        this.faultDuration = faultDuration;
    }

    public Double getAvgFaultTime() {
        return avgFaultTime;
    }

    public void setAvgFaultTime(Double avgFaultTime) {
        this.avgFaultTime = avgFaultTime;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
} 