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

// 角度转换常量
const RADIAN = Math.PI / 180;

// 创建仪表盘背景数据
const createGaugeData = (min, max, segments) => {
  const data = [];
  const range = max - min;
  const segmentSize = range / segments;
  
  for (let i = 0; i < segments; i++) {
    data.push({
      name: `segment-${i}`,
      value: segmentSize,
      // 由浅黄色渐变到橙红色
      color: i < segments / 2 ? COLORS.YELLOW : COLORS.ORANGE 
    });
  }
  
  return data;
};

// 刻度线渲染器
const renderTicks = (containerWidth, containerHeight) => {
  if (!containerWidth || !containerHeight || containerWidth < 10 || containerHeight < 10) return null;
  
  const cx = containerWidth * 0.5;
  const cy = containerHeight * 0.65;
  const outerRadius = Math.min(containerWidth, containerHeight) * 0.45;
  
  // 刻度线配置
  const startAngle = 180;
  const endAngle = 0;
  const totalAngle = startAngle - endAngle;
  
  // 只显示6个主刻度（0, 2, 4, 6, 8, 10）
  const tickCount = 5;
  const subTickCount = 8; // 每个主刻度之间的小刻度数量
  
  const ticks = [];
  
  // 生成刻度线和标签
  for (let i = 0; i <= tickCount; i++) {
    const angle = startAngle - (i / tickCount) * totalAngle;
    const cos = Math.cos(-RADIAN * angle);
    const sin = Math.sin(-RADIAN * angle);
    
    // 计算刻度线坐标
    const outerPoint = outerRadius * 1.03;
    const innerPoint = outerRadius * 0.94;
    
    // 主刻度线
    ticks.push(
      <line
        key={`main-tick-${i}`}
        x1={cx + innerPoint * cos}
        y1={cy + innerPoint * sin}
        x2={cx + outerPoint * cos}
        y2={cy + outerPoint * sin}
        stroke={i <= tickCount/2 ? COLORS.YELLOW : COLORS.ORANGE}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    );
    
    // 刻度值 - 只显示偶数值 (0, 2, 4, 6, 8, 10)
    const textRadius = outerRadius * 0.74;
    const value = i * 2; // 0, 2, 4, 6, 8, 10
    
    // 调整文本对齐方式和位置
    let textAnchor = "middle";
    let xOffset = 0;
    
    // 左边数值右对齐，右边数值左对齐
    if (i === 0) {
      textAnchor = "end";
      xOffset = -2;
    } else if (i === tickCount) {
      textAnchor = "start";
      xOffset = -12; // 从正7改为负7，使"10"向左移动而不是向右
    }
    
    // 显示刻度值
    ticks.push(
      <text
        key={`tick-text-${i}`}
        x={cx + textRadius * cos + xOffset}
        y={cy + textRadius * sin}
        fill={i <= tickCount/2 ? "#f0e68c" : "#ff8c00"} // 更鲜艳的颜色
        fontSize={i === 0 || i === tickCount ? "30" : "22"}
        fontWeight="bold"
        textAnchor={textAnchor}
        dominantBaseline="middle"
        style={{textShadow: '0 0 10px rgba(255,152,0,0.5)'}}
      >
        {value}
      </text>
    );
    
    // 添加小刻度（除了最后一段）
    if (i < tickCount) {
      for (let j = 1; j < subTickCount; j++) {
        const subAngle = angle - (j / subTickCount) * (totalAngle / tickCount);
        const subCos = Math.cos(-RADIAN * subAngle);
        const subSin = Math.sin(-RADIAN * subAngle);
        
        const subOuterPoint = outerRadius * 1.02;
        const subInnerPoint = outerRadius * 0.96;
        
        // 根据位置计算颜色渐变
        const colorPos = (i * subTickCount + j) / (tickCount * subTickCount);
        let strokeColor;
        
        if (colorPos < 0.3) {
          strokeColor = "#f0e68c"; // 浅黄色
        } else if (colorPos < 0.6) {
          strokeColor = "#ffa500"; // 橙色
        } else {
          strokeColor = "#ff4500"; // 红橙色
        }
        
        ticks.push(
          <line
            key={`sub-tick-${i}-${j}`}
            x1={cx + subInnerPoint * subCos}
            y1={cy + subInnerPoint * subSin}
            x2={cx + subOuterPoint * subCos}
            y2={cy + subOuterPoint * subSin}
            stroke={strokeColor}
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.7}
          />
        );
      }
    }
  }
  
  return (
    <g>
      <defs>
        <filter id="glow-ticks" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g filter="url(#glow-ticks)">
        {ticks}
      </g>
    </g>
  );
};

