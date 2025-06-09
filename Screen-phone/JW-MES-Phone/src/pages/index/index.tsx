import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad, switchTab } from '@tarojs/taro'
import { AtButton, AtCard } from 'taro-ui'
import { useAppContext } from '../../store/AppContext'
import platform from '../../utils/platform'
import './index.scss'

// 引入必要的Taro UI样式
import 'taro-ui/dist/style/components/button.scss'
import 'taro-ui/dist/style/components/card.scss'
import 'taro-ui/dist/style/components/icon.scss'

export default function Index() {
  const [count, setCount] = useState(0)
  const { state } = useAppContext()

  useLoad(() => {
    console.log('Index page loaded.')
  })

  // 跳转到我的页面
  const goToMine = () => {
    switchTab({ url: '/pages/mine/index' })
  }

  return (
    <View className='index'>
      <AtCard
        title='平台信息'
        className='platform-card'
      >
        <View className='platform-info'>
          当前平台: {platform.isWeapp ? '微信小程序' : platform.isH5 ? 'H5' : '其他平台'}
        </View>
      </AtCard>

      <AtCard
        title='计数器示例'
        className='counter-card'
      >
        <View className='counter'>
          <Text className='count-number'>{count}</Text>
          <AtButton type='primary' onClick={() => setCount(count + 1)}>增加</AtButton>
        </View>
      </AtCard>

      <AtCard
        title='用户信息'
        className='user-card'
      >
        <View className='user-info'>
          {state.isLogin ? (
            <Text>欢迎您, {state.userInfo?.name}</Text>
          ) : (
            <Text>您尚未登录</Text>
          )}
        </View>
      </AtCard>

      <View className='navigation-btn'>
        <AtButton type='secondary' onClick={goToMine}>前往我的页面</AtButton>
      </View>
    </View>
  )
}
