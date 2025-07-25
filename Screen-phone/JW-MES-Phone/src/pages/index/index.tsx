import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad, switchTab } from '@tarojs/taro'
import FilterForm from '../../components/FilterForm'
import MobilityRate from '../../components/MobilityRate'
import CuttingPerimeter from '../../components/CuttingPerimeter'
import CuttingSpeed from '../../components/CuttingSpeed'
import './index.scss'
import { FilterFormData } from '../../types/filterForm'

// 引入必要的Taro UI样式
import 'taro-ui/dist/style/components/button.scss'

// 移动率数据接口
interface MobilityData {
  totalCuttingTime: number;    // 总裁剪时间（分钟）
  totalWorkTime: number;       // 总工作时间（分钟）  
  totalRestTime: number;       // 总休息时间（分钟）
  mobilityRate: number;        // 移动率百分比
}

// 裁剪周长数据接口
interface CuttingPerimeterData {
  statisticsDays: number;        // 统计时间（天）
  dailyAvgPerimeter: number;     // 日均裁剪周长（米）
  maxDailyPerimeter: number;     // 最大单日裁剪周长（米）
  minDailyPerimeter: number;     // 最小单日裁剪周长（米）
  totalPerimeterKM: number;      // 总裁剪周长（千米）
}

// 裁剪速度数据接口
interface CuttingSpeedData {
  currentSpeed: number;          // 当前速度（m/min）
  avgCuttingSpeed: number;       // 平均裁剪速度（m/min）
  avgIdleSpeed: number;          // 平均空走速度（m/min）
  overallAvgSpeed: number;       // 整体平均速度（m/min）
  maxSpeed: number;              // 最大速度（m/min）
  minSpeed: number;              // 最小速度（m/min）
}

// 国家选项数据
const countryOptions = [
  { label: '中国', value: 'china' },
  { label: '美国', value: 'usa' },
  { label: '日本', value: 'japan' },
  { label: '德国', value: 'germany' }
]

// 车间选项数据（基于国家的级联数据）
const workshopOptions: Record<string, Array<{label: string, value: string}>> = {
  china: [
    { label: '上海车间', value: 'shanghai' },
    { label: '北京车间', value: 'beijing' },
    { label: '深圳车间', value: 'shenzhen' }
  ],
  usa: [
    { label: 'New York Workshop', value: 'newyork' },
    { label: 'California Workshop', value: 'california' }
  ],
  japan: [
    { label: '东京车间', value: 'tokyo' },
    { label: '大阪车间', value: 'osaka' }
  ],
  germany: [
    { label: 'Berlin Workshop', value: 'berlin' },
    { label: 'Munich Workshop', value: 'munich' }
  ]
}

