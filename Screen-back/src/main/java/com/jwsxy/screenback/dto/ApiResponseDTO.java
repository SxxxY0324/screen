package com.jwsxy.screenback.dto;

import java.time.LocalDateTime;

/**
 * 通用API响应DTO
 * 用于统一所有API接口的响应格式
 */
public class ApiResponseDTO<T> {

    /**
     * 响应状态码
     * 200: 成功
     * 400: 客户端错误
     * 401: 未认证
     * 403: 无权限
     * 500: 服务器错误
     */
    private Integer code;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    /**
     * 响应时间戳
     */
    private LocalDateTime timestamp;

    /**
     * 请求是否成功
     */
    private Boolean success;

    /**
     * 默认构造函数
     */
    public ApiResponseDTO() {
        this.timestamp = LocalDateTime.now();
    }

    /**
     * 私有构造函数
     * @param code 状态码
     * @param message 消息
     * @param data 数据
     * @param success 是否成功
     */
    private ApiResponseDTO(Integer code, String message, T data, Boolean success) {
        this();
        this.code = code;
        this.message = message;
        this.data = data;
        this.success = success;
    }

    /**
     * 成功响应（带数据）
     * @param data 响应数据
     * @param <T> 数据类型
     * @return API响应对象
     */
    public static <T> ApiResponseDTO<T> success(T data) {
        return new ApiResponseDTO<>(200, "操作成功", data, true);
    }

    /**
     * 成功响应（带消息和数据）
     * @param message 响应消息
     * @param data 响应数据
     * @param <T> 数据类型
     * @return API响应对象
     */
    public static <T> ApiResponseDTO<T> success(String message, T data) {
        return new ApiResponseDTO<>(200, message, data, true);
    }

    /**
     * 成功响应（仅消息）
     * @param message 响应消息
     * @return API响应对象
     */
    public static <T> ApiResponseDTO<T> success(String message) {
        return new ApiResponseDTO<>(200, message, null, true);
    }

    /**
     * 失败响应
     * @param message 错误消息
     * @param <T> 数据类型
     * @return API响应对象
     */
    public static <T> ApiResponseDTO<T> error(String message) {
        return new ApiResponseDTO<>(400, message, null, false);
    }

    /**
     * 失败响应（带状态码）
     * @param code 状态码
     * @param message 错误消息
     * @param <T> 数据类型
     * @return API响应对象
     */
    public static <T> ApiResponseDTO<T> error(Integer code, String message) {
        return new ApiResponseDTO<>(code, message, null, false);
    }

    /**
     * 未认证响应
     * @param message 错误消息
     * @param <T> 数据类型
     * @return API响应对象
     */
    public static <T> ApiResponseDTO<T> unauthorized(String message) {
        return new ApiResponseDTO<>(401, message, null, false);
    }

    /**
     * 无权限响应
     * @param message 错误消息
     * @param <T> 数据类型
     * @return API响应对象
     */
    public static <T> ApiResponseDTO<T> forbidden(String message) {
        return new ApiResponseDTO<>(403, message, null, false);
    }

    /**
     * 服务器错误响应
     * @param message 错误消息
     * @param <T> 数据类型
     * @return API响应对象
     */
    public static <T> ApiResponseDTO<T> serverError(String message) {
        return new ApiResponseDTO<>(500, message, null, false);
    }

    // Getters and Setters

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    @Override
    public String toString() {
        return "ApiResponseDTO{" +
                "code=" + code +
                ", message='" + message + '\'' +
                ", data=" + data +
                ", timestamp=" + timestamp +
                ", success=" + success +
                '}';
    }
} 