/**
 * 中文语言资源
 */
export const zh = {
  // 导航菜单
  nav: {
    monitoring: '实时监控',
    maintenance: '维保管理', 
    analysis: '业绩分析',
    ai: 'AI',
    country: '中国',
    workshop: '车间',
    device: '设备',
    allWorkshops: '全部车间',
    allDevices: '全部设备',
    selectedWorkshops: '已选{count}个车间',
    selectedDevices: '已选{count}个设备'
  },
  
  // 时间范围选项
  timeRange: {
    none: '不选',
    today: '今天',
    yesterday: '昨天',
    dayBeforeYesterday: '前天',
    thisWeek: '本周',
    lastWeek: '上周',
    thisMonth: '本月',
    lastMonth: '上月',
    thisQuarter: '本季度',
    lastQuarter: '上季度',
    thisYear: '本年',
    lastYear: '上年'
  },
  
  // 监控指标
  monitor: {
    efficiency: '移动率',
    cutTime: '裁剪时间',
    energy: '能耗',
    cutSpeed: '裁剪速度',
    perimeter: '周长',
    cutSets: '裁剪套数',
    
    // 设备状态
    status: {
      cutting: '裁剪',
      standby: '待机', 
      unplanned: '非计划停机',
      planned: '计划停机'
    },
    
    // 单位
    units: {
      efficiency: '%',
      cutTime: 'h',
      energy: 'kW·h',
      cutSpeed: 'm/s',
      perimeter: 'm',
      cutSets: '套',
      speed: 'm/s',
      duration: 'h'
    },
    
    // 状态监控面板
    statusPanel: {
      title: '各裁床运行状态',
      operationTitle: '各裁床运行情况',
      noDeviceData: '无符合条件的设备数据'
    }
  },
  
  // 表格
  table: {
    headers: {
      index: '序号',
      workshop: '车间', 
      deviceId: '设备编号',
      speed: '速度(m/s)',
      duration: '运行时长(h)',
      blade: '刀片',
      grindingRod: '磨刀棒',
      faultCode: '故障代码',
      startTime: '开始时间'
    },
    loadMore: '加载更多',
    loading: '加载中...',
    noData: '暂无数据'
  },
  
  // 维保管理
  maintenance: {
    // 指标卡片
    metrics: {
      faultCount: '故障台数',
      faultTimes: '故障次数',
      faultDuration: '故障时长',
      avgFaultTime: '平均故障时长'
    },
    
    // 单位
    units: {
      devices: '台',
      times: '次',
      hours: 'H'
    },
    
    // 面板标题
    panels: {
      bladeLife: '刀片和磨刀棒寿命',
      faultList: '当前设备故障清单'
    }
  },
  
  // 业绩分析
  analysis: {
    // 图表标题
    charts: {
      efficiency: '移动率MU',
      perimeter: '周长(M)',
      cutTime: '裁剪时间(H)',
      cutSpeed: '裁剪速度(m/s)'
    }
  },
  
  // 通用
  common: {
    loading: '加载中...',
    error: '加载失败',
    retry: '重试',
    confirm: '确认',
    cancel: '取消',
    close: '关闭',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    reset: '重置',
    refresh: '刷新',
    export: '导出',
    import: '导入',
    select: '选择',
    selectAll: '全选',
    clear: '清空'
  },
  
  // 消息提示
  messages: {
    loadSuccess: '加载成功',
    loadError: '加载失败',
    saveSuccess: '保存成功',
    saveError: '保存失败',
    deleteSuccess: '删除成功',
    deleteError: '删除失败',
    networkError: '网络连接失败',
    serverError: '服务器错误',
    dataError: '数据格式错误',
    permissionError: '权限不足'
  }
};

export default zh; 