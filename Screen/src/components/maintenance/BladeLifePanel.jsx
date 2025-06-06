import React, { useRef, useEffect, useState } from 'react';

/**
 * 刀片和磨刀棒寿命面板组件
 */
const BladeLifePanel = ({ tableData, headers }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative', 
      display: 'flex', 
      flexDirection: 'column', 
      borderRadius: '6px', 
      overflow: 'hidden',
      backgroundColor: 'rgba(20, 20, 25, 0.7)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
    }}>
      {/* 标题区 */}
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '16px 20px', 
        textAlign: 'left',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ 
          width: '5px', 
          height: '22px', 
          backgroundColor: '#f9e090', 
          marginRight: '15px',
          borderRadius: '2px'
        }}></div>
        <div style={{ 
          color: '#fff', 
          fontSize: '22px', 
          fontWeight: 'bold'
        }}>刀片和磨刀棒寿命</div>
      </div>
      
      {/* 表格区域 */}
      <div style={{ flex: 1, padding: '10px 10px 15px 10px', overflow: 'hidden' }}>
        <LifeTable 
          tableData={tableData} 
          headers={headers} 
          scrollSpeed={0.5}
          visibleRows={6}
        />
      </div>
    </div>
  );
};

// 刀片和磨刀棒寿命表格组件
function LifeTable({ tableData, headers, visibleRows = 4, cellHeight = 38, scrollSpeed = 0.5 }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const isPaused = useRef(false);
  
  // 计算滚动阈值 - 固定为18条数据
  const scrollThreshold = 18;
  const shouldScroll = tableData.length >= scrollThreshold;
  
  // 启动滚动动画
  const startScrolling = () => {
    // 如果数据不足阈值，则不执行滚动
    if (!shouldScroll) {
      return;
    }
    
    let lastTime = 0;
    
    const animate = (timestamp) => {
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
        // 当滚动超过原始数据长度时，重置回开始位置
        let newPosition = prevPos + pixelsToScroll;
        if (newPosition >= tableData.length * cellHeight) {
          newPosition = 0;
        }
        return newPosition;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // 停止滚动
  const stopScrolling = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // 鼠标事件处理
  const handleMouseEnter = () => {
    // 只有在应该滚动的情况下才暂停
    if (shouldScroll) {
      isPaused.current = true;
    }
  };
  
  const handleMouseLeave = () => {
    // 只有在应该滚动的情况下才恢复
    if (shouldScroll) {
      isPaused.current = false;
    }
  };
  
  // 组件挂载和卸载时控制动画
  useEffect(() => {
    // 只有在数据超过阈值时才启动滚动
    if (shouldScroll) {
      startScrolling();
    } else {
      // 数据不足时确保没有滚动
      setScrollPosition(0);
    }
    
    return () => {
      stopScrolling();
    };
  }, [tableData.length, scrollSpeed, shouldScroll]);
  
  // 进度条组件 - 改进版
  const ProgressBar = ({ percentage }) => {
    // 根据百分比获取颜色渐变
    const getGradientColor = (percent) => {
      if (percent < 30) {
        return 'linear-gradient(to right, #ff3d00, #ff6e40)'; // 红色渐变（低）
      } else if (percent < 70) {
        return 'linear-gradient(to right, #ffab00, #ffd740)'; // 黄色渐变（中）
      } else {
        return 'linear-gradient(to right, #00c853, #69f0ae)'; // 绿色渐变（高）
      }
    };

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: '8px' // 添加间距
      }}>
        {/* 进度条部分 */}
        <div style={{
          flex: 1,
          height: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundImage: getGradientColor(percentage),
            borderRadius: '8px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        
        {/* 百分比显示 - 放在外部 */}
        <div style={{
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#ffffff',
          textShadow: '0 0 2px rgba(0, 0, 0, 0.7)',
          minWidth: '36px', // 固定宽度确保对齐
          textAlign: 'right'
        }}>
          {percentage}%
        </div>
      </div>
    );
  };
  
  // 渲染单元格内容
  const renderCellContent = (cellData, cellIndex) => {
    // 如果是进度条列（刀片或磨刀棒）
    if (cellIndex === 3 || cellIndex === 4) {
      // 假设cellData是一个0-100的数字
      return <ProgressBar percentage={Number(cellData)} />;
    }
    
    // 否则返回普通文本
    return cellData;
  };

  // 定义列宽百分比
  const columnWidths = ['7%', '15%', '22%', '28%', '28%']; // 序号、车间、设备编号、刀片、磨刀棒
  
  return (
    <div 
      ref={containerRef}
      className="life-table-container" 
      style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 固定表头部分 */}
      <div className="table-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'transparent' }}>
        <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  style={{ 
                    height: cellHeight, 
                    textAlign: 'center', 
                    color: '#ffffff', 
                    fontWeight: 'bold', 
                    fontSize: 16, 
                    padding: '0 10px', 
                    width: columnWidths[index] 
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        {/* 橙色分界线 - 完全固定 */}
        <div style={{ 
          height: 2, 
          backgroundColor: '#ff9800', 
          width: '100%', 
          marginBottom: 0
        }}></div>
      </div>
      
      {/* 滚动内容部分 */}
      <div 
        className="table-body-container" 
        style={{ 
          height: `calc(100% - ${cellHeight + 2}px)`, 
          overflowY: 'hidden',
          position: 'relative'
        }}
      >
        {!shouldScroll ? (
          // 不滚动时显示静态表格
          <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {tableData.map((rowData, index) => (
                <tr 
                  key={index} 
                  style={{ 
                    height: cellHeight, 
                    opacity: 1,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)' 
                  }}
                >
                  {rowData.map((cellData, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      style={{ 
                        textAlign: 'center', 
                        color: '#ffffff', 
                        fontSize: 16, 
                        padding: '0 10px', 
                        width: columnWidths[cellIndex] 
                      }}
                    >
                      {renderCellContent(cellData, cellIndex)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // 滚动时显示所有数据
          <div style={{ transform: `translateY(-${scrollPosition % (tableData.length * cellHeight)}px)`, willChange: 'transform' }}>
            {/* 第一遍数据 */}
            <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {tableData.map((rowData, index) => (
                  <tr 
                    key={`first-${index}`} 
                    style={{ 
                      height: cellHeight, 
                      opacity: 1,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    {rowData.map((cellData, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        style={{ 
                          textAlign: 'center', 
                          color: '#ffffff', 
                          fontSize: 16, 
                          padding: '0 10px', 
                          width: columnWidths[cellIndex] 
                        }}
                      >
                        {renderCellContent(cellData, cellIndex)}
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
                    style={{ 
                      height: cellHeight, 
                      opacity: 1,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    {rowData.map((cellData, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        style={{ 
                          textAlign: 'center', 
                          color: '#ffffff', 
                          fontSize: 16, 
                          padding: '0 10px', 
                          width: columnWidths[cellIndex] 
                        }}
                      >
                        {renderCellContent(cellData, cellIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BladeLifePanel; 