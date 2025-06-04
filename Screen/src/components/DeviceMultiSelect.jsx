import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectDeviceStatusData, selectDeviceStatusLoading } from '../store/slices/monitorSlice';

const DeviceMultiSelect = ({ selectedDevices, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const deviceStatusData = useAppSelector(selectDeviceStatusData);
  const deviceStatusLoading = useAppSelector(selectDeviceStatusLoading);
  const dropdownRef = useRef(null);
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 检查设备是否已选中
  const isSelected = (deviceId) => {
    return selectedDevices.includes(deviceId);
  };
  
  // 处理设备选择/取消选择
  const handleToggleDevice = (deviceId) => {
    let newSelection = [...selectedDevices];
    
    if (isSelected(deviceId)) {
      // 如果已选中，则移除
      newSelection = newSelection.filter(id => id !== deviceId);
    } else {
      // 如果未选中，则添加
      newSelection.push(deviceId);
    }
    
    onChange(newSelection);
  };
  
  // 全选/取消全选
  const handleToggleAll = () => {
    if (deviceStatusData && deviceStatusData.length > 0) {
      if (selectedDevices.length === deviceStatusData.length) {
        // 如果所有设备都已选中，则取消全选
        onChange([]);
      } else {
        // 否则全选
        const allDeviceIds = deviceStatusData.map(device => device.id);
        onChange(allDeviceIds);
      }
    }
  };
  
  // 获取显示文本
  const getDisplayText = () => {
    if (selectedDevices.length === 0) {
      return '设备';
    } else if (selectedDevices.length === 1) {
      return selectedDevices[0];
    } else if (deviceStatusData && selectedDevices.length === deviceStatusData.length) {
      return '全部设备';
    } else {
      return `已选${selectedDevices.length}个设备`;
    }
  };
  
  // 处理点击事件
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <select 
        className="nav-select"
        onClick={handleClick}
        onChange={() => {}}
        value={deviceStatusLoading ? '加载中...' : getDisplayText()}
        disabled={deviceStatusLoading}
        style={{
          height: '40px', // 确保与其他按钮一样高
          verticalAlign: 'middle', // 垂直对齐
          margin: '0',
          padding: '5px 30px 5px 12px',
          backgroundColor: '#333',
          color: '#fff',
          border: '1px solid #444',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'white\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        <option>{deviceStatusLoading ? '加载中...' : getDisplayText()}</option>
      </select>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '200px',
          maxHeight: '250px',
          overflowY: 'auto',
          backgroundColor: '#272727',
          border: '1px solid #444',
          borderRadius: '4px',
          zIndex: 1000,
          padding: '5px',
          marginTop: '5px'
        }}>
          {deviceStatusLoading ? (
            <div style={{ padding: '8px', color: '#fff', textAlign: 'center' }}>加载中...</div>
          ) : (
            <>
              <div 
                onClick={handleToggleAll}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #444',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <input 
                  type="checkbox"
                  checked={deviceStatusData && deviceStatusData.length > 0 && selectedDevices.length === deviceStatusData.length}
                  readOnly
                  style={{ marginRight: '8px' }}
                />
                <span>全选</span>
              </div>
              
              {deviceStatusData && deviceStatusData.map(device => (
                <div 
                  key={device.id}
                  onClick={() => handleToggleDevice(device.id)}
                  style={{
                    padding: '8px',
                    cursor: 'pointer',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <input 
                    type="checkbox"
                    checked={isSelected(device.id)}
                    readOnly
                    style={{ marginRight: '8px' }}
                  />
                  <span>{device.id}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceMultiSelect; 