import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './index.scss'
import 'taro-ui/dist/style/components/button.scss'

// 区域数据类型
export interface RegionData {
  id: string;
  name: string;
  deviceCount: number;
  runningCount: number;
}

interface RegionStatsProps {
  data: RegionData[];
  totalDevices: number;
  totalRunning: number;
  onRegionClick?: (regionId: string) => void;
}

const RegionStats: React.FC<RegionStatsProps> = ({ 
  data, 
  totalDevices, 
  totalRunning, 
  onRegionClick 
}) => {
  
  const handleViewDetail = (regionId: string) => {
    if (onRegionClick) {
      onRegionClick(regionId);
    }
  };
  
  return (
    <View className='region-stats'>
      {/* 总览数据 */}
      <View className='total-stats'>
        <View className='stat-item'>
          <Text className='stat-label'>设备总数：</Text>
          <Text className='stat-value'>{totalDevices}</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-label'>当前运行中：</Text>
          <Text className='stat-value running'>{totalRunning}</Text>
        </View>
      </View>
      
      {/* 区域卡片列表 */}
      <View className='region-list'>
        {data.map(region => (
          <View key={region.id} className='region-card'>
            <View className='region-header'>
              <Text className='region-name'>{region.name}</Text>
            </View>
            <View className='region-body'>
              <View className='region-stats-left'>
                <View className='stat-row'>
                  <Text className='stat-label'>设备总数：</Text>
                  <Text className='stat-value'>{region.deviceCount}</Text>
                </View>
                <View className='stat-row'>
                  <Text className='stat-label'>当前运行中：</Text>
                  <Text className='stat-value running'>{region.runningCount}</Text>
                </View>
              </View>
              <View className='region-action'>
                <AtButton 
                  type='primary' 
                  size='small'
                  onClick={() => handleViewDetail(region.id)}
                >
                  查看详情
                </AtButton>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RegionStats; 