export default function Index() {
  // 移动率数据状态
  const [mobilityData, setMobilityData] = useState<MobilityData>({
    totalCuttingTime: 480,  // 8小时 = 480分钟
    totalWorkTime: 600,  // 10小时 = 600分钟
    totalRestTime: 120,     // 2小时 = 120分钟
    mobilityRate: 83.3      // 计算得出的移动率
  })

  // 裁剪周长数据状态
  const [cuttingPerimeterData, setCuttingPerimeterData] = useState<CuttingPerimeterData>({
    statisticsDays: 7,           // 统计7天
    dailyAvgPerimeter: 1250,     // 日均1250米
    maxDailyPerimeter: 1680,     // 最大1680米
    minDailyPerimeter: 890,      // 最小890米
    totalPerimeterKM: 8.75       // 总周长8.75千米
  })

  // 裁剪速度数据状态
  const [cuttingSpeedData, setCuttingSpeedData] = useState<CuttingSpeedData>({
    currentSpeed: 5.7,           // 当前速度5.7m/min
    avgCuttingSpeed: 5.8,        // 平均裁剪速度5.8m/min
    avgIdleSpeed: 0,             // 平均空走速度0m/min
    overallAvgSpeed: 5.8,        // 整体平均速度5.8m/min
    maxSpeed: 7.3,               // 最大速度7.3m/min
    minSpeed: 3.7                // 最小速度3.7m/min
  })

  useLoad(() => {
    // 页面加载完成
    calculateMobilityRate()
    calculateTotalPerimeter()
  })

  // 计算移动率
  const calculateMobilityRate = () => {
    const { totalWorkTime, totalRestTime } = mobilityData
    const totalTime = totalWorkTime + totalRestTime
    const rate = totalTime > 0 ? (totalWorkTime / totalTime) * 100 : 0
    // 确保移动率不超过100%
    const finalRate = Math.min(rate, 100)
    setMobilityData(prev => ({
      ...prev,
      mobilityRate: Math.round(finalRate * 10) / 10  // 保留一位小数
    }))
  }

  // 计算总裁剪周长
  const calculateTotalPerimeter = () => {
    const { dailyAvgPerimeter, statisticsDays } = cuttingPerimeterData
    const totalKM = (dailyAvgPerimeter * statisticsDays) / 1000
    setCuttingPerimeterData(prev => ({
      ...prev,
      totalPerimeterKM: Math.round(totalKM * 100) / 100  // 保留两位小数
    }))
  }

  // 格式化时间显示（分钟转换为小时分钟）
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}小时${mins}分钟`
  }

  // 跳转到我的页面
  const goToMine = () => {
    switchTab({ url: '/pages/mine/index' })
  }

  // 处理查询
  const handleQuery = (formData: FilterFormData) => {
    // TODO: 实现查询逻辑，查询成功后更新所有模块数据
    // 模拟查询结果更新
    setMobilityData({
      totalCuttingTime: 420,  // 7小时
      totalWorkTime: 540,  // 9小时
      totalRestTime: 180,     // 3小时
      mobilityRate: 75.0
    })
    
    setCuttingPerimeterData({
      statisticsDays: 5,           // 统计5天
      dailyAvgPerimeter: 1420,     // 日均1420米
      maxDailyPerimeter: 1850,     // 最大1850米
      minDailyPerimeter: 1020,     // 最小1020米
      totalPerimeterKM: 7.10       // 总周长7.10千米
    })

    setCuttingSpeedData({
      currentSpeed: 6.2,           // 当前速度6.2m/min
      avgCuttingSpeed: 6.1,        // 平均裁剪速度6.1m/min
      avgIdleSpeed: 0.3,           // 平均空走速度0.3m/min
      overallAvgSpeed: 6.0,        // 整体平均速度6.0m/min
      maxSpeed: 8.1,               // 最大速度8.1m/min
      minSpeed: 4.2                // 最小速度4.2m/min
    })
  }

  return (
    <View className='index'>
      {/* 固定定位的筛选表单区域 */}
      <View className='filter-header'>
        <FilterForm onQuery={handleQuery} onGoToMine={goToMine} />
      </View>

      {/* 可滚动的内容区域 */}
      <View className='scrollable-content'>
        {/* 移动率模块 */}
        <View className='mobility-module'>
          <View className='module-title'>移动率</View>
          <View className='mobility-content'>
            {/* 环形进度条区域 */}
            <View className='progress-section'>
              <MobilityRate 
                value={mobilityData.mobilityRate} 
                size={120}
                strokeWidth={8}
                variant="embedded"
                hideTitle={true}
              />
            </View>

            {/* 时间信息展示区域 */}
            <View className='time-info-section'>
              <View className='time-info-item'>
                <Text className='time-label'>总裁剪时间：</Text>
                <Text className='time-value'>{formatTime(mobilityData.totalCuttingTime)}</Text>
              </View>
              <View className='time-info-item'>
                <Text className='time-label'>总工作时间：</Text>
                <Text className='time-value'>{formatTime(mobilityData.totalWorkTime)}</Text>
              </View>
              <View className='time-info-item'>
                <Text className='time-label'>总休息时间：</Text>
                <Text className='time-value'>{formatTime(mobilityData.totalRestTime)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 裁剪周长模块 */}
        <CuttingPerimeter data={cuttingPerimeterData} />

        {/* 裁剪速度模块 */}
        <CuttingSpeed data={cuttingSpeedData} />
      </View>
    </View>
  )
}
