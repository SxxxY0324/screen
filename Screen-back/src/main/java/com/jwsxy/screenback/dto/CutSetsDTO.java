package com.jwsxy.screenback.dto;

import java.util.HashMap;
import java.util.Map;

/**
 * 裁剪套数数据传输对象，封装裁剪套数数据
 */
public class CutSetsDTO {
    
    private Integer cutSets; // 裁剪套数
    private String message; // 提示消息
    private String error; // 错误信息
    
    /**
     * 默认构造函数
     */
    public CutSetsDTO() {
        this.cutSets = 0;
    }
    
    /**
     * 将DTO转换为Map，用于API响应
     */
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("value", cutSets); // 使用"value"作为键，便于前端处理
        
        if (message != null && !message.isEmpty()) {
            map.put("message", message);
        }
        
        if (error != null && !error.isEmpty()) {
            map.put("error", error);
        }
        
        return map;
    }

    // Getters 和 Setters
    
    public Integer getCutSets() {
        return cutSets;
    }

    public void setCutSets(Integer cutSets) {
        this.cutSets = cutSets;
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