import React, { memo } from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * 业绩分析 - 周长(M)图表组件
 * @param {Object} props 组件属性
 * @param {Array} props.categories 类别数据
 * @param {Array} props.values 值数据
 * @returns {React.Component} 周长(M)图表组件
 */
const PerimeterChartAnalysisBase = ({ categories, values }) => {
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
        interval: 200,
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
                { offset: 0, color: '#f9e090' },  // 浅黄色
                { offset: 1, color: '#f5d76e' }   // 浅黄色
              ]
            },
            borderRadius: [5, 5, 0, 0]  // 圆角
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
          backgroundColor: '#f9e090', 
          marginRight: '15px',
          borderRadius: '2px'
        }}></div>
        <div style={{ 
          color: '#fff', 
          fontSize: '22px', 
          fontWeight: 'bold'
        }}>周长(M)</div>
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

PerimeterChartAnalysisBase.displayName = 'PerimeterChartAnalysis';

// 使用memo包装组件，避免不必要的重渲染
const PerimeterChartAnalysis = memo(PerimeterChartAnalysisBase);

export default PerimeterChartAnalysis;
