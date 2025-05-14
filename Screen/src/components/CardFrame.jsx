import React from 'react';
import '../styles/CardFrame.css';

function CardFrame({ children, backgroundImage, customStyle = {} }) {
  // 合并基本图片样式和自定义样式
  const cardStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    ...customStyle
  } : {};

  return (
    <div className="card-frame-wrapper">
      <div 
        className="card-frame"
        style={cardStyle}
      >
        {children}
      </div>
    </div>
  );
}

export default CardFrame; 