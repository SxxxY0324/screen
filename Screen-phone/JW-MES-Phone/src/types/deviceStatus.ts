/**
 * 裁床状态相关类型定义
 */

// 裁床状态枚举
export enum DeviceStatus {
  CUTTING = 'cutting',     // 裁剪中
  STANDBY = 'standby',     // 待机中
  UNPLANNED = 'unplanned', // 非计划停机
  PLANNED = 'planned'      // 计划停机
}

// 裁床状态信息接口 - 简化版，只包含设备编码和状态
export interface DeviceStatusInfo {
  code: string;           // 设备编码
  status: DeviceStatus;   // 设备状态
}

// 状态图例项接口
export interface StatusLegendItem {
  label: string;          // 标签名称
  status: DeviceStatus;   // 状态
}

// 状态颜色映射
export const STATUS_COLORS = {
  [DeviceStatus.CUTTING]: '#00CC52',    // 绿色
  [DeviceStatus.STANDBY]: '#f4ea2a',    // 黄色
  [DeviceStatus.UNPLANNED]: '#d81e06',  // 红色
  [DeviceStatus.PLANNED]: '#515151'     // 灰色
};

// 状态图例项数据
export const STATUS_LEGEND_ITEMS: StatusLegendItem[] = [
  { label: '裁剪中', status: DeviceStatus.CUTTING },
  { label: '待机中', status: DeviceStatus.STANDBY },
  { label: '非计划停机', status: DeviceStatus.UNPLANNED },
  { label: '计划停机', status: DeviceStatus.PLANNED }
]; 