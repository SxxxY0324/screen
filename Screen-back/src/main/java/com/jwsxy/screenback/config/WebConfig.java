package com.jwsxy.screenback.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web配置类，用于额外的URL映射和配置
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * 配置路径匹配
     * 注意：此配置用于Spring Boot版本低于2.6的项目
     * Spring Boot 2.6+ 使用PathPatternParser替代AntPathMatcher
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // 如果使用Spring Boot 2.6+，则需要禁用PathPatternParser
        // configurer.setPatternParser(new org.springframework.web.util.pattern.PathPatternParser());
        
        // 确保路径匹配正确处理
        configurer.setUseTrailingSlashMatch(true);
    }
} 