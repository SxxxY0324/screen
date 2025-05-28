import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const isPaused = useRef(false);
  const lastTimeRef = useRef(0);
  const loadMoreTriggered = useRef(false);
  const totalScrolledDistance = useRef(0);
  
  const startScrolling = useCallback(() => {
    const animate = (timestamp) => {
      if (!animationRef.current) return;

      if (isPaused.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      
      // 约60fps帧率控制
      if (deltaTime >= 16) {
        lastTimeRef.current = timestamp;
        
        const pixelsToScroll = (scrollSpeed * deltaTime) / 16.67;
        
        setScrollPosition(prevPos => {
          if (!tableData || tableData.length === 0) {
            return 0;
          }
          
          let newPosition = prevPos + pixelsToScroll;
          totalScrolledDistance.current += pixelsToScroll;
          
          const maxScrollPosition = tableData.length * cellHeight;
          const loadMoreThreshold = maxScrollPosition * 0.5;
          
          // 触发加载更多数据
          if (canLoadMore && !isLoadingMore && onLoadMore && !loadMoreTriggered.current && 
              totalScrolledDistance.current > loadMoreThreshold) {
            loadMoreTriggered.current = true;
            
            setTimeout(() => {
              onLoadMore();
            }, 0);
            
            setTimeout(() => {
              loadMoreTriggered.current = false;
            }, 5000);
          }
          
          // 处理滚动到数据末尾的情况
          if (newPosition >= maxScrollPosition) {
            if (canLoadMore) {
              newPosition = maxScrollPosition - 10;
            } else {
              newPosition = 0;
              totalScrolledDistance.current = 0;
            }
          }
          
          return newPosition;
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [tableData, cellHeight, scrollSpeed, onLoadMore, canLoadMore, isLoadingMore]);
  
  const stopScrolling = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      lastTimeRef.current = 0;
    }
  }, []);
  
  const handleMouseEnter = useCallback(() => {
    isPaused.current = true;
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    isPaused.current = false;
  }, []);
  
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
    if (tableData && tableData.length > 0) {
      startScrolling();
    }
    return () => {
      stopScrolling();
    };
  }, [tableData, scrollSpeed, startScrolling, stopScrolling]);
  
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
        数据加载中...
      </div>
    );
  }
  
  // 计算可见行
  const getVisibleRowsData = () => {
    const startIndex = Math.floor(scrollPosition / cellHeight) % tableData.length;
    const rowsToRender = [];
    
    for (let i = 0; i < visibleRows + 2; i++) {
      const dataIndex = (startIndex + i) % tableData.length;
      rowsToRender.push(tableData[dataIndex]);
    }
    
    return rowsToRender;
  };
  
  const currentVisibleRows = getVisibleRowsData();
  
  const contentStyle = {
    transform: `translateY(-${scrollPosition % cellHeight}px)`,
    willChange: 'transform'
  };
  
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
      background: 'transparent'
    },
    headerTh: { 
      height: cellHeight, 
      textAlign: 'center', 
      color: '#ffffff', 
      fontWeight: 'bold', 
      fontSize: 16, 
      padding: '0 10px'
    },
    divider: { 
      height: 2, 
      backgroundColor: '#ff9800', 
      width: '100%', 
      marginBottom: 0
    },
    bodyContainer: {
      height: `calc(100% - ${cellHeight + 2}px)`, 
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
        <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
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
        <div style={contentStyle}>
          <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {currentVisibleRows.map((rowData, index) => {
                return (
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
                );
              })}
            </tbody>
          </table>
        </div>
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