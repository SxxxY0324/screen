package com.jwsxy.screenback.entity;

import java.time.LocalDateTime;

/**
 * 裁剪数据实体类，对应数据库表da_cut
 */
public class CutData {
    private Long id;
    private LocalDateTime startTime;
    private Double effectiveTime;
    private Double totalTime;
    private Double moveTime;
    private Double idleTime;
    private Double disruptTime;
    private Double faultTime;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public Double getEffectiveTime() {
        return effectiveTime;
    }

    public void setEffectiveTime(Double effectiveTime) {
        this.effectiveTime = effectiveTime;
    }

    public Double getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(Double totalTime) {
        this.totalTime = totalTime;
    }

    public Double getMoveTime() {
        return moveTime;
    }

    public void setMoveTime(Double moveTime) {
        this.moveTime = moveTime;
    }

    public Double getIdleTime() {
        return idleTime;
    }

    public void setIdleTime(Double idleTime) {
        this.idleTime = idleTime;
    }

    public Double getDisruptTime() {
        return disruptTime;
    }

    public void setDisruptTime(Double disruptTime) {
        this.disruptTime = disruptTime;
    }

    public Double getFaultTime() {
        return faultTime;
    }

    public void setFaultTime(Double faultTime) {
        this.faultTime = faultTime;
    }
} 