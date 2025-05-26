import api from './index';

/**
 * 监控数据API服务
 * 提供与后端监控数据相关的API调用
 */

/**
 * 获取移动率数据
 * @returns {Promise} 包含移动率数据的Promise
 */
export const getMaterialUtilization = async () => {
  return api.get('/monitor/material-utilization');
};

/**
 * 获取周长数据
 * @returns {Promise} 包含周长数据的Promise
 */
export const getPerimeterData = async () => {
  return api.get('/monitor/perimeter-data');
};

/**
 * 获取设备运行状态数据
 * @returns {Promise} 包含设备运行状态数据的Promise
 */
export const getDeviceStatus = async () => {
  try {
    // 获取设备状态数据
    const response = await api.get('/monitor/machine-status');
    
    // 标准化响应处理
    let machines = [];
    
    // 处理不同的响应格式
    if (response && response.machines && Array.isArray(response.machines)) {
      machines = response.machines;
    } else if (response && response.data && response.data.machines && Array.isArray(response.data.machines)) {
      machines = response.data.machines;
    } else if (Array.isArray(response)) {
      machines = response;
    } else if (response && Array.isArray(response.data)) {
      machines = response.data;
    }
    
    // 转换为前端需要的格式
    const deviceStatusData = machines.map(device => ({
      id: device.deviceId || device.machineSN || device.id || '未知设备',
      status: mapDeviceStatus(
        device.onlineStatus !== undefined ? device.onlineStatus : device.status, 
        device.statusName
      )
    }));
    
    return deviceStatusData;
  } catch (error) {
    throw error;
  }
};

/**
 * 将后端API的设备状态映射到前端使用的状态
 * @param {string|number} status - 后端API返回的设备状态码或状态名称
 * @param {string} statusName - 状态名称(可选)，用于辅助状态判断
 * @returns {string} 映射后的设备状态
 */
const mapDeviceStatus = (status, statusName) => {
  // 处理数字状态码
  if (typeof status === 'number') {
    switch (status) {
      case 0: return 'cutting';    // 裁剪中
      case 1: return 'standby';    // 待机中
      case 2: return 'unplanned';  // 非计划停机
      case 3: return 'planned';    // 计划停机
      default: return 'standby';
    }
  }
  
  // 处理状态名称
  if (statusName) {
    const statusNameLower = String(statusName).toLowerCase();
    if (statusNameLower.includes('裁剪')) return 'cutting';
    if (statusNameLower.includes('待机')) return 'standby';
    if (statusNameLower.includes('非计划')) return 'unplanned';
    if (statusNameLower.includes('计划停机')) return 'planned';
  }
  
  // 默认状态
  return 'standby';
};

/**
 * 获取设备能耗数据
 * @returns {Promise} 包含设备能耗数据的Promise
 */
export const getEnergyConsumption = async () => {
  try {
    const response = await api.get('/monitor/energy-consumption');
    
    // 检查API响应结构，尝试提取设备数据
    let devices = [];
    let totalEnergy = 0;
    
    // 处理不同的响应结构
    if (response) {
      // 直接检查response是否为数组
      if (Array.isArray(response)) {
        devices = response;
        totalEnergy = devices.reduce((sum, device) => sum + (device.energy || 0), 0);
      }
      // 检查response是否为对象且包含devices属性
      else if (typeof response === 'object') {
        if (Array.isArray(response.devices)) {
          devices = response.devices;
          totalEnergy = response.totalEnergy || devices.reduce((sum, device) => sum + (device.energy || 0), 0);
        } 
        // 检查是否存在data属性
        else if (response.data) {
          if (Array.isArray(response.data.devices)) {
            devices = response.data.devices;
            totalEnergy = response.data.totalEnergy || 0;
          } else if (Array.isArray(response.data)) {
            devices = response.data;
            totalEnergy = devices.reduce((sum, device) => sum + (device.energy || 0), 0);
          } else if (typeof response.data === 'object') {
            // 遍历所有属性，查找可能的设备数组
            Object.keys(response.data).forEach(key => {
              if (Array.isArray(response.data[key])) {
                if (response.data[key].length > 0 && 
                   (response.data[key][0].deviceId !== undefined || 
                    response.data[key][0].energy !== undefined)) {
                  devices = response.data[key];
                }
              }
            });
            totalEnergy = response.data.totalEnergy || 0;
          }
        }
      }
    }
    
    return {
      data: {
        totalEnergy: totalEnergy,
        devices: devices
      }
    };
  } catch (error) {
    console.error('获取能耗数据失败:', error);
    throw error;
  }
};

/**
 * 获取监控页面所需的综合数据
 * 整合多个API调用，返回统一的数据格式
 * @returns {Promise} 包含所有监控数据的Promise
 */
