import React, { memo } from 'react';
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
  SHADOW: 'rgba(255, 152, 0, 0.5)',
  BACKGROUND_START: 'rgba(120, 80, 40, 0.95)',
  BACKGROUND_END: 'rgba(100, 70, 30, 0.9)'
};

// 加载状态组件
const Loading = () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      fontSize: '18px',
      color: COLORS.LIGHT_GRAY,
      fontFamily: 'Arial'
    }}
  >
    加载中...
  </div>
);

/**
 * 周长图表组件
 * 
 * @param {Object} props 组件属性
 * @param {number} props.value 当前周长值，用于显示
 * @param {number} props.defaultValue 默认周长值，当value为null时使用
 * @param {boolean} props.isInitialized 数据是否已初始化
 */
const PerimeterChartBase = ({ value, defaultValue = 1238.5, isInitialized = false }) => {
  // 使用提供的值或默认值
  const displayValue = Number.isFinite(value) ? value : defaultValue;
  
  // 处理0值的情况
  const currentValue = displayValue;
  
  // 设置目标值和进度计算
  const totalValue = Math.max(currentValue * 1.2, 12000); // 目标值略高于当前值，至少12000
  const remainingValue = totalValue - currentValue;
  
  // 饼图数据
  const data = [
    { name: "已完成", value: currentValue },
    { name: "剩余", value: remainingValue }
  ];

  // 创建背景圆环数据 - 完全填充
  const backgroundData = [{ name: "背景", value: 1 }];

  // 装饰圆环数据
  const decorationData = [{ name: "装饰", value: 1 }];

  // 如果数据尚未初始化，显示加载状态
  if (!isInitialized) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* 渐变定义 */}
            <defs>
              <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor={COLORS.BACKGROUND_START} />
                <stop offset="100%" stopColor={COLORS.BACKGROUND_END} />
              </radialGradient>
            </defs>

            {/* 背景层 - 圆形填充 */}
            <Pie
              data={backgroundData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius="60%"
              innerRadius="0%"
              fill="url(#backgroundGradient)"
              stroke="none"
              isAnimationActive={false}
            />
          </PieChart>
        </ResponsiveContainer>
        <Loading />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* 渐变定义 */}
          <defs>
            <linearGradient id="perimeterGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={COLORS.ORANGE} />
              <stop offset="100%" stopColor={COLORS.YELLOW} />
            </linearGradient>
            <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor={COLORS.BACKGROUND_START} />
              <stop offset="100%" stopColor={COLORS.BACKGROUND_END} />
            </radialGradient>
          </defs>

          {/* 背景层 - 圆形填充 */}
          <Pie
            data={backgroundData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius="60%"
            innerRadius="0%"
            fill="url(#backgroundGradient)"
            stroke="none"
            isAnimationActive={false}
          />

          {/* 进度环 */}
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="63%"
            outerRadius="78%"
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            blendStroke
            animationDuration={1500}
            animationEasing="ease-out"
            animationBegin={200}
          >
            <Cell 
              key="cell-0" 
              fill="url(#perimeterGradient)" 
              stroke="none" 
              cornerRadius={0}
            />
            <Cell 
              key="cell-1" 
              fill="transparent" 
              stroke="none" 
            />
          </Pie>
          
          {/* 外部装饰环 */}
          <Pie
            data={decorationData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="78%"
            outerRadius="79%"
            fill="rgba(130, 120, 110, 0.4)"
            stroke="none"
            isAnimationActive={false}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* 中心数值显示 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          fontSize: '45px',
          fontWeight: 'bold',
          color: COLORS.ORANGE,
          fontFamily: 'Arial',
          userSelect: 'none'
        }}
      >
        {currentValue.toLocaleString()}
      </div>
    </div>
  );
};

// 使用React.memo包装组件以减少不必要的重渲染
const PerimeterChart = memo(PerimeterChartBase);

export default PerimeterChart; 