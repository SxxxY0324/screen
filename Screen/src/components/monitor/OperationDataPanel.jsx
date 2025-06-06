import React, { memo } from 'react';
import { StatusTable, COLORS } from '../index';

/**
 * 运行数据表组件
 * @param {Object} props 组件属性
 * @param {Array} props.tableData 表格数据
 * @param {Array} props.tableHeaders 表格头部
 * @param {Function} props.onLoadMore 加载更多函数
 * @param {boolean} props.canLoadMore 是否可以加载更多
 * @param {boolean} props.isLoadingMore 是否正在加载更多
 * @returns {React.Component} 运行数据表组件
 */
const OperationDataPanelBase = ({
  tableData,
  tableHeaders,
  onLoadMore,
  canLoadMore,
  isLoadingMore
}) => {
  // 样式常量
  const STYLES = {
    contentWrapper: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '0 0 5px 5px'
    },
    tableSection: {
      padding: '5px',
      flex: '1 0 auto',
      position: 'relative',
      zIndex: 1
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: COLORS.WHITE,
      marginTop: '7px',
      marginBottom: '0px',
      paddingLeft: '10px',
      display: 'flex',
      alignItems: 'center'
    },
    titleDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: COLORS.ORANGE,
      marginRight: '10px'
    },
    divider: {
      height: '1px',
      width: '100%',
      backgroundColor: 'rgba(255, 166, 77, 0.6)'
    }
  };

  return (
    <div className="monitor-card">
      {/* 卡片标题 */}
      <div className="monitor-card-title">
        <div className="title-indicator"></div>
        <span>运行数据表</span>
      </div>
      
      <div className="monitor-card-content" style={{padding: 0}}>
        <div style={STYLES.contentWrapper}>
          {/* 表格区域 */}
          <div style={STYLES.tableSection}>
            <div style={STYLES.sectionTitle}>
              <div style={STYLES.titleDot}></div>
              运行数据表
            </div>
            
            {/* 添加运行数据表标题下方的橙线 */}
            <div style={{
              ...STYLES.divider,
              marginTop: '7px',
              marginBottom: '10px'
            }}></div>
            
            <StatusTable 
              tableData={tableData} 
              headers={tableHeaders} 
              scrollSpeed={0.25} // 使用与维保管理页面相同的滚动速度
              visibleRows={6}
              onLoadMore={onLoadMore}
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 显示名称
OperationDataPanelBase.displayName = 'OperationDataPanel';

// 使用memo优化性能，避免不必要的重渲染
const OperationDataPanel = memo(OperationDataPanelBase);

export default OperationDataPanel; 