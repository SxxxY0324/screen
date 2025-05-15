package com.jwsxy.screenback.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 允许凭证
        config.setAllowCredentials(true);
        
        // 允许的来源列表
        // 开发环境
        config.addAllowedOrigin("http://localhost:5173"); // PC端开发环境
        config.addAllowedOrigin("http://localhost:3000"); // 可能的另一个开发环境
        config.addAllowedOrigin("http://localhost:10086"); // 手机Web端开发环境
        config.addAllowedOrigin("http://172.16.69.121:5173"); // 通过局域网IP访问PC端开发环境
        config.addAllowedOrigin("http://172.16.69.121:3000"); // 通过局域网IP访问可能的另一个开发环境
        config.addAllowedOrigin("http://172.16.69.121:10086"); // 通过局域网IP访问手机Web端开发环境
        
        // 生产环境
        config.addAllowedOrigin("https://yourdomain.com"); // PC端生产环境，请替换为实际域名
        config.addAllowedOrigin("https://m.yourdomain.com"); // 手机Web端生产环境，请替换为实际域名
        config.addAllowedOrigin("https://servicewechat.com"); // 微信小程序，请确认此域名
        
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