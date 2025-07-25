package com.jwsxy.screenback.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 员工实体类
 * 映射数据库表 TYBase_Employee
 */
@Entity
@Table(name = "TYBase_Employee")
public class Employee {

    /**
     * 员工ID（主键）
     */
    @Id
    @Column(name = "EP_EmployeeId", length = 50)
    private String employeeId;

    /**
     * 账号
     */
    @Column(name = "EP_Account", length = 50)
    private String account;

    /**
     * 密码
     */
    @Column(name = "EP_Password", length = 50)
    private String password;

    /**
     * 姓名
     */
    @Column(name = "EP_FullName", length = 50)
    private String fullName;

    /**
     * 岗位
     */
    @Column(name = "EP_WorkType", length = 50)
    private String workType;

    /**
     * 入职时间
     */
    @Column(name = "EP_WorkDate")
    private LocalDateTime workDate;

    /**
     * 工龄
     */
    @Column(name = "EP_WorkYear")
    private Double workYear;

    /**
     * 头像
     */
    @Column(name = "EP_Photograph", length = 500)
    private String photograph;

    /**
     * 身份证
     */
    @Column(name = "EP_IDNumber", length = 50)
    private String idNumber;

    /**
     * 开户行
     */
    @Column(name = "EP_BankName", length = 50)
    private String bankName;

    /**
     * 银行卡号
     */
    @Column(name = "EP_BankCardNumber", length = 50)
    private String bankCardNumber;

    /**
     * 保险情况
     */
    @Column(name = "EP_Safe")
    private Integer safe;

    /**
     * 性别
     */
    @Column(name = "EP_Gender", length = 50)
    private String gender;

    /**
     * 出生年月
     */
    @Column(name = "EP_Birthday")
    private LocalDateTime birthday;

    /**
     * 联系电话
     */
    @Column(name = "EP_Phone", length = 50)
    private String phone;

    /**
     * 所在单位ID
     */
    @Column(name = "EP_CompanyId", length = 50)
    private String companyId;

    /**
     * 公司名称
     */
    @Column(name = "EP_CompanyName", length = 100)
    private String companyName;

    /**
     * 部门编号
     */
    @Column(name = "EP_DepartmentId", length = 50)
    private String departmentId;

    /**
     * 部门名称
     */
    @Column(name = "EP_DepartmentName", length = 100)
    private String departmentName;

    /**
     * 工资
     */
    @Column(name = "EP_SalaryValue")
    private Double salaryValue;

    /**
     * 在岗状态（0：在岗，1：离职）
     */
    @Column(name = "EP_IsDimission")
    private Integer isDimission;

    /**
     * 离职时间
     */
    @Column(name = "EP_DimissionDate")
    private LocalDateTime dimissionDate;

    /**
     * 离职原因
     */
    @Column(name = "EP_DimissionCause", length = 100)
    private String dimissionCause;

    /**
     * 身份证正面
     */
    @Column(name = "EP_IdentityCardF", length = 500)
    private String identityCardF;

    /**
     * 身份证反面
     */
    @Column(name = "EP_IdentityCardB", length = 500)
    private String identityCardB;

    /**
     * 角色编号
     */
    @Column(name = "EP_RoleId", length = 50)
    private String roleId;

    /**
     * 角色名称
     */
    @Column(name = "EP_RoleName", length = 50)
    private String roleName;

    /**
     * 允许登录（0：不允许，1：允许）
     */
    @Column(name = "EP_AllowLogin")
    private Integer allowLogin;

    /**
     * 序号
     */
    @Column(name = "EP_SortCode")
    private Integer sortCode;

    /**
     * 机器
     */
    @Column(name = "EP_Machine", length = 50)
    private String machine;

    /**
     * 机器ID
     */
    @Column(name = "EP_MachineID", length = 50)
    private String machineId;

    // 构造函数
    public Employee() {}

    public Employee(String employeeId, String account, String password, String fullName) {
        this.employeeId = employeeId;
        this.account = account;
        this.password = password;
        this.fullName = fullName;
    }

    // Getter和Setter方法
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public LocalDateTime getWorkDate() {
        return workDate;
    }

    public void setWorkDate(LocalDateTime workDate) {
        this.workDate = workDate;
    }

    public Double getWorkYear() {
        return workYear;
    }

    public void setWorkYear(Double workYear) {
        this.workYear = workYear;
    }

    public String getPhotograph() {
        return photograph;
    }

    public void setPhotograph(String photograph) {
        this.photograph = photograph;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBankCardNumber() {
        return bankCardNumber;
    }

    public void setBankCardNumber(String bankCardNumber) {
        this.bankCardNumber = bankCardNumber;
    }

    public Integer getSafe() {
        return safe;
    }

    public void setSafe(Integer safe) {
        this.safe = safe;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDateTime getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDateTime birthday) {
        this.birthday = birthday;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public Double getSalaryValue() {
        return salaryValue;
    }

    public void setSalaryValue(Double salaryValue) {
        this.salaryValue = salaryValue;
    }

    public Integer getIsDimission() {
        return isDimission;
    }

    public void setIsDimission(Integer isDimission) {
        this.isDimission = isDimission;
    }

    public LocalDateTime getDimissionDate() {
        return dimissionDate;
    }

    public void setDimissionDate(LocalDateTime dimissionDate) {
        this.dimissionDate = dimissionDate;
    }

    public String getDimissionCause() {
        return dimissionCause;
    }

    public void setDimissionCause(String dimissionCause) {
        this.dimissionCause = dimissionCause;
    }

    public String getIdentityCardF() {
        return identityCardF;
    }

    public void setIdentityCardF(String identityCardF) {
        this.identityCardF = identityCardF;
    }

    public String getIdentityCardB() {
        return identityCardB;
    }

    public void setIdentityCardB(String identityCardB) {
        this.identityCardB = identityCardB;
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Integer getAllowLogin() {
        return allowLogin;
    }

    public void setAllowLogin(Integer allowLogin) {
        this.allowLogin = allowLogin;
    }

    public Integer getSortCode() {
        return sortCode;
    }

    public void setSortCode(Integer sortCode) {
        this.sortCode = sortCode;
    }

    public String getMachine() {
        return machine;
    }

    public void setMachine(String machine) {
        this.machine = machine;
    }

    public String getMachineId() {
        return machineId;
    }

    public void setMachineId(String machineId) {
        this.machineId = machineId;
    }

    /**
     * 检查员工是否允许登录
     */
    public boolean isLoginAllowed() {
        return allowLogin != null && allowLogin == 1;
    }

    /**
     * 检查员工是否在职
     */
    public boolean isActive() {
        return isDimission == null || isDimission == 0;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "employeeId='" + employeeId + '\'' +
                ", account='" + account + '\'' +
                ", fullName='" + fullName + '\'' +
                ", workType='" + workType + '\'' +
                ", companyName='" + companyName + '\'' +
                ", departmentName='" + departmentName + '\'' +
                ", roleName='" + roleName + '\'' +
                ", allowLogin=" + allowLogin +
                ", isDimission=" + isDimission +
                '}';
    }
} 