package com.jwsxy.screenback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.security.Security;

/**
 * Spring Boot 应用程序主类
 * 启动类负责引导启动Spring Boot应用程序
 */
@SpringBootApplication
public class ScreenBackApplication {

    static {
        // 在应用启动前设置TLS兼容性参数 - 强制支持SQL Server 2012 TLS 1.0
        // 这样无论部署到哪个环境都会自动生效，不需要额外脚本
        
        // 核心TLS协议设置
        System.setProperty("jdk.tls.client.protocols", "TLSv1,TLSv1.1,TLSv1.2");
        System.setProperty("https.protocols", "TLSv1,TLSv1.1,TLSv1.2");
        
        // 禁用所有TLS限制算法
        System.setProperty("jdk.tls.disabledAlgorithms", "");
        System.setProperty("jdk.tls.legacyAlgorithms", "");
        
        // TLS安全设置
        System.setProperty("jdk.tls.useExtendedMasterSecret", "false");
        System.setProperty("com.sun.net.ssl.checkRevocation", "false");
        System.setProperty("com.microsoft.sqlserver.jdbc.fips", "false");
        
        // SSL信任设置
        System.setProperty("javax.net.ssl.trustStore", "");
        System.setProperty("javax.net.ssl.trustStorePassword", "");
        
        // 允许不安全的SSL重新协商和旧式握手
        System.setProperty("sun.security.ssl.allowUnsafeRenegotiation", "true");
        System.setProperty("sun.security.ssl.allowLegacyHelloMessages", "true");
        
        // 强制禁用TLS 1.3和高级安全特性
        System.setProperty("jdk.tls.client.cipherSuites", "");
        System.setProperty("jdk.tls.server.cipherSuites", "");
        
        // 更新安全属性以允许旧版TLS
        Security.setProperty("jdk.tls.disabledAlgorithms", "");
        Security.setProperty("crypto.policy", "unlimited");
        
        // SQL Server JDBC特定设置
        System.setProperty("com.microsoft.sqlserver.jdbc.trustServerCertificate", "true");
        System.setProperty("com.microsoft.sqlserver.jdbc.encrypt", "false");
        
        System.out.println("TLS兼容性配置已加载 - 支持TLS 1.0/1.1/1.2");
    }
    
    public static void main(String[] args) {
        try {
            SpringApplication.run(ScreenBackApplication.class, args);
        } catch (Exception e) {
            System.err.println("应用启动失败: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
