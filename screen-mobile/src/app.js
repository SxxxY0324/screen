import { Component } from 'react'
import Taro from '@tarojs/taro'
// 引入自定义组件样式
import './custom-components.scss'
import './app.scss'

// 不需要Provider可以移除
class App extends Component {
  componentWillMount() {
    // 初始化日志
    console.log('App initialized')
  }
  
  componentDidMount () {
    // 检查更新
    if (process.env.TARO_ENV === 'weapp') {
      console.log('Running in WeChat Mini Program')
    }
  }

  componentDidShow () {
    console.log('App shown')
  }

  componentDidHide () {
    console.log('App hidden')
  }

  // 错误处理
  onError(err) {
    console.error('App error:', err)
  }

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
