import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';

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

const EnergyChart = () => {
  // 定义数据
  const energyData = [
    { name: 'CN01001', value: 847.6 },
    { name: 'CN01002', value: 765.2 },
    { name: 'CN01003', value: 912.3 },
    { name: 'CN01004', value: 625.8 },
    { name: 'CN01005', value: 882.1 }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={energyData}
        layout="vertical"
        barCategoryGap="20%"
        barGap="10%"
        margin={{ left: 80, right: 30, top: 10, bottom: 5 }}
      >
        <defs>
          <linearGradient id="energyGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.YELLOW} />
            <stop offset="100%" stopColor={COLORS.ORANGE} />
          </linearGradient>
        </defs>
        <XAxis type="number" hide />
        <YAxis 
          type="category" 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ 
            fill: COLORS.WHITE,
            fontSize: 16,
            fontWeight: 'bold'
          }}
        />
        <Bar 
          dataKey="value" 
          fill="url(#energyGradient)" 
          barSize={16}
          radius={10}
          animationDuration={1200}
          animationBegin={300}
        >
          <LabelList 
            dataKey="value" 
            position="right" 
            fill={COLORS.WHITE}
            fontSize={14}
            fontWeight="bold"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EnergyChart; 