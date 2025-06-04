package com.jwsxy.screenback.dto;

import java.util.HashMap;
import java.util.Map;

/**
 * 裁剪速度数据传输对象，封装裁剪速度数据
 */
public class CutSpeedDTO {
    
    private Double cutSpeed; // 裁剪速度
    private String message; // 提示消息
    private String error; // 错误信息
    
    /**
     * 默认构造函数
     */
    public CutSpeedDTO() {
        this.cutSpeed = 0.0;
    }
    
    /**
     * 将DTO转换为Map，用于API响应
     */
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("value", cutSpeed); // 使用"value"作为键，便于前端处理
        
        if (message != null && !message.isEmpty()) {
            map.put("message", message);
        }
        
        if (error != null && !error.isEmpty()) {
            map.put("error", error);
        }
        
        return map;
    }

    // Getters 和 Setters
    
    public Double getCutSpeed() {
        return cutSpeed;
    }

    public void setCutSpeed(Double cutSpeed) {
        this.cutSpeed = cutSpeed;
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