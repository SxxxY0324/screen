import React from 'react';
import '../styles/EmptyCard.css';

function EmptyCard({ backgroundImage }) {
  return (
    <div className="empty-card-container">
      <img 
        src={backgroundImage} 
        className="card-image" 
        alt="卡片信息" 
      />
    </div>
  );
}

export default EmptyCard; 