import api from './index';

/**
 * 获取故障台数
 * @returns {Promise<{count: number}>} 故障设备台数
 */
export const getFaultCount = async () => {
  try {
    const response = await api.get('/maintenance/fault-count');
    return response;
  } catch (error) {
    return { count: 0, message: '获取故障台数失败' };
  }
};

/**
 * 获取故障次数
 * @returns {Promise<{count: number}>} 故障发生次数
 */
export const getFaultTimes = async () => {
  try {
    const response = await api.get('/maintenance/fault-times');
    return response;
  } catch (error) {
    return { count: 0, message: '获取故障次数失败' };
  }
};

/**
 * 获取故障时长
 * @returns {Promise<{hours: number}>} 故障总时长（小时）
 */
export const getFaultDuration = async () => {
  try {
    const response = await api.get('/maintenance/fault-duration');
    return response;
  } catch (error) {
    return { hours: 0, message: '获取故障时长失败' };
  }
};

/**
 * 获取平均故障时长
 * @returns {Promise<{hours: number}>} 平均故障时长（小时）
 */
export const getAvgFaultTime = async () => {
  try {
    const response = await api.get('/maintenance/avg-fault-time');
    return response;
  } catch (error) {
    return { hours: 0, message: '获取平均故障时长失败' };
  }
};

/**
 * 获取故障设备清单
 * @returns {Promise<{data: Array}>} 故障设备列表
 */
export const getFaultEquipmentList = async () => {
  try {
    const response = await api.get('/maintenance/fault-equipment-list');
    return response;
  } catch (error) {
    return { data: [], count: 0, message: '获取故障设备清单失败' };
  }
}; 