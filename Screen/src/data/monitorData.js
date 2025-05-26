// 设备状态枚举
export const DeviceStatus = {
  CUTTING: 'cutting',
  STANDBY: 'standby',
  UNPLANNED: 'unplanned',
  PLANNED: 'planned'
};

// 表格数据
export const tableData = [
  ['1', '一车间', 'CN01001', '1.2', '8.5'],
  ['2', '一车间', 'CN01002', '1.5', '7.8'],
  ['3', '二车间', 'CN01003', '1.1', '9.2'],
  ['4', '二车间', 'CN01004', '1.3', '8.0'],
  ['5', '三车间', 'CN01005', '1.4', '8.7'],
  ['6', '三车间', 'CN01006', '1.0', '9.5'],
  ['7', '四车间', 'CN01007', '1.6', '7.2'],
  ['8', '四车间', 'CN01008', '1.3', '8.4'],
  ['9', '五车间', 'CN01009', '1.2', '8.9'],
  ['10', '五车间', 'CN01010', '1.4', '7.5'],
  ['11', '一车间', 'CN01011', '1.3', '8.6'],
  ['12', '二车间', 'CN01012', '1.5', '7.9'],
  ['13', '三车间', 'CN01013', '1.2', '8.8'],
  ['14', '四车间', 'CN01014', '1.1', '9.0'],
  ['15', '五车间', 'CN01015', '1.4', '8.2']
];

// 表格列头
export const tableHeaders = ['序号', '车间', '设备编号', '速度(m/s)', '运行时长(h)'];

// 设备运行状态数据
export const deviceStatusData = [
  { id: "CN01001", status: DeviceStatus.CUTTING },
  { id: "CN01002", status: DeviceStatus.STANDBY },
  { id: "CN01003", status: DeviceStatus.UNPLANNED },
  { id: "CN01004", status: DeviceStatus.PLANNED },
  { id: "CN01005", status: DeviceStatus.CUTTING },
  { id: "CN01006", status: DeviceStatus.STANDBY },
  { id: "CN01007", status: DeviceStatus.UNPLANNED },
  { id: "CN01008", status: DeviceStatus.PLANNED }
];

// 状态图标配置
export const statusLegendItems = [
  { label: '裁剪', status: DeviceStatus.CUTTING, left: '10%' },
  { label: '待机', status: DeviceStatus.STANDBY, left: '35%' },
  { label: '非计划停机', status: DeviceStatus.UNPLANNED, left: '58%' },
  { label: '计划停机', status: DeviceStatus.PLANNED, left: '82%' }
];

// 裁剪套数显示值（方便将来从API获取）
export const cutSetsValue = '213,716'; 