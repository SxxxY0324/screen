import React, { useState, useEffect } from 'react'
import { View, Text, Button, Input, Image } from '@tarojs/components'
import { switchTab, showToast } from '@tarojs/taro'
import { authService } from '../../services/auth'
import './index.scss'

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    account: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberAccount, setRememberAccount] = useState(false)

  useEffect(() => {
    // 尝试从本地存储中恢复账号
    const savedAccount = authService.getRememberedAccount()
    if (savedAccount) {
      setFormData(prev => ({ ...prev, account: savedAccount }))
      setRememberAccount(true)
    }
  }, [])

  /**
   * 处理输入变化
   */
  const handleInputChange = (field: 'account' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  /**
   * 表单验证
   */
  const validateForm = (): boolean => {
    if (!formData.account.trim()) {
      showToast({
        title: '请输入账号',
        icon: 'none'
      })
      return false
    }

    if (!formData.password.trim()) {
      showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return false
    }

    if (formData.account.length < 2) {
      showToast({
        title: '账号长度至少2位',
        icon: 'none'
      })
      return false
    }

    if (formData.password.length < 4) {
      showToast({
        title: '密码长度至少4位',
        icon: 'none'
      })
      return false
    }

    return true
  }

  /**
   * 处理登录
   */
  const handleLogin = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // 执行登录
      const loginData = await authService.login({
        account: formData.account,
        password: formData.password
      })
      
      // 处理记住账号
      if (rememberAccount) {
        authService.saveRememberedAccount(formData.account)
      } else {
        authService.clearRememberedAccount()
      }

      // 显示成功消息
      showToast({
        title: '登录成功',
        icon: 'success'
      })

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        try {
          switchTab({
            url: '/pages/index/index'
          })
        } catch (error) {
          // 简化错误日志
          console.error('跳转失败:', error)
        }
      }, 1500)

    } catch (error: any) {
      // 简化错误日志
      console.error('登录失败:', error)
      
      showToast({
        title: error.message || '登录失败，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='login-container'>
      {/* 背景渐变 */}
      <View className='background-gradient'></View>
      
      {/* 主要内容 */}
      <View className='login-content'>
        {/* Logo和标题 */}
        <View className='header-section'>
          <View className='logo-wrapper'>
            <View className='logo-icon'>
              <Text className='logo-text'>JW</Text>
            </View>
          </View>
          <Text className='app-title'>JW-MES 移动端</Text>
          <Text className='app-subtitle'>工业制造执行系统</Text>
        </View>

        {/* 登录表单 */}
        <View className='form-section'>
          {/* 表单标题 */}
          <View className='form-header'>
            <Text className='welcome-title'>欢迎回来</Text>
            <Text className='welcome-subtitle'>请使用您的账号密码登录系统</Text>
          </View>

          {/* 账号输入 */}
          <View className='input-group'>
            <Text className='input-label'>
              <Text className='label-icon'>👤</Text>
              <Text className='label-text'>账号</Text>
            </Text>
            <View className='input-wrapper'>
              <View className='input-icon'>
                <Text className='icon-symbol'>👤</Text>
              </View>
              <Input
                className='form-input'
                placeholder='请输入您的工号或账号'
                value={formData.account}
                onInput={(e) => setFormData(prev => ({ ...prev, account: e.detail.value }))}
                maxlength={50}
              />
            </View>
          </View>

          {/* 密码输入 */}
          <View className='input-group'>
            <Text className='input-label'>
              <Text className='label-icon'>🔒</Text>
              <Text className='label-text'>密码</Text>
            </Text>
            <View className='input-wrapper'>
              <View className='input-icon'>
                <Text className='icon-symbol'>🔒</Text>
              </View>
              <Input
                className='form-input password-input'
                placeholder='请输入您的密码'
                value={formData.password}
                onInput={(e) => setFormData(prev => ({ ...prev, password: e.detail.value }))}
                password={!showPassword}
                maxlength={50}
              />
              <View 
                className='password-toggle'
                onClick={() => setShowPassword(!showPassword)}
              >
                <Text className='toggle-icon'>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </View>
            </View>
          </View>

          {/* 选项区域 */}
          <View className='options-section'>
            <View className='remember-section'>
              <View 
                className={`checkbox ${rememberAccount ? 'checked' : ''}`}
                onClick={() => setRememberAccount(!rememberAccount)}
              >
                {rememberAccount && <Text className='checkmark'>✓</Text>}
              </View>
              <Text className='remember-text'>记住账号</Text>
            </View>
            <View className='forgot-password'>
              <Text className='forgot-link'>忘记密码？</Text>
            </View>
          </View>

          {/* 登录按钮 */}
          <Button 
            className={`login-button ${loading ? 'loading' : ''}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View className='loading-content'>
                <View className='loading-spinner'></View>
                <Text className='loading-text'>登录中...</Text>
              </View>
            ) : (
              <Text className='button-text'>立即登录</Text>
            )}
          </Button>

          {/* 底部提示 */}
          <View className='form-footer'>
            <Text className='footer-text'>
              首次使用？请联系系统管理员获取账号
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Login 