import React, { memo } from 'react';
import { ensureValidNumber } from '../../utils/chartUtils';
import { useAppSelector } from '../../store/hooks';
import { selectIsDataInitialized } from '../../store/slices/monitorSlice';

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
  // 从Redux中获取数据初始化状态
  const isDataInitialized = useAppSelector(selectIsDataInitialized);
  
  // 记录组件名称，便于调试
  const chartName = Chart.displayName || Chart.name || 'UnknownChart';

  // 值处理逻辑
  // 1. 特殊处理移动率图表
  // 2. 其他图表使用数字验证
  let processedValue;
  
  if (chartName === 'EfficiencyChart' && typeof value === 'number' && !isNaN(value)) {
    // 移动率图表且值为有效数字，直接传递值
    processedValue = value;
  } else {
    // 其他图表使用通用验证逻辑
    processedValue = ensureValidNumber(value, defaultValue, 2, isDataInitialized);
  }
  
  // 如果数据未初始化且值为null，显示加载状态
  if (processedValue === null) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.2)'
      }}>
        数据加载中...
      </div>
    );
  }
  
  // 错误边界内部处理
  try {
    // 向图表传递值和初始化状态
    return <Chart 
      value={processedValue} 
      isInitialized={isDataInitialized}
      {...chartProps} 
    />;
  } catch (error) {
    console.error(`${chartName} 渲染错误:`, error);
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

// 添加显示名称，便于调试
ChartWrapper.displayName = 'ChartWrapper';

// 使用memo优化性能，避免不必要的重渲染
export default memo(ChartWrapper); 