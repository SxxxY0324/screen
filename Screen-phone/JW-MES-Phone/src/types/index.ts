// 客户数据类型
export interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  address: string;
}

// 设备数据类型
export interface DeviceInfo {
  id: string;
  name: string;
  code: string;
  lastUpdateTime: string;
  location: string;
  series: string;
  isOn: boolean;
}

// 轮播图项类型
export interface BannerItem {
  id: number;
  imageUrl: string;
  title: string;
}

// 区域数据类型
export interface RegionData {
  id: string;
  name: string;
  deviceCount: number;
  runningCount: number;
}

// 页面模式枚举
export enum PageMode {
  REGION_LIST = 'regionList',  // 地区列表模式
  CUSTOMER_LIST = 'customerList', // 客户列表模式
  DEVICE_LIST = 'deviceList'  // 设备列表模式
} 