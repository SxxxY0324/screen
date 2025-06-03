import { customerApi } from '../apis'
import { PaginationParams, PaginationResult } from '../apis/types'
import { CustomerInfo } from '../types'

// 客户列表缓存
const customerListCaches: Record<string, {
  data: PaginationResult<CustomerInfo> | null;
  timestamp: number;
}> = {};

// 缓存时间（5分钟）
const CACHE_TIME = 5 * 60 * 1000;

/**
 * 客户服务
 */
export const customerService = {
  /**
   * 获取客户列表
   * @param regionId 区域ID
   * @param params 分页参数
   * @param forceRefresh 是否强制刷新（不使用缓存）
   */
  async getCustomerList(regionId: string, params?: PaginationParams, forceRefresh = false): Promise<PaginationResult<CustomerInfo>> {
    const now = Date.now();
    const cacheKey = regionId;
    
    // 如有有效缓存且不强制刷新，直接使用缓存
    if (
      !forceRefresh && 
      customerListCaches[cacheKey]?.data && 
      now - (customerListCaches[cacheKey]?.timestamp || 0) < CACHE_TIME
    ) {
      return customerListCaches[cacheKey].data!;
    }
    
    // 否则请求新数据
    try {
      const result = await customerApi.getCustomerList(regionId, params);
      
      // 更新缓存
      customerListCaches[cacheKey] = {
        data: result,
        timestamp: now
      };
      
      return result;
    } catch (error) {
      console.error(`获取区域(${regionId})的客户列表失败:`, error);
      throw error;
    }
  },
  
  /**
   * 获取客户详情
   * @param id 客户ID
   */
  async getCustomerDetail(id: string): Promise<CustomerInfo> {
    try {
      return await customerApi.getCustomerDetail(id);
    } catch (error) {
      console.error(`获取客户(${id})详情失败:`, error);
      throw error;
    }
  },
  
  /**
   * 清除指定区域的客户列表缓存
   * @param regionId 区域ID，不传则清除所有缓存
   */
  clearCache(regionId?: string): void {
    if (regionId) {
      delete customerListCaches[regionId];
    } else {
      // 清除所有缓存
      Object.keys(customerListCaches).forEach(key => {
        delete customerListCaches[key];
      });
    }
  }
}; 