/**
 * 国际化工具
 * 提供多语言支持功能
 */

// 支持的语言列表
export const SUPPORTED_LANGUAGES = {
  zh: {
    code: 'zh',
    name: '中文',
    nativeName: '中文'
  },
  en: {
    code: 'en', 
    name: 'English',
    nativeName: 'English'
  }
};

// 默认语言
export const DEFAULT_LANGUAGE = 'zh';

// 本地存储键名
const LANGUAGE_STORAGE_KEY = 'jw-mes-language';

/**
 * 获取当前选择的语言
 * @returns {string} 语言代码
 */
export const getCurrentLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn('无法从本地存储读取语言设置:', error);
  }
  
  return DEFAULT_LANGUAGE;
};

/**
 * 设置当前语言
 * @param {string} languageCode 语言代码
 */
export const setCurrentLanguage = (languageCode) => {
  if (!SUPPORTED_LANGUAGES[languageCode]) {
    console.warn('不支持的语言代码:', languageCode);
    return;
  }
  
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    console.warn('无法保存语言设置到本地存储:', error);
  }
};

/**
 * 获取语言显示名称
 * @param {string} languageCode 语言代码
 * @returns {string} 语言显示名称
 */
export const getLanguageDisplayName = (languageCode) => {
  const language = SUPPORTED_LANGUAGES[languageCode];
  return language ? language.nativeName : languageCode;
};

/**
 * 获取所有支持的语言列表
 * @returns {Array} 语言列表
 */
export const getSupportedLanguagesList = () => {
  return Object.values(SUPPORTED_LANGUAGES);
};

export default {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  getCurrentLanguage,
  setCurrentLanguage,
  getLanguageDisplayName,
  getSupportedLanguagesList
}; 