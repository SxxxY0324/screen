import { useState, useEffect } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

// 设备数据类型定义
interface DeviceInfo {
  id: string;
  name: string;
  code: string;
  lastUpdateTime: string;
  location: string;
  series: string;
  isOn: boolean;
}

interface DeviceListProps {
  initialDevices: DeviceInfo[];
  onDeviceStatusChange: (id: string, isChecked: boolean) => void;
}

export default function DeviceList({ initialDevices, onDeviceStatusChange }: DeviceListProps) {
  // 分页与加载状态 - 设备列表
  const [deviceData, setDeviceData] = useState<DeviceInfo[]>([]);
  const [allDeviceData, setAllDeviceData] = useState<DeviceInfo[]>([]);
  const [devicePageSize] = useState(6); // 设备列表每页6条数据
  const [deviceCurrentPage, setDeviceCurrentPage] = useState(1);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [deviceRefreshing, setDeviceRefreshing] = useState(false);
  const [deviceHasMore, setDeviceHasMore] = useState(true);

  // 初始化数据
  useEffect(() => {
    setAllDeviceData(initialDevices);
    const firstPageData = initialDevices.slice(0, devicePageSize);
    setDeviceData(firstPageData);
    setDeviceCurrentPage(1);
    setDeviceHasMore(initialDevices.length > devicePageSize);
  }, [initialDevices, devicePageSize]);

  // 设备列表刷新数据
  const handleDeviceRefresh = () => {
    if (deviceRefreshing) return;
    
    setDeviceRefreshing(true);
    
    // 模拟异步请求
    setTimeout(() => {
      // 只加载第一页设备数据
      const initialDevices = allDeviceData.slice(0, devicePageSize);
      setDeviceData(initialDevices);
      setDeviceCurrentPage(1);
      setDeviceHasMore(allDeviceData.length > devicePageSize);
      
      setDeviceRefreshing(false);
    }, 1000);
  }

  // 设备列表加载更多
  const handleDeviceLoadMore = () => {
    if (deviceLoading || !deviceHasMore) return;
    
    setDeviceLoading(true);
    
    // 计算下一页数据
    const nextPage = deviceCurrentPage + 1;
    const startIndex = (nextPage - 1) * devicePageSize;
    const endIndex = nextPage * devicePageSize;
    
    // 模拟异步请求
    setTimeout(() => {
      // 获取下一页数据
      const newData = allDeviceData.slice(startIndex, endIndex);
      
      if (newData.length > 0) {
        // 更新数据和页码
        setDeviceData([...deviceData, ...newData]);
        setDeviceCurrentPage(nextPage);
        
        // 判断是否还有更多数据
        setDeviceHasMore(endIndex < allDeviceData.length);
      } else {
        setDeviceHasMore(false);
      }
      
      setDeviceLoading(false);
    }, 1000);
  }
  
  // 处理设备列表滚动到底部事件
  const handleDeviceScrollToLower = () => {
    if (deviceHasMore && !deviceLoading) {
      handleDeviceLoadMore();
    }
  }

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
      scrollTop={0}
      refresherEnabled
      refresherTriggered={deviceRefreshing}
      onRefresherRefresh={handleDeviceRefresh}
      onScrollToLower={handleDeviceScrollToLower}
      lowerThreshold={20}
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
      </View>
        
      {/* 加载状态提示 */}
      {deviceLoading && (
        <View className='loading-tip'>
          <Text className='small-loading-text'>数据加载中...</Text>
        </View>
      )}
      
      {/* 已全部加载提示 */}
      {!deviceHasMore && !deviceLoading && deviceData.length > 0 && (
        <View className='loading-complete'>
          <Text className='small-loading-text'>已全部加载</Text>
        </View>
      )}
    </ScrollView>
  );
} 