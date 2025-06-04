import React, { useEffect, useState } from 'react';
import '../App.css';
import ReactECharts from 'echarts-for-react';
import 业绩分析背景 from '../assets/images/业绩分析.png';

function AnalysisPage() {
  // 模拟数据 - 更新为匹配截图中的数据点数量
  const [muData, setMuData] = useState({
    categories: [
      'CN01001', 'CN01003', 'CN02002', 'CN02004', 
      'CN03002', 'CN03004', 'CN04002', 'CN04004',
      'CN01001', 'CN01003', 'CN02002', 'CN02004', 
      'CN03002', 'CN03004'
    ],
    values: [
      77, 77, 66, 67, 66, 65, 68, 67,
      65, 68, 66, 67, 68, 69
    ]
  });
  
  // 周长(M)数据
  const [perimeterData, setPerimeterData] = useState({
    categories: [
      'CN01001', 'CN01003', 'CN02002', 'CN02004', 
      'CN03002', 'CN03004', 'CN04002', 'CN04004'
    ],
    values: [
      680, 680, 600, 590, 610, 620, 610, 620
    ]
  });
  
  // 裁剪时间(H)数据
  const [cutTimeData, setCutTimeData] = useState({
    categories: [
      'CN01001', 'CN01003', 'CN02002', 'CN02004', 
      'CN03002', 'CN03004', 'CN04002', 'CN04004'
    ],
    values: [
      1950, 1980, 1650, 1680, 1620, 1670, 1730, 1750
    ]
  });

  // 裁剪速度(m/s)数据
  const [cutSpeedData, setCutSpeedData] = useState({
    categories: [
      'CN01001', 'CN01003', 'CN02002', 'CN02004', 
      'CN03002', 'CN03004', 'CN04002', 'CN04004'
    ],
    values: [
      4.6, 4.5, 4.7, 4.5, 4.6, 4.8, 4.6, 4.7
    ]
  });

  // 移动率MU图表配置
  const getMuChartOptions = () => {
    return {
      grid: {
        top: '8%',       // 保持减少的顶部边距
        left: '3%',      // 保持减少的左侧边距
        right: '2%',     // 保持右侧边距不变
        bottom: '4%',    // 将底部边距从8%减小到4%
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: muData.categories,
        axisLine: {
          lineStyle: {
            color: '#888'
          }
        },
        axisLabel: {
          color: '#ddd',
          interval: 0,
          rotate: 45,    // 保持45度旋转，匹配截图
          fontSize: 14,
          fontWeight: 'bold',
          margin: 8
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20,    // 设置间隔为20，匹配截图
        axisLine: {
          lineStyle: {
            color: '#888'
          }
        },
        axisLabel: {
          color: '#ddd',
          fontSize: 14,
          fontWeight: 'bold'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#333',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          data: muData.values,
          type: 'bar',
          barWidth: '60%',  // 调整柱宽
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#ffa64d' },  // 更亮的橙色
                { offset: 1, color: '#ff8c1a' }   // 更亮的橙色
              ]
            },
            borderRadius: [5, 5, 0, 0]  // 增加圆角，匹配截图
          },
          markLine: {
            silent: true,
            lineStyle: {
              color: '#ff9900',
              width: 2,
              type: 'solid'
            },
            data: [
              { 
                yAxis: 50,
                label: {
                  show: false  // 隐藏标签，匹配截图
                },
                symbol: ['none', 'arrow'],  // 起点无标记，终点使用箭头
                symbolSize: [10, 15],       // 增大箭头大小
                symbolOffset: [0, 0],
                lineStyle: {
                  width: 2,
                  type: 'solid'
                }
              }
            ],
            animation: false,
            symbol: 'arrow',
            symbolSize: 10,
            precision: 0
          }
        }
      ]
    };
  };
  
  // 周长(M)图表配置
  const getPerimeterChartOptions = () => {
    return {
      grid: {
        top: '8%',
        left: '3%',
        right: '2%',
        bottom: '4%',    // 将底部边距从8%减小到4%
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: perimeterData.categories,
        axisLine: {
          lineStyle: {
            color: '#888'
          }
        },
        axisLabel: {
          color: '#ddd',
          interval: 0,
          rotate: 45,
          fontSize: 14,
          fontWeight: 'bold',
          margin: 8
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 800,
        interval: 200,  // 根据示例图设置间隔
        axisLine: {
          lineStyle: {
            color: '#888'
          }
        },
        axisLabel: {
          color: '#ddd',
          fontSize: 14,
          fontWeight: 'bold'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#333',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          data: perimeterData.values,
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#f9e090' },  // 浅黄色，根据示例图
                { offset: 1, color: '#f5d76e' }   // 浅黄色，根据示例图
              ]
            },
            borderRadius: [5, 5, 0, 0]  // 同样的圆角
          }
        }
      ]
    };
  };
  
  // 裁剪时间(H)图表配置
  const getCutTimeChartOptions = () => {
    return {
      grid: {
        top: '8%',
        left: '3%',
        right: '2%',
        bottom: '-2%', 
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: cutTimeData.categories,
        axisLine: {
          lineStyle: {
            color: '#888'
          }
        },
        axisLabel: {
          color: '#ddd',
          interval: 0,
          rotate: 45,
          fontSize: 14,
          fontWeight: 'bold',
          margin: 8
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 2500,
        interval: 500,  // 根据示例图设置间隔
        axisLine: {
          lineStyle: {
            color: '#888'
          }
        },
        axisLabel: {
          color: '#ddd',
          fontSize: 14,
          fontWeight: 'bold'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#333',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          data: cutTimeData.values,
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#8fe6df' },  // 浅青色/薄荷绿，根据示例图
                { offset: 1, color: '#5ad8cc' }   // 浅青色/薄荷绿，根据示例图
              ]
            },
            borderRadius: [5, 5, 0, 0]  // 同样的圆角
          }
        }
      ]
    };
  };

  // 裁剪速度(m/s)图表配置
  const getCutSpeedChartOptions = () => {
    return {
      grid: {
        top: '8%',
        left: '3%',
        right: '2%',
        bottom: '-2%',    // 使用与其他图表相同的底部边距
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: cutSpeedData.categories,
        axisLine: {
          lineStyle: {
            color: '#888'
          }
        },
        axisLabel: {
          color: '#ddd',
          interval: 0,
          rotate: 45,
          fontSize: 14,
          fontWeight: 'bold',
          margin: 8
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 10,
        interval: 2,  // 间隔设为2，匹配截图
        axisLine: {
          lineStyle: {
            color: '#888'
          }
        },
        axisLabel: {
          color: '#ddd',
          fontSize: 14,
          fontWeight: 'bold'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#333',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          data: cutSpeedData.values,
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#95c5f5' },  // 浅蓝色，根据截图
                { offset: 1, color: '#7ab6f2' }   // 浅蓝色，根据截图
              ]
            },
            borderRadius: [5, 5, 0, 0]  // 匹配其他图表的圆角
          },
          markLine: {
            silent: true,
            lineStyle: {
              color: '#ff9900',
              width: 2,
              type: 'solid'
            },
            data: [
              { 
                yAxis: 4.8,  // 参考线位置大约在4.8
                label: {
                  show: false  // 隐藏标签，匹配截图
                },
                symbol: ['none', 'arrow'],  // 起点无标记，终点使用箭头
                symbolSize: [10, 15],       // 增大箭头大小
                symbolOffset: [0, 0],
                lineStyle: {
                  width: 2,
                  type: 'solid'
                }
              }
            ],
            animation: false,
            symbol: 'arrow',
            symbolSize: 10,
            precision: 0
          }
        }
      ]
    };
  };

  return (
    <div className="analysis-page" style={{ 
      position: 'relative',
      width: '100%',
      height: 'calc(100vh - 110px)',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }}>
        <img 
          src={业绩分析背景} 
          alt="业绩分析背景" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center center',
          }}
        />
      </div>

      <div style={{ 
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        padding: '20px'
      }}>
        <div className="analysis-grid">
          {/* 左上: 移动率MU图表 */}
          <div className="dashboard-card">
            <div className="chart-content" style={{ width: '100%', height: '100%' }}>
              <ReactECharts 
                option={getMuChartOptions()} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
          </div>
          
          {/* 右上: 周长(M)图表 */}
          <div className="dashboard-card">
            <div className="chart-content" style={{ width: '100%', height: '100%' }}>
              <ReactECharts 
                option={getPerimeterChartOptions()} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
          </div>
          
          {/* 左下: 裁剪时间(H)图表 */}
          <div className="dashboard-card">
            <div className="chart-content" style={{ width: '100%', height: '100%' }}>
              <ReactECharts 
                option={getCutTimeChartOptions()} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
          </div>
          
          {/* 右下: 裁剪速度(m/s)图表 */}
          <div className="dashboard-card">
            <div className="chart-content" style={{ width: '100%', height: '100%' }}>
              <ReactECharts 
                option={getCutSpeedChartOptions()} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;