import React, { useRef, useEffect, useState } from 'react';
import '../App.css';

// 导入图片
import faultCountImg from '../assets/images/故障台数.jpg';
import faultTimesImg from '../assets/images/故障次数.jpg';
import faultDurationImg from '../assets/images/故障时长.jpg';
import avgFaultTimeImg from '../assets/images/平均故障时长.jpg';
import bladeLifeImg from '../assets/images/刀片和磨刀棒寿命.jpg';
import faultListImg from '../assets/images/当前设备故障清单.jpg';

// 刀片和磨刀棒寿命表格组件
function LifeTable({ tableData, headers, visibleRows = 4, cellHeight = 38, scrollSpeed = 0.5 }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const isPaused = useRef(false);
  
  // 创建完整的数据数组（原始数据 + 复制数据用于无缝衔接）
  const fullData = [...tableData, ...tableData];
  
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

// 设备故障清单表格组件 - 参考LifeTable组件设计
function FaultTable({ tableData, headers, visibleRows = 4, cellHeight = 38, scrollSpeed = 0.5 }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const isPaused = useRef(false);
  
  // 创建完整的数据数组（原始数据 + 复制数据用于无缝衔接）
  const fullData = [...tableData, ...tableData];
  
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

  // 定义列宽百分比 - 根据内容调整
  const columnWidths = ['7%', '12%', '20%', '18%', '43%']; // 序号、车间、设备编号、故障代码、开始时间
  
  return (
    <div 
      ref={containerRef}
      className="fault-table-container" 
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
                      {cellData}
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
    </div>
  );
}

function ManagementPage() {
  // 刀片和磨刀棒寿命数据 - 18条数据
  const bladeLifeData = [
    ['1', '一车间', 'CN01001', '85', '72'],
    ['2', '一车间', 'CN01002', '65', '89'],
    ['3', '二车间', 'CN01003', '45', '52'],
    ['4', '二车间', 'CN01004', '92', '78'],
    ['5', '三车间', 'CN01005', '33', '45'],
    ['6', '三车间', 'CN01006', '77', '81'],
    ['7', '四车间', 'CN01007', '58', '66'],
    ['8', '四车间', 'CN01008', '89', '27'],
    ['9', '五车间', 'CN01009', '25', '91'],
    ['10', '五车间', 'CN01010', '71', '44'],
    ['11', '一车间', 'CN01011', '39', '63'],
    ['12', '二车间', 'CN01012', '82', '76'],
    ['13', '三车间', 'CN01013', '61', '55'],
    ['14', '四车间', 'CN01014', '74', '48'],
    ['15', '五车间', 'CN01015', '53', '87'],
    ['16', '一车间', 'CN01016', '68', '79'],
    ['17', '二车间', 'CN01017', '43', '90'],
    ['18', '三车间', 'CN01018', '57', '84']
  ];
  
  // 设备故障清单数据
  const faultListData = [
    ['1', '一车间', 'CN01001', 'E-1032', '2025-05-13 16:06:02'],
    ['2', '一车间', 'CN01006', 'E-2143', '2025-05-13 14:23:47'],
    ['3', '二车间', 'CN01003', 'E-1580', '2025-05-13 12:15:38'],
    ['4', '二车间', 'CN01012', 'E-2201', '2025-05-12 23:40:12'],
    ['5', '三车间', 'CN01005', 'E-3072', '2025-05-12 20:18:55'],
    ['6', '三车间', 'CN01013', 'E-1784', '2025-05-12 18:32:09'],
    ['7', '四车间', 'CN01007', 'E-2345', '2025-05-12 15:41:23'],
    ['8', '四车间', 'CN01008', 'E-1062', '2025-05-12 10:25:37'],
    ['9', '五车间', 'CN01015', 'E-2908', '2025-05-11 22:17:46'],
    ['10', '五车间', 'CN01010', 'E-1249', '2025-05-11 19:03:51'],
    ['11', '一车间', 'CN01002', 'E-3145', '2025-05-11 16:54:14'],
    ['12', '二车间', 'CN01004', 'E-2653', '2025-05-11 14:32:28'],
    ['13', '三车间', 'CN01018', 'E-1498', '2025-05-11 11:45:39'],
    ['14', '四车间', 'CN01014', 'E-2871', '2025-05-11 09:29:52'],
    ['15', '五车间', 'CN01009', 'E-1723', '2025-05-10 21:12:08'],
    ['16', '一车间', 'CN01016', 'E-2406', '2025-05-10 18:37:22']
  ];
  
  const bladeHeaders = ['序号', '车间', '设备编号', '刀片', '磨刀棒'];
  const faultHeaders = ['序号', '车间', '设备编号', '故障代码', '开始时间'];

  return (
    <>
      {/* 顶部指标行 - 四个卡片水平排列 */}
      <div className="metrics-row">
        {/* 故障台数 */}
        <div className="metric-card">
          <img src={faultCountImg} className="card-image" alt="故障台数" />
        </div>
        
        {/* 故障次数 */}
        <div className="metric-card">
          <img src={faultTimesImg} className="card-image" alt="故障次数" />
        </div>
        
        {/* 故障时长 */}
        <div className="metric-card">
          <img src={faultDurationImg} className="card-image" alt="故障时长" />
        </div>
        
        {/* 平均故障时长 */}
        <div className="metric-card">
          <img src={avgFaultTimeImg} className="card-image" alt="平均故障时长" />
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="management-grid">
        {/* 刀片和磨刀棒寿命 - 使用相对定位作为容器 */}
        <div className="card-blade" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* 背景图片 */}
          <img 
            src={bladeLifeImg} 
            className="card-image" 
            alt="刀片和磨刀棒寿命" 
            style={{ display: 'block', width: '100%', height: 'auto' }} 
          />
          
          {/* 表格叠加层 - 使用绝对定位悬浮在图片上方 */}
          <div 
            className="chart-overlay"
            style={{ 
              position: 'absolute', 
              top: '80px', 
              left: '7%', 
              width: '86%', 
              height: 'calc(100% - 110px)'
            }}
          >
            <LifeTable 
              tableData={bladeLifeData} 
              headers={bladeHeaders} 
              scrollSpeed={0.25}
              visibleRows={6}
            />
          </div>
        </div>
        
        {/* 当前设备故障清单 */}
        <div className="card-fault" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={faultListImg} className="card-image" alt="当前设备故障清单" />
          
          {/* 表格叠加层 - 使用绝对定位悬浮在图片上方 */}
          <div 
            className="chart-overlay"
            style={{ 
              position: 'absolute', 
              top: '80px', 
              left: '7%', 
              width: '86%', 
              height: 'calc(100% - 110px)'
            }}
          >
            <FaultTable 
              tableData={faultListData} 
              headers={faultHeaders} 
              scrollSpeed={0.25}
              visibleRows={6}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagementPage; 