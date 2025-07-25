/**
 * 筛选表单相关类型定义
 */

// 筛选表单数据接口
export interface FilterFormData {
  country: string;     // 国家
  workshop: string;    // 车间
  deviceId: string;    // 设备ID
  startDate: string;   // 开始日期
  endDate: string;     // 结束日期
}

// 筛选表单组件Props接口
export interface FilterFormProps {
  onQuery: (formData: FilterFormData) => void;
  onGoToMine: () => void;
} 