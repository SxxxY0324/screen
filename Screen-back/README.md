# Screen-back 后端项目

## 配置敏感信息

为了保护敏感信息（如数据库密码、API密钥等），本项目使用环境变量来管理这些配置。在启动应用程序前，请按照以下步骤设置必要的环境变量：

### 环境变量设置

#### 必要的环境变量：

- `DB_URL`: 数据库连接URL
- `DB_USERNAME`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `WECHAT_APP_ID`: 微信小程序AppID
- `WECHAT_APP_SECRET`: 微信小程序AppSecret

#### 设置方法：

**在开发环境中：**

1. 创建一个`.env`文件（已被添加到.gitignore中，不会被提交）
2. 按照以下格式填写环境变量：

```
DB_URL=jdbc:sqlserver://your_server;databaseName=your_db;encrypt=false
DB_USERNAME=your_username
DB_PASSWORD=your_password
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret
```

**在生产环境中：**

- 根据您的部署平台（如Docker、Kubernetes、服务器等）设置环境变量。

### 使用配置文件

1. 项目中提供了一个`application-example.properties`文件作为配置模板
2. 首次设置项目时，请复制此文件并重命名为`application-dev.properties`或`application-prod.properties`
3. 在复制的文件中填入真实的配置信息

### 安全注意事项

- 请勿在代码中硬编码敏感信息
- 不要将包含敏感信息的配置文件提交到Git仓库
- 定期更新密码和密钥
- 遵循最小权限原则设置数据库用户权限

## 启动项目

设置好环境变量后，可以使用以下命令启动项目：

```bash
# 开发环境
./mvnw spring-boot:run -Dspring.profiles.active=dev

# 生产环境
./mvnw spring-boot:run -Dspring.profiles.active=prod
```

或者通过Java命令：

```bash
# 开发环境
java -jar target/app.jar --spring.profiles.active=dev

# 生产环境
java -jar target/app.jar --spring.profiles.active=prod
``` 