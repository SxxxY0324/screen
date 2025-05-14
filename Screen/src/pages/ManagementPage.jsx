import React from 'react';
import '../App.css';

// 导入图片
import faultCountImg from '../assets/images/故障台数.jpg';
import faultTimesImg from '../assets/images/故障次数.jpg';
import faultDurationImg from '../assets/images/故障时长.jpg';
import avgFaultTimeImg from '../assets/images/平均故障时长.jpg';
import bladeLifeImg from '../assets/images/刀片和磨刀棒寿命.jpg';
import faultListImg from '../assets/images/当前设备故障清单.jpg';

function ManagementPage() {
  return (
    <>
      {/* 顶部指标行 - 四个卡片水平排列 */}
      <div className="metrics-row">
        {/* 故障台数 */}
        <div className="metric-card">
          <img src={faultCountImg} className="card-image" alt="故障台数" />
        </div>
        
        {/* 故障次数 */}
        <div className="metric-card">
          <img src={faultTimesImg} className="card-image" alt="故障次数" />
        </div>
        
        {/* 故障时长 */}
        <div className="metric-card">
          <img src={faultDurationImg} className="card-image" alt="故障时长" />
        </div>
        
        {/* 平均故障时长 */}
        <div className="metric-card">
          <img src={avgFaultTimeImg} className="card-image" alt="平均故障时长" />
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="management-grid">
        {/* 刀片和磨刀棒寿命 */}
        <div className="card-blade">
          <img src={bladeLifeImg} className="card-image" alt="刀片和磨刀棒寿命" />
        </div>
        
        {/* 当前设备故障清单 */}
        <div className="card-fault">
          <img src={faultListImg} className="card-image" alt="当前设备故障清单" />
        </div>
      </div>
    </>
  );
}

export default ManagementPage; 