import React, { useRef, useEffect, useState } from 'react';
import '../App.css';
import ReactECharts from 'echarts-for-react';

// 导入背景图片
import cutTimeImg from '../assets/images/裁剪时间.jpg';
import cutSpeedImg from '../assets/images/裁剪速度.jpg';
import totalEnergyImg from '../assets/images/总能耗.jpg';
import totalPerimeterImg from '../assets/images/总周长.jpg';
import cutSetsImg from '../assets/images/裁剪套数.jpg';
import cutSetsIconImg from '../assets/images/裁剪套数图标.jpg';
import 移动率MUImg from '../assets/images/移动率MU.jpg';
import 裁床运行情况Img from '../assets/images/裁床运行情况.jpg';
import 各裁床运行状态Img from '../assets/images/各裁床运行状态.jpg';
import 各裁床运行状态标题Img from '../assets/images/各裁床运行状态标题.jpg';

// 状态图标组件 - 用SVG代替图片
const StatusIcon = ({ status, color }) => {
  // 根据状态返回对应的图标
  switch (status) {
    case "cutting":
      // 裁剪状态使用Tabler Icons的SVG
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color || "#4CAF50"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
          <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
          <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
          <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
          <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
          <path d="M12 9l-2 3h4l-2 3" />
        </svg>
      );
    case "standby":
      // 待机状态使用Tabler Icons的SVG
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color || "#FFEB3B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
          <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
          <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
          <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
          <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
          <path d="M9 12l2 2l4 -4" />
        </svg>
      );
    case "unplanned":
      // 非计划停机状态使用Tabler Icons的SVG
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color || "#F44336"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
          <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
          <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
          <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
          <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
          <path d="M12 8v4" />
          <path d="M12 16v.01" />
        </svg>
      );
    case "planned":
      // 计划停机状态使用Tabler Icons的SVG
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color || "#9E9E9E"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
          <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
          <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
          <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
          <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
          <path d="M14 14l-4 -4" />
          <path d="M10 14l4 -4" />
        </svg>
      );
    default:
      // 默认返回待机状态图标
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFEB3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
          <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
          <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
          <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
          <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
          <path d="M9 12l2 2l4 -4" />
        </svg>
      );
  }
};

