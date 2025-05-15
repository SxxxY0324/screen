# Screen 项目

这是一个前后端分离的项目，前端使用React+Vite构建，后端使用Spring Boot构建，同时包含微信小程序端。

## 项目结构

- `Screen/`: 前端React项目
- `Screen-back/`: 后端Spring Boot项目
- `Screen-mobile/`: 移动端H5及微信小程序项目

## 前端 (Screen)

### 技术栈
- React 19
- Vite 6

### 开发环境启动
```bash
cd Screen
npm install
npm run dev
```

前端开发服务器将在 http://localhost:5173 启动。

## 后端 (Screen-back)

### 技术栈
- Spring Boot 3.4.5
- Java 17
- RestTemplate (微信API调用)

### 开发环境启动
```bash
cd Screen-back
./mvnw spring-boot:run
```

后端API服务将在 http://localhost:8080 启动。

### 主要接口
- `/api/auth/login`: 微信登录授权接口
- `/api/auth/get-phone`: 获取微信绑定手机号接口

## 移动端 (Screen-mobile)

### 技术栈
- Taro 4.0.13 (多端统一开发框架)
- React 18.0.0 
- 微信小程序
- Sass (CSS预处理器)

### 项目特点
- 支持同时构建H5版本和微信小程序版本
- 使用React Hooks管理组件状态
- 原生组件风格，提升性能和兼容性
- 完善的错误处理和调试信息
- 微信一键登录功能
- 用户中心和权限管理

### 页面结构
- 登录页: 微信快捷登录入口
- 实时监控: 设备运行状态监控
- 维保管理: 设备维护保养记录
- 达标分析: 设备数据分析
- 用户中心: 个人信息和系统设置

### 开发环境启动
```bash
# 进入移动端目录
cd screen-mobile

# 安装依赖
npm install

# 开发微信小程序版本
npm run dev:weapp

# 开发H5版本
npm run dev:h5
```

小程序开发需使用微信开发者工具打开`screen-mobile/dist`目录进行预览。

## 前后端联调

- 前端API基础URL配置为: `http://localhost:8080/api`
- 后端已配置CORS，允许前端开发服务器访问API
- 移动端配置API地址: `http://172.16.69.121:8080/api`

## 最近更新

### 2025-05-15
- 添加用户中心页面和退出登录功能
- 修复微信登录流程和页面跳转问题
- 完善错误处理和导航逻辑
- 优化页面布局和用户体验

### 2025-05-14
- 修复微信登录接口和消息转换问题
- 解决小程序页面空白问题
- 添加详细的开发文档

## 部署说明

### 前端构建
```bash
cd Screen
npm run build
```

### 后端构建
```bash
cd Screen-back
./mvnw package
```

### 移动端构建
```bash
# 构建微信小程序版本
cd screen-mobile
npm run build:weapp

# 构建H5版本
cd screen-mobile
npm run build:h5
```

## 常见问题解决

### 微信小程序开发
- 登录流程: 使用微信提供的登录接口获取临时code，后端换取openid和token
- 页面跳转: tabBar页面间使用switchTab跳转，tabBar页面到非tabBar页面使用redirectTo
- 开发工具: 使用开发者工具进行编译和调试，预览真机效果

## 项目截图

(待添加) 