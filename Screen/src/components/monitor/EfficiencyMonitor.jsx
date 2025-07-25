import React, { memo } from 'react';
import { ErrorBoundary, COLORS } from '../index';
import ChartWrapper from '../charts/ChartWrapper';
import { EfficiencyChart } from '../charts';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * 移动率MU监控组件
 * @param {Object} props 组件属性
 * @param {number} props.value 移动率MU值
 * @param {number} props.defaultValue 默认值
 * @returns {React.Component} 移动率MU监控组件
 */
const EfficiencyMonitorBase = ({ value, defaultValue = 69.03 }) => {
  const { getMonitor, getCommon } = useTranslation();

  // 图表错误回退组件
  const ChartErrorFallback = ({ title }) => (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      color: COLORS.WHITE,
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}>
      <div>{getCommon('error')}</div>
      <div>{title}</div>
    </div>
  );

  const efficiencyLabel = getMonitor('efficiency');

  return (
    <div className="monitor-card">
      {/* 卡片标题 */}
      <div className="monitor-card-title">
        <div className="title-indicator"></div>
        <span>{efficiencyLabel}</span>
      </div>
      
      {/* 图表内容 */}
      <div className="monitor-card-content">
        <ErrorBoundary fallback={<ChartErrorFallback title={efficiencyLabel} />}>
          <ChartWrapper 
            Chart={EfficiencyChart} 
            value={value} 
            defaultValue={defaultValue} 
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

// 显示名称
EfficiencyMonitorBase.displayName = 'EfficiencyMonitor';

// 使用memo优化性能，避免不必要的重渲染
const EfficiencyMonitor = memo(EfficiencyMonitorBase);

export default EfficiencyMonitor; 