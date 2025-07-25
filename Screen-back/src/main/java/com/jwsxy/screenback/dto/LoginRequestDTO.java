package com.jwsxy.screenback.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * 登录请求DTO
 * 用于接收用户登录表单数据
 */
public class LoginRequestDTO {

    /**
     * 用户账号
     */
    @NotBlank(message = "账号不能为空")
    @Size(max = 50, message = "账号长度不能超过50个字符")
    private String account;

    /**
     * 用户密码
     */
    @NotBlank(message = "密码不能为空")
    @Size(max = 100, message = "密码长度不能超过100个字符")
    private String password;

    /**
     * 登录类型（可选）
     * 用于区分不同的登录方式，如：password、wechat等
     */
    private String loginType = "password";

    /**
     * 设备信息（可选）
     * 记录登录时的设备信息
     */
    private String deviceInfo;

    /**
     * 默认构造函数
     */
    public LoginRequestDTO() {}

    /**
     * 构造函数
     * @param account 账号
     * @param password 密码
     */
    public LoginRequestDTO(String account, String password) {
        this.account = account;
        this.password = password;
    }

    // Getters and Setters

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

    public String getLoginType() {
        return loginType;
    }

    public void setLoginType(String loginType) {
        this.loginType = loginType;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    @Override
    public String toString() {
        return "LoginRequestDTO{" +
                "account='" + account + '\'' +
                ", password='[PROTECTED]'" +
                ", loginType='" + loginType + '\'' +
                ", deviceInfo='" + deviceInfo + '\'' +
                '}';
    }
} 