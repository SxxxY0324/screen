import { useState, useEffect, useRef } from 'react';
import Taro from '@tarojs/taro';
import { RENDER_DELAY_WEAPP, RENDER_DELAY_H5 } from '../constants/chart';

/**
 * 环境检测钩子 - 检测当前运行环境并提供相应延迟时间
 * @returns 环境相关的信息和工具方法
 */
export function useEnvironment() {
  // 是否为微信小程序环境
  const [isWeapp, setIsWeapp] = useState(false);
  // 延迟定时器引用
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 检测环境类型
  useEffect(() => {
    const isInWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP;
    setIsWeapp(isInWeapp);
    
    // 清除组件卸载时的定时器
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * 获取基于环境的延迟值
   * @returns 适合当前环境的延迟时间（毫秒）
   */
  const getRenderDelay = (): number => {
    return isWeapp ? RENDER_DELAY_WEAPP : RENDER_DELAY_H5;
  };

  /**
   * 根据当前环境执行延迟函数
   * @param callback 延迟执行的函数
   */
  const executeWithDelay = (callback: () => void) => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 设置新的定时器
    const delay = getRenderDelay();
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  };

  return { 
    isWeapp,
    getRenderDelay,
    executeWithDelay,
    timeoutRef
  };
} 