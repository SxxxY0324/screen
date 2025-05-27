package com.jwsxy.screenback.dto;

import java.util.HashMap;
import java.util.Map;

/**
 * 裁剪时间数据传输对象，封装裁剪时间数据
 */
public class CutTimeDTO {
    
    private Double cutTime; // 裁剪时间，单位为小时
    private String message; // 提示消息
    private String error; // 错误信息
    
    /**
     * 默认构造函数
     */
    public CutTimeDTO() {
        this.cutTime = 0.0;
    }
    
    /**
     * 将DTO转换为Map，用于API响应
     */
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("value", cutTime); // 使用"value"作为键，便于前端处理
        
        if (message != null && !message.isEmpty()) {
            map.put("message", message);
        }
        
        if (error != null && !error.isEmpty()) {
            map.put("error", error);
        }
        
        return map;
    }

    // Getters 和 Setters
    
    public Double getCutTime() {
        return cutTime;
    }

    public void setCutTime(Double cutTime) {
        this.cutTime = cutTime;
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