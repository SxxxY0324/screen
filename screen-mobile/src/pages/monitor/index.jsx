import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { getStorage } from '../../utils/storage'
import './index.scss'

// 模拟数据
const mockMonitorData = [
  { id: 1, name: '1号设备', status: '正常', temperature: '36.5°C', humidity: '45%', lastUpdate: '2025-05-15 14:30:45' },
  { id: 2, name: '2号设备', status: '警告', temperature: '42.1°C', humidity: '38%', lastUpdate: '2025-05-15 14:29:12' },
  { id: 3, name: '3号设备', status: '正常', temperature: '35.8°C', humidity: '42%', lastUpdate: '2025-05-15 14:28:30' },
  { id: 4, name: '4号设备', status: '正常', temperature: '37.2°C', humidity: '40%', lastUpdate: '2025-05-15 14:27:55' },
  { id: 5, name: '5号设备', status: '离线', temperature: 'N/A', humidity: 'N/A', lastUpdate: '2025-05-15 12:15:22' }
]

export default function Monitor() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [monitorData, setMonitorData] = useState([])
  const [isH5, setIsH5] = useState(false)
  
  useEffect(() => {
    // 检测当前环境
    const currentEnv = process.env.TARO_ENV
    setIsH5(currentEnv === 'h5')
    console.log('Monitor页面已加载，当前环境:', currentEnv)
    
    // 检查登录状态
    const token = getStorage('token')
    
    if (!token) {
      console.log('未检测到token，需要登录')
      
      // 避免使用redirectTo，改用navigateTo以避免循环跳转
      Taro.redirectTo({
        url: '/pages/index/index',
        success: () => {
          console.log('成功跳转到登录页')
        },
        fail: (err) => {
          console.error('跳转到登录页失败:', err)
          setError('跳转失败，请手动返回登录页')
        }
      })
    } else {
      // 有token，可以直接显示页面内容
      if (currentEnv === 'h5') {
        // H5环境使用模拟数据
        loadMockData()
      } else {
        // 小程序环境加载真实数据
        loadRealData()
      }
    }
  }, [])

  // 加载模拟数据
  const loadMockData = () => {
    setTimeout(() => {
      setMonitorData(mockMonitorData)
      setIsLoading(false)
      console.log('已加载模拟监控数据')
    }, 1000) // 模拟网络延迟
  }
  
  // 加载真实数据 (如果后端API可用)
  const loadRealData = () => {
    // TODO: 实现真实数据获取逻辑
    // 暂时也使用模拟数据
    loadMockData()
  }

  // 如果还在加载或有错误，显示相应提示
  if (isLoading) {
    return (
      <View className='loading-container'>
        <Text>数据加载中...</Text>
      </View>
    )
  }
  
  if (error) {
    return (
      <View className='error-container'>
        <Text className='error-text'>{error}</Text>
      </View>
    )
  }

  return (
    <View className='monitor-page'>
      <View className='page-header'>
        <Text className='title'>实时监控</Text>
        {isH5 && <Text className='env-tag'>H5模式</Text>}
      </View>
      
      <ScrollView 
        className='monitor-list'
        scrollY
      >
        {monitorData.map(item => (
          <View 
            key={item.id}
            className={`monitor-item ${item.status === '警告' ? 'warning' : item.status === '离线' ? 'offline' : ''}`}
          >
            <View className='item-header'>
              <Text className='item-name'>{item.name}</Text>
              <Text className={`item-status ${item.status === '警告' ? 'warning' : item.status === '离线' ? 'offline' : 'normal'}`}>
                {item.status}
              </Text>
            </View>
            
            <View className='item-content'>
              <View className='item-data'>
                <Text className='data-label'>温度:</Text>
                <Text className='data-value'>{item.temperature}</Text>
              </View>
              <View className='item-data'>
                <Text className='data-label'>湿度:</Text>
                <Text className='data-value'>{item.humidity}</Text>
              </View>
            </View>
            
            <View className='item-footer'>
              <Text className='last-update'>最后更新: {item.lastUpdate}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {isH5 && (
        <View className='h5-notice'>
          <Text>注意: 当前为H5演示模式，显示模拟数据</Text>
        </View>
      )}
    </View>
  )
}