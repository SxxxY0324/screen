import React from 'react';
import '../App.css';
import { EfficiencyChart, EnergyChart, PerimeterChart, CutTimeChart, CutSpeedChart } from '../components/charts';
import StatusIcon, { COLORS } from '../components/StatusIcon';
import StatusTable from '../components/StatusTable';
import { 
  tableData, 
  tableHeaders, 
  deviceStatusData, 
  statusLegendItems,
  cutSetsValue
} from '../data/monitorData';

// 导入背景图片
import cutTimeImg from '../assets/images/裁剪时间.jpg';
import cutSpeedImg from '../assets/images/裁剪速度.jpg';
import totalEnergyImg from '../assets/images/总能耗.jpg';
import totalPerimeterImg from '../assets/images/总周长.jpg';
import cutSetsImg from '../assets/images/裁剪套数.jpg';
import cutSetsIconImg from '../assets/images/裁剪套数图标.jpg';
import 移动率MUImg from '../assets/images/移动率MU.jpg';
import 裁床运行情况Img from '../assets/images/裁床运行情况.jpg';
import 各裁床运行状态标题Img from '../assets/images/各裁床运行状态标题.jpg';

// 提取样式常量，减少内联样式
const STYLES = {
  chartOverlay: {
    position: 'absolute',
    top: '45px',
    left: 0,
    width: '100%',
    height: '90%',
    zIndex: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cutSetsOverlay: {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    padding: '0 5% 0 15%'
  },
  cutSetsIcon: {
    width: '80px', 
    height: '80px', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: '20px'
  },
  cutSetsIconImg: {
    maxWidth: '100%', 
    maxHeight: '100%', 
    objectFit: 'contain'
  },
  cutSetsValue: {
    fontSize: '70px', 
    fontWeight: 'bold', 
    color: COLORS.DARK_ORANGE, 
    fontFamily: 'Arial, sans-serif'
  },
  statusLegendContainer: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  statusLegendItem: {
    position: 'absolute',
    top: '6.6%',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center'
  },
  statusLegendLabel: {
    fontSize: '20px', 
    fontWeight: 'bold', 
    color: COLORS.WHITE, 
    marginRight: '8px', 
    paddingTop: '5px'
  },
  statusLegendIcon: {
    width: '26px', 
    height: '26px'
  },
  statusDivider: {
    position: 'absolute',
    top: '11%',
    left: '3%',
    right: '3%',
    height: '2px',
    background: COLORS.ORANGE,
    zIndex: 5
  },
  devicesContainer: {
    top: '12%',
    left: '5%',
    width: '90%',
    height: '50%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: '0',
    alignContent: 'start',
    padding: '0 50px'
  },
  deviceItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: '0',
    height: '32px',
    background: 'transparent'
  },
  deviceId: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginRight: '15px'
  },
  deviceIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center'
  },
  tableContainer: {
    top: '74%', 
    left: '7%', 
    width: '86%', 
    height: '25%'
  }
};

function MonitorPage() {
  // 设备状态颜色映射函数
  const getStatusColor = (status) => {
    switch(status) {
      case 'cutting': return COLORS.GREEN;
      case 'standby': return COLORS.YELLOW;
      case 'unplanned': return COLORS.RED;
      default: return COLORS.GRAY;
    }
  };

  return (
    <>
      <div className="dashboard-grid">
        {/* 移动率MU */}
        <div className="card-efficiency">
          <img src={移动率MUImg} className="card-image" alt="移动率MU" />
          <div className="chart-overlay">
            <EfficiencyChart />
          </div>
        </div>

        {/* 裁剪时间 */}
        <div className="card-cuttime">
          <img src={cutTimeImg} className="card-image" alt="裁剪时间" />
          <div className="chart-overlay">
            <CutTimeChart />
          </div>
        </div>

        {/* 总能耗 */}
        <div className="card-energy">
          <img src={totalEnergyImg} className="card-image" alt="总能耗" />
          <div className="chart-overlay">
            <EnergyChart />
          </div>
        </div>

        {/* 裁剪速度 */}
        <div className="card-cutspeed">
          <img src={cutSpeedImg} className="card-image" alt="裁剪速度" />
          <div className="chart-overlay">
            <CutSpeedChart />
          </div>
        </div>

        {/* 总周长 */}
        <div className="card-perimeter">
          <img src={totalPerimeterImg} className="card-image" alt="总周长" />
          <div className="chart-overlay">
            <PerimeterChart />
          </div>
        </div>

        {/* 裁剪套数 */}
        <div className="card-cutsets">
          <img src={cutSetsImg} className="card-image" alt="裁剪套数" />
          <div className="chart-overlay" style={STYLES.cutSetsOverlay}>
            {/* 左侧图标 */}
            <div style={STYLES.cutSetsIcon}>
              <img 
                src={cutSetsIconImg} 
                alt="裁剪套数图标" 
                style={STYLES.cutSetsIconImg} 
              />
            </div>
            
            {/* 右侧数据 */}
            <div style={STYLES.cutSetsValue}>
              {cutSetsValue}
            </div>
          </div>
        </div>

        {/* 裁床运行情况 */}
        <div className="card-status">
          {/* 上部分：各裁床运行状态 */}
          <img 
            src={各裁床运行状态标题Img}
            className="cutting-status-image"
            alt="各裁床运行状态"
          />
          
          {/* 状态说明图例区 */}
          <div className="status-legend-container" style={STYLES.statusLegendContainer}>
            {/* 状态图例项 */}
            {statusLegendItems.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  ...STYLES.statusLegendItem,
                  left: item.left
                }}
              >
                <div style={STYLES.statusLegendLabel}>
                  {item.label}
                </div>
                <div style={STYLES.statusLegendIcon}>
                  <StatusIcon status={item.status} color={getStatusColor(item.status)} />
                </div>
              </div>
            ))}
          </div>
          
          {/* 橙色分隔线 */}
          <div style={STYLES.statusDivider}></div>
          
          {/* 设备状态指示器区域 */}
          <div className="chart-overlay" style={STYLES.devicesContainer}>
            {deviceStatusData.map((device, index) => (
              <div key={index} style={STYLES.deviceItem}>
                {/* 左侧设备编号 */}
                <div style={STYLES.deviceId}>
                  {device.id}
                </div>
                
                {/* 右侧状态图标 */}
                <div style={STYLES.deviceIcon}>
                  <StatusIcon 
                    status={device.status} 
                    color={getStatusColor(device.status)} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* 下部分：裁床运行情况 */}
          <img 
            src={裁床运行情况Img}
            className="status-image"
            alt="裁床运行情况"
          />
          {/* 表格叠加层 */}
          <div className="chart-overlay" style={STYLES.tableContainer}>
            <StatusTable 
              tableData={tableData} 
              headers={tableHeaders} 
              scrollSpeed={0.3}
              visibleRows={4}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default MonitorPage; 