package com.jwsxy.screenback.dto;

import java.time.LocalDateTime;

/**
 * 登录响应DTO
 * 用于返回登录成功后的用户信息和认证令牌
 */
public class LoginResponseDTO {

    /**
     * 访问令牌
     */
    private String accessToken;

    /**
     * 刷新令牌
     */
    private String refreshToken;

    /**
     * 令牌类型，通常为"Bearer"
     */
    private String tokenType = "Bearer";

    /**
     * 令牌过期时间（秒）
     */
    private Long expiresIn;

    /**
     * 用户信息
     */
    private UserInfoDTO userInfo;

    /**
     * 登录时间
     */
    private LocalDateTime loginTime;

    /**
     * 登录成功消息
     */
    private String message = "登录成功";

    /**
     * 默认构造函数
     */
    public LoginResponseDTO() {
        this.loginTime = LocalDateTime.now();
    }

    /**
     * 构造函数
     * @param accessToken 访问令牌
     * @param userInfo 用户信息
     */
    public LoginResponseDTO(String accessToken, UserInfoDTO userInfo) {
        this();
        this.accessToken = accessToken;
        this.userInfo = userInfo;
    }

    /**
     * 构造函数
     * @param accessToken 访问令牌
     * @param refreshToken 刷新令牌
     * @param expiresIn 过期时间
     * @param userInfo 用户信息
     */
    public LoginResponseDTO(String accessToken, String refreshToken, Long expiresIn, UserInfoDTO userInfo) {
        this();
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.userInfo = userInfo;
    }

    // Getters and Setters

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public UserInfoDTO getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfoDTO userInfo) {
        this.userInfo = userInfo;
    }

    public LocalDateTime getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(LocalDateTime loginTime) {
        this.loginTime = loginTime;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "LoginResponseDTO{" +
                "accessToken='[PROTECTED]'" +
                ", refreshToken='[PROTECTED]'" +
                ", tokenType='" + tokenType + '\'' +
                ", expiresIn=" + expiresIn +
                ", userInfo=" + userInfo +
                ", loginTime=" + loginTime +
                ", message='" + message + '\'' +
                '}';
    }
} 