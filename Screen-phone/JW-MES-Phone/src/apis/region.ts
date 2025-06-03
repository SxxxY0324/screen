import { httpClient } from '../config'
import { API_PATHS, PaginationParams, PaginationResult } from './types'
import { RegionData } from '../types'

// 区域统计摘要类型
export interface RegionStats {
  totalRegions: number;
  totalDevices: number;
  runningDevices: number;
  offlineDevices: number;
}

// 区域API
export const regionApi = {
  /**
   * 获取区域列表
   * @param params 分页参数
   */
  getRegionList: (params?: PaginationParams) => {
    return httpClient.get<PaginationResult<RegionData>>(API_PATHS.REGION.LIST, params)
  },
  
  /**
   * 获取区域详情
   * @param id 区域ID
   */
  getRegionDetail: (id: string) => {
    return httpClient.get<RegionData>(API_PATHS.REGION.DETAIL(id))
  },

  /**
   * 获取区域统计数据
   */
  getRegionStats: () => {
    return httpClient.get<RegionStats>(API_PATHS.REGION.STATS)
  }
} 