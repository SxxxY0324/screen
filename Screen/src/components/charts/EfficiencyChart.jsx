import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
  DARK_ORANGE: '#FF7A00',
  SHADOW: 'rgba(255, 152, 0, 0.5)'
};

// 移动率MU组件 - 使用Recharts实现
const EfficiencyChart = () => {
  const [hovered, setHovered] = useState(false);
  const muValue = 69.03;
  const remainingValue = 30.97;
  
  // 饼图数据
  const data = [
    { name: "已使用", value: muValue },
    { name: "剩余", value: remainingValue }
  ];
  
  // 颜色数组
  const CHART_COLORS = [
    { start: COLORS.YELLOW, end: COLORS.ORANGE },
    COLORS.LIGHT_GRAY
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
            animationDuration={800}
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
    </div>
  );
};

export default EfficiencyChart; 