package com.jwsxy.screenback.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 全局API控制器，用于处理顶层API请求
 * 注意：原有的兼容性端点已移至各功能控制器中
 */
@RestController
@RequestMapping("/api")
public class GlobalApiController {
    // 移除了重复的getMovingRate方法，该方法已在MonitorController中实现
} 