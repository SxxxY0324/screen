import React from 'react';
import MetricCard from '../MetricCard';

// 导入图片
import faultCountImg from '../../assets/images/故障台数.jpg';
import faultTimesImg from '../../assets/images/故障次数.jpg';
import faultDurationImg from '../../assets/images/故障时长.jpg';
import avgFaultTimeImg from '../../assets/images/平均故障时长.jpg';

/**
 * 维保管理页面顶部指标面板组件
 * 显示四个关键维保指标：故障台数、故障次数、故障时长、平均故障时长
 */
const MetricsPanel = ({ 
  faultCount, 
  faultTimes, 
  faultDuration, 
  avgFaultTime 
}) => {
  return (
    <div className="metrics-row">
      {/* 故障台数 */}
      <MetricCard
        title="故障台数"
        value={faultCount}
        unit="台"
        bgImage={faultCountImg}
        className="fault-count-card"
      />
      
      {/* 故障次数 */}
      <MetricCard
        title="故障次数"
        value={faultTimes}
        unit="次"
        bgImage={faultTimesImg}
        className="fault-count-card"
      />
      
      {/* 故障时长 */}
      <MetricCard
        title="故障时长"
        value={faultDuration}
        unit="H"
        bgImage={faultDurationImg}
        className="fault-count-card"
      />
      
      {/* 平均故障时长 */}
      <MetricCard
        title="平均故障时长"
        value={avgFaultTime}
        unit="H"
        bgImage={avgFaultTimeImg}
        className="fault-count-card"
      />
    </div>
  );
};

export default MetricsPanel; 