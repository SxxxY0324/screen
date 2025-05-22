import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
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

// 最大刻度值
const MAX_VALUE = 50000;

// 简单防抖函数
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 增强版刻度线渲染器
const renderTicks = (containerWidth, containerHeight) => {
  if (!containerWidth || !containerHeight || containerWidth < 10 || containerHeight < 10) return null;
  
  // 根据容器尺寸计算中心点和半径
  const cx = containerWidth * 0.5;
  const cy = containerHeight * 0.65; // 与Pie组件的cy对应
  const outerRadius = Math.min(containerWidth, containerHeight) * 0.42; // 稍小于Pie的outerRadius
  const innerRadius = outerRadius * 0.85; // 用于放置标签的内径
  
  // 刻度线角度配置 - 扩大范围以更好地覆盖圆弧
  const tickStartAngle = -209; // 扩展到右下方一些
  const tickEndAngle = 29;     // 扩展到左下方一些
  
  // 转换角度为弧度
  const startRad = (tickStartAngle * Math.PI) / 180;
  const endRad = (tickEndAngle * Math.PI) / 180;
  const totalRad = endRad - startRad;
  
  // 确定刻度线数量和角度增量
  const minorTickCount = 75; // 增加刻度线数量以更好覆盖
  const minorTickStep = totalRad / minorTickCount;
  const majorTickInterval = 5; // 每5个小刻度显示一个主刻度
  
  // 刻度线设置
  const minorTickLength = 4;
  const majorTickLength = 8;
  
  // 创建刻度线数组
  const ticks = [];
  
  for (let i = 0; i <= minorTickCount; i++) {
    const rad = startRad + i * minorTickStep; // 从左到右
    const isMajor = i % majorTickInterval === 0;
    const tickLength = isMajor ? majorTickLength : minorTickLength;
    
    // 计算刻度线坐标
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    // 刻度线从圆环外部开始
    const tickOuterRadius = outerRadius * 1.03;
    const tickInnerRadius = tickOuterRadius + tickLength;
    
    const x1 = cx + tickOuterRadius * cos;
    const y1 = cy + tickOuterRadius * sin;
    const x2 = cx + tickInnerRadius * cos;
    const y2 = cy + tickInnerRadius * sin;
    
    // 刻度线样式
    const strokeColor = isMajor ? COLORS.ORANGE : 'rgba(255, 165, 0, 0.7)';
    const strokeWidth = isMajor ? 1.5 : 0.8;
    
    // 创建刻度线
    ticks.push(
      <line 
        key={`tick-${i}`}
        x1={x1} 
        y1={y1} 
        x2={x2} 
        y2={y2} 
        stroke={strokeColor} 
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );
  }
  
  // 添加阴影滤镜
  const defsShadow = (
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  );
  
  return (
    <g filter="url(#glow)">
      {defsShadow}
      {ticks}
    </g>
  );
};

