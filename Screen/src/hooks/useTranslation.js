import { useSelector } from 'react-redux';
import { selectLanguage } from '../store/slices/appSlice';
import { t, getStatusText, getTimeRangeText, getTableHeaderText } from '../locales';

/**
 * 翻译Hook
 * 提供组件级别的翻译功能，自动响应语言变化
 * @returns {Object} 翻译函数集合
 */
export const useTranslation = () => {
  const currentLanguage = useSelector(selectLanguage);

  /**
   * 基础翻译函数
   * @param {string} path 翻译路径
   * @param {Object} variables 变量替换对象
   * @returns {string} 翻译后的文本
   */
  const translate = (path, variables = {}) => {
    return t(path, variables, currentLanguage);
  };

  /**
   * 获取状态翻译
   * @param {string} status 状态键
   * @returns {string} 翻译后的状态文本
   */
  const getStatus = (status) => {
    return getStatusText(status, currentLanguage);
  };

  /**
   * 获取时间范围翻译
   * @param {string} timeRangeKey 时间范围键
   * @returns {string} 翻译后的时间范围文本
   */
  const getTimeRange = (timeRangeKey) => {
    return getTimeRangeText(timeRangeKey, currentLanguage);
  };

  /**
   * 获取表格列头翻译
   * @param {string} headerKey 列头键
   * @returns {string} 翻译后的列头文本
   */
  const getTableHeader = (headerKey) => {
    return getTableHeaderText(headerKey, currentLanguage);
  };

  /**
   * 获取导航菜单翻译
   * @param {string} navKey 导航键
   * @returns {string} 翻译后的导航文本
   */
  const getNav = (navKey) => {
    return translate(`nav.${navKey}`);
  };

  /**
   * 获取监控指标翻译
   * @param {string} metricKey 指标键
   * @returns {string} 翻译后的指标文本
   */
  const getMonitor = (metricKey) => {
    return translate(`monitor.${metricKey}`);
  };

  /**
   * 获取维保管理翻译
   * @param {string} maintenanceKey 维保管理键
   * @returns {string} 翻译后的维保管理文本
   */
  const getMaintenance = (maintenanceKey) => {
    return translate(`maintenance.${maintenanceKey}`);
  };

  /**
   * 获取业绩分析翻译
   * @param {string} analysisKey 业绩分析键
   * @returns {string} 翻译后的业绩分析文本
   */
  const getAnalysis = (analysisKey) => {
    return translate(`analysis.${analysisKey}`);
  };

  /**
   * 获取通用文本翻译
   * @param {string} commonKey 通用文本键
   * @returns {string} 翻译后的通用文本
   */
  const getCommon = (commonKey) => {
    return translate(`common.${commonKey}`);
  };

  /**
   * 获取消息提示翻译
   * @param {string} messageKey 消息键
   * @returns {string} 翻译后的消息文本
   */
  const getMessage = (messageKey) => {
    return translate(`messages.${messageKey}`);
  };

  return {
    t: translate,
    getStatus,
    getTimeRange,
    getTableHeader,
    getNav,
    getMonitor,
    getMaintenance,
    getAnalysis,
    getCommon,
    getMessage,
    currentLanguage
  };
};

export default useTranslation; 