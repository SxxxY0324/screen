package com.jwsxy.screenback.dto;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * 周长数据传输对象，用于向前端返回周长数据
 */
public class PerimeterDataDTO {
    private Double totalCutPerimeter;      // 总切割周长
    private Double totalMarkPerimeter;     // 总标记周长
    private Double averageCutPerimeter;    // 平均切割周长
    private Double averageMarkPerimeter;   // 平均标记周长
    private Integer totalPieces;           // 总件数
    private LocalDate date;                // 数据日期
    private String message;                // 提示信息
    private String error;                  // 错误信息

    /**
     * 将DTO转换为Map对象，用于返回JSON
     */
    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();
        
        // 添加主要数据 - 总切割周长作为主值
        result.put("value", totalCutPerimeter);  
        
        // 添加详细数据
        result.put("totalCutPerimeter", totalCutPerimeter);
        result.put("totalMarkPerimeter", totalMarkPerimeter);
        result.put("averageCutPerimeter", averageCutPerimeter);
        result.put("averageMarkPerimeter", averageMarkPerimeter);
        result.put("totalPieces", totalPieces);
        
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
    public Double getTotalCutPerimeter() {
        return totalCutPerimeter;
    }

    public void setTotalCutPerimeter(Double totalCutPerimeter) {
        this.totalCutPerimeter = totalCutPerimeter;
    }

    public Double getTotalMarkPerimeter() {
        return totalMarkPerimeter;
    }

    public void setTotalMarkPerimeter(Double totalMarkPerimeter) {
        this.totalMarkPerimeter = totalMarkPerimeter;
    }

    public Double getAverageCutPerimeter() {
        return averageCutPerimeter;
    }

    public void setAverageCutPerimeter(Double averageCutPerimeter) {
        this.averageCutPerimeter = averageCutPerimeter;
    }

    public Double getAverageMarkPerimeter() {
        return averageMarkPerimeter;
    }

    public void setAverageMarkPerimeter(Double averageMarkPerimeter) {
        this.averageMarkPerimeter = averageMarkPerimeter;
    }

    public Integer getTotalPieces() {
        return totalPieces;
    }

    public void setTotalPieces(Integer totalPieces) {
        this.totalPieces = totalPieces;
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