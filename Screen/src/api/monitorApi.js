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
 * 获取设备能耗数据
 * @returns {Promise} 包含设备能耗数据的Promise
 */
export const getEnergyConsumption = async () => {
  try {
    const response = await api.get('/monitor/energy-consumption');
    console.log('能耗API原始响应:', response);
    
    // 检查API响应结构，尝试提取设备数据
    let devices = [];
    let totalEnergy = 0;
    
    // 处理不同的响应结构
    if (response) {
      // 直接检查response是否为数组（某些API可能直接返回数组）
      if (Array.isArray(response)) {
        devices = response;
        totalEnergy = devices.reduce((sum, device) => sum + (device.energy || 0), 0);
      }
      // 检查response是否为对象且包含devices属性
      else if (typeof response === 'object') {
        if (Array.isArray(response.devices)) {
          // 标准响应格式
          devices = response.devices;
          totalEnergy = response.totalEnergy || devices.reduce((sum, device) => sum + (device.energy || 0), 0);
        } 
        // 检查是否存在data属性，这是axios解析后的格式
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
                  console.log(`从字段 ${key} 中找到设备数据`);
                }
              }
            });
            totalEnergy = response.data.totalEnergy || 0;
          }
        }
      }
    }
    
    console.log(`找到 ${devices.length} 台设备的能耗数据`);
    if (devices.length > 0) {
      console.log('设备数据示例:', JSON.stringify(devices.slice(0, 2)));
    }
    
    return {
      data: {
        totalEnergy: totalEnergy,
        devices: devices
      }
    };
  } catch (error) {
    console.error('获取能耗数据失败:', error);
    throw error; // 抛出错误，由getMonitorData处理
  }
};

/**
 * 获取监控页面所需的综合数据
 * 整合多个API调用，返回统一的数据格式
 * @returns {Promise} 包含所有监控数据的Promise
 */
export const getMonitorData = async () => {
  try {
    // 直接获取能耗数据，确保设备数据正确处理
    let deviceEnergyData = [];
    let energyValue = 0;
    
    try {
      // 直接调用能耗API
      const energyResponse = await getEnergyConsumption();
      console.log('能耗API直接调用结果:', energyResponse);
      
      if (energyResponse && energyResponse.data) {
        // 提取设备数据
        if (Array.isArray(energyResponse.data.devices)) {
          deviceEnergyData = energyResponse.data.devices;
          energyValue = energyResponse.data.totalEnergy || 0;
          console.log(`能耗API直接调用：获取到 ${deviceEnergyData.length} 台设备数据`);
          if (deviceEnergyData.length > 0) {
            console.log('设备数据第一条:', JSON.stringify(deviceEnergyData[0]));
          }
        }
      }
    } catch (energyError) {
      console.error('获取能耗数据失败:', energyError);
    }
    
    // 获取其他监控数据
    const [materialUtilizationResponse, perimeterResponse] = await Promise.all([
      getMaterialUtilization().catch(err => null),
      getPerimeterData().catch(err => null)
    ]);
    
    // 提取移动率值
    let efficiencyValue = 0;
    if (materialUtilizationResponse) {
      if (typeof materialUtilizationResponse.value === 'number') {
        efficiencyValue = materialUtilizationResponse.value;
      } else if (typeof materialUtilizationResponse.materialUtilization === 'number') {
        efficiencyValue = materialUtilizationResponse.materialUtilization;
      } else if (materialUtilizationResponse.data) {
        if (typeof materialUtilizationResponse.data.value === 'number') {
          efficiencyValue = materialUtilizationResponse.data.value;
        } else if (typeof materialUtilizationResponse.data.materialUtilization === 'number') {
          efficiencyValue = materialUtilizationResponse.data.materialUtilization;
        }
      }
    }
    
    // 提取周长值
    let perimeterValue = 0;
    if (perimeterResponse) {
      if (typeof perimeterResponse.value === 'number') {
        perimeterValue = perimeterResponse.value;
      } else if (typeof perimeterResponse.totalCutPerimeter === 'number') {
        perimeterValue = perimeterResponse.totalCutPerimeter;
      } else if (perimeterResponse.data) {
        if (typeof perimeterResponse.data.value === 'number') {
          perimeterValue = perimeterResponse.data.value;
        } else if (typeof perimeterResponse.data.totalCutPerimeter === 'number') {
          perimeterValue = perimeterResponse.data.totalCutPerimeter;
        }
      }
    }
    
    // 确保设备能耗数据有有效值，保留原始设备编码
    if (Array.isArray(deviceEnergyData) && deviceEnergyData.length > 0) {
      deviceEnergyData = deviceEnergyData
        .filter(item => item && (typeof item.energy === 'number' && item.energy > 0))
        .map(item => {
          // 处理后端不同格式的设备ID，但始终保留原始编码
          let deviceId = item.deviceId || item.machineSN || '未知设备';
          
          return {
            deviceId: deviceId,
            energy: typeof item.energy === 'number' ? item.energy : 0
          };
        })
        .sort((a, b) => b.energy - a.energy); // 按能耗从大到小排序
      
      console.log('处理后的设备数据数量:', deviceEnergyData.length);
      if (deviceEnergyData.length > 0) {
        console.log('处理后的第一条设备数据:', JSON.stringify(deviceEnergyData[0]));
      }
    }
    
    // 整合数据
    return {
      efficiencyValue,
      perimeterValue,
      energyValue,
      deviceEnergyData,
      cutTimeValue: 16.5,
      cutSpeedValue: 6.5,
      cutSetsValue: '0'
    };
  } catch (error) {
    console.error('获取监控数据失败:', error);
    return {
      efficiencyValue: 0,
      energyValue: 0,
      deviceEnergyData: [],
      perimeterValue: 0,
      cutTimeValue: 0,
      cutSpeedValue: 0,
      cutSetsValue: '0'
    };
  }
};