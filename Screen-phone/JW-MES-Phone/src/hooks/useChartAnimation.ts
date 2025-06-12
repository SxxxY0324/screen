import { useState, useRef, useEffect, useMemo } from 'react';
import { ANIMATION_DURATION } from '../constants/chart';

/**
 * 图表动画钩子 - 处理单值动画
 * @param targetValue 目标值
 * @param isVisible 组件是否可见
 * @param onAnimationEnd 动画结束回调
 * @returns 动画值和动画状态
 */
export function useValueAnimation(
  targetValue: number,
  isVisible: boolean = true,
  onAnimationEnd?: () => void
) {
  // 动画进度值
  const [animatedValue, setAnimatedValue] = useState(0);
  // 动画帧引用
  const animationFrameRef = useRef<number | null>(null);
  // 是否正在加载
  const [isAnimating, setIsAnimating] = useState(true);

  // 启动值动画
  const startValueAnimation = (targetVal: number) => {
    // 清除之前的动画
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // 标记为加载中
    setIsAnimating(true);
    
    // 从0到目标值的平滑动画
    let currentValue = 0;
    const duration = ANIMATION_DURATION;
    const startTime = Date.now();
    
    const animateValue = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed < duration) {
        // 使用easeOutQuad缓动函数
        const progress = elapsed / duration;
        const easedProgress = 1 - (1 - progress) * (1 - progress);
        currentValue = easedProgress * targetVal;
        
        setAnimatedValue(currentValue);
        
        // 继续动画
        animationFrameRef.current = requestAnimationFrame(animateValue);
      } else {
        // 动画结束，设置最终值
        setAnimatedValue(targetVal);
        setIsAnimating(false);
        
        // 调用动画结束回调
        if (onAnimationEnd) {
          onAnimationEnd();
        }
      }
    };
    
    // 开始动画
    animationFrameRef.current = requestAnimationFrame(animateValue);
  };

  // 组件卸载时清除动画
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 当目标值变化或组件变为可见时重新启动动画
  useEffect(() => {
    if (isVisible) {
      startValueAnimation(targetValue);
    }
  }, [targetValue, isVisible]);

  return { animatedValue, isAnimating };
}

/**
 * 数组深度比较函数
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 是否相等
 */
function arraysEqual(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, index) => val === arr2[index]);
}

/**
 * 图表动画钩子 - 处理数组值动画
 * @param targetValues 目标值数组
 * @param isVisible 组件是否可见
 * @param onAnimationEnd 动画结束回调
 * @returns 动画值数组和动画状态
 */
export function useValuesAnimation(
  targetValues: number[],
  isVisible: boolean = true,
  onAnimationEnd?: () => void
) {
  // 动画进度值数组
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);
  // 动画帧引用
  const animationFrameRef = useRef<number | null>(null);
  // 是否正在加载
  const [isAnimating, setIsAnimating] = useState(true);
  // 超时定时器引用
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // 记录上一次的目标值，用于深度比较
  const prevTargetValuesRef = useRef<number[]>([]);

  // 使用 useMemo 来稳定数组引用，只有在数组内容真正变化时才更新
  const stableTargetValues = useMemo(() => {
    if (arraysEqual(targetValues, prevTargetValuesRef.current)) {
      return prevTargetValuesRef.current;
    }
    prevTargetValuesRef.current = [...targetValues];
    return prevTargetValuesRef.current;
  }, [targetValues]);

  // 启动值动画
  const startValuesAnimation = (targetVals: number[]) => {
    // 清除之前的动画和超时
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 如果数组为空，直接完成
    if (targetVals.length === 0) {
      setAnimatedValues([]);
      setIsAnimating(false);
      if (onAnimationEnd) {
        onAnimationEnd();
      }
      return;
    }
    
    // 标记为加载中
    setIsAnimating(true);
    
    // 从0到目标值的平滑动画
    const duration = ANIMATION_DURATION;
    const startTime = Date.now();
    
    // 设置超时保护，防止动画永不结束
    timeoutRef.current = setTimeout(() => {
      setAnimatedValues([...targetVals]);
      setIsAnimating(false);
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    }, duration + 1000); // 比动画时间多1秒作为容错
    
    const animateValues = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed < duration) {
        // 使用easeOutQuad缓动函数
        const progress = elapsed / duration;
        const easedProgress = 1 - (1 - progress) * (1 - progress);
        
        const currentValues = targetVals.map(target => easedProgress * target);
        setAnimatedValues(currentValues);
        
        // 继续动画
        animationFrameRef.current = requestAnimationFrame(animateValues);
      } else {
        // 动画结束，清除超时并设置最终值
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        setAnimatedValues([...targetVals]);
        setIsAnimating(false);
        
        // 调用动画结束回调
        if (onAnimationEnd) {
          onAnimationEnd();
        }
      }
    };
    
    // 开始动画
    animationFrameRef.current = requestAnimationFrame(animateValues);
  };

  // 组件卸载时清除动画和超时
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 当目标值变化或组件变为可见时重新启动动画
  useEffect(() => {
    if (isVisible) {
      startValuesAnimation(stableTargetValues);
    }
  }, [stableTargetValues, isVisible]);

  return { animatedValues, isAnimating };
} 