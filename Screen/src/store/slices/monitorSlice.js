import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { 
  tableData as initialTableData, 
  tableHeaders as initialTableHeaders, 
  deviceStatusData as initialDeviceStatusData, 
  statusLegendItems as initialStatusLegendItems,
  cutSetsValue as initialCutSetsValue,
  DeviceStatus
} from '../../data/monitorData';

// 模拟API响应数据 - 当后端API未就绪时使用
const mockApiResponse = {
  tableData: initialTableData,
  deviceStatusData: initialDeviceStatusData,
  efficiencyValue: 69.03,
  cutTimeValue: 16.5,
  energyValue: 298.6,
  cutSpeedValue: 6.5,
  perimeterValue: 1238.5,
  cutSetsValue: initialCutSetsValue
};

// 开关标志 - 设置是否使用模拟数据
const USE_MOCK_DATA = true;

// 异步获取监控数据
export const fetchMonitorData = createAsyncThunk(
  'monitor/fetchMonitorData',
  async (_, { rejectWithValue }) => {
    // 如果设置使用模拟数据，直接返回模拟数据
    if (USE_MOCK_DATA) {
      // 减少网络延迟模拟时间，避免与图表动画冲突
      await new Promise(resolve => setTimeout(resolve, 50));
      return mockApiResponse;
    }
    
    try {
      // 尝试真实API调用
      const response = await api.get('/monitor/data');
      return response;
    } catch (error) {
      console.error('API请求失败:', error);
      
      // 即使API请求失败，仍返回模拟数据而不是错误
      // 这样可以防止UI显示错误，确保有数据可以显示
      return mockApiResponse;
      
      // 如果想真正处理API错误，可以取消注释下面的代码
      // return rejectWithValue(
      //   typeof error.message === 'string' ? error.message : '获取数据失败'
      // );
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
  efficiencyValue: 69.03, // 移动率MU初始值
  cutTimeValue: 16.5,     // 裁剪时间初始值
  energyValue: 298.6,     // 能耗初始值
  cutSpeedValue: 6.5,     // 裁剪速度初始值
  perimeterValue: 1238.5, // 周长初始值
  loading: false,
  error: null,
  lastUpdated: null
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
        // 更新所有监控数据
        const data = action.payload;
        
        if (data.tableData) state.tableData = data.tableData;
        if (data.deviceStatusData) state.deviceStatusData = data.deviceStatusData;
        if (data.efficiencyValue) state.efficiencyValue = data.efficiencyValue;
        if (data.cutTimeValue) state.cutTimeValue = data.cutTimeValue;
        if (data.energyValue) state.energyValue = data.energyValue;
        if (data.cutSpeedValue) state.cutSpeedValue = data.cutSpeedValue;
        if (data.perimeterValue) state.perimeterValue = data.perimeterValue;
        if (data.cutSetsValue) state.cutSetsValue = data.cutSetsValue;
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMonitorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '获取数据失败';
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
export const selectTableData = (state) => state.monitor.tableData;
export const selectTableHeaders = (state) => state.monitor.tableHeaders;
export const selectStatusLegendItems = (state) => state.monitor.statusLegendItems;
export const selectMonitorLoading = (state) => state.monitor.loading;
export const selectMonitorError = (state) => state.monitor.error;
export const selectLastUpdated = (state) => state.monitor.lastUpdated;

export default monitorSlice.reducer; 