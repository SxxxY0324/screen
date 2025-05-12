# Screen 项目

这是一个前后端分离的项目，前端使用React+Vite构建，后端使用Spring Boot构建。

## 项目结构

- `Screen/`: 前端React项目
- `Screen-back/`: 后端Spring Boot项目

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

### 开发环境启动
```bash
cd Screen-back
./mvnw spring-boot:run
```

后端API服务将在 http://localhost:8080 启动。

## 前后端联调

- 前端API基础URL配置为: `http://localhost:8080/api`
- 后端已配置CORS，允许前端开发服务器访问API

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

## 项目截图

(待添加) 