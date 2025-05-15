export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/monitor/index',
    'pages/management/index',
    'pages/analysis/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '大屏监控',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#666",
    selectedColor: "#07c160",
    backgroundColor: "#fff",
    list: [
      {
        pagePath: "pages/monitor/index",
        text: "实时监控"
      },
      {
        pagePath: "pages/management/index",
        text: "维保管理"
      },
      {
        pagePath: "pages/analysis/index",
        text: "达标分析"
      },
      {
        pagePath: "pages/user/index",
        text: "我的"
      }
    ]
  },
  requiredPrivateInfos: [
    "getLocation"
  ],
  permission: {
    "scope.userLocation": {
      "desc": "您的位置信息将用于监控设备的位置显示"
    }
  }
})
