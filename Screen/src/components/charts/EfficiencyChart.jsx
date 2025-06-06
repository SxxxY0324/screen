import React, { useState, memo, useRef, useEffect, useCallback } from 'react';
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
  // 状态与引用
  const [displayValue, setDisplayValue] = useState(0); // 动画显示值
  const [hovered, setHovered] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);
  const prevSizeRef = useRef({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const observerRef = useRef(null);
  const isDataInitialized = useAppSelector(selectIsDataInitialized);
  
  // 确保值是有效的百分比
  const validValue = ensureValidPercentage(value, value === null ? 0 : value, isDataInitialized);
  const finalValueRef = useRef(validValue !== null ? validValue : 0);
  
  // 当传入的value变化时更新finalValueRef
  useEffect(() => {
    if (validValue !== null) {
      finalValueRef.current = validValue;
    }
  }, [validValue]);

  // 尺寸更新处理函数
  const updateSize = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      if (width > 50 && height > 50) {
        setContainerSize({ width, height });
        prevSizeRef.current = { width, height };
        
        if (!isReady) {
          setIsReady(true);
        }
      }
    }
  }, [isReady]);
  
  // 使用ResizeObserver监听尺寸变化
  useEffect(() => {
    // 立即调用一次
    updateSize();
    
    // 创建ResizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      observerRef.current = new ResizeObserver(entries => {
        if (entries && entries.length > 0) {
          updateSize();
        }
      });
      
      if (containerRef.current) {
        observerRef.current.observe(containerRef.current);
      }
    } else {
      // 降级方案：使用resize事件
      window.addEventListener('resize', updateSize);
    }
    
    // 清理函数
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      } else {
        window.removeEventListener('resize', updateSize);
      }
    };
  }, [updateSize]);
  
  // 数值动画效果
  useEffect(() => {
    if (!isReady || validValue === null) return;
    
    let startTime = null;
    const startValue = displayValue;
    const animationDuration = 1500;
    
    const animateValue = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // 计算动画进度 (0 到 1)
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // 缓出效果
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // 计算当前显示值
      const currentValue = startValue + (finalValueRef.current - startValue) * easeProgress;
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
  }, [isReady, validValue, finalValueRef.current]);
  
  // 获取有效的容器尺寸
  const { width, height } = containerSize.width > 50 && containerSize.height > 50 
    ? containerSize 
    : prevSizeRef.current.width > 0 
      ? prevSizeRef.current 
      : { width: 0, height: 0 };
  
  // 如果组件未准备好，显示占位符
  if (!isReady || width === 0 || validValue === null) {
    return (
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%',
          minWidth: '100px',
          minHeight: '100px',
          visibility: validValue === null ? 'visible' : 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: COLORS.WHITE,
          backgroundColor: validValue === null ? 'rgba(0,0,0,0.3)' : 'transparent'
        }}
      >
        {validValue === null && '正在加载数据...'}
      </div>
    );
  }
  
  // 使用动画显示值
  const muValue = displayValue.toFixed(2);
  const remainingValue = (100 - parseFloat(muValue)).toFixed(2);
  
  // 饼图数据
  const data = [
    { name: "已使用", value: parseFloat(muValue) },
    { name: "剩余", value: parseFloat(remainingValue) }
  ];
  
  // 标签尺寸自适应
  const fontSizeBase = Math.min(width, height) * 0.18;
  const fontSize = hovered ? fontSizeBase * 1.1 : fontSizeBase;
  const fontSizeCapped = Math.min(Math.max(fontSize, 24), 48);
  
  // 中心标签样式
  const centerLabelStyle = {
    fontSize: `${fontSizeCapped}px`,
    fontWeight: hovered ? 'bolder' : 'bold',
    fill: COLORS.WHITE,
    transition: 'all 0.3s ease'
  };
  
  // 饼图尺寸自适应
  const innerRadius = Math.min(width, height) * 0.35;
  const outerRadius = Math.min(width, height) * 0.45;
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        minWidth: '100px',
        minHeight: '100px',
      }}
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
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            cornerRadius={10}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            animationDuration={1000}
            animationEasing="ease-out"
            filter="url(#glow)"
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

// 添加组件显示名称，便于调试
EfficiencyChart.displayName = 'EfficiencyChart';

// 使用memo优化性能，避免不必要的重渲染
export default memo(EfficiencyChart); 