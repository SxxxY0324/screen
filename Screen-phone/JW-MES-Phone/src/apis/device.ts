import { httpClient } from '../config'
import { API_PATHS, PaginationParams, PaginationResult } from './types'
import { DeviceInfo } from '../types'

// 设备状态更新接口
export interface DeviceStatusUpdateParams {
  isOn: boolean;
}

// 设备API
export const deviceApi = {
  /**
   * 获取指定客户的设备列表
   * @param customerId 客户ID
   * @param params 分页参数
   */
  getDeviceList: (customerId: string, params?: PaginationParams) => {
    return httpClient.get<PaginationResult<DeviceInfo>>(API_PATHS.DEVICE.LIST(customerId), params)
  },
  
  /**
   * 获取设备详情
   * @param id 设备ID
   */
  getDeviceDetail: (id: string) => {
    return httpClient.get<DeviceInfo>(API_PATHS.DEVICE.DETAIL(id))
  },
  
  /**
   * 更新设备状态
   * @param id 设备ID
   * @param isOn 是否开启
   */
  updateDeviceStatus: (id: string, isOn: boolean) => {
    return httpClient.put<DeviceInfo>(
      API_PATHS.DEVICE.UPDATE_STATUS(id),
      { isOn } as DeviceStatusUpdateParams
    )
  }
} 