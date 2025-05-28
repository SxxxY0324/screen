import React, { useState, useEffect, memo } from 'react';
import imageCache from '../../utils/imageCache';

/**
 * 缓存优化的图片组件
 * 使用图片缓存系统，提供加载状态和平滑过渡
 * 
 * @param {Object} props 组件属性
 * @param {string} props.src 图片路径
 * @param {string} props.alt 图片替代文本
 * @param {string} props.className 样式类名
 * @param {Object} props.style 内联样式
 * @param {boolean} props.lazy 是否懒加载 (默认: false)
 * @param {string} props.placeholder 占位图片URL
 * @param {Function} props.onLoad 图片加载完成回调
 * @param {Function} props.onError 图片加载失败回调
 * @returns {React.Element} React组件
 */
const CachedImage = ({
  src,
  alt = '',
  className = '',
  style = {},
  lazy = false,
  placeholder = null,
  onLoad = null,
  onError = null,
  ...rest
}) => {
  // 状态管理
  const [loaded, setLoaded] = useState(imageCache.isLoaded(src));
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(placeholder || (loaded ? src : null));
  
  // 样式
  const combinedStyle = {
    ...style,
    opacity: loaded ? 1 : 0.3,
    transition: 'opacity 0.3s ease-in-out',
    willChange: 'opacity',
  };
  
  // 加载图片
  useEffect(() => {
    if (!src || (lazy && !isInViewport())) return;
    
    let isMounted = true;
    
    const loadImage = async () => {
      try {
        // 使用缓存系统加载图片
        await imageCache.preload(src);
        
        // 确保组件仍然挂载
        if (isMounted) {
          setLoaded(true);
          setImgSrc(src);
          if (onLoad) onLoad();
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          if (onError) onError(err);
        }
      }
    };
    
    // 如果未加载，则执行加载
    if (!loaded) {
      loadImage();
    }
    
    return () => {
      isMounted = false;
    };
  }, [src, lazy, onLoad, onError]);
  
  // 简单检查元素是否在视口内（懒加载用）
  const isInViewport = () => {
    // 实际项目中可能需要更复杂的方法或IntersectionObserver
    return true;
  };
  
  // 渲染错误状态
  if (error) {
    return (
      <div 
        className={`cached-image-error ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#151515',
          color: '#ff6b00',
          width: '100%',
          height: '100%',
          fontSize: '14px',
          ...style
        }}
      >
        图片加载失败
      </div>
    );
  }
  
  // 返回图片元素
  return (
    <img
      src={imgSrc || placeholder}
      alt={alt}
      className={`cached-image ${className}`}
      style={combinedStyle}
      {...rest}
    />
  );
};

// 为组件添加显示名称
CachedImage.displayName = 'CachedImage';

// 使用memo优化，只在属性变化时重新渲染
export default memo(CachedImage); 