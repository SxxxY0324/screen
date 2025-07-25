import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const StatusTable = ({ 
  tableData, 
  headers, 
  visibleRows = 4, 
  cellHeight = 38, 
  scrollSpeed = 0.5,
  onLoadMore = null,
  canLoadMore = false,
  isLoadingMore = false
}) => {
  const { getCommon } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const isPaused = useRef(false);
  const lastTimeRef = useRef(0);
  const loadMoreTriggered = useRef(false);
  
  // 计算滚动阈值 - 当数据超过这个数量才会滚动
  const scrollThreshold = 10;
  const shouldScroll = tableData && tableData.length > scrollThreshold;
  
  // 启动滚动动画 - 严格参照维保管理页面的实现
  const startScrolling = useCallback(() => {
    // 如果数据不足阈值，则不执行滚动
    if (!shouldScroll || !tableData || tableData.length === 0) {
      return;
    }
    
    let lastTime = 0;
    
    const animate = (timestamp) => {
      if (!animationRef.current) return;
      
      if (isPaused.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // 基于帧率调整滚动速度
      const pixelsToScroll = (scrollSpeed * deltaTime) / 16.67; // 标准化到60fps
      
      setScrollPosition(prevPos => {
        // 计算新位置
        let newPosition = prevPos + pixelsToScroll;
        
        // 触发加载更多数据
        if (canLoadMore && !isLoadingMore && onLoadMore && !loadMoreTriggered.current && 
            newPosition > (tableData.length * cellHeight * 0.6)) {
          loadMoreTriggered.current = true;
          
          setTimeout(() => {
            onLoadMore();
          }, 0);
          
          setTimeout(() => {
            loadMoreTriggered.current = false;
          }, 3000);
        }
        
        // 当滚动超过原始数据长度时，直接重置回开始位置
        // 这是维保管理页面的精确实现方式
        if (newPosition >= tableData.length * cellHeight) {
          newPosition = 0;
        }
        
        return newPosition;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [tableData, cellHeight, scrollSpeed, canLoadMore, isLoadingMore, onLoadMore, shouldScroll]);
  
  const stopScrolling = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      lastTimeRef.current = 0;
    }
  }, []);
  
  const handleMouseEnter = useCallback(() => {
    // 只有在应该滚动的情况下才暂停
    if (shouldScroll) {
      isPaused.current = true;
    }
  }, [shouldScroll]);
  
  const handleMouseLeave = useCallback(() => {
    // 只有在应该滚动的情况下才恢复
    if (shouldScroll) {
      isPaused.current = false;
    }
  }, [shouldScroll]);
  
  // 数据变化时重置加载触发器
  useEffect(() => {
    if (loadMoreTriggered.current) {
      setTimeout(() => {
        loadMoreTriggered.current = false;
      }, 1000);
    }
  }, [tableData]);
  
  // 组件挂载和卸载时控制动画
  useEffect(() => {
    // 只有在数据超过阈值时才启动滚动
    if (shouldScroll && tableData && tableData.length > 0) {
      startScrolling();
    } else {
      // 数据不足时确保没有滚动
      setScrollPosition(0);
    }
    
    return () => {
      stopScrolling();
    };
  }, [tableData, scrollSpeed, startScrolling, stopScrolling, shouldScroll]);
  
  // 数据不足时主动触发加载更多
  useEffect(() => {
    if (tableData && tableData.length < 10 && canLoadMore && !isLoadingMore && onLoadMore && !loadMoreTriggered.current) {
      loadMoreTriggered.current = true;
      
      setTimeout(() => {
        onLoadMore();
      }, 0);
      
      setTimeout(() => {
        loadMoreTriggered.current = false;
      }, 5000);
    }
  }, [tableData, canLoadMore, isLoadingMore, onLoadMore]);
  
  // 空数据状态处理
  if (!tableData || tableData.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        {getCommon('loading')}
      </div>
    );
  }
  
  // 样式定义
  const styles = {
    container: {
      height: '100%', 
      width: '100%', 
      overflow: 'hidden', 
      position: 'relative'
    },
    header: {
      position: 'sticky', 
      top: 0, 
      zIndex: 10, 
      background: 'transparent',
      lineHeight: 1,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0
    },
    headerTh: { 
      height: 'auto',
      textAlign: 'center', 
      color: '#ffffff', 
      fontWeight: 'bold', 
      fontSize: 16, 
      padding: '0px 10px',
      lineHeight: '18px'
    },
    divider: { 
      height: 2, 
      backgroundColor: '#ff9800', 
      width: '100%', 
      marginTop: '2px',
      marginBottom: '2px'
    },
    bodyContainer: {
      height: `calc(100% - ${22 + 2 + 2}px)`,
      overflowY: 'hidden',
      position: 'relative'
    },
    tableRow: { 
      height: cellHeight, 
      opacity: 1,
      borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
    },
    tableCell: { 
      textAlign: 'center', 
      color: '#ffffff', 
      fontSize: 16,
      padding: '0 10px'
    },
    loadingMoreIndicator: {
      textAlign: 'center',
      color: '#ff9800',
      padding: '5px 0',
      fontSize: 14
    },
    tableCommon: {
      tableLayout: 'fixed', 
      width: '100%', 
      borderCollapse: 'collapse'
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="status-table-container" 
      style={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 固定表头部分 */}
      <div className="table-header" style={styles.header}>
        <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse', margin: 0, padding: 0 }}>
          <thead style={{ margin: 0, padding: 0 }}>
            <tr style={{ margin: 0, padding: 0 }}>
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  style={{
                    ...styles.headerTh,
                    width: `${100 / headers.length}%` 
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div style={styles.divider}></div>
      </div>
      
      {/* 滚动内容部分 */}
      <div 
        className="table-body-container" 
        style={styles.bodyContainer}
      >
        {!shouldScroll ? (
          // 不滚动时显示静态表格
          <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {tableData.map((rowData, index) => (
                <tr 
                  key={index} 
                  style={styles.tableRow}
                >
                  {rowData.map((cellData, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      style={{
                        ...styles.tableCell,
                        width: `${100 / headers.length}%` 
                      }}
                    >
                      {cellData}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // 滚动时采用双表格无缝循环技术 - 严格参照维保管理页面的实现
          <div style={{ 
            transform: `translateY(-${scrollPosition % (tableData.length * cellHeight)}px)`, 
            willChange: 'transform'
            // 移除transition属性，维保管理页面没有使用它
          }}>
            {/* 第一遍数据 */}
            <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {tableData.map((rowData, index) => (
                  <tr 
                    key={`first-${index}`} 
                    style={styles.tableRow}
                  >
                    {rowData.map((cellData, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        style={{
                          ...styles.tableCell,
                          width: `${100 / headers.length}%` 
                        }}
                      >
                        {cellData}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* 第二遍数据用于无缝滚动 */}
            <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {tableData.map((rowData, index) => (
                  <tr 
                    key={`second-${index}`} 
                    style={styles.tableRow}
                  >
                    {rowData.map((cellData, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        style={{
                          ...styles.tableCell,
                          width: `${100 / headers.length}%` 
                        }}
                      >
                        {cellData}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* 加载更多指示器 */}
      {isLoadingMore && (
        <div style={styles.loadingMoreIndicator}>
          正在加载更多数据...
        </div>
      )}
    </div>
  );
};

export default StatusTable; 