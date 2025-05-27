/**
 * 图表工具函数
 */

// 控制是否输出详细日志 - 设置为false以关闭所有日志
const DEBUG_LOG = false;

/**
 * 确保值是有效的数字并格式化
 * @param {any} value - 输入值
 * @param {number} defaultValue - 默认值（如果输入无效）
 * @param {number} decimals - 小数位数
 * @param {boolean} isInitialized - 数据是否已初始化
 * @returns {number|null} 格式化后的数字值，如果数据未初始化且值为null则返回null
 */
export const ensureValidNumber = (value, defaultValue = 0, decimals = 2, isInitialized = true) => {
  // 完全禁用日志以避免重复输出
  // 如果需要调试，再改为true
  const ENABLE_LOGS = false;
  
  // 情况1: 数据未初始化且值为null，显示加载状态
  if (value === null && !isInitialized) {
    return null;
  }
  
  // 情况2: 直接是数字类型
  if (typeof value === 'number' && !isNaN(value)) {
    // 对于小数，保留指定的小数位数
    if (ENABLE_LOGS) {
      console.log(`处理数字: ${value} -> ${Number(value.toFixed(decimals))}`);
    }
    return Number(value.toFixed(decimals));
  }
  
  // 情况3: 可转换为数字的字符串
  if (typeof value === 'string') {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      if (ENABLE_LOGS) {
        console.log(`处理字符串: ${value} -> ${Number(num.toFixed(decimals))}`);
      }
      return Number(num.toFixed(decimals));
    }
  }
  
  // 情况4: 所有其他情况
  if (ENABLE_LOGS) {
    console.log(`使用默认值: ${value} -> ${defaultValue}`);
  }
  return defaultValue;
};

/**
 * 处理百分比数据，确保在0-100范围内
 * @param {any} value - 输入的百分比值
 * @param {number} defaultValue - 默认值
 * @param {boolean} isInitialized - 数据是否已初始化
 * @returns {number|null} 处理后的百分比值(0-100)，如果数据未初始化且值为null则返回null
 */
export const ensureValidPercentage = (value, defaultValue = 0, isInitialized = true) => {
  // 完全禁用日志以避免重复输出
  
  const num = ensureValidNumber(value, defaultValue, 2, isInitialized);
  
  // 如果ensureValidNumber返回null，保持null状态
  if (num === null) {
    return null;
  }
  
  return Math.max(0, Math.min(100, num));
}; 