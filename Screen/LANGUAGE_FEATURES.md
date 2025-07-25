# 多语言功能说明

## 概述

本项目已集成完整的多语言支持系统，目前支持中文和英文两种语言。用户可以通过界面上的语言选择器实时切换语言，所有界面文本都会相应更新。

## 功能特点

- 🌐 **实时语言切换** - 通过右上角的语言选择器一键切换
- 💾 **持久化存储** - 语言设置自动保存到本地存储
- 🔄 **自动刷新** - 切换语言后所有组件文本自动更新
- 🏭 **工业术语优化** - 针对MES制造执行系统优化的专业术语翻译
- 📱 **响应式设计** - 语言切换器与现有界面元素完美融合

## 支持的语言

| 语言 | 代码 | 显示名称 | 完成度 |
|------|------|----------|--------|
| 中文 | zh   | 中文     | 100%   |
| 英文 | en   | English  | 100%   |

## 使用方法

### 用户操作

1. 在右上角导航栏中找到语言选择器（位于时间范围选择器之后）
2. 点击下拉菜单选择目标语言
3. 界面文本将立即更新为所选语言

### 开发者集成

#### 1. 使用翻译Hook

```javascript
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { t, getNav, getMonitor } = useTranslation();

  return (
    <div>
      <h1>{getNav('monitoring')}</h1>
      <p>{t('common.loading')}</p>
      <span>{getMonitor('efficiency')}</span>
    </div>
  );
};
```

#### 2. 直接使用翻译函数

```javascript
import { t } from '../locales';

// 基础翻译
const text = t('nav.monitoring');

// 带变量替换的翻译
const message = t('nav.selectedDevices', { count: 5 });
```

#### 3. 添加新的翻译文本

在 `src/locales/zh.js` 和 `src/locales/en.js` 中添加相应的键值对：

```javascript
// zh.js
export const zh = {
  newSection: {
    title: '新标题',
    description: '新描述'
  }
};

// en.js
export const en = {
  newSection: {
    title: 'New Title',
    description: 'New Description'
  }
};
```

## 翻译覆盖范围

### 已翻译的区域

- ✅ **顶部导航** - 页面标签、AI按钮、选择器标签
- ✅ **时间范围选项** - 所有时间选择选项
- ✅ **监控指标** - 效率、能耗、裁剪速度等指标名称
- ✅ **设备状态** - 裁剪、待机、停机状态
- ✅ **表格列头** - 序号、车间、设备编号等
- ✅ **通用按钮** - 加载、重试、确认等操作按钮
- ✅ **消息提示** - 成功、失败、错误等状态消息

### 专业术语翻译

| 中文术语 | 英文翻译 | 说明 |
|----------|----------|------|
| 实时监控 | Real-time Monitoring | 实时监控页面 |
| 维保管理 | Maintenance Management | 设备维护管理 |
| 业绩分析 | Performance Analysis | 数据分析页面 |
| 移动率 | Efficiency | 设备运行效率 |
| 裁剪套数 | Cut Sets | 裁剪生产套数 |
| 非计划停机 | Unplanned Downtime | 设备意外停机 |
| 计划停机 | Planned Downtime | 设备计划维护停机 |

## 技术架构

### 文件结构

```
src/
├── locales/           # 语言资源文件
│   ├── index.js      # 翻译管理器
│   ├── zh.js         # 中文资源
│   └── en.js         # 英文资源
├── utils/
│   └── i18n.js       # 国际化工具函数
├── hooks/
│   └── useTranslation.js  # 翻译Hook
├── components/
│   └── LanguageSelector.jsx  # 语言选择器组件
└── store/slices/
    └── appSlice.js   # 全局状态管理（包含语言状态）
```

### 状态管理

语言状态通过Redux管理：

- **状态存储**: `state.app.language`
- **Action**: `setLanguage(languageCode)`
- **选择器**: `selectLanguage(state)`
- **本地持久化**: 自动保存到localStorage

### 性能优化

- 使用React.memo避免不必要的组件重渲染
- 翻译函数结果缓存
- 按需加载语言资源
- 组件级别的翻译Hook减少重复计算

## 扩展新语言

如需添加新语言支持：

1. 在 `src/utils/i18n.js` 中添加语言配置
2. 创建新的语言资源文件 `src/locales/[lang].js`
3. 在 `src/locales/index.js` 中导入新语言
4. 翻译所有必要的文本键值对

## 最佳实践

1. **一致性**: 使用统一的翻译函数和命名规范
2. **上下文**: 为翻译提供足够的上下文信息
3. **变量替换**: 使用 `{变量名}` 格式进行动态内容替换
4. **错误处理**: 为缺失翻译提供合理的降级策略
5. **测试**: 在不同语言下测试界面布局和功能

## 注意事项

- 语言切换立即生效，无需刷新页面
- 语言设置在页面刷新后保持
- 部分动态内容可能需要重新加载数据以更新语言
- 建议在添加新文本时同时更新所有语言文件 