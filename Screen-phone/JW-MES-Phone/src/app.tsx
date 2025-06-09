import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { AppProvider } from './store/AppContext'
import './app.scss'
import './styles/common.scss' // 引入全局通用样式

// 引入Taro UI全局样式
import 'taro-ui/dist/style/index.scss'

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // 使用AppProvider包装应用
  return (
    <AppProvider>
      {children}
    </AppProvider>
  )
}

export default App 