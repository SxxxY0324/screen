/**
 * 图表工具函数
 */

/**
 * 确保值是有效的数字并格式化
 * @param {any} value - 输入值
 * @param {number} defaultValue - 默认值（如果输入无效）
 * @param {number} decimals - 小数位数
 * @returns {number} 格式化后的数字值
 */
export const ensureValidNumber = (value, defaultValue = 0, decimals = 2) => {
  // 如果值是null或undefined，返回默认值
  if (value == null) return defaultValue;
  
  // 尝试转换为数字
  const num = parseFloat(value);
  
  // 如果转换结果不是有效数字，返回默认值
  if (isNaN(num)) return defaultValue;
  
  // 返回保留指定小数位的数字
  return Number(num.toFixed(decimals));
};

/**
 * 处理百分比数据，确保在0-100范围内
 * @param {any} value - 输入的百分比值
 * @param {number} defaultValue - 默认值
 * @returns {number} 处理后的百分比值(0-100)
 */
export const ensureValidPercentage = (value, defaultValue = 0) => {
  const num = ensureValidNumber(value, defaultValue);
  return Math.max(0, Math.min(100, num));
}; 