import { deviceApi } from '../apis'
import { PaginationParams, PaginationResult } from '../apis/types'
import { DeviceInfo } from '../types'

// 设备列表缓存
const deviceListCaches: Record<string, {
  data: PaginationResult<DeviceInfo> | null;
  timestamp: number;
}> = {};

// 缓存时间（5分钟）
const CACHE_TIME = 5 * 60 * 1000;

/**
 * 设备服务
 */
export const deviceService = {
  /**
   * 获取设备列表
   * @param customerId 客户ID
   * @param params 分页参数
   * @param forceRefresh 是否强制刷新（不使用缓存）
   */
  async getDeviceList(customerId: string, params?: PaginationParams, forceRefresh = false): Promise<PaginationResult<DeviceInfo>> {
    const now = Date.now();
    const cacheKey = customerId;
    
    // 如有有效缓存且不强制刷新，直接使用缓存
    if (
      !forceRefresh && 
      deviceListCaches[cacheKey]?.data && 
      now - (deviceListCaches[cacheKey]?.timestamp || 0) < CACHE_TIME
    ) {
      return deviceListCaches[cacheKey].data!;
    }
    
    // 否则请求新数据
    try {
      const result = await deviceApi.getDeviceList(customerId, params);
      
      // 更新缓存
      deviceListCaches[cacheKey] = {
        data: result,
        timestamp: now
      };
      
      return result;
    } catch (error) {
      console.error(`获取客户(${customerId})的设备列表失败:`, error);
      throw error;
    }
  },
  
  /**
   * 获取设备详情
   * @param id 设备ID
   */
  async getDeviceDetail(id: string): Promise<DeviceInfo> {
    try {
      return await deviceApi.getDeviceDetail(id);
    } catch (error) {
      console.error(`获取设备(${id})详情失败:`, error);
      throw error;
    }
  },
  
  /**
   * 更新设备状态
   * @param id 设备ID
   * @param isOn 是否开启
   */
  async updateDeviceStatus(id: string, isOn: boolean): Promise<DeviceInfo> {
    try {
      const updatedDevice = await deviceApi.updateDeviceStatus(id, isOn);
      
      // 更新所有可能包含该设备的缓存
      Object.keys(deviceListCaches).forEach(cacheKey => {
        const cache = deviceListCaches[cacheKey];
        if (cache?.data) {
          // 在缓存中找到并更新设备状态
          const deviceIndex = cache.data.list.findIndex(device => device.id === id);
          if (deviceIndex !== -1) {
            cache.data.list[deviceIndex] = {
              ...cache.data.list[deviceIndex],
              isOn: updatedDevice.isOn
            };
          }
        }
      });
      
      return updatedDevice;
    } catch (error) {
      console.error(`更新设备(${id})状态失败:`, error);
      throw error;
    }
  },
  
  /**
   * 清除指定客户的设备列表缓存
   * @param customerId 客户ID，不传则清除所有缓存
   */
  clearCache(customerId?: string): void {
    if (customerId) {
      delete deviceListCaches[customerId];
    } else {
      // 清除所有缓存
      Object.keys(deviceListCaches).forEach(key => {
        delete deviceListCaches[key];
      });
    }
  }
}; 