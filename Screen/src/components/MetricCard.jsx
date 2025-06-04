import React from 'react';

/**
 * 指标卡片组件
 * @param {Object} props - 组件属性
 * @param {string} props.title - 卡片标题
 * @param {string|number} props.value - 卡片显示的值
 * @param {string} props.unit - 单位（可选）
 * @param {string} props.bgImage - 背景图片URL（可选）
 * @param {string} props.className - 额外的CSS类（可选）
 * @returns {JSX.Element}
 */
const MetricCard = ({ title, value, unit = '', bgImage, className = '' }) => {
  // 内容容器样式 - 改为绝对定位悬浮在图片上，不影响背景图尺寸
  const contentStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '25%',
    textAlign: 'left',
    zIndex: 2,
  };

  // 文字内容容器 - 确保文本不换行
  const textContainerStyle = {
    whiteSpace: 'nowrap',
  };

  // 文本样式 - 加大字体并优化
  const textStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '0px 0px 8px rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center'
  };

  // 数字高亮样式 - 添加泛光效果
  const numberStyle = {
    color: '#FFE082',
    fontSize: '30px',
    fontWeight: 'bold',
    textShadow: `
      0 0 5px #FF9800,
      0 0 10px #FF9800,
      0 0 15px #FF6D00,
      0 0 20px #FF6D00
    `,
    padding: '0 2px',
  };

  // 单位样式 - 添加左边距，与数字保持距离
  const unitStyle = {
    marginLeft: '8px'
  };

  return (
    <div className={`metric-card ${className}`} style={{ position: 'relative' }}>
      {/* 保持背景图完整显示 */}
      {bgImage && <img src={bgImage} className="card-image" alt={title} />}
      
      {/* 文字内容叠加层 */}
      <div style={contentStyle}>
        <div style={textContainerStyle}>
          <div style={textStyle}>
            {title}：<span style={numberStyle}>{value}</span><span style={unitStyle}>{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard; 