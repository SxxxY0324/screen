package com.jwsxy.screenback.config;

import com.jwsxy.screenback.security.JwtAuthenticationFilter;
import com.jwsxy.screenback.security.JwtAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Spring Security安全配置类
 * 配置JWT认证、CORS跨域、安全过滤器链等
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    /**
     * 配置密码编码器
     * 使用BCrypt加密算法
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 配置安全过滤器链
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 禁用CSRF，因为使用JWT令牌
            .csrf().disable()
            
            // 配置CORS
            .cors().configurationSource(corsConfigurationSource())
            
            .and()
            
            // 配置会话管理 - 使用无状态会话
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            
            .and()
            
            // 配置异常处理
            .exceptionHandling()
            .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            
            .and()
            
            // 配置授权规则
            .authorizeHttpRequests()
                // 公开的认证相关接口，不需要令牌
                .antMatchers("/api/auth/login", "/api/auth/check-account/**").permitAll()
                
                // 健康检查接口
                .antMatchers("/actuator/health").permitAll()
                
                // 错误页面
                .antMatchers("/error").permitAll()
                
                // 所有其他API请求都需要认证
                .antMatchers("/api/**").authenticated()
                
                // 允许其他请求
                .anyRequest().permitAll()
            
            // 添加JWT认证过滤器
            .and()
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * 配置CORS跨域
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 允许的源
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        
        // 允许的HTTP方法
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // 允许的请求头
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // 允许发送凭证
        configuration.setAllowCredentials(true);
        
        // 预检请求的有效期
        configuration.setMaxAge(3600L);
        
        // 暴露的响应头
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
} 