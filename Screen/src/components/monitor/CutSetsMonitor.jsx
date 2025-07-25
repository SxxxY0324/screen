import React, { memo } from 'react';
import { COLORS } from '../index';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * 裁剪套数监控组件
 * @param {Object} props 组件属性
 * @param {number} props.value 裁剪套数值
 * @param {string} props.iconSrc 套数图标地址
 * @returns {React.Component} 裁剪套数监控组件
 */
const CutSetsMonitorBase = ({ value, iconSrc }) => {
  const { getMonitor } = useTranslation();

  // 样式常量
  const STYLES = {
    cutSetsOverlay: {
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'flex-start', 
      padding: '0 5% 0 15%'
    },
    cutSetsIcon: {
      width: '80px', 
      height: '80px', 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center', 
      marginRight: '20px'
    },
    cutSetsIconImg: {
      maxWidth: '100%', 
      maxHeight: '100%', 
      objectFit: 'contain'
    },
    cutSetsValue: {
      fontSize: '70px', 
      fontWeight: 'bold', 
      color: COLORS.DARK_ORANGE, 
      fontFamily: 'Arial, sans-serif'
    }
  };

  const cutSetsLabel = getMonitor('cutSets');

  return (
    <div className="monitor-card">
      {/* 卡片标题 */}
      <div className="monitor-card-title">
        <div className="title-indicator"></div>
        <span>{cutSetsLabel}</span>
      </div>
      
      {/* 图表内容 */}
      <div className="monitor-card-content">
        <div style={STYLES.cutSetsOverlay}>
          <div style={STYLES.cutSetsIcon}>
            <img
              src={iconSrc}
              alt="裁剪套数图标"
              style={STYLES.cutSetsIconImg}
            />
          </div>
          
          <div style={STYLES.cutSetsValue}>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

// 显示名称
CutSetsMonitorBase.displayName = 'CutSetsMonitor';

// 使用memo优化性能，避免不必要的重渲染
const CutSetsMonitor = memo(CutSetsMonitorBase);

export default CutSetsMonitor; 