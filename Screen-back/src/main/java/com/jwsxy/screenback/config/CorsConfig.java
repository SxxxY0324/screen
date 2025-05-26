package com.jwsxy.screenback.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 允许凭证
        config.setAllowCredentials(true);
        
        // 使用通配符模式允许局域网内所有设备访问
        // Spring Boot 3.x完全支持setAllowedOriginPatterns
        List<String> allowedOriginPatterns = Arrays.asList(
            // 放宽访问限制，允许所有源
            "*",
            // 本地开发环境
            "http://localhost:*",
            // 局域网IP - 覆盖常见的内网IP段
            "http://172.16.*.*:*",
            "http://192.168.*.*:*",
            "http://10.*.*.*:*",
            // 具体的生产环境域名
            "https://yourdomain.com",
            "https://m.yourdomain.com",
            "https://servicewechat.com"  // 微信小程序
        );
        
        // 设置允许的源
        config.setAllowedOriginPatterns(allowedOriginPatterns);
        
        // 明确的将localhost:5173添加为允许源
        config.addAllowedOrigin("http://localhost:5173");
        
        // 允许所有请求头
        config.addAllowedHeader("*");
        
        // 允许的HTTP方法
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // 暴露的响应头
        config.setExposedHeaders(Arrays.asList("Content-Range", "X-Total-Count"));
        
        // 预检请求的缓存时间（秒）
        config.setMaxAge(3600L);
        
        // 应用CORS配置到所有路径
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
} 