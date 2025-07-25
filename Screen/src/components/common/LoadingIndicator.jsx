import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * 加载指示器组件
 * @param {Object} props 组件属性
 * @param {number} props.progress 加载进度（0-100）
 * @param {string} props.message 加载消息
 * @param {boolean} props.showSpinner 是否显示加载动画
 * @returns {JSX.Element}
 */
const LoadingIndicator = ({ 
  progress = null, 
  message = null, 
  showSpinner = true 
}) => {
  const { getCommon } = useTranslation();
  
  // 使用传入的消息或默认翻译消息
  const displayMessage = message || getCommon('loading');
  // 样式定义
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      color: '#ffffff',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '4px solid rgba(255, 255, 255, 0.3)',
      borderTop: '4px solid #ff9800',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    },
    message: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px'
    },
    progressContainer: {
      width: '250px',
      height: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '10px'
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#ff9800',
      transition: 'width 0.3s ease'
    },
    progressText: {
      fontSize: '14px',
      color: '#ff9800'
    }
  };

  // 添加动画样式
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      
      {showSpinner && <div style={styles.spinner} />}
      
      <div style={styles.message}>{displayMessage}</div>
      
      {progress !== null && (
        <>
          <div style={styles.progressContainer}>
            <div 
              style={{
                ...styles.progressBar,
                width: `${progress * 100}%`
              }} 
            />
          </div>
          
          <div style={styles.progressText}>
            {Math.round(progress * 100)}%
          </div>
        </>
      )}
    </div>
  );
};

export default LoadingIndicator; 