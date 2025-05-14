import React from 'react';
import '../App.css';

// 导入背景图片
import cutTimeImg from '../assets/images/裁剪时间.jpg';
import cutSpeedImg from '../assets/images/裁剪速度.jpg';
import totalEnergyImg from '../assets/images/总能耗.jpg';
import totalPerimeterImg from '../assets/images/总周长.jpg';
import cutSetsImg from '../assets/images/裁剪套数.jpg';
import 移动率MUImg from '../assets/images/移动率MU.jpg';
import 裁床运行情况Img from '../assets/images/裁床运行情况.jpg';
import 各裁床运行状态Img from '../assets/images/各裁床运行状态.jpg';

function MonitorPage() {
  return (
    <>
      <div className="dashboard-grid">
        <div className="card-efficiency">
          <img src={移动率MUImg} className="card-image" alt="移动率MU" />
        </div>
        <div className="card-cuttime">
          <img src={cutTimeImg} className="card-image" alt="裁剪时间" />
        </div>
        <div className="card-energy">
          <img src={totalEnergyImg} className="card-image" alt="总能耗" />
        </div>
        <div className="card-cutspeed">
          <img src={cutSpeedImg} className="card-image" alt="裁剪速度" />
        </div>
        <div className="card-perimeter">
          <img src={totalPerimeterImg} className="card-image" alt="总周长" />
        </div>
        <div className="card-cutsets">
          <img src={cutSetsImg} className="card-image" alt="裁剪套数" />
        </div>
        <div className="card-status">
          {/* 上部分：各裁床运行状态 */}
          <img 
            src={各裁床运行状态Img}
            className="cutting-status-image"
            alt="各裁床运行状态"
          />
          
          {/* 下部分：裁床运行情况 */}
          <img 
            src={裁床运行情况Img}
            className="status-image"
            alt="裁床运行情况"
          />
        </div>
      </div>
    </>
  );
}

export default MonitorPage; 