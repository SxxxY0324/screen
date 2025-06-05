import React, { useState, useEffect } from 'react';
import '../App.css';
import { 
  MetricsPanel, 
  BladeLifePanel, 
  FaultListPanel 
} from '../components/maintenance';
import { 
  getFaultCount, 
  getFaultTimes, 
  getFaultDuration, 
  getAvgFaultTime, 
  getFaultEquipmentList 
} from '../api/maintenanceApi';

function ManagementPage() {
  // 状态变量声明 - 维保指标和故障清单
  const [faultCount, setFaultCount] = useState(0);
  const [faultTimes, setFaultTimes] = useState(0);
  const [faultDuration, setFaultDuration] = useState(0);
  const [avgFaultTime, setAvgFaultTime] = useState(0);
  const [faultListData, setFaultListData] = useState([]);
  
  // 加载故障数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 并行请求数据
        const [countData, timesData, durationData, avgTimeData, equipmentListData] = await Promise.all([
          getFaultCount(),
          getFaultTimes(),
          getFaultDuration(),
          getAvgFaultTime(),
          getFaultEquipmentList()
        ]);
        
        // 直接使用API返回值，不使用硬编码数据
        setFaultCount(countData.count);
        setFaultTimes(timesData.count);
        setFaultDuration(durationData.hours);
        setAvgFaultTime(avgTimeData.hours);
        
        // 处理故障设备清单数据 - 将API返回的对象数组转换为表格所需的二维数组
        if (equipmentListData && equipmentListData.data && equipmentListData.data.length > 0) {
          const formattedData = equipmentListData.data.map((item, index) => [
            String(index + 1),                      // 序号（从1开始）
            item.workshop || '未知',                // 车间
            item.equipmentId || '未知',             // 设备编号
            item.faultCode || '未知',               // 故障代码
            item.formattedStartTime || '未知'       // 开始时间
          ]);
          setFaultListData(formattedData);
        } else {
          setFaultListData([]); // 设置为空数组，不使用默认数据
        }
      } catch (error) {
        // 发生错误时设置为0或空值，不使用默认值
        setFaultCount(0);
        setFaultTimes(0);
        setFaultDuration(0);
        setAvgFaultTime(0);
        setFaultListData([]);
      }
    };
    
    fetchData();
  }, []); // 只在组件挂载时加载一次数据
  
  // 以下是刀片和磨刀棒寿命数据 - 暂时保留硬编码数据，等待后续API开发
  // 实际项目中应该从API获取这些数据
  const bladeLifeData = [
    ['1', '一车间', 'CN01001', '85', '72'],
    ['2', '一车间', 'CN01002', '65', '89'],
    ['3', '二车间', 'CN01003', '45', '52'],
    ['4', '二车间', 'CN01004', '92', '78'],
    ['5', '三车间', 'CN01005', '33', '45'],
    ['6', '三车间', 'CN01006', '77', '81'],
    ['7', '四车间', 'CN01007', '58', '66'],
    ['8', '四车间', 'CN01008', '89', '27'],
    ['9', '五车间', 'CN01009', '25', '91'],
    ['10', '五车间', 'CN01010', '71', '44'],
    ['11', '一车间', 'CN01011', '39', '63'],
    ['12', '二车间', 'CN01012', '82', '76'],
    ['13', '三车间', 'CN01013', '61', '55'],
    ['14', '四车间', 'CN01014', '74', '48'],
    ['15', '五车间', 'CN01015', '53', '87'],
    ['16', '一车间', 'CN01016', '68', '79'],
    ['17', '二车间', 'CN01017', '43', '90'],
    ['18', '三车间', 'CN01018', '57', '84']
  ];
  
  const bladeHeaders = ['序号', '车间', '设备编号', '刀片', '磨刀棒'];
  const faultHeaders = ['序号', '车间', '设备编号', '故障代码', '开始时间'];

  return (
    <div className="management-page" style={{ 
      position: 'relative',
      width: '100%',
      height: 'calc(100vh - 110px)',
      overflow: 'hidden',
      backgroundColor: '#111',
      boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ 
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        padding: '2px 20px 30px 20px',
        marginTop: '-12px'
      }}>
        {/* 顶部指标行 - 使用MetricsPanel组件 */}
        <MetricsPanel
          faultCount={faultCount}
          faultTimes={faultTimes}
          faultDuration={faultDuration}
          avgFaultTime={avgFaultTime}
        />

        {/* 主要内容区 */}
        <div className="management-grid" style={{ 
          gap: '16px',
          height: '100%'
        }}>
          {/* 刀片和磨刀棒寿命 - 使用BladeLifePanel组件 */}
          <BladeLifePanel 
            tableData={bladeLifeData} 
            headers={bladeHeaders} 
          />
          
          {/* 当前设备故障清单 - 使用FaultListPanel组件 */}
          <FaultListPanel
            tableData={faultListData}
            headers={faultHeaders}
          />
        </div>
      </div>
    </div>
  );
}

export default ManagementPage; 