import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
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

// 最大刻度值 - 调整为更合适的小时单位
const MAX_VALUE = 1000; // 最大显示1000小时

// 增强版刻度线渲染器
const renderTicks = (containerWidth, containerHeight) => {
  if (!containerWidth || !containerHeight || containerWidth < 10 || containerHeight < 10) return null;
  
  // 根据容器尺寸计算中心点和半径
  const cx = containerWidth * 0.5;
  const cy = containerHeight * 0.65; // 与Pie组件的cy对应
  const outerRadius = Math.min(containerWidth, containerHeight) * 0.45; // 增加半径从0.42到0.48，使刻度线与放大后的圆环匹配
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
    const tickOuterRadius = outerRadius * 1.06; // 增加倍数从1.03到1.06，使刻度线更接近容器边缘
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

const CutTimeChartBase = ({ value = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false); // 新增：用于控制初始渲染
  const [hovered, setHovered] = useState(false); // 新增：悬停状态
  const prevSizeRef = useRef({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const observerRef = useRef(null); // 新增：ResizeObserver引用
  const finalValueRef = useRef(value); // 使用传入的值
  const animationDuration = 2500; // 动画持续时间
  
  // 当传入的value改变时更新finalValueRef
  useEffect(() => {
    finalValueRef.current = value;
  }, [value]);

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
  
  // 平滑数值动画 - 只在组件准备好后开始或者当value变化时
  useEffect(() => {
    // 只有在组件准备好后才开始动画
    if (!isReady) return;
    
    let startTime = null;
    let startValue = displayValue; // 从当前显示值开始
    
    const animateValue = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // 计算动画进度 (0 到 1)
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // 使用缓动函数使动画更平滑
      const easeOutProgress = 1 - Math.pow(1 - progress, 3); // 缓出效果
      
      // 计算当前显示值
      const currentValue = Math.round(startValue + (finalValueRef.current - startValue) * easeOutProgress);
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
  }, [isReady, value]); // 添加value作为依赖
  
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
  const finalProgressPercent = finalValueRef.current / MAX_VALUE;
  const thinRingValue = [{ name: '细线进度', value: finalValueRef.current }];
  const maxValue = [{ name: '最大值', value: MAX_VALUE }];

  // 获取有效的容器尺寸
  const { width, height } = containerSize.width > 50 && containerSize.height > 50 
    ? containerSize 
    : prevSizeRef.current.width > 0 
      ? prevSizeRef.current 
      : { width: 0, height: 0 }; // 初始尺寸设为0，避免渲染小图表
  
  // 如果组件尚未准备好，显示一个占位符
  if (!isReady || width === 0) {
    return (
      <div 
        ref={containerRef} 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%',
          minWidth: '100px',
          minHeight: '100px',
          visibility: 'hidden' // 隐藏占位符，但保留空间用于测量
        }}
      />
    );
  }
  
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
            innerRadius="80%"
            outerRadius="95%"
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
            innerRadius="96%"
            outerRadius="98%"
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
            innerRadius="96%"
            outerRadius="98%"
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
              innerRadius="80%"
              outerRadius="95%"
              cornerRadius={10}
              fill="url(#cutTimeGradient)" 
              stroke="none"
              isAnimationActive={false}
              filter="url(#shadow)"
              dataKey="value"
            />
          )}
          
          {/* 在SVG中绘制刻度线 - 不需要动画效果 */}
          {renderTicks(width, height)}
        </PieChart>
      </ResponsiveContainer>
      
      {/* 中心显示数值 - 改为动态计算字体大小 */}
      <div
        style={{
          position: 'absolute',
          top: '65%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          fontSize: `${Math.min(Math.max(Math.min(width, height) * 0.32, 30), 95)}px`, // 进一步增加字体大小系数从0.28到0.32
          fontWeight: hovered ? 'bolder' : 'bold',
          color: COLORS.WHITE,
          fontFamily: 'Arial',
          textShadow: '0 0 10px rgba(255,152,0,0.5)',
          userSelect: 'none',
          transition: 'all 0.3s ease'
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