/**
 * 应用初始化工具
 * 执行应用启动时的预加载和初始化配置
 */
import imagePreloader from './imagePreloader';
import imageCache from './imageCache';

/**
 * 预热应用
 * 在应用启动时执行预加载和初始化配置
 * @param {Function} progressCallback 进度回调函数
 * @returns {Promise} 初始化完成的Promise
 */
export const warmupApp = async (progressCallback) => {
  try {
    // 1. 首先加载最重要的底部图片（优先级最高）
    await imagePreloader.preloadBottomRowImages();
    
    if (progressCallback) {
      progressCallback(0.3);
    }
    
    // 2. 然后加载所有图片
    await imagePreloader.preloadAllImages((progress) => {
      // 从30%到90%的进度
      if (progressCallback) {
        progressCallback(0.3 + progress * 0.6);
      }
    });
    
    if (progressCallback) {
      progressCallback(0.9);
    }
    
    // 3. 执行其他初始化操作
    // ... 例如：预取初始API数据、配置全局设置等
    
    // 模拟其他初始化操作
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (progressCallback) {
      progressCallback(1.0);
    }
    
    return {
      success: true,
      stats: imageCache.getStatus()
    };
  } catch (error) {
    console.error('应用预热失败:', error);
    return {
      success: false,
      error: error.message,
      stats: imageCache.getStatus()
    };
  }
};

export default {
  warmupApp
}; 