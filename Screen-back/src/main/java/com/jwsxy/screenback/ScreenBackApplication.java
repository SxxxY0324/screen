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
        // 设置TLS协议和安全配置
        System.setProperty("https.protocols", "TLSv1,TLSv1.1,TLSv1.2,TLSv1.3");
        Security.setProperty("jdk.tls.disabledAlgorithms", "");
        
        // SQL Server JDBC驱动配置
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
            e.printStackTrace();
        }
    }
}
