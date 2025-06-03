export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/mine/index',
    'pages/list/index',
    'pages/compare/index',
    'pages/service/index',
    'pages/time-selector/index',
    'pages/device-details/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'JW-MES移动端',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: '#999',
    selectedColor: '#1890FF',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/list/index',
        text: '列表',
        iconPath: 'assets/tabbar/列表.png',
        selectedIconPath: 'assets/tabbar/列表.png'
      },
      {
        pagePath: 'pages/compare/index',
        text: '对比',
        iconPath: 'assets/tabbar/对比.png',
        selectedIconPath: 'assets/tabbar/对比.png'
      },
      {
        pagePath: 'pages/service/index',
        text: '服务',
        iconPath: 'assets/tabbar/服务管理.png',
        selectedIconPath: 'assets/tabbar/服务管理.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/tabbar/我的.png',
        selectedIconPath: 'assets/tabbar/我的.png'
      }
    ]
  }
})
