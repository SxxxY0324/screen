import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import Banner from '../../components/Banner'
import './index.scss'

// 引入必要的Taro UI样式
import 'taro-ui/dist/style/components/list.scss'
import 'taro-ui/dist/style/components/icon.scss'
import 'taro-ui/dist/style/components/search-bar.scss'
import 'taro-ui/dist/style/components/button.scss'

// 引入类型定义
import {
  CustomerInfo,
  DeviceInfo,
  BannerItem,
  RegionData,
  PageMode
} from '../../types'

// 引入子组件
import RegionList from './components/RegionList'
import CustomerList from './components/CustomerList'
import DeviceList from './components/DeviceList'

export default function List() {
  // 页面状态 - 列表模式
  const [pageMode, setPageMode] = useState<PageMode>(PageMode.REGION_LIST);
  const [currentRegionId, setCurrentRegionId] = useState('');
  const [currentCustomerId, setCurrentCustomerId] = useState('');
  const [regionName, setRegionName] = useState('');
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceInfo[]>([]);
  
  // 轮播图数据
  const [bannerData] = useState<BannerItem[]>([
    { id: 1, imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg', title: '设备工业4.0' },
    { id: 2, imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg', title: '智能制造' },
    { id: 3, imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg', title: '数字化转型' },
  ])
  
  // 区域统计数据
  const [allRegionData] = useState<RegionData[]>([
    { id: 'north', name: '华北地区', deviceCount: 3, runningCount: 0 },
    { id: 'northeast', name: '东北地区', deviceCount: 1, runningCount: 0 },
    { id: 'east', name: '华东地区', deviceCount: 133, runningCount: 38 },
    { id: 'central', name: '华中地区', deviceCount: 11, runningCount: 7 },
    { id: 'south', name: '华南地区', deviceCount: 78, runningCount: 15 },
    { id: 'southwest', name: '西南地区', deviceCount: 42, runningCount: 9 },
  ])
  
  // 模拟设备数据
  const mockDevices: DeviceInfo[] = [
    { 
      id: '1', 
      name: 'BullmerTest(裁床)', 
      code: '123456', 
      lastUpdateTime: '2025-05-16 11:39:11', 
      location: '中国-北京 东城',
      series: 'E系列',
      isOn: false
    },
    { 
      id: '2', 
      name: 'BullmerTest(裁床)', 
      code: '654321', 
      lastUpdateTime: '2024-02-02 12:54:47', 
      location: '中国-北京 东城',
      series: 'D系列',
      isOn: false
    },
    { 
      id: '3', 
      name: 'BullmerTest(裁床)', 
      code: '123456789', 
      lastUpdateTime: '2023-11-30 09:45:47', 
      location: '中国-北京 东城',
      series: 'E系列',
      isOn: false
    },
  ];
  
  // 模拟客户数据
  const mockCustomers = {
    'north': [
      { id: 'c1', name: 'BullmerTest', phone: '010-12345678', address: '北京市朝阳区' },
      { id: 'c2', name: '北方科技', phone: '010-87654321', address: '天津市南开区' },
    ],
    'northeast': [
      { id: 'c3', name: '东北实业', phone: '024-12345678', address: '沈阳市和平区' },
    ],
    'east': [
      { id: 'c4', name: '江南制造', phone: '021-12345678', address: '上海市浦东新区' },
      { id: 'c5', name: '杭州智能', phone: '0571-87654321', address: '杭州市西湖区' },
    ],
    'central': [
      { id: 'c6', name: '中原科技', phone: '027-12345678', address: '武汉市洪山区' },
    ],
    'south': [
      { id: 'c7', name: '南方智造', phone: '020-12345678', address: '广州市天河区' },
    ],
    'southwest': [
      { id: 'c8', name: '西南企业', phone: '028-12345678', address: '成都市锦江区' },
    ],
  };
  
  // 区域名称映射
  const regionNameMap = {
    'north': '华北地区',
    'northeast': '东北地区',
    'east': '华东地区',
    'central': '华中地区',
    'south': '华南地区',
    'southwest': '西南地区',
  };
  
  // 计算设备总数和运行中总数
  const totalDevices = allRegionData.reduce((sum, region) => sum + region.deviceCount, 0)
  const totalRunning = allRegionData.reduce((sum, region) => sum + region.runningCount, 0)
  
  useLoad(() => {
    console.log('List page loaded.')
  })

  // 轮播图点击
  const handleBannerClick = (id: number) => {
    console.log('Banner clicked:', id)
  }
  
  // 区域卡片点击
  const handleRegionClick = (regionId: string) => {
    console.log('Region clicked:', regionId)
    // 切换到客户列表模式
    setCurrentRegionId(regionId);
    
    // 设置区域名称
    if (regionNameMap[regionId]) {
      const name = regionNameMap[regionId];
      setRegionName(name);
      Taro.setNavigationBarTitle({ title: name });
    }
    
    // 加载客户数据
    if (mockCustomers[regionId]) {
      setCustomers(mockCustomers[regionId]);
    }
    
    // 切换到客户列表模式并重置滚动位置
    setPageMode(PageMode.CUSTOMER_LIST);
    
    // 使用setTimeout确保DOM更新后再滚动
    setTimeout(() => {
      // 重置滚动位置
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    }, 50);
  }
  
  // 返回地区列表
  const handleBackToRegionList = () => {
    // 恢复列表模式
    setPageMode(PageMode.REGION_LIST);
    setCurrentRegionId('');
    // 恢复原标题
    Taro.setNavigationBarTitle({ title: '列表' });
    
    // 重置客户列表状态
    setCustomers([]);
    
    // 重置滚动位置
    setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    }, 50);
  }
  
  // 客户详情点击
  const handleCustomerDetail = (customerId: string) => {
    console.log('Customer detail clicked:', customerId);
    // 保存当前客户ID
    setCurrentCustomerId(customerId);
    
    // 设置页面标题
    Taro.setNavigationBarTitle({ title: '设备列表' });
    
    // 模拟从API获取该客户的设备数据
    // 这里使用mockDevices来模拟，实际应该根据customerId从API获取
    setDeviceData(mockDevices);
    
    // 切换到设备列表模式
    setPageMode(PageMode.DEVICE_LIST);
    
    // 重置滚动位置
    setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    }, 50);
  }
  
  // 从设备列表返回到客户列表
  const handleBackToCustomerList = () => {
    setPageMode(PageMode.CUSTOMER_LIST);
    setCurrentCustomerId('');
    
    // 重置设备列表状态
    setDeviceData([]);
    
    // 重置滚动位置
    setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    }, 50);
    
    // 恢复区域标题
    if (regionName) {
      Taro.setNavigationBarTitle({ title: regionName });
    }
  }
  
  // 切换设备开关状态
  const handleDeviceSwitchChange = (id: string, isChecked: boolean) => {
    console.log(`设备 ${id} 状态已切换为: ${isChecked ? 'on' : 'off'}`);
    
    // 更新设备状态
    const updatedDevices = deviceData.map(device => {
      if (device.id === id) {
        return { ...device, isOn: isChecked };
      }
      return device;
    });
    
    setDeviceData(updatedDevices);
  }

  return (
    <View className='list-page'>
      {/* 固定的内容区域 */}
      <View className='fixed-content'>
        {/* Banner轮播图 */}
        <Banner data={bannerData} onBannerClick={handleBannerClick} />
        
        {/* 固定的统计信息 - 仅在地区列表模式显示 */}
        {pageMode === PageMode.REGION_LIST && (
          <View className='fixed-stats'>
            <View className='stat-item'>
              <Text className='stat-label'>设备总数：</Text>
              <Text className='stat-value'>{totalDevices}</Text>
            </View>
            <View className='stat-item'>
              <Text className='stat-label'>当前运行中：</Text>
              <Text className='stat-value running'>{totalRunning}</Text>
            </View>
          </View>
        )}
        
        {/* 客户列表模式标题 */}
        {pageMode === PageMode.CUSTOMER_LIST && (
          <View className='detail-header'>
            <View className='back-button' onClick={handleBackToRegionList}>
              <Text className='back-icon'>←</Text>
              <Text>返回</Text>
            </View>
            
            <View className='breadcrumb'>
              <Text className='breadcrumb-item' onClick={handleBackToRegionList}>地区列表</Text>
              <Text className='breadcrumb-separator'>/</Text>
              <Text className='breadcrumb-item active'>客户列表</Text>
            </View>
          </View>
        )}
        
        {/* 设备列表模式标题 */}
        {pageMode === PageMode.DEVICE_LIST && (
          <View className='detail-header'>
            <View className='back-button' onClick={handleBackToCustomerList}>
              <Text className='back-icon'>←</Text>
              <Text>返回</Text>
            </View>
            
            <View className='breadcrumb'>
              <Text className='breadcrumb-item' onClick={handleBackToRegionList}>地区列表</Text>
              <Text className='breadcrumb-separator'>/</Text>
              <Text className='breadcrumb-item' onClick={handleBackToCustomerList}>客户列表</Text>
              <Text className='breadcrumb-separator'>/</Text>
              <Text className='breadcrumb-item active'>设备列表</Text>
            </View>
          </View>
        )}
      </View>
      
      {/* 条件渲染 - 地区列表模式 */}
      {pageMode === PageMode.REGION_LIST && (
        <RegionList 
          allRegionData={allRegionData} 
          onRegionClick={handleRegionClick} 
        />
      )}
      
      {/* 条件渲染 - 客户列表模式 */}
      {pageMode === PageMode.CUSTOMER_LIST && (
        <CustomerList 
          initialCustomers={customers} 
          onCustomerClick={handleCustomerDetail}
        />
      )}

      {/* 条件渲染 - 设备列表模式 */}
      {pageMode === PageMode.DEVICE_LIST && (
        <DeviceList 
          initialDevices={deviceData} 
          onDeviceStatusChange={handleDeviceSwitchChange}
        />
      )}
    </View>
  )
}