// 重新设计的滚动表格组件
function StatusTable({ tableData, headers, visibleRows = 4, cellHeight = 38, scrollSpeed = 0.5 }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const isPaused = useRef(false);
  
  // 创建完整的数据数组（原始数据 + 复制数据用于无缝衔接）
  const fullData = [...tableData, ...tableData];
  
  // 启动滚动动画
  const startScrolling = () => {
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
  
  // 计算当前应该显示哪些行
  const getVisibleRowsData = () => {
    const startIndex = Math.floor(scrollPosition / cellHeight);
    const rowsToRender = [];
    
    // 计算可见行和缓冲行
    for (let i = startIndex; i < startIndex + visibleRows + 4; i++) {
      rowsToRender.push(fullData[i % fullData.length]);
    }
    
    return rowsToRender;
  };
  
  // 获取当前可见的行
  const currentVisibleRows = getVisibleRowsData();
  
  // 计算内容容器的样式
  const contentStyle = {
    transform: `translateY(-${scrollPosition % cellHeight}px)`,
    willChange: 'transform' // 优化性能
  };
  
  return (
    <div 
      ref={containerRef}
      className="status-table-container" 
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
                    width: `${100 / headers.length}%` 
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
        <div style={contentStyle}>
          <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {currentVisibleRows.map((rowData, index) => {
                return (
                  <tr 
                    key={index} 
                    style={{ 
                      height: cellHeight, 
                      opacity: 1,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.15)' // 添加行分隔线
                    }}
                  >
                    {rowData.map((cellData, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        style={{ 
                          textAlign: 'center', 
                          color: '#ffffff', 
                          fontSize: 16, // 增大字号从14px到16px 
                          padding: '0 10px', 
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
}

function MonitorPage() {
  const muChartRef = useRef(null);
  const energyChartRef = useRef(null);
  const perimeterChartRef = useRef(null);
  const cutTimeChartRef = useRef(null);
  const cutSpeedChartRef = useRef(null);  // 添加裁剪速度图表引用
  
  // 表格数据
  const tableData = [
    ['1', '一车间', 'CN01001', '1.2', '8.5'],
    ['2', '一车间', 'CN01002', '1.5', '7.8'],
    ['3', '二车间', 'CN01003', '1.1', '9.2'],
    ['4', '二车间', 'CN01004', '1.3', '8.0'],
    ['5', '三车间', 'CN01005', '1.4', '8.7'],
    ['6', '三车间', 'CN01006', '1.0', '9.5'],
    ['7', '四车间', 'CN01007', '1.6', '7.2'],
    ['8', '四车间', 'CN01008', '1.3', '8.4'],
    ['9', '五车间', 'CN01009', '1.2', '8.9'],
    ['10', '五车间', 'CN01010', '1.4', '7.5'],
    ['11', '一车间', 'CN01011', '1.3', '8.6'],
    ['12', '二车间', 'CN01012', '1.5', '7.9'],
    ['13', '三车间', 'CN01013', '1.2', '8.8'],
    ['14', '四车间', 'CN01014', '1.1', '9.0'],
    ['15', '五车间', 'CN01015', '1.4', '8.2']
  ];
  const headers = ['序号', '车间', '设备编号', '速度(m/s)', '运行时长(h)'];
  
  // 设备运行状态数据 - 包含4种不同的状态
  const deviceStatusData = [
    { id: "CN01001", status: "cutting" },      // 裁剪
    { id: "CN01002", status: "standby" },      // 待机
    { id: "CN01003", status: "unplanned" },    // 非计划停机
    { id: "CN01004", status: "planned" },      // 计划停机
    { id: "CN01005", status: "cutting" },      // 裁剪
    { id: "CN01006", status: "standby" },      // 待机
    { id: "CN01007", status: "unplanned" },    // 非计划停机
    { id: "CN01008", status: "planned" }       // 计划停机
  ];
  
  useEffect(() => {
    // 当组件挂载后，为移动率MU图表添加鼠标事件
    if (muChartRef.current && muChartRef.current.getEchartsInstance) {
      const chart = muChartRef.current.getEchartsInstance();
      
      // 监听鼠标悬停事件
      chart.on('mouseover', function(params) {
        // 只有当鼠标悬停在已使用部分(索引0)上时才更新标签
        if (params.dataIndex === 0) {
          chart.setOption({
            series: [{
              label: {
                show: true,
                fontSize: 32,
                fontWeight: 'bolder'
              }
            }]
          });
        }
      });
      
      // 监听鼠标离开事件
      chart.on('mouseout', function() {
        // 恢复默认标签大小
        chart.setOption({
          series: [{
            label: {
              show: true,
              fontSize: 30,
              fontWeight: 'bold'
            }
          }]
        });
      });
    }
  }, []);

  // 裁剪时间仪表盘配置
  const getCutTimeChartOption = () => {
    return {
      backgroundColor: 'transparent',
      series: [
        {
          type: 'gauge',
          radius: '85%',  // 添加半径控制整体大小，值越大图表越大
          center: ['50%', '65%'],  // 控制仪表盘位置
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 50000,
          splitNumber: 10,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#ffeb3b' }, // 亮黄色
                { offset: 1, color: '#ff9800' }  // 橙色
              ]
            }
          },
          progress: {
            show: true,
            width: 25,
            roundCap: true,  // 添加圆形端点
            itemStyle: {
              shadowBlur: 5,
              shadowColor: 'rgba(255, 152, 0, 0.5)'
            }
          },
          pointer: {
            show: false
          },
          axisLine: {
            roundCap: true,  // 关键属性：为轴线添加圆角
            lineStyle: {
              width: 25,
              cap: 'round'  // 使用圆角端点
            }
          },
          axisTick: {
            distance: -35,
            splitNumber: 5,
            lineStyle: {
              width: 1,
              color: '#999'
            }
          },
          splitLine: {
            distance: -42,
            length: 12,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          axisLabel: {
            show: false  // 移除刻度数字
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: '100%',  // 增加宽度以确保数字居中
            lineHeight: 30,
            borderRadius: 6,
            offsetCenter: [0, '0%'],  // 调整垂直居中
            fontSize: 55,  // 增大字体
            fontWeight: 'bolder',
            formatter: function(value) {
              return new Intl.NumberFormat().format(value);  // 使用千位分隔符格式化数字
            },
            color: '#ffffff'
          },
          data: [
            {
              value: 26404
            }
          ]
        },
        {
          type: 'gauge',
          radius: '85%',  // 保持与主仪表盘一致
          center: ['50%', '65%'],  // 将位置向下调整，与上面保持一致
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 50000,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#ff9800' },  // 橙色
                { offset: 1, color: '#ff5722' }   // 深橙色
              ]
            }
          },
          progress: {
            show: true,
            width: 6,
            roundCap: true,  // 添加圆形端点
            itemStyle: {}
          },
          pointer: {
            show: false
          },
          axisLine: {
            show: false,
            roundCap: true,  // 为轴线添加圆角
            lineStyle: {
              cap: 'round'  // 使用圆角端点
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [
            {
              value: 26404
            }
          ]
        }
      ]
    };
  };

  // 新增 - 裁剪速度仪表盘配置
  const getCutSpeedChartOption = () => {
    // 定义橙色渐变
    const orangeGradient = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: '#FFC107' },  // 黄色
        { offset: 1, color: '#FF5722' }   // 深橙色
      ]
    };
    
    return {
      backgroundColor: 'transparent',
      series: [
        {
          type: 'gauge',
          radius: '100%',
          center: ['50%', '60%'],
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 10,  // 调整最大值为10
          splitNumber: 5,  // 调整为5个主刻度
          axisLine: {
            lineStyle: {
              width: 1,  // 减小轴线宽度，几乎不可见
              color: [[1, 'rgba(0,0,0,0)']]  // 透明轴线
            }
          },
          axisTick: {
            show: true,
            distance: 0,
            splitNumber: 5,  // 每个刻度再分5份
            length: 8,  // 调整刻度长度
            lineStyle: {
              width: 1,
              color: orangeGradient  // 使用橙色渐变
            }
          },
          splitLine: {
            show: true,
            distance: 0,
            length: 13,  // 调整分割线长度
            lineStyle: {
              width: 2,
              color: orangeGradient  // 使用橙色渐变
            }
          },
          axisLabel: {
            show: true,
            distance: 8,  // 调整标签距离，更靠近刻度
            fontSize: 20,
            fontWeight: 'bold', // 加粗字体
            formatter: '{value}',
            color: '#FFC107'  // 使用橙色渐变的起始颜色
          },
          pointer: {
            icon: 'triangle',  // 使用三角形指针
            length: '75%',
            width: 6,  // 调整指针宽度
            offsetCenter: [0, 0],
            itemStyle: {
              color: '#FE8019'  // 橙色指针
            }
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            fontSize: 40,  // 增大字体
            fontWeight: 'normal',
            color: '#ffffff',  // 白色文字
            offsetCenter: [0, '40%'],  // 向下移动避免被指针覆盖
            valueAnimation: true, 
            formatter: function(value) {
              return value.toFixed(2);  // 保留两位小数
            }
          },
          data: [
            {
              value: 8.14  // 设置为图中的值
            }
          ]
        }
      ]
    };
  };

  // 移动率MU环形图配置
  const getMUChartOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%'
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          silent: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 1
          },
          // 添加中心标签
          label: {
            show: true,
            position: 'center',
            formatter: '69.03%',
            fontSize: 30,
            fontWeight: 'bold',
            color: '#ffffff'
          },
          labelLine: {
            show: false
          },
          data: [
            { 
              value: 69.03, 
              name: '已使用', 
              itemStyle: { 
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#ffeb3b' },  // 黄色
                    { offset: 1, color: '#ff9800' }   // 橙色
                  ]
                }
              }
            },
            { 
              value: 30.97, 
              name: '剩余', 
              itemStyle: { color: '#e0e0e0' }  // 灰白色
            }
          ]
        }
      ]
    };
  };

  // 总能耗横向柱状图配置
  const getEnergyChartOption = () => {
    // 定义数据
    const energyData = [
      {
        name: 'CN01001',
        value: 847.6
      },
      {
        name: 'CN01002',
        value: 765.2
      },
      {
        name: 'CN01003',
        value: 912.3
      },
      {
        name: 'CN01004',
        value: 625.8
      },
      {
        name: 'CN01005',
        value: 882.1
      }
    ];

    // 统一的橙色渐变
    const orangeGradient = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: '#ffeb3b' },  // 黄色起始
        { offset: 1, color: '#ff9800' }   // 橙色结束
      ]
    };

    return {
      backgroundColor: 'transparent',
      grid: {
        left: '25%',
        right: '15%',
        top: '10%',  // 减少顶部空间
        bottom: '5%'  // 减少底部空间
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
        axisPointer: {
          type: 'none'
        }
      },
      xAxis: {
        type: 'value',
        show: false,
        max: 1000
      },
      yAxis: {
        type: 'category',
        data: energyData.map(item => item.name),
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#ffffff',
          fontSize: 16,  // 增加字体大小
          fontWeight: 'bold',
          margin: 20
        }
      },
      series: [
        {
          type: 'bar',
          barWidth: 16,  // 减小柱宽度
          barGap: '10%',  // 减小间距
          barCategoryGap: '20%',  // 调整类目间距
          data: energyData.map(item => ({
            value: item.value,
            itemStyle: {
              color: orangeGradient,
              borderRadius: 10
            },
            label: {
              show: true,
              position: 'right',
              formatter: '{c}',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 'bold'
            }
          })),
          showBackground: false,
          silent: false,
          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(255, 152, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  // 总周长仪表盘配置
  const getPerimeterChartOption = () => {
    // 定义总值，当前值以及进度百分比
    const totalValue = 12000;
    const currentValue = 9496;
    const percentage = (currentValue / totalValue) * 100;
    
    return {
      backgroundColor: 'transparent',
      series: [
        // 灰橙色背景层 - 完整圆形
        {
          type: 'pie',
          animation: false, // 关闭加载动画
          radius: ['0', '60%'],
          center: ['50%', '50%'],
          startAngle: 0,
          endAngle: 360,
          silent: true,
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(120, 80, 40, 0.95)' // 中心偏灰橙色
                },
                {
                  offset: 1,
                  color: 'rgba(100, 70, 30, 0.9)' // 边缘稍暗的灰橙色
                }
              ]
            }
          },
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: 1,
              name: 'background'
            }
          ],
          z: 1 // 确保在底层
        },
        // 进度条层 - 完整圆环
        {
          type: 'gauge',
          radius: '63%',
          startAngle: 90,
          endAngle: -270, // 形成完整的圆
          min: 0,
          max: 100,
          pointer: {
            show: false
          },
          progress: {
            show: false // 关闭基于百分比的进度条
          },
          axisLine: {
            lineStyle: {
              width: 15,
              color: [
                [1, {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: '#ff9800' },
                    { offset: 1, color: '#ffeb3b' }
                  ]
                }] // 使用渐变橙色作为整个圆环
              ],
              shadowColor: 'rgba(255, 152, 0, 0.5)',
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0
            }
          },
          axisTick: {
            show: false, // 关闭刻度线
            splitNumber: 10,
            lineStyle: {
              width: 2,
              color: '#999'
            },
            length: 5
          },
          splitLine: {
            show: false, // 关闭分割线
            length: 10,
            distance: -20,
            lineStyle: {
              width: 3,
              color: '#999'
            }
          },
          axisLabel: {
            show: false
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            show: true,
            valueAnimation: true,
            fontSize: 45,
            fontWeight: 'bold',
            fontFamily: 'Arial',
            color: '#ff9800',
            offsetCenter: [0, 0],
            formatter: function(value) {
              return new Intl.NumberFormat().format(currentValue);
            },
            backgroundColor: 'transparent'
          },
          data: [
            {
              value: percentage
            }
          ],
          z: 3 // 位于上层
        },
        // 外部装饰层 - 完整圆环
        {
          type: 'gauge',
          radius: '78%',
          startAngle: 90,
          endAngle: -270, // 形成完整的圆
          pointer: {
            show: false
          },
          progress: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: [
                [1, 'rgba(130, 120, 110, 0.4)'] // 加深颜色，增加不透明度
              ]
            }
          },
          axisTick: {
            show: true,
            splitNumber: 40,
            lineStyle: {
              width: 1,
              color: 'rgba(130, 120, 110, 0.4)' // 加深颜色，增加不透明度
            },
            length: 8
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [
            {
              value: 0
            }
          ],
          z: 2 // 位于中层
        }
      ]
    };
  };

  return (
    <>
      <div className="dashboard-grid">
        <div className="card-efficiency">
          <img src={移动率MUImg} className="card-image" alt="移动率MU" />
          <div className="chart-overlay">
            <ReactECharts 
              ref={muChartRef}
              option={getMUChartOption()} 
              style={{ height: '100%', width: '100%' }}
              className="mu-chart"
            />
          </div>
        </div>
        <div className="card-cuttime">
          <img src={cutTimeImg} className="card-image" alt="裁剪时间" />
          <div className="chart-overlay">
            <ReactECharts 
              ref={cutTimeChartRef}
              option={getCutTimeChartOption()} 
              style={{ 
                height: '100%',  // 控制图表高度
                width: '100%',   // 控制图表宽度
                margin: 'auto'  // 自动居中
              }}
              className="cuttime-chart"
            />
          </div>
        </div>
        <div className="card-energy">
          <img src={totalEnergyImg} className="card-image" alt="总能耗" />
          <div className="chart-overlay">
            <ReactECharts 
              ref={energyChartRef}
              option={getEnergyChartOption()} 
              style={{ height: '100%', width: '100%' }}
              className="energy-chart"
            />
          </div>
        </div>
        <div className="card-cutspeed">
          <img src={cutSpeedImg} className="card-image" alt="裁剪速度" />
          <div className="chart-overlay">
            <ReactECharts 
              ref={cutSpeedChartRef}
              option={getCutSpeedChartOption()} 
              style={{ 
                height: '95%', 
                width: '95%',
                margin: 'auto'
              }}
              className="cutspeed-chart"
            />
          </div>
        </div>
        <div className="card-perimeter">
          <img src={totalPerimeterImg} className="card-image" alt="总周长" />
          <div className="chart-overlay">
            <ReactECharts 
              ref={perimeterChartRef}
              option={getPerimeterChartOption()} 
              style={{ height: '100%', width: '100%' }}
              className="perimeter-chart"
            />
          </div>
        </div>
        <div className="card-cutsets">
          <img src={cutSetsImg} className="card-image" alt="裁剪套数" />
          <div className="chart-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 5% 0 15%' }}>
            {/* 左侧图标 */}
            <div style={{ 
              width: '80px', 
              height: '80px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '20px'
            }}>
              <img 
                src={cutSetsIconImg} 
                alt="裁剪套数图标" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain'
                }} 
              />
            </div>
            
            {/* 右侧数据 */}
            <div style={{
              fontSize: '70px',
              fontWeight: 'bold',
              color: '#FF7A00',
              fontFamily: 'Arial, sans-serif'
            }}>
              213,715
            </div>
          </div>
        </div>
        <div className="card-status">
          {/* 上部分：各裁床运行状态 */}
          <img 
            src={各裁床运行状态标题Img}
            className="cutting-status-image"
            alt="各裁床运行状态"
          />
          
          {/* 状态说明图例区 - 均匀分布在橙色线上 */}
          {/* 裁剪状态 */}
          <div style={{ 
            position: 'absolute',
            top: '6.6%',  
            left: '10%', 
            zIndex: 10,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-start'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFFFFF', marginRight: '8px', paddingTop: '5px' }}>裁剪</div>
            <div style={{ width: '26px', height: '26px' }}>
              <StatusIcon status="cutting" color="#4CAF50" />
            </div>
          </div>
            
          {/* 待机状态 */}
          <div style={{ 
            position: 'absolute',
            top: '6.6%',  
            left: '35%', 
            zIndex: 10,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-start'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFFFFF', marginRight: '8px', paddingTop: '5px' }}>待机</div>
            <div style={{ width: '26px', height: '26px' }}>
              <StatusIcon status="standby" color="#FFEB3B" />
            </div>
          </div>
            
          {/* 非计划停机状态 */}
          <div style={{ 
            position: 'absolute',
            top: '6.6%',  
            left: '58%', 
            zIndex: 10,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-start'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFFFFF', marginRight: '8px', paddingTop: '5px' }}>非计划停机</div>
            <div style={{ width: '26px', height: '26px' }}>
              <StatusIcon status="unplanned" color="#F44336" />
            </div>
          </div>
            
          {/* 计划停机状态 */}
          <div style={{ 
            position: 'absolute',
            top: '6.6%',  
            left: '82%', 
            zIndex: 10,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-start'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFFFFF', marginRight: '8px', paddingTop: '5px' }}>计划停机</div>
            <div style={{ width: '26px', height: '26px' }}>
              <StatusIcon status="planned" color="#9E9E9E" />
            </div>
          </div>
          
          {/* 橙色分隔线 */}
          <div style={{
            position: 'absolute',
            top: '11%',
            left: '3%',
            right: '3%',
            height: '2px',
            background: '#FF9800',
            zIndex: 5
          }}></div>
          
          {/* 设备状态指示器区域 */}
          <div className="chart-overlay" style={{ 
            top: '12%',  
            left: '5%', 
            width: '90%', 
            height: '50%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridGap: '0',
            alignContent: 'start',
            padding: '0 50px'
          }}>
            {deviceStatusData.map((device, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                margin: '0',
                height: '32px',
                background: 'transparent'
              }}>
                {/* 左侧设备编号 */}
                <div style={{
                  fontSize: '26px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginRight: '15px'
                }}>
                  {device.id}
                </div>
                
                {/* 右侧状态图标 */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <StatusIcon 
                    status={device.status} 
                    color={
                      device.status === "cutting" ? "#4CAF50" : 
                      device.status === "standby" ? "#FFEB3B" : 
                      device.status === "unplanned" ? "#F44336" :
                      "#9E9E9E"
                    } 
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* 下部分：裁床运行情况 */}
          <img 
            src={裁床运行情况Img}
            className="status-image"
            alt="裁床运行情况"
          />
          {/* 表格叠加层 - 调整左右边距和位置 */}
          <div className="chart-overlay" style={{ top: '74%', left: '7%', width: '86%', height: '25%' }}>
            <StatusTable 
              tableData={tableData} 
              headers={headers} 
              scrollSpeed={0.3}
              visibleRows={4}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default MonitorPage; 