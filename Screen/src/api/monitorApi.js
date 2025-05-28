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
 * 将后端API的设备状态映射到前端使用的状态
 * 0 = cutting（裁剪中）
 * 1 = standby（待机中）
 * 2 = unplanned（非计划停机）
 * 3 = planned（计划停机）
 * 
 * @param {string|number} status - 后端API返回的设备状态码
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
    
    // 简化响应处理逻辑
    if (response) {
      if (Array.isArray(response)) {
        devices = response;
      } else if (typeof response === 'object') {
        if (Array.isArray(response.devices)) {
          devices = response.devices;
          totalEnergy = response.totalEnergy || 0;
        } else if (response.data) {
          if (Array.isArray(response.data.devices)) {
            devices = response.data.devices;
            totalEnergy = response.data.totalEnergy || 0;
          } else if (Array.isArray(response.data)) {
            devices = response.data;
          }
        }
      }
      
      // 只有在没有获取到总能耗时，才通过设备能耗计算
      if (totalEnergy === 0 && devices.length > 0) {
        totalEnergy = devices.reduce((sum, device) => sum + (device.energy || 0), 0);
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
      deviceStatusData: [], // 裁床状态数据将由fetchDeviceStatusData单独获取
      cutTimeValue: 0,
      cutSpeedValue: 0,
      cutSetsValue: '0',
      tableData: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 0,
      hasMoreData: false
    };
    
    // 创建所有API请求的Promise
    const apiRequests = [];
    
    // 注意：不再获取设备运行状态数据，这由fetchDeviceStatusData单独处理
    // 避免两次请求同一数据导致状态显示不一致
    
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
    
    // 获取裁床运行数据表格 - 使用支持分页的API
    apiRequests.push(
      getMachineRunningDataWithPagination(1, 20)
        .then(tableDataResponse => {
          if (tableDataResponse && Array.isArray(tableDataResponse.tableData)) {
            result.tableData = tableDataResponse.tableData;
            // 添加分页信息到结果
            result.totalItems = tableDataResponse.totalItems || 0;
            result.totalPages = tableDataResponse.totalPages || 1;
            result.currentPage = tableDataResponse.currentPage || 1;
            result.hasMoreData = tableDataResponse.hasMoreData || (tableDataResponse.currentPage < tableDataResponse.totalPages);
          }
        })
        .catch(error => console.error('获取裁床运行数据表格失败:', error))
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

/**
 * 获取裁床运行数据表格（支持分页）
 * @param {number} page 页码，默认为1
 * @param {number} size 每页记录数，默认为20
 * @returns {Promise} 包含裁床运行数据表格的Promise
 */
export const getMachineRunningDataWithPagination = async (page = 1, size = 20) => {
  try {
    const response = await api.get(`/monitor/machine-running-data/page?page=${page}&size=${size}`);
    
    // 提取分页信息 - 处理后端返回的嵌套格式
    let paginationInfo = {};
    if (response.pagination) {
      // 如果分页信息在嵌套的pagination对象中，则提取出来
      paginationInfo = {
        totalItems: response.pagination.totalItems || 0,
        totalPages: response.pagination.totalPages || 1,
        currentPage: response.pagination.currentPage || page,
        pageSize: response.pagination.pageSize || size
      };
    } else {
      // 尝试从顶层获取分页信息
      paginationInfo = {
        totalItems: response.totalItems || 0,
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || page,
        pageSize: response.pageSize || size
      };
    }
    
    // 返回数据，确保tableData字段存在，将分页信息添加到顶层
    return {
      tableData: response && response.tableData ? response.tableData : [],
      totalItems: paginationInfo.totalItems,
      totalPages: paginationInfo.totalPages,
      currentPage: paginationInfo.currentPage,
      pageSize: paginationInfo.pageSize,
      hasMoreData: (paginationInfo.currentPage < paginationInfo.totalPages),
      error: response && response.error ? response.error : null
    };
  } catch (error) {
    console.error('获取裁床运行数据表格分页数据失败:', error);
    return { 
      tableData: [], 
      totalItems: 0,
      totalPages: 0,
      currentPage: page,
      error: '获取数据失败' 
    };
  }
};

/**
 * 获取裁床状态数据的专用API
 * 唯一获取裁床状态数据的函数，用于避免状态码映射不一致问题
 * 使用统一的mapDeviceStatus函数映射状态码
 * 
 * @returns {Promise} 包含裁床状态数据的Promise
 */
export const getDeviceStatusData = async () => {
  try {
    // 性能记录开始
    const startTime = performance.now();
    
    const response = await api.get('/monitor/machine-status');
    const result = [];
    
    // 处理响应数据
    if (response && response.machines && Array.isArray(response.machines)) {
      // 将后端数据转换为前端需要的格式
      result.push(...response.machines.map(machine => {
        // 获取状态码和映射后的状态
        const statusCode = machine.onlineStatus;
        const mappedStatus = mapDeviceStatus(statusCode, null);
        
        return {
          id: machine.deviceId,
          status: mappedStatus,
          runningHours: machine.runningHours,
          speed: machine.speed,
          workshop: machine.workshop
        };
      }));
    }
    
    // 性能记录结束
    const endTime = performance.now();
    
    return result;
  } catch (error) {
    console.error('获取裁床状态数据失败:', error);
    return [];
  }
};

// 更优雅的错误处理函数
const handleApiError = (error, defaultValue, errorMsg = '请求失败') => {
  // 如果处于开发环境，记录更详细的错误信息
  if (process.env.NODE_ENV === 'development') {
    console.error(errorMsg, error);
  }
  return defaultValue;
};

/**
 * 获取当前能耗数据
 * @returns {Promise<Object>} 能耗数据
 */
export const getPowerData = async () => {
  try {
    const response = await api.get('/monitor/power');
    return response.data || [];
  } catch (error) {
    return handleApiError(error, [], '获取能耗数据失败');
  }
};

/**
 * 获取移动率数据
 * @returns {Promise<Object>} 移动率数据
 */
export const getMobilityData = async () => {
  try {
    const response = await api.get('/monitor/mobility');
    return response.data || {};
  } catch (error) {
    return handleApiError(error, { value: 0, color: '#00FF00' }, '获取移动率数据失败');
  }
};

/**
 * 获取裁床运行数据表格
 * @returns {Promise<Object>} 表格数据
 */
export const getCuttingTableData = async () => {
  try {
    const response = await api.get('/monitor/cutting-table');
    return response.data || { headers: [], rows: [] };
  } catch (error) {
    return handleApiError(error, { headers: [], rows: [] }, '获取裁床运行数据表格失败');
  }
};

/**
 * 获取裁剪时间数据
 * @returns {Promise<Object>} 裁剪时间数据
 */
export const getCuttingTimeData = async () => {
  try {
    const response = await api.get('/monitor/cutting-time');
    return response.data || { value: 0 };
  } catch (error) {
    return handleApiError(error, { value: 0 }, '获取切割时间数据失败');
  }
};

/**
 * 获取裁剪速度数据
 * @returns {Promise<Object>} 裁剪速度数据
 */
export const getCuttingSpeedData = async () => {
  try {
    const response = await api.get('/monitor/cutting-speed');
    return response.data || { value: 0 };
  } catch (error) {
    return handleApiError(error, { value: 0 }, '获取切割速度数据失败');
  }
};

/**
 * 获取裁剪套数数据
 * @returns {Promise<Object>} 裁剪套数数据
 */
export const getCuttingPiecesData = async () => {
  try {
    const response = await api.get('/monitor/cutting-pieces');
    return response.data || { value: 0 };
  } catch (error) {
    return handleApiError(error, { value: 0 }, '获取裁剪套数数据失败');
  }
};

/**
 * 获取所有监控数据
 * @returns {Promise<Object>} 所有监控数据
 */
export const getAllMonitorData = async () => {
  try {
    // 并行请求数据，提高性能
    const [power, mobility, perimeter, cuttingTable, cuttingTime, cuttingSpeed, cuttingPieces] = await Promise.all([
      getPowerData(),
      getMobilityData(),
      getPerimeterData(),
      getCuttingTableData(),
      getCuttingTimeData(),
      getCuttingSpeedData(),
      getCuttingPiecesData()
    ]);
    
    return {
      powerData: power,
      mobilityData: mobility,
      perimeterData: perimeter,
      cuttingTableData: cuttingTable,
      cuttingTimeData: cuttingTime,
      cuttingSpeedData: cuttingSpeed,
      cuttingPiecesData: cuttingPieces
    };
  } catch (error) {
    return handleApiError(error, {
      powerData: [],
      mobilityData: { value: 0, color: '#00FF00' },
      perimeterData: { value: 0, color: '#00FF00' },
      cuttingTableData: { headers: [], rows: [] },
      cuttingTimeData: { value: 0 },
      cuttingSpeedData: { value: 0 },
      cuttingPiecesData: { value: 0 }
    }, '获取监控数据失败');
  }
};

/**
 * 获取裁床运行数据表格（分页）
 * @param {number} page 页码
 * @param {number} pageSize 每页记录数
 * @returns {Promise<Object>} 分页表格数据
 */
export const getCuttingTableDataPaginated = async (page = 1, pageSize = 10) => {
  try {
    const response = await api.get('/monitor/cutting-table-paginated', {
      params: { page, pageSize }
    });
    return response.data || { 
      headers: [],
      rows: [], 
      totalPages: 0,
      currentPage: page,
      totalRecords: 0
    };
  } catch (error) {
    return handleApiError(error, { 
      headers: [],
      rows: [], 
      totalPages: 0,
      currentPage: page,
      totalRecords: 0
    }, '获取裁床运行数据表格分页数据失败');
  }
};

/**
 * 获取裁床状态数据
 * @returns {Promise<Array>} 裁床状态数据
 */
export const getMachineStatusData = async () => {
  try {
    const response = await api.get('/monitor/machine-status');
    return response.data || [];
  } catch (error) {
    return handleApiError(error, [], '获取裁床状态数据失败');
  }
};