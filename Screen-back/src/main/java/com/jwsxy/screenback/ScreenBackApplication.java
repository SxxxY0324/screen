package com.jwsxy.screenback;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.security.Security;

@SpringBootApplication
public class ScreenBackApplication {

    private static final Logger logger = LoggerFactory.getLogger(ScreenBackApplication.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public static void main(String[] args) {
        // 设置系统属性允许TLS 1.0和1.1（不推荐长期使用，仅作为临时解决方案）
        System.setProperty("https.protocols", "TLSv1,TLSv1.1,TLSv1.2,TLSv1.3");
        
        // 启用弱加密套件
        Security.setProperty("jdk.tls.disabledAlgorithms", "");
        
        // 设置SQL Server JDBC驱动相关属性
        // System.setProperty("javax.net.debug", "ssl");  // 启用SSL调试
        System.setProperty("com.microsoft.sqlserver.jdbc.disableTLS", "false");
        System.setProperty("com.microsoft.sqlserver.jdbc.enableTLS", "true");
        
        SpringApplication.run(ScreenBackApplication.class, args);
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void testDatabaseConnection() {
        try {
            logger.info("测试数据库连接...");
            String dbVersion = jdbcTemplate.queryForObject("SELECT @@version", String.class);
            logger.info("数据库连接成功! 数据库版本: {}", dbVersion);
        } catch (Exception e) {
            logger.error("数据库连接测试失败", e);
            // 打印详细的异常信息有助于诊断问题
            e.printStackTrace();
        }
    }
}
