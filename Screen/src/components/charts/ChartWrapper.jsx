import React, { memo } from 'react';
import { ensureValidNumber } from '../../utils/chartUtils';

/**
 * 图表包装组件 - 提供通用的错误处理和数据验证
 * @param {Object} props - 组件属性
 * @param {React.Component} props.Chart - 需要包装的图表组件
 * @param {any} props.value - 图表数据值
 * @param {number} props.defaultValue - 默认值
 * @param {Object} props.chartProps - 传递给图表的其他属性
 * @returns {React.Component} 包装后的图表组件
 */
const ChartWrapper = ({ 
  Chart, 
  value, 
  defaultValue = 0, 
  chartProps = {} 
}) => {
  // 确保value是有效的数字
  const safeValue = ensureValidNumber(value, defaultValue);
  
  // 错误边界内部处理
  try {
    return <Chart value={safeValue} {...chartProps} />;
  } catch (error) {
    console.error('Chart rendering error:', error);
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.4)'
      }}>
        图表加载失败
      </div>
    );
  }
};

// 使用memo优化性能，避免不必要的重渲染
export default memo(ChartWrapper); 