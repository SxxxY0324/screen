import { PropsWithChildren, useEffect } from 'react'
import { useLaunch } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { AppProvider } from './store/AppContext'
import { authService } from './services/auth'
import './app.scss'
import './styles/common.scss' // 引入全局通用样式

// 引入Taro UI全局样式
import 'taro-ui/dist/style/index.scss'

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    // 移除调试语句
  })

  useEffect(() => {
    // 应用启动时检查登录状态
    checkLoginStatus()
  }, [])

  /**
   * 检查登录状态
   */
  const checkLoginStatus = async () => {
    try {
      // 获取当前页面路径
      const pages = Taro.getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const currentRoute = currentPage?.route || ''
      
      // 定义不需要登录的公开页面
      const publicPages = [
        'pages/login/index'
      ]

      // 检查当前是否在公开页面
      if (publicPages.some(page => currentRoute.includes(page))) {
        // 移除调试语句
        return
      }

      // 检查本地登录状态
      const isLoggedIn = authService.isLoggedIn()
      // 移除调试语句

      if (!isLoggedIn) {
        // 移除调试语句
        // 跳转到登录页面
        Taro.reLaunch({
          url: '/pages/login/index'
        })
        return
      }

      // 如果有token，验证其有效性
      try {
        // 移除调试语句
        const response = await authService.validateToken()
        
        if (response.success) {
          // 移除调试语句
        } else {
          // 移除调试语句
          // 跳转到登录页面
          Taro.reLaunch({
            url: '/pages/login/index'
          })
        }
      } catch (error) {
        console.error('令牌验证出错:', error)
        // 跳转到登录页面
        Taro.reLaunch({
          url: '/pages/login/index'
        })
      }
      
    } catch (error) {
      console.error('登录状态检查失败:', error)
      // 出错时跳转到登录页面
      Taro.reLaunch({
        url: '/pages/login/index'
      })
    }
  }

  // 使用AppProvider包装应用
  return (
    <AppProvider>
      {children}
    </AppProvider>
  )
}

export default App 