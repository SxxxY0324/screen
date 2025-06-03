import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import MobilityRate from '../../components/MobilityRate'
import './index.scss'

// 定义Tab类型
type TabType = 'monitor' | 'maintenance' | 'analysis';

export default function DeviceDetails() {
  const router = useRouter();
  const { deviceName, deviceCode, startDate, endDate } = router.params;
  
  // 当前选中的Tab
  const [activeTab, setActiveTab] = useState<TabType>('monitor');
  
  // 计算天数差异
  const calculateDaysDifference = (): number => {
    if (!startDate || !endDate) return 1;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays || 1; // 至少1天
  };
  
  const days = calculateDaysDifference();
  
  // 处理Tab切换
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  // 渲染当前选项卡内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'monitor':
        return (
          <View className='monitor-content'>
            <View className='monitor-section'>
              <Text className='section-title'>设备运行状态</Text>
              <View className='charts-grid'>
                {/* 移动率MU组件 - 使用环形图 */}
                <MobilityRate 
                  value={75} 
                  max={100} 
                  size={150}
                  strokeWidth={12}
                  className='chart-card'
                />
                
                {/* 其他监控数据版块 */}
                <View className='empty-chart'>
                  <View className='empty-content-wrapper'>
                    <Text className='empty-section-title'>设备切割参数</Text>
                    <Text className='empty-text'>设备切割参数数据待添加</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      case 'maintenance':
        return (
          <View className='empty-content'>
            <Text className='empty-text'>维保管理内容待实现</Text>
          </View>
        );
      case 'analysis':
        return (
          <View className='empty-content'>
            <Text className='empty-text'>达标分析内容待实现</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className='device-details-page'>
      {/* 顶部蓝色区域 */}
      <View className='header-section'>
        <View className='device-info'>
          <Text className='device-name'>{deviceName || 'BullmerTest'}</Text>
          <Text className='device-code'>{deviceCode || '123456'}</Text>
        </View>
        
        <View className='time-info'>
          <Text className='time-label'>累计统计时间</Text>
          <View className='time-stats'>
            <Text className='days-count'>{days}</Text>
            <Text className='days-unit'>天</Text>
            <Text className='date-range'>{startDate} 至 {endDate}</Text>
          </View>
        </View>
      </View>
      
      {/* 选项卡 */}
      <View className='tab-section'>
        <View 
          className={`tab-item ${activeTab === 'monitor' ? 'active' : ''}`}
          onClick={() => handleTabChange('monitor')}
        >
          <Text>实时监控</Text>
        </View>
        <View 
          className={`tab-item ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => handleTabChange('maintenance')}
        >
          <Text>维保管理</Text>
        </View>
        <View 
          className={`tab-item ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => handleTabChange('analysis')}
        >
          <Text>达标分析</Text>
        </View>
      </View>
      
      {/* 内容区域 */}
      <View className='stats-content'>
        {renderTabContent()}
      </View>
    </View>
  );
} 