    import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectDeviceStatusData, selectDeviceStatusLoading } from '../store/slices/monitorSlice';
import { useTranslation } from '../hooks/useTranslation';

const WorkshopMultiSelect = ({ selectedWorkshops, onChange }) => {
  const { getCommon } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const deviceStatusData = useAppSelector(selectDeviceStatusData);
  const deviceStatusLoading = useAppSelector(selectDeviceStatusLoading);
  const dropdownRef = useRef(null);
  
  // 从设备状态数据中提取不重复的车间列表
  const workshopList = useMemo(() => {
    if (!deviceStatusData || deviceStatusData.length === 0) return [];
    
    // 使用Set去重
    const uniqueWorkshops = new Set();
    deviceStatusData.forEach(device => {
      if (device.workshop) {
        uniqueWorkshops.add(device.workshop);
      }
    });
    
    // 转换为数组并排序
    return Array.from(uniqueWorkshops).sort();
  }, [deviceStatusData]);
  
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
  
  // 检查车间是否已选中
  const isSelected = (workshop) => {
    return selectedWorkshops.includes(workshop);
  };
  
  // 处理车间选择/取消选择
  const handleToggleWorkshop = (workshop) => {
    let newSelection = [...selectedWorkshops];
    
    if (isSelected(workshop)) {
      // 如果已选中，则移除
      newSelection = newSelection.filter(w => w !== workshop);
    } else {
      // 如果未选中，则添加
      newSelection.push(workshop);
    }
    
    onChange(newSelection);
  };
  
  // 全选/取消全选
  const handleToggleAll = () => {
    if (workshopList && workshopList.length > 0) {
      if (selectedWorkshops.length === workshopList.length) {
        // 如果所有车间都已选中，则取消全选
        onChange([]);
      } else {
        // 否则全选
        onChange([...workshopList]);
      }
    }
  };
  
  // 获取显示文本
  const getDisplayText = () => {
    if (selectedWorkshops.length === 0) {
      return '车间';
    } else if (selectedWorkshops.length === 1) {
      return selectedWorkshops[0];
    } else if (workshopList && selectedWorkshops.length === workshopList.length) {
      return '全部车间';
    } else {
      return `已选${selectedWorkshops.length}个车间`;
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
        value={deviceStatusLoading ? getCommon('loading') : getDisplayText()}
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
        <option>{deviceStatusLoading ? getCommon('loading') : getDisplayText()}</option>
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
            <div style={{ padding: '8px', color: '#fff', textAlign: 'center' }}>{getCommon('loading')}</div>
          ) : workshopList.length === 0 ? (
            <div style={{ padding: '8px', color: '#fff', textAlign: 'center' }}>暂无车间数据</div>
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
                  checked={workshopList && workshopList.length > 0 && selectedWorkshops.length === workshopList.length}
                  readOnly
                  style={{ marginRight: '8px' }}
                />
                <span>全选</span>
              </div>
              
              {workshopList.map(workshop => (
                <div 
                  key={workshop}
                  onClick={() => handleToggleWorkshop(workshop)}
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
                    checked={isSelected(workshop)}
                    readOnly
                    style={{ marginRight: '8px' }}
                  />
                  <span>{workshop}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkshopMultiSelect; 