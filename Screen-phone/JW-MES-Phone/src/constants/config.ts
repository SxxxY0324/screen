/**
 * 项目配置常量
 */

// =============================================================================
// 分页配置
// =============================================================================
export const PAGINATION_CONFIG = {
  /** 默认每页显示条数 */
  DEFAULT_PAGE_SIZE: 6,
  /** 滚动触发加载更多的距离阈值 */
  SCROLL_LOWER_THRESHOLD: 20,
  /** 分页加载延迟时间（毫秒） */
  PAGINATION_DELAY: 1000,
} as const;

// =============================================================================
// 延迟时间配置
// =============================================================================
export const DELAY_CONFIG = {
  /** 数据加载延迟 - 短 */
  DATA_LOAD_SHORT: 300,
  /** 数据加载延迟 - 中 */
  DATA_LOAD_MEDIUM: 500,
  /** 数据加载延迟 - 长 */
  DATA_LOAD_LONG: 800,
  /** DOM测量延迟 */
  DOM_MEASURE_DELAY: 300,
  /** 组件强制结束加载超时 */
  COMPONENT_TIMEOUT: 5000,
} as const;

// =============================================================================
// 设备详情页配置
// =============================================================================
export const DEVICE_DETAILS_CONFIG = {
  /** 固定区域默认高度 */
  DEFAULT_FIXED_AREA_HEIGHT: 300,
  /** Tab切换数据加载延迟 */
  TAB_SWITCH_DELAY: 500,
  /** 页面显示数据重载延迟 */
  PAGE_SHOW_RELOAD_DELAY: 500,
} as const;

// =============================================================================
// 图表配置
// =============================================================================
export const CHART_CONFIG = {
  /** 环形图默认大小 */
  DEFAULT_RING_SIZE: 150,
  /** 环形图默认线宽 */
  DEFAULT_STROKE_WIDTH: 12,
  /** 柱状图默认最大值 */
  DEFAULT_MAX_VALUE: 100,
  /** 总周长默认最大值 */
  CIRCUMFERENCE_MAX_VALUE: 1000,
  /** 总周长默认单位 */
  CIRCUMFERENCE_DEFAULT_UNIT: 'mm',
} as const;

// =============================================================================
// 模拟数据
// =============================================================================
export const MOCK_DATA = {
  /** 设备能耗模拟数据 */
  ENERGY_DATA: [
    { deviceCode: 'Device001', energyValue: 85 },
    { deviceCode: 'Device002', energyValue: 62 },
    { deviceCode: 'Device003', energyValue: 45 },
    { deviceCode: 'Device004', energyValue: 28 }
  ],
  
  /** 设备详情默认值 */
  DEVICE_DEFAULTS: {
    MOBILITY_VALUE: 75,
    CIRCUMFERENCE_VALUE: 850,
  },
  
  /** 区域数据 */
  REGION_DATA: [
    { id: 'north', name: '华北地区', deviceCount: 3, runningCount: 0 },
    { id: 'northeast', name: '东北地区', deviceCount: 1, runningCount: 0 },
    { id: 'east', name: '华东地区', deviceCount: 133, runningCount: 38 },
    { id: 'central', name: '华中地区', deviceCount: 11, runningCount: 7 },
    { id: 'south', name: '华南地区', deviceCount: 78, runningCount: 15 },
    { id: 'southwest', name: '西南地区', deviceCount: 42, runningCount: 9 },
  ],
  
  /** 客户数据 */
  CUSTOMER_DATA: {
    'north': [
      { id: 'c1', name: 'BullmerTest', phone: '010-12345678', address: '北京市朝阳区' },
      { id: 'c2', name: '北方科技', phone: '010-87654321', address: '天津市南开区' },
    ],
    'northeast': [
      { id: 'c3', name: '东北实业', phone: '024-12345678', address: '沈阳市和平区' },
    ],
    'east': [
      { id: 'c4', name: '江南制造', phone: '021-12345678', address: '上海市浦东新区' },
      { id: 'c5', name: '杭州智能', phone: '0571-87654321', address: '杭州市西湖区' },
    ],
    'central': [
      { id: 'c6', name: '中原科技', phone: '027-12345678', address: '武汉市洪山区' },
    ],
    'south': [
      { id: 'c7', name: '南方智造', phone: '020-12345678', address: '广州市天河区' },
    ],
    'southwest': [
      { id: 'c8', name: '西南企业', phone: '028-12345678', address: '成都市锦江区' },
    ],
  },
  
  /** 设备列表模拟数据 */
  DEVICE_LIST: [
    { 
      id: '1', 
      name: 'BullmerTest(裁床)', 
      code: '123456', 
      lastUpdateTime: '2025-05-16 11:39:11', 
      location: '中国-北京 东城',
      series: 'E系列',
      isOn: false
    },
    { 
      id: '2', 
      name: 'BullmerTest(裁床)', 
      code: '654321', 
      lastUpdateTime: '2024-02-02 12:54:47', 
      location: '中国-北京 东城',
      series: 'D系列',
      isOn: false
    },
    { 
      id: '3', 
      name: 'BullmerTest(裁床)', 
      code: '123456789', 
      lastUpdateTime: '2023-11-30 09:45:47', 
      location: '中国-北京 东城',
      series: 'E系列',
      isOn: false
    },
  ],
} as const;

// =============================================================================
// 页面路径常量
// =============================================================================
export const PAGE_PATHS = {
  INDEX: '/pages/index/index',
  MINE: '/pages/mine/index',
  LIST: '/pages/list/index',
  COMPARE: '/pages/compare/index',
  SERVICE: '/pages/service/index',
  TIME_SELECTOR: '/pages/time-selector/index',
  DEVICE_DETAILS: '/pages/device-details/index',
} as const;

// =============================================================================
// 区域名称映射
// =============================================================================
export const REGION_NAME_MAP = {
  'north': '华北地区',
  'northeast': '东北地区',
  'east': '华东地区',
  'central': '华中地区',
  'south': '华南地区',
  'southwest': '西南地区',
} as const; 