import React, { memo } from 'react';
import { ErrorBoundary, COLORS } from '../index';
import ChartWrapper from '../charts/ChartWrapper';
import { CutTimeChart } from '../charts';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * 裁剪时间监控组件
 * @param {Object} props 组件属性
 * @param {number} props.value 裁剪时间值
 * @param {number} props.defaultValue 默认值
 * @returns {React.Component} 裁剪时间监控组件
 */
const CutTimeMonitorBase = ({ value, defaultValue = 16.5 }) => {
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

  const cutTimeLabel = getMonitor('cutTime');

  return (
    <div className="monitor-card">
      {/* 卡片标题 */}
      <div className="monitor-card-title">
        <div className="title-indicator"></div>
        <span>{cutTimeLabel}</span>
      </div>
      
      {/* 图表内容 */}
      <div className="monitor-card-content">
        <ErrorBoundary fallback={<ChartErrorFallback title={cutTimeLabel} />}>
          <ChartWrapper 
            Chart={CutTimeChart} 
            value={value} 
            defaultValue={defaultValue} 
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

// 显示名称
CutTimeMonitorBase.displayName = 'CutTimeMonitor';

// 使用memo优化性能，避免不必要的重渲染
const CutTimeMonitor = memo(CutTimeMonitorBase);

export default CutTimeMonitor; 