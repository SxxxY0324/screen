// 设备状态枚举
export const DeviceStatus = {
  CUTTING: 'cutting',
  STANDBY: 'standby',
  UNPLANNED: 'unplanned',
  PLANNED: 'planned'
};

// 表格列头
export const tableHeaders = ['序号', '车间', '设备编号', '速度(m/s)', '运行时长(h)'];

// 状态图标配置
export const statusLegendItems = [
  { label: '裁剪', status: DeviceStatus.CUTTING, left: '10%' },
  { label: '待机', status: DeviceStatus.STANDBY, left: '35%' },
  { label: '非计划停机', status: DeviceStatus.UNPLANNED, left: '58%' },
  { label: '计划停机', status: DeviceStatus.PLANNED, left: '82%' }
]; 