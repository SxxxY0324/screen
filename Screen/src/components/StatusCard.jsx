import React from 'react';
import '../styles/StatusCard.css';
import backgroundImage from '../assets/images/裁床运行情况.jpg';

function StatusCard() {
  return (
    <div className="status-card">
      <div className="status-content">
        <img 
          src={backgroundImage}
          className="status-image"
          alt="裁床运行情况"
        />
      </div>
    </div>
  );
}

export default StatusCard; 