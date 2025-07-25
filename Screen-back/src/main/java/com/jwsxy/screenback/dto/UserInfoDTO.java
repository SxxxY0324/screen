package com.jwsxy.screenback.dto;

import java.time.LocalDateTime;

/**
 * 用户信息DTO
 * 用于传输用户基本信息，避免暴露敏感字段如密码
 */
public class UserInfoDTO {

    /**
     * 员工ID
     */
    private String employeeId;

    /**
     * 账号
     */
    private String account;

    /**
     * 姓名
     */
    private String fullName;

    /**
     * 岗位
     */
    private String workType;

    /**
     * 头像
     */
    private String photograph;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 公司名称
     */
    private String companyName;

    /**
     * 部门名称
     */
    private String departmentName;

    /**
     * 角色名称
     */
    private String roleName;

    /**
     * 入职时间
     */
    private LocalDateTime workDate;

    /**
     * 是否允许登录
     */
    private Boolean allowLogin;

    /**
     * 是否在职
     */
    private Boolean isActive;

    /**
     * 默认构造函数
     */
    public UserInfoDTO() {}

    /**
     * 构造函数
     * @param employeeId 员工ID
     * @param account 账号
     * @param fullName 姓名
     */
    public UserInfoDTO(String employeeId, String account, String fullName) {
        this.employeeId = employeeId;
        this.account = account;
        this.fullName = fullName;
    }

    // Getters and Setters

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getWorkType() {
        return workType;
    }

    public void setWorkType(String workType) {
        this.workType = workType;
    }

    public String getPhotograph() {
        return photograph;
    }

    public void setPhotograph(String photograph) {
        this.photograph = photograph;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public LocalDateTime getWorkDate() {
        return workDate;
    }

    public void setWorkDate(LocalDateTime workDate) {
        this.workDate = workDate;
    }

    public Boolean getAllowLogin() {
        return allowLogin;
    }

    public void setAllowLogin(Boolean allowLogin) {
        this.allowLogin = allowLogin;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    @Override
    public String toString() {
        return "UserInfoDTO{" +
                "employeeId='" + employeeId + '\'' +
                ", account='" + account + '\'' +
                ", fullName='" + fullName + '\'' +
                ", workType='" + workType + '\'' +
                ", companyName='" + companyName + '\'' +
                ", departmentName='" + departmentName + '\'' +
                ", roleName='" + roleName + '\'' +
                ", allowLogin=" + allowLogin +
                ", isActive=" + isActive +
                '}';
    }
} 