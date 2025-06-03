import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './index.scss'

export default function TimeSelector() {
  // 获取路由参数
  const router = useRouter();
  const { deviceId, deviceName, deviceCode } = router.params;
  
  // 日期状态
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // 初始化日期为当天
  useEffect(() => {
    const today = new Date();
    const formattedDate = formatDate(today);
    setStartDate(formattedDate);
    setEndDate(formattedDate);
  }, []);
  
  // 格式化日期为 YYYY-MM-DD 格式
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 计算相对于今天的日期
  const calculateDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return formatDate(date);
  };
  
  // 处理快捷按钮点击
  const handleQuickSelect = (days: number) => {
    const end = formatDate(new Date());
    const start = calculateDate(days);
    setStartDate(start);
    setEndDate(end);
  };
  
  // 处理详情查看按钮点击
  const handleViewDetails = () => {
    // 跳转到设备详情页面
    Taro.navigateTo({
      url: `/pages/device-details/index?deviceId=${deviceId}&deviceName=${deviceName}&deviceCode=${deviceCode}&startDate=${startDate}&endDate=${endDate}`
    });
  };
  
  // 返回上一页
  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className='time-selector-page'>
      {/* 设备信息卡片 */}
      <View className='device-info-section'>
        <Text className='device-name'>{deviceName || 'BullmerTest'}</Text>
        <Text className='device-code'>{deviceCode || '123456'}</Text>
        
        {/* 时间选择区域 */}
        <View className='time-range-section'>
          <View className='time-row'>
            <Text className='time-label'>开始时间</Text>
            <Text className='time-value'>{startDate}</Text>
          </View>
          <Text className='time-separator'>至</Text>
          <View className='time-row'>
            <Text className='time-label'>截至时间</Text>
            <Text className='time-value'>{endDate}</Text>
          </View>
        </View>
      </View>
      
      {/* 快捷按钮区域 */}
      <View className='quick-buttons'>
        <View className='button-item' onClick={() => handleQuickSelect(3)}>
          <Text>三天</Text>
        </View>
        <View className='button-item' onClick={() => handleQuickSelect(7)}>
          <Text>七天</Text>
        </View>
        <View className='button-item' onClick={() => handleQuickSelect(15)}>
          <Text>十五天</Text>
        </View>
        <View className='button-item' onClick={() => handleQuickSelect(30)}>
          <Text>三十天</Text>
        </View>
      </View>
      
      {/* 查看详情按钮 */}
      <View className='action-button' onClick={handleViewDetails}>
        <Text>查看详情</Text>
      </View>
    </View>
  );
} 