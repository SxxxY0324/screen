import { httpClient } from '../config'
import { API_PATHS, PaginationParams, PaginationResult } from './types'
import { CustomerInfo } from '../types'

// 客户API
export const customerApi = {
  /**
   * 获取指定区域的客户列表
   * @param regionId 区域ID
   * @param params 分页参数
   */
  getCustomerList: (regionId: string, params?: PaginationParams) => {
    return httpClient.get<PaginationResult<CustomerInfo>>(API_PATHS.CUSTOMER.LIST(regionId), params)
  },
  
  /**
   * 获取客户详情
   * @param id 客户ID
   */
  getCustomerDetail: (id: string) => {
    return httpClient.get<CustomerInfo>(API_PATHS.CUSTOMER.DETAIL(id))
  }
} 