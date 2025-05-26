package com.jwsxy.screenback.dto;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * 移动率数据传输对象，用于向前端返回移动率数据
 */
public class MaterialUtilizationDTO {
    private Double materialUtilization;     // 移动率（基于切割周长和移动速度）
    private Double cutPerimeter;            // 切割周长
    private Double moveSpeed;               // 移动速度
    private Double totalTime;               // 总时间（秒）
    private Double calculatedMoveTime;      // 计算得到的移动时间
    private LocalDate date;                 // 数据日期
    private String message;                 // 提示信息
    private String error;                   // 错误信息

    /**
     * 将DTO转换为Map对象，用于返回JSON
     */
    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();
        result.put("value", materialUtilization);  // 移动率值用于前端展示
        result.put("materialUtilization", materialUtilization);
        
        // 添加基础数据
        result.put("cutPerimeter", cutPerimeter);
        result.put("moveSpeed", moveSpeed);
        result.put("totalTime", totalTime);
        result.put("calculatedMoveTime", calculatedMoveTime);
        
        // 添加日期和消息
        if (date != null) {
            result.put("date", date.toString());
        }
        if (message != null && !message.isEmpty()) {
            result.put("message", message);
        }
        if (error != null && !error.isEmpty()) {
            result.put("error", error);
        }
        
        return result;
    }

    // Getters and Setters
    public Double getMaterialUtilization() {
        return materialUtilization;
    }

    public void setMaterialUtilization(Double materialUtilization) {
        this.materialUtilization = materialUtilization;
    }

    public Double getCutPerimeter() {
        return cutPerimeter;
    }

    public void setCutPerimeter(Double cutPerimeter) {
        this.cutPerimeter = cutPerimeter;
    }

    public Double getMoveSpeed() {
        return moveSpeed;
    }

    public void setMoveSpeed(Double moveSpeed) {
        this.moveSpeed = moveSpeed;
    }

    public Double getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(Double totalTime) {
        this.totalTime = totalTime;
    }

    public Double getCalculatedMoveTime() {
        return calculatedMoveTime;
    }

    public void setCalculatedMoveTime(Double calculatedMoveTime) {
        this.calculatedMoveTime = calculatedMoveTime;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
} 