// 指针生成器
const renderNeedle = (value, min, max, cx, cy, radius, color) => {
  const ratio = (value - min) / (max - min); // 值在范围中的比例
  const angle = 180 - ratio * 180; // 从180度（左侧）到0度（右侧）
  
  // 调整指针长度和宽度
  const length = radius * 0.85; 
  const sin = Math.sin(-RADIAN * angle);
  const cos = Math.cos(-RADIAN * angle);
  
  // 计算三角形指针的坐标点
  const baseWidth = radius * 0.06;
  const tipX = cx + length * cos;
  const tipY = cy + length * sin;
  
  const baseLeftX = cx - baseWidth * sin;
  const baseLeftY = cy - baseWidth * cos;
  
  const baseRightX = cx + baseWidth * sin;
  const baseRightY = cy + baseWidth * cos;
  
  // 创建三角形路径
  const path = `M ${tipX} ${tipY} L ${baseLeftX} ${baseLeftY} L ${baseRightX} ${baseRightY} Z`;
  
  // 添加发光效果
  const filter = (
    <defs>
      <filter id="glow-needle" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ff4500" />
        <stop offset="100%" stopColor="#ff8c00" />
      </linearGradient>
    </defs>
  );
  
  return (
    <g filter="url(#glow-needle)">
      {filter}
      {/* 指针 */}
      <path d={path} fill="url(#needleGradient)" />
      
      {/* 指针中心点 */}
      <circle cx={cx} cy={cy} r={radius * 0.05} fill="#ff6600" />
    </g>
  );
};

const CutSpeedChartBase = () => {
  const [displayValue, setDisplayValue] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false); // 新增：用于控制初始渲染
  const prevSizeRef = useRef({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const observerRef = useRef(null); // 新增：ResizeObserver引用
  const finalValue = 8.14;
  const animationDuration = 2000; // 匹配动画持续时间
  
  // 更新尺寸的处理函数
  const updateSize = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // 确保尺寸有效且大于最小限制
      if (width > 50 && height > 50) {
        setContainerSize({ width, height });
        prevSizeRef.current = { width, height };
        
        // 只有在第一次获取到有效尺寸时设置isReady为true
        if (!isReady) {
          setIsReady(true);
        }
      }
    }
  }, [isReady]);
  
  // 使用ResizeObserver监听尺寸变化
  useEffect(() => {
    // 初始化调用一次
    updateSize();
    
    // 创建ResizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      observerRef.current = new ResizeObserver(updateSize);
      
      if (containerRef.current) {
        observerRef.current.observe(containerRef.current);
      }
    } else {
      // 降级方案：使用resize事件
      window.addEventListener('resize', updateSize);
    }
    
    // 清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      } else {
        window.removeEventListener('resize', updateSize);
      }
    };
  }, [updateSize]);
  
  // 平滑数值动画 - 只在组件准备好后开始
  useEffect(() => {
    // 只有在组件准备好后才开始动画
    if (!isReady) return;
    
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
      const currentValue = startValue + (finalValue - startValue) * easeOutProgress;
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
  }, [isReady]); // 依赖isReady，确保在组件准备好后才开始动画
  
  // 创建仪表盘背景数据
  const gaugeData = createGaugeData(0, 10, 10);
  
  // 获取有效的容器尺寸
  const { width, height } = containerSize.width > 50 && containerSize.height > 50 
    ? containerSize 
    : prevSizeRef.current.width > 0 
      ? prevSizeRef.current 
      : { width: 0, height: 0 }; // 初始尺寸设为0，避免渲染小图表
  
  // 如果组件尚未准备好，显示一个占位符
  if (!isReady || width === 0) {
    return (
      <div ref={containerRef} style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '10%',
        minWidth: '100px',
        minHeight: '100px',
        visibility: 'hidden' // 隐藏占位符，但保留空间用于测量
      }}/>
    );
  }
  
  return (
    <div ref={containerRef} style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '10%', // 添加底部内边距
      minWidth: '100px',
      minHeight: '100px'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* 定义渐变 */}
          <defs>
            <linearGradient id="cutSpeedGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f0e68c" /> {/* 浅黄色 */}
              <stop offset="50%" stopColor="#ffa500" /> {/* 橙色 */}
              <stop offset="100%" stopColor="#ff4500" /> {/* 红橙色 */}
            </linearGradient>
          </defs>
          
          {/* 仪表盘背景 - 不可见但用于定位 */}
          <Pie
            data={gaugeData}
            cx="50%"
            cy="65%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="95%"
            paddingAngle={0}
            dataKey="value"
            isAnimationActive={false}
            fill="transparent"
            stroke="none"
          />
          
          {/* 绘制刻度线 */}
          {renderTicks(width, height)}
          
          {/* 绘制指针 */}
          {renderNeedle(
            displayValue, 
            0, 
            10, 
            width / 2, 
            height * 0.65,
            Math.min(width, height) * 0.45,
            "#ff6600" // 鲜亮的橙色
          )}
        </PieChart>
      </ResponsiveContainer>
      
      {/* 显示数值 */}
      <div
        style={{
          position: 'absolute',
          top: '65%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          textAlign: 'center',
          fontSize: '60px',
          fontWeight: '900',
          color: COLORS.WHITE,
          fontFamily: 'Arial',
          textShadow: '0 0 10px rgba(255,152,0,0.3)',
          userSelect: 'none',
          letterSpacing: '2px'
        }}
      >
        {displayValue.toFixed(2)}
      </div>
    </div>
  );
};

// 使用React.memo包装组件以减少不必要的重渲染
const CutSpeedChart = memo(CutSpeedChartBase);

export default CutSpeedChart; 