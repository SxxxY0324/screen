import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { getStorage, setStorage } from '../../utils/storage'
import { showToast } from '../../utils/ui'
import './index.scss'

// API路径配置
const API_BASE_URL = 'http://172.16.69.121:8080/api';

export default function Index() {
  const [loading, setLoading] = useState(false)
  const [debug, setDebug] = useState('页面已加载')
  const [loginStep, setLoginStep] = useState(0)  // 0: 未登录, 1: 已登录待获取手机号
  const [isH5, setIsH5] = useState(false)

  useEffect(() => {
    // 检测当前环境
    const currentEnv = process.env.TARO_ENV
    setIsH5(currentEnv === 'h5')
    console.log('Index页面已加载，当前环境:', currentEnv)
    
    // 添加调试输出
    console.log('Index页面已加载')
    
    // H5环境使用不同的方式获取系统信息
    if (currentEnv === 'h5') {
      // H5环境下直接使用浏览器的navigator信息
      const userAgent = navigator.userAgent;
      setDebug(`H5环境: ${userAgent}`);
      console.log('浏览器信息:', userAgent);
    } else {
      // 微信小程序环境下使用Taro API
      try {
        // 尝试获取系统信息，测试API是否正常
        Taro.getSystemInfo({
          success: function(res) {
            setDebug(`系统信息: ${res.model} ${res.system}`)
            console.log('系统信息:', res)
          },
          fail: function(err) {
            setDebug(`获取系统信息失败: ${JSON.stringify(err)}`)
            console.error('获取系统信息失败:', err)
          }
        })
      } catch (error) {
        console.error('API调用错误:', error);
        setDebug(`API错误: ${error.message}`);
      }
    }

    // 检查是否已经有token
    const token = getStorage('token')
    if (token) {
      // 已有token，直接跳转到首页
      navigateToMainPage()
    } else if (currentEnv === 'h5') {
      // H5环境下，显示临时访客登录按钮
      setDebug('H5环境，请点击临时访客登录')
    }
  }, [])

  // 导航到主页面
  const navigateToMainPage = () => {
    Taro.switchTab({
      url: '/pages/monitor/index',
      success: () => {
        console.log('成功跳转到监控页面')
      },
      fail: (error) => {
        console.error('跳转失败:', error)
        setDebug(`跳转失败: ${JSON.stringify(error)}`)
        setLoading(false)
      }
    })
  }
  
  // 微信登录按钮点击处理
  const handleLogin = () => {
    setLoading(true)
    setDebug('点击登录按钮')
    console.log('登录按钮点击')
    
    // 如果是H5环境，执行简化的登录流程
    if (isH5) {
      handleH5Login()
      return
    }
    
    // 调用微信登录接口
    Taro.login({
      success: (loginRes) => {
        if (loginRes.code) {
          console.log('获取到code:', loginRes.code)
          setDebug(`获取到code: ${loginRes.code}`)
          
          // 使用code向后端换取用户token
          Taro.request({
            url: `${API_BASE_URL}/auth/login`,
            method: 'POST',
            data: {
              code: loginRes.code
            },
            success: (res) => {
              console.log('登录成功:', res.data)
              
              if (res.data && res.data.token) {
                // 保存token到本地存储
                setStorage('token', res.data.token)
                setStorage('userId', res.data.userId || '')
                
                setDebug(`登录成功: ${res.data.userId || ''}`)
                // 将登录状态更新为需要获取手机号
                setLoginStep(1)
                setLoading(false)
              } else {
                console.error('登录返回数据异常:', res.data)
                setDebug(`登录返回数据异常: ${JSON.stringify(res.data)}`)
                setLoading(false)
              }
            },
            fail: (err) => {
              console.error('请求后端登录接口失败:', err)
              setDebug(`请求后端登录接口失败: ${JSON.stringify(err)}`)
              setLoading(false)
            }
          })
        } else {
          console.error('获取微信code失败')
          setDebug('获取微信code失败')
          setLoading(false)
        }
      },
      fail: (err) => {
        console.error('微信登录失败:', err)
        setDebug(`微信登录失败: ${JSON.stringify(err)}`)
        setLoading(false)
      }
    })
  }

  // H5环境简化登录处理
  const handleH5Login = () => {
    setDebug('H5环境临时登录')
    
    // 模拟登录状态
    setStorage('token', 'h5-temporary-token')
    setStorage('userId', 'h5-visitor')
    
    // 显示登录成功提示
    showToast({
      title: '访客登录成功',
      icon: 'success',
      duration: 2000
    })
    
    // 立即跳转到主页，不使用setTimeout延迟
    setLoading(false)
    navigateToMainPage()
  }

  // 获取手机号按钮回调
  const handleGetPhoneNumber = (e) => {
    console.log('获取手机号回调:', e)
    
    // 判断是否成功获取
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      setLoading(true)
      setDebug('获取手机号成功，准备发送到服务器')
      
      // 向后端发送获取到的加密数据
      Taro.request({
        url: `${API_BASE_URL}/auth/get-phone`,
        method: 'POST',
        data: {
          code: e.detail.code
        },
        success: (res) => {
          console.log('获取手机号接口返回:', res.data)
          if (res.data && res.data.success) {
            // 保存手机号
            const phoneInfo = res.data.phoneInfo
            if (phoneInfo && phoneInfo.phoneNumber) {
              setStorage('phoneNumber', phoneInfo.phoneNumber)
              setDebug(`手机号获取成功: ${phoneInfo.phoneNumber}`)
              
              // 跳转到主页
              navigateToMainPage()
            } else {
              setDebug('未能获取到手机号')
              setLoading(false)
            }
          } else {
            setDebug(`获取手机号失败: ${res.data.message || '未知错误'}`)
            setLoading(false)
          }
        },
        fail: (err) => {
          console.error('请求获取手机号接口失败:', err)
          setDebug(`请求获取手机号接口失败: ${JSON.stringify(err)}`)
          setLoading(false)
        }
      })
    } else {
      console.log('用户拒绝授权手机号')
      setDebug('用户拒绝授权手机号')
      
      // 用户拒绝授权，仍然可以继续使用（可根据业务需求调整）
      // 这里简单处理为直接跳转到主页
      navigateToMainPage()
    }
  }

  // 渲染登录按钮
  const renderLoginButton = () => {
    if (isH5) {
      // H5环境显示临时访客登录按钮
      return (
        <Button 
          className='h5-login-button'
          loading={loading}
          onClick={handleH5Login}
          type='primary'
        >
          临时访客登录
        </Button>
      )
    } else {
      // 小程序环境
      if (loginStep === 0) {
        // 未登录状态，显示微信登录按钮
        return (
          <Button 
            className='login-button'
            loading={loading}
            onClick={handleLogin}
            type='primary'
          >
            微信一键登录
          </Button>
        )
      } else {
        // 已登录状态，需要获取手机号
        return (
          <Button 
            className='phone-button'
            loading={loading}
            openType='getPhoneNumber' 
            onGetPhoneNumber={handleGetPhoneNumber}
            type='primary'
          >
            授权手机号并登录
          </Button>
        )
      }
    }
  }

  return (
    <View className='index'>
      <View className='title'>大屏监控系统</View>
      <View className='subtitle'>移动端 & 小程序</View>
      
      {renderLoginButton()}
      
      <View className='debug-section'>
        <Text className='debug-info'>{debug}</Text>
      </View>
      
      <Text className='version-info'>v1.0.0</Text>
    </View>
  )
}
