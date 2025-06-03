// 分页请求参数
export interface PaginationParams {
  current?: number;
  pageSize?: number;
  [key: string]: any; // 允许其他自定义参数
}

// 分页响应数据
export interface PaginationResult<T> {
  list: T[];
  total: number;
  current: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// API路径常量
export const API_PATHS = {
  // 区域相关接口
  REGION: {
    LIST: '/regions',
    DETAIL: (id: string) => `/regions/${id}`,
    STATS: '/regions/stats',
  },
  
  // 客户相关接口
  CUSTOMER: {
    LIST: (regionId: string) => `/regions/${regionId}/customers`,
    DETAIL: (id: string) => `/customers/${id}`,
  },
  
  // 设备相关接口
  DEVICE: {
    LIST: (customerId: string) => `/customers/${customerId}/devices`,
    DETAIL: (id: string) => `/devices/${id}`,
    UPDATE_STATUS: (id: string) => `/devices/${id}/status`,
  }
}; 