export const getMonitorData = async () => {
  try {
    // 初始化返回数据结构
    let result = {
      efficiencyValue: 0,
      perimeterValue: 0,
      energyValue: 0,
      deviceEnergyData: [],
      deviceStatusData: [],
      cutTimeValue: 0,
      cutSpeedValue: 0,
      cutSetsValue: '0',
      tableData: []
    };
    
    // 创建所有API请求的Promise
    const apiRequests = [];
    
    // 获取设备运行状态数据
    apiRequests.push(
      getDeviceStatus()
        .then(deviceStatusData => {
          result.deviceStatusData = deviceStatusData || [];
        })
        .catch(error => {
          console.error('获取设备运行状态数据失败:', error);
          result.deviceStatusData = [];
        })
    );
    
    // 获取能耗数据
    apiRequests.push(
      getEnergyConsumption()
        .then(energyResponse => {
          if (energyResponse && energyResponse.data) {
            if (Array.isArray(energyResponse.data.devices)) {
              result.deviceEnergyData = energyResponse.data.devices;
              result.energyValue = energyResponse.data.totalEnergy || 0;
            }
          }
        })
        .catch(error => console.error('获取能耗数据失败:', error))
    );
    
    // 获取移动率数据
    apiRequests.push(
      getMaterialUtilization()
        .then(materialUtilizationResponse => {
          if (materialUtilizationResponse) {
            if (typeof materialUtilizationResponse.value === 'number') {
              result.efficiencyValue = materialUtilizationResponse.value;
            } else if (typeof materialUtilizationResponse.materialUtilization === 'number') {
              result.efficiencyValue = materialUtilizationResponse.materialUtilization;
            } else if (materialUtilizationResponse.data) {
              if (typeof materialUtilizationResponse.data.value === 'number') {
                result.efficiencyValue = materialUtilizationResponse.data.value;
              } else if (typeof materialUtilizationResponse.data.materialUtilization === 'number') {
                result.efficiencyValue = materialUtilizationResponse.data.materialUtilization;
              }
            }
          }
        })
        .catch(error => console.error('获取移动率数据失败:', error))
    );
    
    // 获取周长数据
    apiRequests.push(
      getPerimeterData()
        .then(perimeterResponse => {
          if (perimeterResponse) {
            if (typeof perimeterResponse.value === 'number') {
              result.perimeterValue = perimeterResponse.value;
            } else if (typeof perimeterResponse.totalCutPerimeter === 'number') {
              result.perimeterValue = perimeterResponse.totalCutPerimeter;
            } else if (perimeterResponse.data) {
              if (typeof perimeterResponse.data.value === 'number') {
                result.perimeterValue = perimeterResponse.data.value;
              } else if (typeof perimeterResponse.data.totalCutPerimeter === 'number') {
                result.perimeterValue = perimeterResponse.data.totalCutPerimeter;
              }
            }
          }
        })
        .catch(error => console.error('获取周长数据失败:', error))
    );
    
    // 获取其他数据的API请求
    apiRequests.push(
      api.get('/monitor/cut-time')
        .then(cutTimeResponse => {
          if (cutTimeResponse) {
            if (typeof cutTimeResponse.value === 'number') {
              result.cutTimeValue = cutTimeResponse.value;
            } else if (cutTimeResponse.data && typeof cutTimeResponse.data.value === 'number') {
              result.cutTimeValue = cutTimeResponse.data.value;
            }
          }
        })
        .catch(error => console.error('获取切割时间数据失败:', error))
    );
    
    apiRequests.push(
      api.get('/monitor/cut-speed')
        .then(cutSpeedResponse => {
          if (cutSpeedResponse) {
            if (typeof cutSpeedResponse.value === 'number') {
              result.cutSpeedValue = cutSpeedResponse.value;
            } else if (cutSpeedResponse.data && typeof cutSpeedResponse.data.value === 'number') {
              result.cutSpeedValue = cutSpeedResponse.data.value;
            }
          }
        })
        .catch(error => console.error('获取切割速度数据失败:', error))
    );
    
    apiRequests.push(
      api.get('/monitor/cut-sets')
        .then(cutSetsResponse => {
          if (cutSetsResponse) {
            if (cutSetsResponse.value !== undefined) {
              result.cutSetsValue = String(cutSetsResponse.value);
            } else if (cutSetsResponse.data && cutSetsResponse.data.value !== undefined) {
              result.cutSetsValue = String(cutSetsResponse.data.value);
            }
          }
        })
        .catch(error => console.error('获取裁剪套数数据失败:', error))
    );
    
    apiRequests.push(
      api.get('/monitor/table-data')
        .then(tableDataResponse => {
          if (tableDataResponse && Array.isArray(tableDataResponse)) {
            result.tableData = tableDataResponse;
          } else if (tableDataResponse && tableDataResponse.data && Array.isArray(tableDataResponse.data)) {
            result.tableData = tableDataResponse.data;
          }
        })
        .catch(error => console.error('获取表格数据失败:', error))
    );
    
    // 等待所有API请求完成
    await Promise.allSettled(apiRequests);
    
    // 处理设备能耗数据
    if (Array.isArray(result.deviceEnergyData) && result.deviceEnergyData.length > 0) {
      result.deviceEnergyData = result.deviceEnergyData
        .filter(item => item && (typeof item.energy === 'number' && item.energy > 0))
        .map(item => ({
          deviceId: item.deviceId || item.machineSN || '未知设备',
          energy: typeof item.energy === 'number' ? item.energy : 0
        }))
        .sort((a, b) => b.energy - a.energy); // 按能耗从大到小排序
    }
    
    return result;
  } catch (error) {
    console.error('获取监控数据失败:', error);
    throw error;
  }
};