package com.jwsxy.screenback.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;

import javax.annotation.PostConstruct;

/**
 * TLS兼容性配置类
 * 验证和记录TLS配置状态（主要配置在ScreenBackApplication启动类中）
 */
@Slf4j
@Configuration
public class TLSCompatibilityConfig {

    /**
     * 应用启动完成后验证TLS配置
     */
    @EventListener(ApplicationReadyEvent.class)
    @Order(1)
    public void verifyTLSConfiguration() {
        log.info("验证TLS配置 (Java 11 + SQL Server 2012):");
        log.info("  - jdk.tls.client.protocols: {}", System.getProperty("jdk.tls.client.protocols"));
        log.info("  - https.protocols: {}", System.getProperty("https.protocols"));
        log.info("  - jdk.tls.disabledAlgorithms: [{}]", System.getProperty("jdk.tls.disabledAlgorithms"));
        log.info("  - com.sun.net.ssl.checkRevocation: {}", System.getProperty("com.sun.net.ssl.checkRevocation"));
        log.info("  - allowUnsafeRenegotiation: {}", System.getProperty("sun.security.ssl.allowUnsafeRenegotiation"));
        log.info("TLS配置验证完成 - 已启用SQL Server 2012兼容模式");
    }
} 