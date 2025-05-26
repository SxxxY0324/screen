import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { getMonitorData } from '../../api/monitorApi';
import { 
  tableHeaders as initialTableHeaders, 
  statusLegendItems as initialStatusLegendItems,
} from '../../data/monitorData';

// 异步获取监控数据
export const fetchMonitorData = createAsyncThunk(
  'monitor/fetchMonitorData',
  async (_, { rejectWithValue }) => {
    try {
      // 使用专门的API服务获取监控数据
      const response = await getMonitorData();
      
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
  tableData: [],
  tableHeaders: initialTableHeaders,
  deviceStatusData: [],
  statusLegendItems: initialStatusLegendItems,
  cutSetsValue: '0',
  efficiencyValue: 0,    // 移动率初始值
  cutTimeValue: 0,       // 裁剪时间初始值
  energyValue: 0,        // 能耗初始值
  cutSpeedValue: 0,      // 裁剪速度初始值
  perimeterValue: 0,     // 周长初始值
  deviceEnergyData: [],  // 设备能耗数据初始为空数组
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
        }
        
        // 处理设备状态数据
        if (data.deviceStatusData && Array.isArray(data.deviceStatusData) && data.deviceStatusData.length > 0) {
          // 创建新数组以确保状态更新
          state.deviceStatusData = [...data.deviceStatusData];
        }
        
        // 更新其他数据
        if (typeof data.efficiencyValue === 'number') state.efficiencyValue = data.efficiencyValue;
        if (typeof data.cutTimeValue === 'number') state.cutTimeValue = data.cutTimeValue;
        if (typeof data.energyValue === 'number') state.energyValue = data.energyValue;
        if (typeof data.cutSpeedValue === 'number') state.cutSpeedValue = data.cutSpeedValue;
        if (typeof data.perimeterValue === 'number') state.perimeterValue = data.perimeterValue;
        if (data.cutSetsValue !== undefined) state.cutSetsValue = data.cutSetsValue;
        if (data.tableData) state.tableData = data.tableData;
        
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