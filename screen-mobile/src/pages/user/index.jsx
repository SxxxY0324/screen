import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { getStorage, removeStorage } from '../../utils/storage'
import { showModal, showToast } from '../../utils/ui'
import './index.scss'

export default function User() {
  const [userInfo, setUserInfo] = useState({
    userId: '',
    phoneNumber: ''
  })
  const [isH5, setIsH5] = useState(false)

  useEffect(() => {
    // 检测当前环境
    const currentEnv = process.env.TARO_ENV
    setIsH5(currentEnv === 'h5')
    console.log('用户页面加载，当前环境:', currentEnv)
    
    // 页面加载时读取本地存储的用户信息
    const userId = getStorage('userId') || ''
    const phoneNumber = getStorage('phoneNumber') || ''
    const token = getStorage('token') || ''

    console.log('用户页面加载，当前登录状态:', !!token)
    
    if (!token) {
      // 未登录状态，跳转到登录页
      Taro.redirectTo({
        url: '/pages/index/index',
        success: () => {
          console.log('成功跳转到登录页')
        },
        fail: (err) => {
          console.error('跳转到登录页失败:', err)
        }
      })
      return
    }
    
    // 设置用户信息
    if (currentEnv === 'h5' && userId === 'h5-visitor') {
      // H5环境下的访客模式
      setUserInfo({
        userId: '访客账号',
        phoneNumber: '未绑定手机号'
      })
    } else {
      // 正常登录用户
      setUserInfo({
        userId,
        phoneNumber: phoneNumber || '未绑定手机号'
      })
    }
  }, [])

  // 退出登录
  const handleLogout = () => {
    // 显示确认对话框
    showModal({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          // 清除所有登录信息
          removeStorage('token')
          removeStorage('userId')
          removeStorage('phoneNumber')
          
          showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 2000
          })
          
          // 立即跳转到登录页，使用redirectTo而不是navigateTo
          Taro.redirectTo({
            url: '/pages/index/index',
            success: () => {
              console.log('成功跳转到登录页')
            },
            fail: (err) => {
              console.error('跳转到登录页失败:', err)
              // 如果redirectTo失败，尝试使用reLaunch（关闭所有页面，打开到应用内的某个页面）
              Taro.reLaunch({
                url: '/pages/index/index'
              })
            }
          })
        }
      }
    })
  }

  return (
    <View className='user-page'>
      <View className='user-header'>
        <View className='avatar-container'>
          <Image 
            className='user-avatar' 
            src='https://img.icons8.com/color/96/000000/user-male-circle--v1.png'
          />
        </View>
        <View className='user-info'>
          <Text className='user-id'>用户ID: {userInfo.userId || '未登录'}</Text>
          <Text className='user-phone'>手机号: {userInfo.phoneNumber}</Text>
          {isH5 && <Text className='h5-tag'>H5模式</Text>}
        </View>
      </View>
      
      <View className='menu-section'>
        <View className='menu-title'>账户管理</View>
        <View className='menu-list'>
          <View className='menu-item'>
            <Text className='item-label'>账户信息</Text>
            <Text className='item-arrow'>›</Text>
          </View>
          <View className='menu-item'>
            <Text className='item-label'>通知设置</Text>
            <Text className='item-arrow'>›</Text>
          </View>
        </View>
      </View>
      
      <View className='menu-section'>
        <View className='menu-title'>系统设置</View>
        <View className='menu-list'>
          <View className='menu-item'>
            <Text className='item-label'>帮助中心</Text>
            <Text className='item-arrow'>›</Text>
          </View>
          <View className='menu-item'>
            <Text className='item-label'>关于我们</Text>
            <Text className='item-arrow'>›</Text>
          </View>
        </View>
      </View>
      
      <Button 
        className='logout-button' 
        onClick={handleLogout}
      >
        退出登录
      </Button>
      
      {isH5 && (
        <View className='h5-notice'>
          <Text>当前为H5演示模式，使用访客账号</Text>
        </View>
      )}
      
      <Text className='version-info'>大屏监控系统 v1.0.0</Text>
    </View>
  )
} 