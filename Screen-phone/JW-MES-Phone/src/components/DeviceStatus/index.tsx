import { View, Text } from '@tarojs/components'
import { useState, useMemo } from 'react'
import { DeviceStatusInfo, STATUS_LEGEND_ITEMS } from '../../types/deviceStatus'
import StatusIcon from '../StatusIcon'
import './index.scss'

interface DeviceStatusProps {
  /** 设备状态数据列表 */
  devices: DeviceStatusInfo[];
  /** 自定义类名 */
  className?: string;
}

/**
 * 各裁床运行状态组件
 * 展示所有裁床的编码和状态图标
 */
const DeviceStatus: React.FC<DeviceStatusProps> = ({
  devices = [],
  className = ''
}) => {
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 渲染加载动画
  const renderLoadingSpinner = () => {
    return (
      <View className='device-status-loading'>
        <View className='device-status-spinner' />
      </View>
    );
  };
  
  // 渲染空状态
  const renderEmpty = () => {
    return (
      <View className='device-status-empty'>
        <Text className='device-status-empty-text'>暂无设备状态数据</Text>
      </View>
    );
  };

  return (
    <View className={`device-status-component ${className}`}>
      <View className='device-status-header'>
        <Text className='device-status-title'>各裁床运行状态</Text>
      </View>
      
      <View className='device-status-content'>
        {/* 状态图例 */}
        <View className='device-status-legend'>
          {STATUS_LEGEND_ITEMS.map((item, index) => (
            <View key={index} className='device-status-legend-item'>
              <StatusIcon status={item.status} size={20} />
              <Text className='device-status-legend-label'>{item.label}</Text>
            </View>
          ))}
        </View>
        
        {/* 设备状态列表 */}
        {isLoading ? (
          renderLoadingSpinner()
        ) : devices.length === 0 ? (
          renderEmpty()
        ) : (
          <View className='device-status-list'>
            {devices.map((device, index) => (
              <View key={index} className='device-status-item'>
                <Text className='device-status-code'>{device.code}</Text>
                <StatusIcon status={device.status} size={32} />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default DeviceStatus; 