import { View, ScrollView, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { DeviceInfo } from '../../../types'
import { usePagination } from '../../../hooks/usePagination'
import { PAGINATION_CONFIG } from '../../../constants/config'

interface DeviceListProps {
  initialDevices: DeviceInfo[];
  onDeviceStatusChange: (deviceId: string, isOn: boolean) => void;
}

export default function DeviceList({ initialDevices, onDeviceStatusChange }: DeviceListProps) {
  // 使用通用分页Hook
  const {
    data: deviceData,
    isRefreshing: deviceRefreshing,
    isLoading: deviceLoading,
    hasMore: deviceHasMore,
    handleRefresh: handleDeviceRefresh,
    handleScrollToLower: handleDeviceScrollToLower
  } = usePagination(initialDevices, PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);

  // 处理设备卡片点击事件
  const handleDeviceCardClick = (device: DeviceInfo) => {
    // 去除名称中的括号及括号内容
    const cleanName = device.name.replace(/\([^)]*\)/g, '').trim();
    
    // 跳转到时间选择页面
    Taro.navigateTo({
      url: `/pages/time-selector/index?deviceId=${device.id}&deviceName=${cleanName}&deviceCode=${device.code}`
    });
  };

  return (
    <ScrollView 
      className='scrollable-devices'
      scrollY
      refresherEnabled
      refresherTriggered={deviceRefreshing}
      onRefresherRefresh={handleDeviceRefresh}
      onScrollToLower={handleDeviceScrollToLower}
      lowerThreshold={PAGINATION_CONFIG.SCROLL_LOWER_THRESHOLD}
      enableBackToTop
    >
      <View className='device-list-container'>
        {deviceData.map(device => (
          <View 
            key={device.id} 
            className='device-card'
            onClick={() => handleDeviceCardClick(device)}
          >
            <View className='device-card-left'>
              <View className='device-name'>{device.name}</View>
              <View className='device-code'>{device.code}</View>
              <View className='device-update-time'>
                <Text className='label'>最后更新时间：</Text>
                <Text className='value'>{device.lastUpdateTime}</Text>
              </View>
            </View>
            <View className='device-card-right'>
              <View className='device-location'>
                <Text className='location-icon'>📍</Text>
                <Text className='location-text'>{device.location}</Text>
              </View>
              <View className='device-series'>
                <Text className='label'>设备型号：</Text>
                <Text className='value'>{device.series}</Text>
              </View>
              <View className='device-status'>
                <Text 
                  className={`status-text ${device.isOn ? 'status-on' : 'status-off'}`}
                >
                  {device.isOn ? '运行中' : '已停机'}
                </Text>
              </View>
            </View>
          </View>
        ))}
        
        {/* 加载状态提示 */}
        {deviceLoading && (
          <View className='loading-tip'>
            <Text className='small-loading-text'>数据加载中...</Text>
          </View>
        )}
        
        {/* 已全部加载提示 - 内嵌到容器中，确保在微信端可见 */}
        {!deviceHasMore && !deviceLoading && deviceData.length > 0 && (
          <View className='loading-complete' style={{ paddingBottom: '80px' }}>
            <Text className='small-loading-text'>已全部加载</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
} 