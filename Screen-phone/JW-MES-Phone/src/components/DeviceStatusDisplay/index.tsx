import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { DeviceStatus, DeviceStatusInfo, STATUS_LEGEND_ITEMS } from '../../types/deviceStatus'
import StatusIcon from '../StatusIcon'
import './index.scss'
import { 
  containerStyle, 
  headerSectionStyle, 
  headerTitleStyle, 
  contentStyle 
} from '../../constants/chart'

// 模拟裁床状态数据
const MOCK_DEVICE_STATUS_DATA: DeviceStatusInfo[] = [
  { code: 'CN01001', status: DeviceStatus.CUTTING },
  { code: 'CN01002', status: DeviceStatus.STANDBY },
  { code: 'CN01003', status: DeviceStatus.UNPLANNED },
  { code: 'CN01004', status: DeviceStatus.PLANNED },
  { code: 'CN01005', status: DeviceStatus.CUTTING },
  { code: 'CN01006', status: DeviceStatus.STANDBY },
]

interface DeviceStatusDisplayProps {
  /** 设备状态数据列表，不传则使用模拟数据 */
  devices?: DeviceStatusInfo[];
  /** 自定义类名 */
  className?: string;
}

/**
 * 各裁床运行状态组件
 * 展示所有裁床的编码和状态图标
 */
const DeviceStatusDisplay: React.FC<DeviceStatusDisplayProps> = ({
  devices = MOCK_DEVICE_STATUS_DATA,
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
    <View className={className} style={containerStyle}>
      <View style={headerSectionStyle}>
        <Text style={headerTitleStyle}>各裁床运行状态</Text>
      </View>
      
      <View style={contentStyle}>
        {/* 状态图例 */}
        <View className='device-status-legend'>
          {STATUS_LEGEND_ITEMS.map((item, index) => (
            <View key={index} className='device-status-legend-item'>
              <StatusIcon status={item.status} size={36} />
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
                <StatusIcon status={device.status} size={50} />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default DeviceStatusDisplay; 