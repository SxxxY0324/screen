/**
 * 图表组件共享常量
 */

// 时间常量（毫秒）
export const ANIMATION_DURATION = 800;
export const RENDER_DELAY_WEAPP = 600;
export const RENDER_DELAY_H5 = 500;

// 基础容器样式
export const containerStyle = {
  padding: '16px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  marginBottom: '16px'
};

// 标题区域样式
export const headerSectionStyle = {
  marginBottom: '16px'
};

// 标题文本样式
export const headerTitleStyle = {
  fontSize: '18px',
  fontWeight: 500,
  color: '#333'
};

// 内容区域样式
export const contentStyle = {
  position: 'relative' as 'relative',
  minHeight: '180px'
}; 