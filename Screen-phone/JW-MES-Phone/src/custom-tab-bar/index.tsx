import { useState, useEffect } from 'react'
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

export default function CustomTabBar() {
  const [selected, setSelected] = useState(0)
  const [isTabBarPage, setIsTabBarPage] = useState(true) // 标记是否为TabBar页面
  
  // 切换页面时更新选中状态
  useEffect(() => {
    const updateSelected = () => {
      const pages = Taro.getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (currentPage) {
        const currentPath = `/${currentPage.route}`
        
        // 检查是否是TabBar页面
        const tabIndex = tabList.findIndex(item => item.pagePath === currentPath)
        
        if (tabIndex !== -1) {
          // 是TabBar页面
          setSelected(tabIndex)
          setIsTabBarPage(true)
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
  
  // 处理标签点击
  const switchTab = (index, url) => {
    // 如果当前不是TabBar页面，可能需要返回
    if (!isTabBarPage) {
      // 如果在非TabBar页面点击当前选中的Tab，则返回上一页
      if (selected === index) {
        Taro.navigateBack()
        return
      }
    }
    
    // 标准的切换TabBar行为
    if (selected !== index) {
      Taro.switchTab({ url })
      setSelected(index)
    }
  }
  
  return (
    <View className='custom-tab-bar'>
      {tabList.map((item, index) => (
        <View 
          key={index}
          className={`tab-item ${selected === index ? 'selected' : ''}`}
          onClick={() => switchTab(index, item.pagePath)}
        >
          <Image
            className='tab-icon'
            src={selected === index ? item.selectedIconPath : item.iconPath}
          />
          <Text className='tab-text'>{item.text}</Text>
        </View>
      ))}
    </View>
  )
}
