import { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import MobilityRate from '../../components/MobilityRate'
import EnergyConsumption from '../../components/EnergyConsumption'
import TotalCircumference from '../../components/TotalCircumference'
import DeviceStatusDisplay from '../../components/DeviceStatusDisplay'
import { DeviceStatus, DeviceStatusInfo } from '../../types/deviceStatus'
import './index.scss'

// 定义Tab类型
type TabType = 'monitor' | 'maintenance' | 'analysis';

// 模拟设备能耗数据
const mockEnergyData = [
  { deviceCode: 'Device001', energyValue: 85 },
  { deviceCode: 'Device002', energyValue: 62 },
  { deviceCode: 'Device003', energyValue: 45 },
  { deviceCode: 'Device004', energyValue: 28 }
];

// 模拟裁床运行状态数据
const mockDeviceStatusData: DeviceStatusInfo[] = [
  { code: 'CN01001', status: DeviceStatus.CUTTING },
  { code: 'CN01002', status: DeviceStatus.STANDBY },
  { code: 'CN01003', status: DeviceStatus.UNPLANNED },
  { code: 'CN01004', status: DeviceStatus.PLANNED },
  { code: 'CN01005', status: DeviceStatus.CUTTING },
  { code: 'CN01006', status: DeviceStatus.STANDBY },
];

export default function DeviceDetails() {
  const router = useRouter();
  const { deviceName, deviceCode, startDate, endDate } = router.params;
  
  // 当前选中的Tab
  const [activeTab, setActiveTab] = useState<TabType>('monitor');
  
  // 用于强制刷新Canvas组件的状态
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  
  // 模拟数据加载状态
  const [dataLoaded, setDataLoaded] = useState(false);
  const [mobilityValue, setMobilityValue] = useState(0);
  const [energyData, setEnergyData] = useState(mockEnergyData);
  const [circumferenceValue, setCircumferenceValue] = useState(0);
  
  // 固定区域高度状态
  const [fixedAreaHeight, setFixedAreaHeight] = useState(0);
  // 固定区域ref
  const fixedAreaRef = useRef<any>(null);
  
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
    
    // 当切换到监控Tab时，增加计数器触发刷新
    if (tab === 'monitor') {
      // 模拟数据加载
      setDataLoaded(false);
      setTimeout(() => {
        setMobilityValue(75); // 设置实际数值
        setEnergyData(mockEnergyData); // 设置能耗数据
        setCircumferenceValue(850); // 设置总周长数据
        setDataLoaded(true);
        setTabSwitchCount(prev => prev + 1);
      }, 500);
    }
  };
  
  // 跳转到裁床运行状态演示页面
  const goToDeviceStatusDemo = () => {
    Taro.navigateTo({
      url: '/pages/device-status-demo/index'
    });
  };
  
  // 初始数据加载
  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setMobilityValue(75); // 设置实际数值
      setEnergyData(mockEnergyData); // 设置能耗数据
      setCircumferenceValue(850); // 设置总周长数据
      setDataLoaded(true);
    }, 800);
    
    // 延迟测量固定区域高度，确保DOM已渲染
    setTimeout(() => {
      measureFixedAreaHeight();
    }, 300);
  }, []);
  
  // 测量固定区域高度的函数
  const measureFixedAreaHeight = () => {
    try {
      const query = Taro.createSelectorQuery();
      query.select('.fixed-area')
        .boundingClientRect()
        .exec(res => {
          if (res && res[0] && res[0].height) {
            const height = res[0].height;
            setFixedAreaHeight(height);
            
            // 设置CSS变量
            document.documentElement.style.setProperty('--fixed-area-height', `${height}px`);
          }
        });
    } catch (error) {
      // 记录错误但不打印到控制台
      setFixedAreaHeight(300); // 使用默认高度
    }
  };
  
  // 窗口大小变化时重新测量
  useEffect(() => {
    const handleResize = () => {
      measureFixedAreaHeight();
    };
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 微信小程序环境特殊处理
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      const sysInfo = Taro.getSystemInfoSync();
      if (sysInfo.windowHeight) {
        // 仅在微信小程序环境下，使用系统信息来设置高度
        document.documentElement.style.setProperty('--window-height', `${sysInfo.windowHeight}px`);
      }
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 页面显示时触发（针对微信小程序）
  useEffect(() => {
    // 监听页面显示事件
    Taro.eventCenter.on('taroPageShow', () => {
      // 如果当前是监控Tab，增加计数器触发刷新
      if (activeTab === 'monitor') {
        // 重新加载数据
        setDataLoaded(false);
        setTimeout(() => {
          setMobilityValue(75); // 设置实际数值
          setEnergyData(mockEnergyData); // 设置能耗数据
          setCircumferenceValue(850); // 设置总周长数据
          setDataLoaded(true);
          setTabSwitchCount(prev => prev + 1);
        }, 500);
      }
      
      // 重新测量固定区域高度
      setTimeout(() => {
        measureFixedAreaHeight();
      }, 300);
    });
    
    // 卸载时移除监听
    return () => {
      Taro.eventCenter.off('taroPageShow');
    };
  }, [activeTab]);
  
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
                  value={mobilityValue} 
                  max={100} 
                  size={150}
                  strokeWidth={12}
                  variant="card"
                  isVisible={activeTab === 'monitor' && dataLoaded}
                  key={`mobility-rate-${tabSwitchCount}`} // 强制重新渲染
                />
                
                {/* 总能耗组件 - 使用横向柱状图 */}
                <EnergyConsumption 
                  devices={energyData}
                  maxValue={100}
                  className='chart-card'
                  isVisible={activeTab === 'monitor' && dataLoaded}
                  key={`energy-consumption-${tabSwitchCount}`} // 强制重新渲染
                />
                
                {/* 总周长组件 - 使用环形图 */}
                <TotalCircumference
                  value={circumferenceValue}
                  max={1000}
                  unit="mm"
                  size={150}
                  strokeWidth={12}
                  isVisible={activeTab === 'monitor' && dataLoaded}
                  key={`total-circumference-${tabSwitchCount}`} // 强制重新渲染
                />
              </View>
            </View>
            
            {/* 各裁床运行状态组件 */}
            <View className='monitor-section'>
              <DeviceStatusDisplay 
                devices={mockDeviceStatusData} 
                key={`device-status-${tabSwitchCount}`} // 强制重新渲染
              />
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
      {/* 固定区域：包含顶部蓝色区域和选项卡 */}
      <View className='fixed-area' ref={fixedAreaRef}>
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
      </View>
      
      {/* 可滚动区域：只包含内容 */}
      <ScrollView 
        className='scrollable-content'
        scrollY={true}
        enableBackToTop={true}
        enhanced={true}
        showScrollbar={false}
        style={{
          paddingTop: fixedAreaHeight ? `${fixedAreaHeight}px` : 'var(--fixed-area-height, 300px)',
          height: fixedAreaHeight ? `calc(100vh - ${fixedAreaHeight}px)` : 'calc(100vh - var(--fixed-area-height, 300px))'
        }}
      >
        <View className='stats-content'>
          {renderTabContent()}
        </View>
      </ScrollView>
    </View>
  );
} 