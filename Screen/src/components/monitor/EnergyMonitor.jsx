import React, { memo } from 'react';
import { ErrorBoundary, COLORS } from '../index';
import ChartWrapper from '../charts/ChartWrapper';
import { EnergyChart } from '../charts';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * 能耗监控组件
 * @param {Object} props 组件属性
 * @param {number} props.value 能耗值
 * @param {number} props.defaultValue 默认值
 * @returns {React.Component} 能耗监控组件
 */
const EnergyMonitorBase = ({ value, defaultValue = 1276.5 }) => {
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

  const energyLabel = getMonitor('energy');

  return (
    <div className="monitor-card">
      {/* 卡片标题 */}
      <div className="monitor-card-title">
        <div className="title-indicator"></div>
        <span>{energyLabel}</span>
      </div>
      
      {/* 图表内容 */}
      <div className="monitor-card-content">
        <ErrorBoundary fallback={<ChartErrorFallback title={energyLabel} />}>
          <ChartWrapper 
            Chart={EnergyChart} 
            value={value} 
            defaultValue={defaultValue} 
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

// 显示名称
EnergyMonitorBase.displayName = 'EnergyMonitor';

// 使用memo优化性能，避免不必要的重渲染
const EnergyMonitor = memo(EnergyMonitorBase);

export default EnergyMonitor; 