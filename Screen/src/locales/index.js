/**
 * 语言资源管理
 * 提供统一的多语言支持
 */
import zh from './zh';
import en from './en';
import { getCurrentLanguage } from '../utils/i18n';

// 所有语言资源
const resources = {
  zh,
  en
};

/**
 * 获取指定语言的资源
 * @param {string} language 语言代码
 * @returns {Object} 语言资源对象
 */
export const getLanguageResource = (language) => {
  return resources[language] || resources.zh;
};

/**
 * 获取当前语言资源
 * @returns {Object} 当前语言资源对象
 */
export const getCurrentLanguageResource = () => {
  const currentLang = getCurrentLanguage();
  return getLanguageResource(currentLang);
};

/**
 * 根据路径获取翻译文本
 * @param {string} path 文本路径，如 'nav.monitoring'
 * @param {Object} variables 要替换的变量，如 {count: 5}
 * @param {string} language 指定语言（可选）
 * @returns {string} 翻译后的文本
 */
export const t = (path, variables = {}, language = null) => {
  const targetLang = language || getCurrentLanguage();
  const resource = getLanguageResource(targetLang);
  
  // 按路径获取文本
  const keys = path.split('.');
  let result = resource;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && result.hasOwnProperty(key)) {
      result = result[key];
    } else {
      // 如果找不到翻译，返回路径本身
      console.warn(`Translation not found for path: ${path} in language: ${targetLang}`);
      return path;
    }
  }
  
  // 如果结果不是字符串，返回路径
  if (typeof result !== 'string') {
    console.warn(`Translation result is not a string for path: ${path}`);
    return path;
  }
  
  // 替换变量
  let translatedText = result;
  Object.keys(variables).forEach(key => {
    const placeholder = `{${key}}`;
    translatedText = translatedText.replace(new RegExp(placeholder, 'g'), variables[key]);
  });
  
  return translatedText;
};

/**
 * 获取监控状态的翻译
 * @param {string} status 状态键
 * @param {string} language 指定语言（可选）
 * @returns {string} 翻译后的状态文本
 */
export const getStatusText = (status, language = null) => {
  return t(`monitor.status.${status}`, {}, language);
};

/**
 * 获取时间范围选项的翻译
 * @param {string} timeRangeKey 时间范围键
 * @param {string} language 指定语言（可选）
 * @returns {string} 翻译后的时间范围文本
 */
export const getTimeRangeText = (timeRangeKey, language = null) => {
  return t(`timeRange.${timeRangeKey}`, {}, language);
};

/**
 * 获取表格列头的翻译
 * @param {string} headerKey 列头键
 * @param {string} language 指定语言（可选）
 * @returns {string} 翻译后的列头文本
 */
export const getTableHeaderText = (headerKey, language = null) => {
  return t(`table.headers.${headerKey}`, {}, language);
};

export { zh, en };
export default {
  getLanguageResource,
  getCurrentLanguageResource,
  t,
  getStatusText,
  getTimeRangeText,
  getTableHeaderText
}; 