const CutTimeChartBase = () => {
  const [displayValue, setDisplayValue] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const prevSizeRef = useRef({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const finalValue = 26404;
  const animationDuration = 2500; // 动画持续时间
  
  // 防抖更新尺寸的处理函数
  const updateSize = useCallback(
    debounce(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        // 确保尺寸有效且大于最小限制
        if (width > 50 && height > 50) {
          setContainerSize({ width, height });
          prevSizeRef.current = { width, height };
        } else if (prevSizeRef.current.width > 0 && prevSizeRef.current.height > 0) {
          // 使用上一个有效的尺寸
          setContainerSize(prevSizeRef.current);
        }
      }
    }, 100),
    []
  );
  
  // 检测容器尺寸
  useEffect(() => {
    // 初始化调用一次
    updateSize();
    
    // 添加resize事件监听
    window.addEventListener('resize', updateSize);
    
    // 清理
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [updateSize]);
  
  // 平滑数值动画
  useEffect(() => {
    let startTime = null;
    let startValue = 0;
    
    const animateValue = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // 计算动画进度 (0 到 1)
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // 使用缓动函数使动画更平滑
      const easeOutProgress = 1 - Math.pow(1 - progress, 3); // 缓出效果
      
      // 计算当前显示值
      const currentValue = Math.round(startValue + (finalValue - startValue) * easeOutProgress);
      setDisplayValue(currentValue);
      
      // 继续动画或结束
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateValue);
      }
    };
    
    // 开始动画
    animationRef.current = requestAnimationFrame(animateValue);
    
    // 清理
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // 只在组件挂载时运行一次
  
  // 创建数据
  const progressPercent = displayValue / MAX_VALUE;
  const totalAngle = 240; // 总角度范围 (startAngle - endAngle)
  
  // 角度配置 - 调整为与刻度线对应
  const startAngle = 210;
  const endAngle = -30;
  
  // 为外环创建基于角度的动画数据
  const outerRingStartAngle = startAngle;
  const outerRingCurrentAngle = startAngle - progressPercent * totalAngle;
  
  // 为细线进度条创建数据 - 使用finalValue而不是当前值
  const finalProgressPercent = finalValue / MAX_VALUE;
  const thinRingValue = [{ name: '细线进度', value: finalValue }];
  const maxValue = [{ name: '最大值', value: MAX_VALUE }];

  // 获取有效的容器尺寸
  const { width, height } = containerSize.width > 50 && containerSize.height > 50 
    ? containerSize 
    : prevSizeRef.current.width > 0 
      ? prevSizeRef.current 
      : { width: 300, height: 200 }; // 默认尺寸
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        minWidth: '100px',
        minHeight: '100px'
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* 定义渐变 */}
          <defs>
            <linearGradient id="cutTimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.YELLOW} />
              <stop offset="100%" stopColor={COLORS.ORANGE} />
            </linearGradient>
            <linearGradient id="cutTimeGradient2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.ORANGE} />
              <stop offset="100%" stopColor={COLORS.DEEP_ORANGE} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={COLORS.SHADOW} floodOpacity="0.5" />
            </filter>
          </defs>
          
          {/* 外环背景 - 灰色 */}
          <Pie
            data={[{name: '背景', value: 1}]}
            cx="50%"
            cy="65%"
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius="70%"
            outerRadius="85%"
            fill="rgba(50, 50, 50, 0.3)"
            stroke="none"
            isAnimationActive={false}
            dataKey="value"
          />
          
          {/* 细线进度条 - 不使用动画，直接显示最终结果 */}
          <Pie
            data={maxValue}
            cx="50%"
            cy="65%"
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius="87%"
            outerRadius="90%"
            fill="rgba(50, 50, 50, 0.3)"
            stroke="none"
            isAnimationActive={false}
            dataKey="value"
          />
          
          <Pie
            data={thinRingValue}
            cx="50%"
            cy="65%"
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius="87%"
            outerRadius="90%"
            fill="url(#cutTimeGradient2)"
            stroke="none"
            dataKey="value"
            isAnimationActive={false}
          />
          
          {/* 主要进度条 - 外环 - 使用角度动画 */}
          {progressPercent > 0 && (
            <Pie
              data={[{name: '进度', value: 1}]}
              cx="50%"
              cy="65%"
              startAngle={outerRingStartAngle}
              endAngle={outerRingCurrentAngle}
              innerRadius="70%"
              outerRadius="85%"
              cornerRadius={10}
              fill="url(#cutTimeGradient)" 
              stroke="none"
              isAnimationActive={false}
              filter="url(#shadow)"
              dataKey="value"
            />
          )}
          
          {/* 在SVG中绘制刻度线 - 不需要动画效果 */}
          {width > 0 && renderTicks(width, height)}
        </PieChart>
      </ResponsiveContainer>
      
      {/* 中心显示数值 */}
      <div
        style={{
          position: 'absolute',
          top: '65%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          fontSize: '55px',
          fontWeight: 'bolder',
          color: COLORS.WHITE,
          fontFamily: 'Arial',
          textShadow: '0 0 10px rgba(255,152,0,0.5)',
          userSelect: 'none'
        }}
      >
        {displayValue.toLocaleString()}
      </div>
    </div>
  );
};

// 使用React.memo包装组件以减少不必要的重渲染
const CutTimeChart = memo(CutTimeChartBase);

export default CutTimeChart; 