import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { ensureValidNumber } from '../../utils/chartUtils';

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

const EnergyChart = ({ value = 298.6 }) => {
  // 确保value是有效数字
  const totalEnergy = ensureValidNumber(value, 298.6, 1);
  
  // 根据总能耗值生成分布数据 (模拟不同设备的能耗分布)
  const calculateDeviceEnergy = (total) => {
    const baseValue = total / 5;
    return [
      { name: 'CN01001', value: baseValue * 1.05 },
      { name: 'CN01002', value: baseValue * 0.95 },
      { name: 'CN01003', value: baseValue * 1.13 },
      { name: 'CN01004', value: baseValue * 0.77 },
      { name: 'CN01005', value: baseValue * 1.1 }
    ].map(item => ({
      ...item,
      value: parseFloat(item.value.toFixed(1))
    }));
  };
  
  // 定义数据
  const energyData = calculateDeviceEnergy(totalEnergy);

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
          animationDuration={1000}
          animationBegin={0}
          isAnimationActive={true}
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

// 使用React.memo优化性能，避免不必要的重渲染
export default memo(EnergyChart); 