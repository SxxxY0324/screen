import React, { useState, memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ensureValidPercentage } from '../../utils/chartUtils';
import { useAppSelector } from '../../store/hooks';
import { selectIsDataInitialized } from '../../store/slices/monitorSlice';

// 颜色常量定义
const COLORS = {
  GREEN: '#4CAF50',
  YELLOW: '#FFEB3B',
  RED: '#F44336',
  GRAY: '#9E9E9E',
  ORANGE: '#ff9800',
  DEEP_ORANGE: '#ff5722',
  WHITE: '#ffffff',
  LIGHT_GRAY: '#e0e0e0',
  DARK_ORANGE: '#FF7A00'
};

/**
 * 移动率MU组件 - 使用Recharts实现
 * @param {Object} props - 组件属性 
 * @param {number} props.value - 移动率值(0-100)
 */
const EfficiencyChart = ({ value = 69.03 }) => {
  const [hovered, setHovered] = useState(false);
  // 获取数据初始化状态
  const isDataInitialized = useAppSelector(selectIsDataInitialized);
  
  // 确保值是有效的百分比，传入初始化状态
  const validValue = ensureValidPercentage(value, value === null ? 0 : value, isDataInitialized);
  
  // 如果validValue为null，显示加载状态
  if (validValue === null) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: COLORS.WHITE,
        backgroundColor: 'rgba(0,0,0,0.3)'
      }}>
        正在加载数据...
      </div>
    );
  }
  
  const muValue = validValue.toFixed(2);
  const remainingValue = (100 - parseFloat(muValue)).toFixed(2);
  
  // 饼图数据
  const data = [
    { name: "已使用", value: parseFloat(muValue) },
    { name: "剩余", value: parseFloat(remainingValue) }
  ];
  
  // 中心标签样式
  const centerLabelStyle = {
    fontSize: hovered ? '32px' : '30px',
    fontWeight: hovered ? 'bolder' : 'bold',
    fill: COLORS.WHITE,
    transition: 'all 0.3s ease'
  };
  
  return (
    <div 
      style={{ position: 'relative', width: '100%', height: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="muGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={COLORS.YELLOW} />
              <stop offset="100%" stopColor={COLORS.ORANGE} />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            cornerRadius={10}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? "url(#muGradient)" : COLORS.LIGHT_GRAY} 
                strokeWidth={0}
              />
            ))}
          </Pie>
          {/* 中心百分比标签 */}
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dominantBaseline="middle"
            style={centerLabelStyle}
          >
            {muValue}%
          </text>
        </PieChart>
      </ResponsiveContainer>
      
      {/* 简化的调试信息，仅在开发环境显示 */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'absolute',
          bottom: '5px',
          left: '5px',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.5)'
        }}>
          原值:{typeof value === 'number' ? value.toFixed(1) : value}
        </div>
      )}
    </div>
  );
};

// 添加组件显示名称，便于调试
EfficiencyChart.displayName = 'EfficiencyChart';

// 使用memo优化性能，避免不必要的重渲染
export default memo(EfficiencyChart); 