import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { getMonitorData } from '../../api/monitorApi';
import { 
  tableData as initialTableData, 
  tableHeaders as initialTableHeaders, 
  deviceStatusData as initialDeviceStatusData, 
  statusLegendItems as initialStatusLegendItems,
  cutSetsValue as initialCutSetsValue,
  DeviceStatus
} from '../../data/monitorData';

// 默认设备能耗数据
const defaultDeviceEnergyData = [
  { deviceId: '设备1', energy: 63.5 },
  { deviceId: '设备2', energy: 57.3 },
  { deviceId: '设备3', energy: 68.2 },
  { deviceId: '设备4', energy: 46.2 },
  { deviceId: '设备5', energy: 65.4 }
];

// 模拟API响应数据 - 当后端API未就绪时使用
const mockApiResponse = {
  tableData: initialTableData,
  deviceStatusData: initialDeviceStatusData,
  efficiencyValue: 69.03,
  cutTimeValue: 16.5,
  energyValue: 298.6,
  cutSpeedValue: 6.5,
  perimeterValue: 1238.5,
  cutSetsValue: initialCutSetsValue,
  deviceEnergyData: defaultDeviceEnergyData // 添加设备能耗数据
};

// 开关标志 - 设置是否使用模拟数据
const USE_MOCK_DATA = false;

// 异步获取监控数据
export const fetchMonitorData = createAsyncThunk(
  'monitor/fetchMonitorData',
  async (_, { rejectWithValue }) => {
    try {
      // 使用专门的API服务获取监控数据
      const response = await getMonitorData();
      console.log('获取到监控数据:', response);
      
      // 检查API返回的设备能耗数据
      if (response.deviceEnergyData && Array.isArray(response.deviceEnergyData)) {
        console.log(`API返回了 ${response.deviceEnergyData.length} 条设备能耗数据`);
        if (response.deviceEnergyData.length > 0) {
          console.log('第一条设备数据:', JSON.stringify(response.deviceEnergyData[0]));
        }
      } else {
        console.warn('API未返回设备能耗数据或数据格式不正确');
      }
      
      // 返回响应的所有数据
      return {
        ...response,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('获取监控数据失败:', error);
      return rejectWithValue('获取监控数据失败');
    }
  }
);

// 初始状态
const initialState = {
  tableData: initialTableData,
  tableHeaders: initialTableHeaders,
  deviceStatusData: initialDeviceStatusData,
  statusLegendItems: initialStatusLegendItems,
  cutSetsValue: initialCutSetsValue,
  efficiencyValue: null,   // 移动率初始值
  cutTimeValue: 0,         // 裁剪时间初始值
  energyValue: 0,          // 能耗初始值
  cutSpeedValue: 0,        // 裁剪速度初始值
  perimeterValue: null,    // 周长初始值
  deviceEnergyData: [],    // 设备能耗数据初始为空数组
  loading: false,
  error: null,
  lastUpdated: null,
  isDataInitialized: false
};

const monitorSlice = createSlice({
  name: 'monitor',
  initialState,
  reducers: {
    updateEfficiencyValue(state, action) {
      state.efficiencyValue = action.payload;
    },
    updateCutTimeValue(state, action) {
      state.cutTimeValue = action.payload;
    },
    updateEnergyValue(state, action) {
      state.energyValue = action.payload;
    },
    updateCutSpeedValue(state, action) {
      state.cutSpeedValue = action.payload;
    },
    updatePerimeterValue(state, action) {
      state.perimeterValue = action.payload;
    },
    updateCutSetsValue(state, action) {
      state.cutSetsValue = action.payload;
    },
    updateDeviceStatus(state, action) {
      const { deviceId, status } = action.payload;
      const deviceIndex = state.deviceStatusData.findIndex(device => device.id === deviceId);
      if (deviceIndex !== -1) {
        state.deviceStatusData[deviceIndex].status = status;
      }
    },
    updateDeviceEnergyData(state, action) {
      if (Array.isArray(action.payload)) {
        state.deviceEnergyData = action.payload;
        console.log(`Redux状态更新：${action.payload.length}台设备的能耗数据`);
      } else {
        console.warn('尝试更新设备能耗数据失败：payload不是数组', action.payload);
      }
    },
    updateTableData(state, action) {
      state.tableData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonitorData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // 获取API返回的数据
        const data = action.payload;
        
        // 特别处理设备能耗数据
        if (data.deviceEnergyData && Array.isArray(data.deviceEnergyData)) {
          state.deviceEnergyData = [...data.deviceEnergyData]; // 创建新数组以确保状态更新
          console.log(`Redux状态更新: 设置了 ${data.deviceEnergyData.length} 条设备能耗数据`);
        } else {
          console.warn('API返回的设备能耗数据无效，保留当前状态');
        }
        
        // 更新其他数据
        if (typeof data.efficiencyValue === 'number') state.efficiencyValue = data.efficiencyValue;
        if (typeof data.cutTimeValue === 'number') state.cutTimeValue = data.cutTimeValue;
        if (typeof data.energyValue === 'number') state.energyValue = data.energyValue;
        if (typeof data.cutSpeedValue === 'number') state.cutSpeedValue = data.cutSpeedValue;
        if (typeof data.perimeterValue === 'number') state.perimeterValue = data.perimeterValue;
        if (data.cutSetsValue !== undefined) state.cutSetsValue = data.cutSetsValue;
        if (data.tableData) state.tableData = data.tableData;
        if (data.deviceStatusData) state.deviceStatusData = data.deviceStatusData;
        
        state.lastUpdated = data.lastUpdated;
        state.isDataInitialized = true;
      })
      .addCase(fetchMonitorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '获取数据失败';
        state.isDataInitialized = true; // 即使失败也标记为已初始化
      });
  },
});

// 导出Action Creators
export const { 
  updateEfficiencyValue,
  updateCutTimeValue,
  updateEnergyValue,
  updateCutSpeedValue,
  updatePerimeterValue,
  updateCutSetsValue,
  updateDeviceStatus,
  updateDeviceEnergyData,
  updateTableData
} = monitorSlice.actions;

// 导出选择器
export const selectMonitorData = (state) => state.monitor;
export const selectEfficiencyValue = (state) => state.monitor.efficiencyValue;
export const selectCutTimeValue = (state) => state.monitor.cutTimeValue;
export const selectEnergyValue = (state) => state.monitor.energyValue;
export const selectCutSpeedValue = (state) => state.monitor.cutSpeedValue;
export const selectPerimeterValue = (state) => state.monitor.perimeterValue;
export const selectCutSetsValue = (state) => state.monitor.cutSetsValue;
export const selectDeviceStatusData = (state) => state.monitor.deviceStatusData;
export const selectDeviceEnergyData = (state) => state.monitor.deviceEnergyData;
export const selectTableData = (state) => state.monitor.tableData;
export const selectTableHeaders = (state) => state.monitor.tableHeaders;
export const selectStatusLegendItems = (state) => state.monitor.statusLegendItems;
export const selectMonitorLoading = (state) => state.monitor.loading;
export const selectMonitorError = (state) => state.monitor.error;
export const selectLastUpdated = (state) => state.monitor.lastUpdated;
export const selectIsDataInitialized = (state) => state.monitor.isDataInitialized;

export default monitorSlice.reducer; 