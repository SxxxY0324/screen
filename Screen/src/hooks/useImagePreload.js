import { useState, useEffect } from 'react';
import { preloadImages } from '../utils/imagePreloader';

/**
 * 图片预加载Hook
 * @param {Array} images 需要预加载的图片数组
 * @param {boolean} loadImmediately 是否立即开始加载，默认为true
 * @returns {Object} 包含加载状态、进度和控制方法
 */
const useImagePreload = (images = [], loadImmediately = true) => {
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // 开始加载方法
  const startPreloading = () => {
    if (isLoading || isComplete || !images.length) return;
    
    setIsLoading(true);
    setError(null);
    
    preloadImages(images, (progressValue) => {
      setProgress(progressValue);
    })
      .then(() => {
        setIsComplete(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  };

  // 如果设置为立即加载，在Hook挂载时开始预加载
  useEffect(() => {
    if (loadImmediately) {
      startPreloading();
    }
    
    return () => {
      // 清理工作（如果需要）
    };
  }, [loadImmediately, images.length]); // 依赖于images数组长度，避免不必要的重新加载

  return {
    isLoading,
    isComplete,
    progress, // 0-1的加载进度
    error,
    startPreloading // 手动触发预加载
  };
};

export default useImagePreload; 