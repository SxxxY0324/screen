package com.jwsxy.screenback.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 裁床运行数据传输对象
 * 包含裁床运行表格需要展示的数据：序号、车间、设备编号、速度和运行时长
 */
public class MachineRunningDataDTO {
    
    private List<MachineRunningData> tableData = new ArrayList<>();
    private String error;
    
    // 添加分页相关字段
    private int currentPage = 1;
    private int pageSize = 20;
    private int totalItems = 0;
    private int totalPages = 0;
    
    /**
     * 添加裁床运行数据
     *
     * @param machineId 设备编号
     * @param workshop 车间名称
     * @param speed 运行速度
     * @param runningHours 运行时长(小时)
     */
    public void addMachineData(String machineId, String workshop, double speed, double runningHours) {
        MachineRunningData data = new MachineRunningData();
        data.setMachineId(machineId);
        data.setWorkshop(workshop);
        data.setSpeed(speed);
        data.setRunningHours(runningHours);
        tableData.add(data);
    }
    
    /**
     * 转换为前端需要的Map格式
     * 
     * @return 包含数据的Map
     */
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        
        if (error != null) {
            map.put("error", error);
        } else {
            // 转换数据为二维数组格式，方便前端表格渲染
            List<List<String>> formattedData = new ArrayList<>();
            
            for (int i = 0; i < tableData.size(); i++) {
                MachineRunningData data = tableData.get(i);
                List<String> row = new ArrayList<>();
                
                // 序号 (1-based)
                row.add(String.valueOf(((currentPage - 1) * pageSize) + i + 1));
                // 车间
                row.add(data.getWorkshop());
                // 设备编号
                row.add(data.getMachineId());
                // 速度 (保留2位小数)
                row.add(String.format("%.2f", data.getSpeed()));
                // 运行时长 (转换为小时:分钟格式)
                row.add(formatHours(data.getRunningHours()));
                
                formattedData.add(row);
            }
            
            map.put("tableData", formattedData);
            
            // 添加分页信息
            Map<String, Object> pagination = new HashMap<>();
            pagination.put("currentPage", currentPage);
            pagination.put("pageSize", pageSize);
            pagination.put("totalItems", totalItems);
            pagination.put("totalPages", totalPages);
            map.put("pagination", pagination);
        }
        
        return map;
    }
    
    /**
     * 将小时数格式化为"小时"格式，保留1位小数
     * 
     * @param hours 小时数
     * @return 格式化后的时间字符串
     */
    private String formatHours(double hours) {
        // 直接返回小时数，保留1位小数
        return String.format("%.1f", hours);
    }
    
    // Getters and Setters
    public List<MachineRunningData> getTableData() {
        return tableData;
    }
    
    public void setTableData(List<MachineRunningData> tableData) {
        this.tableData = tableData;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
    
    /**
     * 设置分页信息
     * 
     * @param currentPage 当前页码
     * @param pageSize 每页大小
     * @param totalItems 总记录数
     */
    public void setPagination(int currentPage, int pageSize, int totalItems) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = (totalItems + pageSize - 1) / pageSize; // 向上取整
    }
    
    public int getCurrentPage() {
        return currentPage;
    }
    
    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }
    
    public int getPageSize() {
        return pageSize;
    }
    
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
    
    public int getTotalItems() {
        return totalItems;
    }
    
    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
        this.totalPages = (totalItems + pageSize - 1) / pageSize; // 计算总页数
    }
    
    public int getTotalPages() {
        return totalPages;
    }
    
    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
    
    /**
     * 内部类：裁床运行数据
     */
    public static class MachineRunningData {
        private String machineId;
        private String workshop;
        private double speed;
        private double runningHours;
        
        // Getters and Setters
        public String getMachineId() {
            return machineId;
        }
        
        public void setMachineId(String machineId) {
            this.machineId = machineId;
        }
        
        public String getWorkshop() {
            return workshop;
        }
        
        public void setWorkshop(String workshop) {
            this.workshop = workshop;
        }
        
        public double getSpeed() {
            return speed;
        }
        
        public void setSpeed(double speed) {
            this.speed = speed;
        }
        
        public double getRunningHours() {
            return runningHours;
        }
        
        public void setRunningHours(double runningHours) {
            this.runningHours = runningHours;
        }
    }
} 