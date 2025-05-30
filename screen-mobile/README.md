# Screen Mobile 项目

这是Screen项目的移动端部分，支持微信小程序和H5两种版本。基于Taro 4和React 18构建。

## 技术架构

### 核心框架
- **Taro 4.0.13**: 京东凹凸实验室开源的多端统一开发框架
- **React 18.0.0**: 用户界面开发库
- **Sass**: CSS预处理器，提供更强大的样式组织能力

### 运行环境
- **微信小程序**: 使用微信开发者工具运行和调试
- **H5**: 支持移动端浏览器访问

## 项目结构

```
screen-mobile/
├── config/                 # 项目配置文件
├── dist/                   # 编译输出目录
├── node_modules/           # 依赖包
├── src/                    # 源代码
│   ├── api/                # API接口定义
│   ├── assets/             # 静态资源文件
│   │   └── icons/          # 导航栏图标
│   ├── components/         # 公共组件
│   ├── pages/              # 页面文件
│   │   ├── index/          # 登录页
│   │   ├── monitor/        # 监控页
│   │   ├── management/     # 管理页
│   │   ├── analysis/       # 分析页
│   │   └── user/           # 用户中心页
│   ├── app.js              # 应用入口
│   ├── app.scss            # 全局样式
│   ├── app.config.js       # 应用配置
│   └── custom-components.scss  # 自定义组件样式
├── .eslintrc               # ESLint配置
├── babel.config.js         # Babel配置
├── package.json            # 项目依赖和脚本
└── project.config.json     # 小程序项目配置
```

## 功能特性

### 用户认证
- **微信一键登录**: 使用微信官方登录API，无需用户名密码
- **登录状态管理**: 使用本地存储保存登录凭证，自动维持登录状态
- **安全退出**: 提供完整的退出登录流程，清除本地凭证

### 页面功能
- **实时监控**: 设备运行状态实时监控
- **维保管理**: 设备维护和保养记录管理
- **达标分析**: 设备运行数据分析和达标情况
- **用户中心**: 个人信息管理和系统设置

### UI组件
- 使用原生风格UI组件，提升性能和兼容性
- 响应式设计适配不同尺寸屏幕
- 统一的样式规范和视觉风格

## 开发指南

### 环境准备
- Node.js 14.0+
- npm 6.0+
- 微信开发者工具最新版

### 安装依赖
```bash
npm install
```

### 运行开发环境
```bash
# 微信小程序
npm run dev:weapp

# H5版本
npm run dev:h5
```

### 构建生产环境
```bash
# 微信小程序
npm run build:weapp

# H5版本
npm run build:h5
```

## 开发规范

### 目录命名
- 小写字母开头
- 多个单词使用连字符(-)连接
- 有复数结构时使用复数形式

### 组件规范
- 组件文件使用PascalCase命名（如HeaderNav.jsx）
- 组件内使用函数式组件和React Hooks
- 组件必须具有完善的注释和类型标注

### 样式规范
- 页面样式写在对应页面目录下的`index.scss`
- 公共样式写在`custom-components.scss`
- 全局样式写在`app.scss`

## 常见问题排查

### 页面空白
- 检查控制台是否有错误
- 检查API地址是否正确
- 确保路由配置正确
- 检查样式导入是否正确

### 真机调试问题
- 确保微信开发者ID与小程序appId匹配
- 检查是否已配置合适的请求域名
- 检查网络请求是否符合HTTPS要求

### 退出登录后未跳转
- 使用`redirectTo`或`reLaunch`代替`navigateTo`
- TabBar页面跳转到非TabBar页面需特别注意

### 样式问题
- 确保导入的样式文件路径正确
- 检查是否有样式冲突
- 检查是否适配不同尺寸屏幕

## 接口说明

项目使用以下API接口:

### 微信登录
```javascript
// 登录流程
Taro.login() -> 后端 /api/auth/login -> 获取openid和token

// 获取手机号 (需企业小程序)
Button(openType='getPhoneNumber') -> 后端 /api/auth/get-phone
```

## 最近更新记录

### 2025-05-15
- 添加用户中心页面
- 实现退出登录功能
- 修复导航跳转问题
- 优化登录流程

### 2025-05-14
- 修复微信登录接口
- 解决页面空白问题
- 完善错误处理和日志记录

## 部署流程

1. 构建微信小程序版本
```bash
npm run build:weapp
```

2. 使用微信开发者工具打开`dist`目录

3. 上传小程序代码并提交审核

## 工程化说明

本项目遵循现代前端工程化实践:
- 使用ESLint保证代码质量
- 适当使用Git分支管理功能开发
- 遵循组件化、模块化的开发理念 