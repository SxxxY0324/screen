import React, { memo } from 'react';
import { StatusIcon, StatusTable, COLORS } from '../index';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * 裁床运行状态监控组件
 * @param {Object} props 组件属性
 * @param {Array} props.statusLegendItems 状态图例项
 * @param {Array} props.deviceData 设备数据
 * @param {boolean} props.isLoading 是否加载中
 * @param {Function} props.getStatusColor 获取状态颜色函数
 * @param {Array} props.tableData 表格数据
 * @param {Array} props.tableHeaders 表格头部
 * @param {Function} props.onLoadMore 加载更多函数
 * @param {boolean} props.canLoadMore 是否可以加载更多
 * @param {boolean} props.isLoadingMore 是否正在加载更多
 * @returns {React.Component} 裁床运行状态监控组件
 */
const StatusMonitorBase = ({ 
  statusLegendItems,
  deviceData,
  isLoading, 
  getStatusColor,
  tableData,
  tableHeaders,
  onLoadMore,
  canLoadMore,
  isLoadingMore
}) => {
  const { t, getCommon } = useTranslation();

  // 样式常量
  const STYLES = {
    contentWrapper: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'block', // 改为块级布局，不使用flex
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '0 0 5px 5px'
    },
    header: {
      position: 'relative',
      padding: '5px 20px',
      borderBottom: '1px solid rgba(255, 166, 77, 0.4)'
    },
    statusLegendContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    },
    statusLegendItem: {
      display: 'flex',
      alignItems: 'center',
      margin: '0 20px'
    },
    statusLegendLabel: {
      fontSize: '20px', 
      fontWeight: 'bold', 
      color: COLORS.WHITE, 
      marginRight: '10px'
    },
    statusLegendIcon: {
      width: '28px', 
      height: '28px',
      filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))'
    },
    devicesContainer: {
      padding: '5px 5px 5px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridAutoRows: 'max-content',
      gap: '6px 12px',
      height: '57%', // 增加高度，把标题区域推下去
      overflow: 'auto',
      boxSizing: 'border-box',
      marginBottom: '0', // 移除底部边距
    },
    deviceItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '2px 10px',
      padding: '6px 8px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      height: '40px',
      overflow: 'hidden'
    },
    deviceId: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: COLORS.WHITE,
      fontFamily: "'Arial', sans-serif",
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    deviceIcon: {
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.4))'
    },
    deviceStatusWrapper: {
      display: 'flex',
      alignItems: 'center',
      padding: '3px',
      borderRadius: '3px',
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    tableSection: {
      padding: 0,
      position: 'relative',
      zIndex: 1,
      marginTop: '0', // 保持没有顶部边距
      height: '38%', // 调整高度
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: COLORS.WHITE,
      margin: 0,
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
      borderBottom: '1px solid #333',
      height: '60px',
      boxSizing: 'border-box',
      letterSpacing: '1px'
    },
    titleDot: {
      width: '6px',
      height: '28px',
      borderRadius: '2px',
      backgroundColor: COLORS.ORANGE,
      marginRight: '15px'
    },
    divider: {
      height: '1px',
      width: '100%',
      backgroundColor: 'rgba(255, 166, 77, 0.6)'
    }
  };

  // 将设备分成三列显示
  const chunkDeviceData = (data, columns = 3) => {
    if (!data || data.length === 0) return [];
    
    const result = [];
    const itemsPerColumn = Math.ceil(data.length / columns);
    
    for (let i = 0; i < columns; i++) {
      const startIndex = i * itemsPerColumn;
      result.push(data.slice(startIndex, startIndex + itemsPerColumn));
    }
    
    return result;
  };
  
  // 处理设备ID和状态的显示格式
  const formatDeviceId = (deviceId) => {
    // 确保设备ID是字符串
    const idString = String(deviceId);
    // 如果是格式化的ID（如CN01001），直接返回
    if (/^[A-Z]{2}\d{5}$/.test(idString)) {
      return idString;
    }
    // 否则尝试格式化为CN01001格式
    if (idString.length <= 5) {
      const paddedNumber = idString.padStart(5, '0');
      return `CN${paddedNumber}`;
    }
    return idString;
  };

  // 如果有数据，则按列组织
  const columnizedData = deviceData && deviceData.length > 0 ? 
    chunkDeviceData(deviceData) : [];

  return (
    <div className="monitor-card">
      {/* 卡片标题 */}
      <div className="monitor-card-title">
        <div className="title-indicator"></div>
        <span>{t('monitor.statusPanel.title')}</span>
      </div>
      
      <div className="monitor-card-content" style={{padding: 0}}>
        <div style={STYLES.contentWrapper}>
          {/* 状态图例区域 */}
          <div style={STYLES.header}>
            <div style={STYLES.statusLegendContainer}>
              {statusLegendItems.map((item, index) => (
                <div key={index} style={STYLES.statusLegendItem}>
                  <div style={STYLES.statusLegendLabel}>
                    {item.label}
                  </div>
                  <div style={STYLES.statusLegendIcon}>
                    <StatusIcon status={item.status} color={getStatusColor(item.status)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 设备状态指示器区域 */}
          <div style={STYLES.devicesContainer}>
            {isLoading || !deviceData || deviceData.length === 0 ? (
              <div style={{
                width: '100%',
                height: '100%', // 填充整个容器
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gridColumn: '1 / span 3',
                color: COLORS.WHITE,
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {isLoading ? getCommon('loading') : 
                  deviceData && deviceData.length === 0 ? t('monitor.statusPanel.noDeviceData') : getCommon('loading')}
              </div>
            ) : (
              deviceData.map((device, index) => (
                <div key={index} 
                  style={{
                    ...STYLES.deviceItem,
                    borderLeft: `4px solid ${getStatusColor(device.status)}`,
                  }}
                >
                  <div style={STYLES.deviceId}>
                    {formatDeviceId(device.id)}
                  </div>
                  
                  <div style={STYLES.deviceStatusWrapper}>
                    <div style={STYLES.deviceIcon}>
                      <StatusIcon 
                        status={device.status} 
                        color={getStatusColor(device.status)} 
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* 运行数据表区域 */}
          <div style={STYLES.tableSection}>
            <div style={STYLES.sectionTitle}>
              <div style={STYLES.titleDot}></div>
              {t('monitor.statusPanel.operationTitle')}
            </div>
            
            <div className="monitor-card-content" style={{padding: '5px', height: 'calc(100% - 60px)'}}>
              <StatusTable 
                tableData={tableData} 
                headers={tableHeaders} 
                scrollSpeed={0.25} // 使用与维保管理页面相同的滚动速度
                visibleRows={4} // 减少可见行数
                onLoadMore={onLoadMore}
                canLoadMore={canLoadMore}
                isLoadingMore={isLoadingMore}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 显示名称
StatusMonitorBase.displayName = 'StatusMonitor';

// 使用memo优化性能，避免不必要的重渲染
const StatusMonitor = memo(StatusMonitorBase);

export default StatusMonitor; 