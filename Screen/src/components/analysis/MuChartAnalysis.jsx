import React, { memo } from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * 业绩分析 - 移动率MU图表组件
 * @param {Object} props 组件属性
 * @param {Array} props.categories 类别数据
 * @param {Array} props.values 值数据
 * @returns {React.Component} 移动率MU图表组件
 */
const MuChartAnalysisBase = ({ categories, values }) => {
  // 图表配置
  const getOptions = () => {
    return {
      grid: {
        top: '12%',
        left: '6%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: '#333',
        borderWidth: 1
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: {
          lineStyle: {
            color: '#888'
          }
        },
        axisLabel: {
          color: '#ddd',
          interval: 0,
          rotate: 45,    // 保持45度旋转
          fontSize: 14,
          fontWeight: 'bold',
          margin: 8
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20,
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
          data: values,
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#ffa64d' },  // 更亮的橙色
                { offset: 1, color: '#ff8c1a' }   // 更亮的橙色
              ]
            },
            borderRadius: [5, 5, 0, 0]  // 增加圆角
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
                  show: false  // 隐藏标签
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
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', borderRadius: '6px', overflow: 'hidden' }}>
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
          backgroundColor: '#ffa64d', 
          marginRight: '15px',
          borderRadius: '2px'
        }}></div>
        <div style={{ 
          color: '#fff', 
          fontSize: '22px', 
          fontWeight: 'bold'
        }}>移动率MU</div>
      </div>
      
      {/* 图表区 */}
      <div style={{ flex: 1, width: '100%' }}>
        <ReactECharts 
          option={getOptions()} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
};

MuChartAnalysisBase.displayName = 'MuChartAnalysis';

// 使用memo包装组件，避免不必要的重渲染
const MuChartAnalysis = memo(MuChartAnalysisBase);

export default MuChartAnalysis;
