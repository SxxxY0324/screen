# JW-MES-Phone 后端服务

## 项目概述

JW-MES-Phone 是一个基于 Spring Boot 的制造执行系统(MES)后端服务，为微信小程序提供API支持。

## 技术栈

- **Spring Boot**: 2.7.18
- **Java**: 11 (推荐)
- **数据库**: SQL Server 2012
- **安全框架**: Spring Security + JWT
- **连接池**: HikariCP

## 核心特性

- ✅ **TLS兼容性**: 内置SQL Server 2012 TLS 1.0支持
- ✅ **密码自动升级**: 支持SHA-256/明文密码自动升级为BCrypt
- ✅ **JWT认证**: 完整的登录认证和令牌管理
- ✅ **CORS支持**: 跨域请求配置
- ✅ **微信小程序集成**: 微信登录API支持

## 快速开始

### 1. 环境要求
- Java 11或更高版本
- SQL Server 2012或更高版本
- Maven 3.6+

### 2. 配置数据库
更新 `src/main/resources/application.properties` 中的数据库连接信息：
```properties
spring.datasource.url=jdbc:sqlserver://[服务器地址]:1433;databaseName=CutDB03;encrypt=false;trustServerCertificate=true;loginTimeout=120;socketTimeout=120
spring.datasource.username=sa
spring.datasource.password=123456
```

### 3. IDEA运行配置
在IDEA的Run Configuration中添加VM options：
```
-Djdk.tls.client.protocols=TLSv1,TLSv1.1,TLSv1.2 -Dhttps.protocols=TLSv1,TLSv1.1,TLSv1.2 -Djdk.tls.disabledAlgorithms= -Djdk.tls.legacyAlgorithms= -Djdk.tls.useExtendedMasterSecret=false -Dcom.sun.net.ssl.checkRevocation=false -Dsun.security.ssl.allowUnsafeRenegotiation=true -Dsun.security.ssl.allowLegacyHelloMessages=true
```

### 4. 启动应用
```bash
mvn clean compile
mvn spring-boot:run
```

应用将在 http://localhost:8081 启动

## API接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新令牌
- `POST /api/auth/logout` - 用户登出

### 测试默认账号
- **用户名**: admin
- **密码**: admin

## 开发说明

### TLS配置
系统已内置SQL Server 2012的TLS兼容性配置，无需额外脚本。

### 密码加密
- 系统支持多种密码格式：SHA-256哈希、明文、BCrypt
- 首次登录时自动升级为BCrypt格式

### 日志配置
调试级别日志已启用，可在控制台查看详细的数据库操作和认证过程。

## 项目结构
```
src/main/java/com/jwsxy/screenback/
├── ScreenBackApplication.java      # 主启动类（含TLS配置）
├── config/                         # 配置类
├── controller/                     # REST控制器
├── service/                        # 业务逻辑服务
├── repository/                     # 数据访问层
├── entity/                         # 实体类
├── dto/                           # 数据传输对象
├── security/                      # 安全相关
└── utils/                         # 工具类
```

## 故障排除

### 数据库连接问题
1. 确认SQL Server服务正在运行
2. 检查网络连通性：`ping [数据库服务器IP]`
3. 验证端口访问：`telnet [数据库服务器IP] 1433`

### TLS连接问题
1. 确认IDEA中已添加VM options
2. 查看启动日志是否显示"TLS兼容性配置已加载"

### 登录问题
1. 查看控制台日志的密码验证详细信息
2. 确认数据库中用户数据存在
3. 检查密码格式（SHA-256/明文/BCrypt）

## 技术支持

如有问题，请查看应用日志获取详细错误信息。 