import { useState, useEffect, useRef, useCallback } from 'react'
import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// TabBar项目配置
const tabList = [
  {
    pagePath: '/pages/list/index',
    text: '列表',
    iconPath: '../assets/tabbar/列表.png',
    selectedIconPath: '../assets/tabbar/列表.png'
  },
  {
    pagePath: '/pages/compare/index',
    text: '对比',
    iconPath: '../assets/tabbar/对比.png',
    selectedIconPath: '../assets/tabbar/对比.png'
  },
  {
    pagePath: '/pages/service/index',
    text: '服务',
    iconPath: '../assets/tabbar/服务管理.png',
    selectedIconPath: '../assets/tabbar/服务管理.png'
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    iconPath: '../assets/tabbar/我的.png',
    selectedIconPath: '../assets/tabbar/我的.png'
  }
]

// 定义一个映射关系，指定非TabBar页面应该继承哪个TabBar页面的选中状态
const inheritSelectedTabMap = {
  // 已经不需要映射，所有功能都整合到了list页面中
}

// 判断当前是否是微信小程序环境
const isWeapp = process.env.TARO_ENV === 'weapp'

export default function CustomTabBar() {
  const [selected, setSelected] = useState(0)
  const [isTabBarPage, setIsTabBarPage] = useState(true) // 标记是否为TabBar页面
  const isClickingRef = useRef(false) // 用于防止重复点击
  const pendingTabIndexRef = useRef<number | null>(null) // 存储等待跳转的Tab索引
  
  // 切换页面时更新选中状态
  useEffect(() => {
    const updateSelected = () => {
      // 使用当前页面来确定应该选中的标签
      const pages = Taro.getCurrentPages()
      const currentPage = pages[pages.length - 1]
      
      if (currentPage) {
        const currentPath = `/${currentPage.route}`
        // 检查是否是TabBar页面
        const tabIndex = tabList.findIndex(item => item.pagePath === currentPath)
        
        if (tabIndex !== -1) {
          // 是TabBar页面 - 根据实际页面设置选中状态
          setSelected(tabIndex)
          setIsTabBarPage(true)
          
          // 微信小程序环境下，确保选中状态与当前页面匹配
          if (isWeapp && pendingTabIndexRef.current !== null) {
            // 如果有待处理的跳转，但页面已经成功跳转到其他页面，清除待处理状态
            if (pendingTabIndexRef.current !== tabIndex) {
              pendingTabIndexRef.current = null;
            }
          }
        } else {
          // 非TabBar页面，检查是否需要继承某个TabBar的选中状态
          const inheritFrom = inheritSelectedTabMap[currentPath]
          if (inheritFrom) {
            const inheritIndex = tabList.findIndex(item => item.pagePath === inheritFrom)
            if (inheritIndex !== -1) {
              setSelected(inheritIndex)
            }
          }
          // 即使在非TabBar页面也显示TabBar
          setIsTabBarPage(false)
        }
      }
    }
    
    updateSelected()
    
    // 监听页面显示事件，确保在页面切换时正确更新
    Taro.eventCenter.on('taroDidShow', updateSelected)
    
    return () => {
      Taro.eventCenter.off('taroDidShow', updateSelected)
    }
  }, [])
  
  // 使用useCallback包裹switchTab函数，优化性能
  const switchTab = useCallback((index, url) => {
    // 防止重复点击
    if (isClickingRef.current) {
      return
    }
    
    // 防抖，标记为正在点击
    isClickingRef.current = true
    
    // 处理非TabBar页面的情况
    if (!isTabBarPage && selected === index) {
      Taro.navigateBack().finally(() => {
        // 重置点击状态
        setTimeout(() => {
          isClickingRef.current = false
        }, 500) // 增加延迟时间
      })
      return
    }
    
    // 只有在不是当前选中标签时才执行切换
    if (selected !== index) {
      // 微信小程序环境中，记录待处理的跳转，但不立即更新UI
      if (isWeapp) {
        pendingTabIndexRef.current = index;
      } else {
        // 非微信环境（如H5）可以立即更新UI，因为这在H5环境中工作良好
        setSelected(index);
      }
      
      // 执行标签切换
      Taro.switchTab({ 
        url,
        success: () => {
          // 跳转成功后，重置点击状态
          setTimeout(() => {
            isClickingRef.current = false
            
            // 非微信环境不需要特殊处理，微信环境依赖didShow事件更新
            if (!isWeapp) {
              pendingTabIndexRef.current = null;
            }
          }, 500) // 增加延迟时间
        },
        fail: () => {
          // 跳转失败，清除待处理状态
          pendingTabIndexRef.current = null;
          isClickingRef.current = false;
        },
        complete: () => {
          // 确保在所有情况下都重置点击状态
          setTimeout(() => {
            isClickingRef.current = false;
          }, 500) // 增加延迟时间
        }
      })
    } else {
      // 点击当前已选中的标签，无需操作，重置点击状态
      isClickingRef.current = false
    }
  }, [isTabBarPage, selected])
  
  // 确定要显示的选中状态 - 微信环境下优先使用pending状态
  const displaySelected = isWeapp && pendingTabIndexRef.current !== null ? 
    pendingTabIndexRef.current : selected;
  
  return (
    <View className='custom-tab-bar'>
      {tabList.map((item, index) => (
        <View 
          key={index}
          className={`tab-item ${displaySelected === index ? 'selected' : ''}`}
          onClick={() => switchTab(index, item.pagePath)}
          hoverClass='tab-item-hover'
          hoverStayTime={100}
        >
          <Image
            className='tab-icon'
            src={displaySelected === index ? item.selectedIconPath : item.iconPath}
          />
          <Text className='tab-text'>{item.text}</Text>
        </View>
      ))}
    </View>
  )
}
