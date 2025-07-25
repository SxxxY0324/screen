import { getTableHeaderText, getStatusText } from '../locales';

// 设备状态枚举
export const DeviceStatus = {
  CUTTING: 'cutting',
  STANDBY: 'standby',
  UNPLANNED: 'unplanned',
  PLANNED: 'planned'
};

// 获取表格列头（支持多语言）
export const getTableHeaders = () => [
  getTableHeaderText('index'),
  getTableHeaderText('workshop'), 
  getTableHeaderText('deviceId'),
  getTableHeaderText('speed'),
  getTableHeaderText('duration')
];

// 表格列头（向后兼容）
export const tableHeaders = ['序号', '车间', '设备编号', '速度(m/s)', '运行时长(h)'];

// 获取状态图标配置（支持多语言）
export const getStatusLegendItems = () => [
  { 
    label: getStatusText(DeviceStatus.CUTTING), 
    status: DeviceStatus.CUTTING, 
    left: '10%' 
  },
  { 
    label: getStatusText(DeviceStatus.STANDBY), 
    status: DeviceStatus.STANDBY, 
    left: '35%' 
  },
  { 
    label: getStatusText(DeviceStatus.UNPLANNED), 
    status: DeviceStatus.UNPLANNED, 
    left: '58%' 
  },
  { 
    label: getStatusText(DeviceStatus.PLANNED), 
    status: DeviceStatus.PLANNED, 
    left: '82%' 
  }
];

// 状态图标配置（向后兼容）
export const statusLegendItems = [
  { label: '裁剪', status: DeviceStatus.CUTTING, left: '10%' },
  { label: '待机', status: DeviceStatus.STANDBY, left: '35%' },
  { label: '非计划停机', status: DeviceStatus.UNPLANNED, left: '58%' },
  { label: '计划停机', status: DeviceStatus.PLANNED, left: '82%' }
]; 