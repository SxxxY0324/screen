import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { getStorage } from '../../utils/storage'
import './index.scss'

export default function Analysis() {
  const [isH5, setIsH5] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // 检测当前环境
    const currentEnv = process.env.TARO_ENV
    setIsH5(currentEnv === 'h5')
    console.log('分析页面已加载，当前环境:', currentEnv)
    
    // 检查登录状态
    const token = getStorage('token')
    console.log('当前token状态:', !!token)
    
    if (!token) {
      console.log('未检测到token，需要登录')
      
      // 必须使用redirectTo而不是switchTab，因为index页面不在tabBar中
      Taro.redirectTo({
        url: '/pages/index/index',
        success: () => {
          console.log('成功跳转到登录页')
        },
        fail: (err) => {
          console.error('跳转到登录页失败:', err)
        }
      })
    } else {
      // 有token，显示页面内容
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <View className='loading-container'>
        <Text>数据加载中...</Text>
      </View>
    )
  }

  return (
    <View className='analysis-page'>
      <View className='page-header'>
        <Text className='title'>达标分析</Text>
        {isH5 && <Text className='env-tag'>H5模式</Text>}
      </View>
      <View className='content'>
        <Text>达标分析内容将在这里显示</Text>
      </View>
    </View>
  )
} 