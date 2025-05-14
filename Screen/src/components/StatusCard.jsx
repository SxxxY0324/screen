import React from 'react';
import '../styles/StatusCard.css';
import backgroundImage from '../assets/images/裁床运行情况.jpg';
import cuttingMachineStatusImg from '../assets/images/各裁床运行状态.jpg';

function StatusCard() {
  return (
    <div className="status-card">
      <div className="status-header">
        <img 
          src={cuttingMachineStatusImg}
          className="cutting-status-image"
          alt="各裁床运行状态"
        />
      </div>
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