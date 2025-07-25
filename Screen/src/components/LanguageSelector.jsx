import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setLanguage, selectLanguage } from '../store/slices/appSlice';
import { getSupportedLanguagesList, getLanguageDisplayName, setCurrentLanguage } from '../utils/i18n';

/**
 * 语言选择器组件
 * 提供语言切换功能，样式与其他导航选择器保持一致
 */
const LanguageSelector = () => {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(selectLanguage);
  const supportedLanguages = getSupportedLanguagesList();

  /**
   * 处理语言切换
   * @param {Event} event 选择事件
   */
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    
    // 更新Redux状态
    dispatch(setLanguage(newLanguage));
    
    // 保存到本地存储
    setCurrentLanguage(newLanguage);
    
    console.log(`语言已切换到: ${getLanguageDisplayName(newLanguage)}`);
  };

  return (
    <select 
      className="nav-select language-selector"
      value={currentLanguage}
      onChange={handleLanguageChange}
      title="选择语言 / Select Language"
    >
      {supportedLanguages.map((language) => (
        <option 
          key={language.code} 
          value={language.code}
        >
          {language.nativeName}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector; 