import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectDeviceEnergyData } from '../store/slices/monitorSlice';
import { fetchMonitorData } from '../store/slices/monitorSlice';

/**
 * 调试组件 - 显示系统数据状态，方便开发调试
 */
const Debug = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'json'
  const deviceEnergyData = useAppSelector(selectDeviceEnergyData);
  const dispatch = useAppDispatch();
  const [lastRefresh, setLastRefresh] = useState('-');

  // 监听设备数据变化
  useEffect(() => {
    if (deviceEnergyData && deviceEnergyData.length > 0) {
      setLastRefresh(new Date().toLocaleTimeString());
    }
  }, [deviceEnergyData]);

  // 如果不可见，只显示一个小按钮
  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 9999,
          padding: '5px',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          opacity: 0.6
        }}
      >
        调试
      </button>
    );
  }

  // 手动刷新数据
  const handleRefresh = () => {
    console.log('手动刷新数据...');
    dispatch(fetchMonitorData());
  };
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      width: '550px',
      height: '500px',
      background: 'rgba(0,0,0,0.9)',
      color: '#fff',
      zIndex: 9999,
      padding: '15px',
      overflow: 'auto',
      borderRadius: '5px',
      fontSize: '14px',
      fontFamily: 'monospace'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <h3 style={{ margin: 0 }}>调试面板</h3>
        <div>
          <button 
            onClick={handleRefresh}
            style={{
              background: '#555',
              border: 'none',
              color: '#fff',
              marginRight: '10px',
              padding: '3px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            刷新数据
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            X
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid #444' }}>
          <div
            onClick={() => setActiveTab('table')} 
            style={{ 
              padding: '5px 10px', 
              cursor: 'pointer',
              borderBottom: activeTab === 'table' ? '2px solid orange' : 'none'
            }}
          >
            表格视图
          </div>
          <div 
            onClick={() => setActiveTab('json')}
            style={{ 
              padding: '5px 10px', 
              cursor: 'pointer',
              borderBottom: activeTab === 'json' ? '2px solid orange' : 'none'
            }}
          >
            JSON视图
          </div>
        </div>
        
        <div>
          <h4>设备能耗数据 <span style={{color: '#aaa', fontSize: '12px'}}>最近更新: {lastRefresh}</span></h4>
          <p>设备总数: <strong style={{color: '#ff0'}}>{deviceEnergyData?.length || 0}</strong></p>
          
          {activeTab === 'table' ? (
            <div style={{ maxHeight: '330px', overflow: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                color: '#fff'
              }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #555' }}>索引</th>
                    <th style={{ textAlign: 'left', padding: '5px', border: '1px solid #555' }}>设备ID</th>
                    <th style={{ textAlign: 'right', padding: '5px', border: '1px solid #555' }}>能耗 (kWh)</th>
                    <th style={{ textAlign: 'right', padding: '5px', border: '1px solid #555' }}>功率 (kW)</th>
                  </tr>
                </thead>
                <tbody>
                  {deviceEnergyData && deviceEnergyData.map((device, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: 'left', padding: '5px', border: '1px solid #555' }}>
                        {index + 1}
                      </td>
                      <td style={{ textAlign: 'left', padding: '5px', border: '1px solid #555' }}>
                        {device.deviceId}
                      </td>
                      <td style={{ textAlign: 'right', padding: '5px', border: '1px solid #555' }}>
                        {device.energy.toFixed(1)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '5px', border: '1px solid #555' }}>
                        {device.power?.toFixed(1) || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ maxHeight: '330px', overflow: 'auto' }}>
              <pre style={{ 
                fontSize: '12px', 
                background: '#222', 
                padding: '10px', 
                border: '1px solid #444',
                whiteSpace: 'pre-wrap'
              }}>
                {JSON.stringify(deviceEnergyData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Debug; 