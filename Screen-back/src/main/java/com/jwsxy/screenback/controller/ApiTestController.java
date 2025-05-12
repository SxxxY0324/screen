package com.jwsxy.screenback.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiTestController {

    @GetMapping("/test")
    public Map<String, Object> testApi() {
        Map<String, Object> result = new HashMap<>();
        result.put("message", "API连接成功");
        result.put("status", "success");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
} 