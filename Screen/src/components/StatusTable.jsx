import React, { useState, useEffect, useRef } from 'react';

const StatusTable = ({ tableData, headers, visibleRows = 4, cellHeight = 38, scrollSpeed = 0.5 }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const isPaused = useRef(false);
  const lastTimeRef = useRef(0);
  
  // 防止空数据引起问题
  if (!tableData || tableData.length === 0) {
    return <div>无数据</div>;
  }
  
  // 创建完整的数据数组（原始数据 + 复制数据用于无缝衔接）
  const fullData = [...tableData, ...tableData];
  
  // 启动滚动动画 - 优化帧率控制
  const startScrolling = () => {
    const animate = (timestamp) => {
      if (isPaused.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // 优化动画帧率控制
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      
      // 限制最大帧率，避免过度渲染，提高性能
      if (deltaTime >= 16) { // 约60fps
        lastTimeRef.current = timestamp;
        
        // 基于帧率调整滚动速度
        const pixelsToScroll = (scrollSpeed * deltaTime) / 16.67; // 标准化到60fps
        
        setScrollPosition(prevPos => {
          // 当滚动超过原始数据长度时，重置回开始位置
          let newPosition = prevPos + pixelsToScroll;
          if (newPosition >= tableData.length * cellHeight) {
            newPosition = 0;
          }
          return newPosition;
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // 停止滚动
  const stopScrolling = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      lastTimeRef.current = 0;
    }
  };
  
  // 鼠标事件处理
  const handleMouseEnter = () => {
    isPaused.current = true;
  };
  
  const handleMouseLeave = () => {
    isPaused.current = false;
  };
  
  // 组件挂载和卸载时控制动画
  useEffect(() => {
    startScrolling();
    return () => {
      stopScrolling();
    };
  }, [tableData.length, scrollSpeed]);
  
  // 计算当前应该显示哪些行 - 优化为memoized计算
  const getVisibleRowsData = () => {
    const startIndex = Math.floor(scrollPosition / cellHeight);
    const rowsToRender = [];
    
    // 计算可见行和缓冲行
    for (let i = startIndex; i < startIndex + visibleRows + 2; i++) { // 减少缓冲行数量
      rowsToRender.push(fullData[i % fullData.length]);
    }
    
    return rowsToRender;
  };
  
  const currentVisibleRows = getVisibleRowsData();
  
  const contentStyle = {
    transform: `translateY(-${scrollPosition % cellHeight}px)`,
    willChange: 'transform' // 优化性能
  };
  
  // 提取样式为常量，减少内联样式
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
        {/* 橙色分界线 */}
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
    </div>
  );
};

export default StatusTable; 