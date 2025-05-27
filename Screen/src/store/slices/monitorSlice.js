import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { getMonitorData, getMachineRunningDataWithPagination, getDeviceStatusData } from '../../api/monitorApi';
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
      return rejectWithValue('获取监控数据失败');
    }
  }
);

// 异步获取裁床状态数据 - 单独API调用
export const fetchDeviceStatusData = createAsyncThunk(
  'monitor/fetchDeviceStatusData',
  async (_, { rejectWithValue }) => {
    try {
      // 使用专门的API获取裁床状态数据
      const deviceStatusData = await getDeviceStatusData();
      
      return {
        deviceStatusData,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue('获取裁床状态数据失败');
    }
  }
);

// 异步加载更多表格数据
export const loadMoreTableData = createAsyncThunk(
  'monitor/loadMoreTableData',
  async ({page, size}, { rejectWithValue }) => {
    try {
      // 使用分页API加载更多数据
      const response = await getMachineRunningDataWithPagination(page, size);
      
      return {
        ...response,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue('加载更多表格数据失败');
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
  
  // 裁床状态数据缓冲区
  deviceStatusBuffer: null,     // 裁床状态数据的缓冲
  deviceStatusTransition: false, // 是否正在过渡
  deviceStatusLastUpdate: 0,     // 最后更新时间戳
  
  loading: false,
  deviceStatusLoading: false,  // 裁床状态数据加载状态
  loadingMore: false,    // 加载更多数据状态
  error: null,
  deviceStatusError: null, // 裁床状态数据错误
  loadMoreError: null,   // 加载更多时的错误
  lastUpdated: null,
  deviceStatusLastUpdated: null, // 裁床状态数据最后更新时间
  isDataInitialized: false,
  isDeviceStatusInitialized: false, // 裁床状态数据是否已初始化
  pagination: {          // 分页信息
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMoreData: false
  }
};

// 检查裁床状态数据是否有实质变化的辅助函数
const hasDeviceStatusChanged = (oldStatus, newStatus) => {
  if (!oldStatus || !newStatus || oldStatus.length !== newStatus.length) {
    return true;
  }
  
  // 比较每个设备的状态是否变化
  for (let i = 0; i < oldStatus.length; i++) {
    const oldDevice = oldStatus[i];
    const newDevice = newStatus[i];
    
    // 如果ID不匹配或状态不同，认为有变化
    if (oldDevice.id !== newDevice.id || oldDevice.status !== newDevice.status) {
      return true;
    }
  }
  
  // 所有设备状态都相同
  return false;
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
    applyDeviceStatusBuffer(state) {
      // 只有在缓冲区有数据且标记了过渡状态时才应用
      if (state.deviceStatusBuffer && state.deviceStatusTransition) {
        state.deviceStatusData = state.deviceStatusBuffer;
        state.deviceStatusBuffer = null;
        state.deviceStatusTransition = false;
      }
    }
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
        
        // 注意：不再处理设备状态数据，这部分由fetchDeviceStatusData处理
        // 以避免状态码映射不一致导致的状态显示冲突
        
        // 更新其他数据
        if (typeof data.efficiencyValue === 'number') state.efficiencyValue = data.efficiencyValue;
        if (typeof data.cutTimeValue === 'number') state.cutTimeValue = data.cutTimeValue;
        if (typeof data.energyValue === 'number') state.energyValue = data.energyValue;
        if (typeof data.cutSpeedValue === 'number') state.cutSpeedValue = data.cutSpeedValue;
        if (typeof data.perimeterValue === 'number') state.perimeterValue = data.perimeterValue;
        if (data.cutSetsValue !== undefined) state.cutSetsValue = data.cutSetsValue;
        
        // 更新表格数据和分页信息
        if (data.tableData) {
          state.tableData = data.tableData;
          
          // 从返回数据中获取分页信息，如果没有则使用默认值
          const totalItems = data.totalItems !== undefined ? data.totalItems : data.tableData.length;
          const totalPages = data.totalPages !== undefined ? data.totalPages : 1;
          const currentPage = data.currentPage !== undefined ? data.currentPage : 1;
          // 显式检查是否有更多数据
          const hasMoreData = data.hasMoreData !== undefined 
            ? data.hasMoreData 
            : (currentPage < totalPages);
          
          // 更新分页状态
          state.pagination = {
            currentPage,
            totalPages,
            totalItems,
            hasMoreData
          };
        }
        
        state.lastUpdated = data.lastUpdated;
        state.isDataInitialized = true;
      })
      .addCase(fetchMonitorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '获取数据失败';
        state.isDataInitialized = true; // 即使失败也标记为已初始化
      })
      // 处理加载更多数据的状态
      .addCase(loadMoreTableData.pending, (state) => {
        state.loadingMore = true;
        state.loadMoreError = null;
      })
      .addCase(loadMoreTableData.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.loadMoreError = null;
        
        const data = action.payload;
        
        // 如果有新的表格数据
        if (data.tableData && Array.isArray(data.tableData) && data.tableData.length > 0) {
          // 将新数据追加到现有表格数据之后
          state.tableData = [...state.tableData, ...data.tableData];
          
          // 获取分页信息
          const currentPage = data.currentPage || state.pagination.currentPage + 1;
          const totalPages = data.totalPages || state.pagination.totalPages;
          const totalItems = data.totalItems || state.pagination.totalItems;
          // 显式检查hasMoreData字段，如果没有则基于currentPage和totalPages计算
          const hasMoreData = data.hasMoreData !== undefined 
            ? data.hasMoreData 
            : (currentPage < totalPages);
          
          // 更新分页信息
          state.pagination = {
            currentPage,
            totalPages,
            totalItems,
            hasMoreData
          };
        } else {
          // 即使没有新数据，也标记为没有更多数据了
          state.pagination.hasMoreData = false;
        }
      })
      .addCase(loadMoreTableData.rejected, (state, action) => {
        state.loadingMore = false;
        state.loadMoreError = action.payload || '加载更多数据失败';
      })
      // 处理裁床状态数据的状态
      .addCase(fetchDeviceStatusData.pending, (state) => {
        // 首次加载时设置加载状态，后续重新加载时不改变加载状态以避免闪烁
        if (!state.isDeviceStatusInitialized) {
          state.deviceStatusLoading = true;
        }
        state.deviceStatusError = null;
      })
      .addCase(fetchDeviceStatusData.fulfilled, (state, action) => {
        state.deviceStatusLoading = false;
        state.deviceStatusError = null;
        
        const data = action.payload;
        const currentTime = Date.now();
        
        // 更新裁床状态数据
        if (data.deviceStatusData && Array.isArray(data.deviceStatusData)) {
          // 如果是首次加载，直接设置数据
          if (!state.isDeviceStatusInitialized) {
            state.deviceStatusData = [...data.deviceStatusData];
          } else {
            // 如果不是首次加载，检查数据是否有显著变化
            const hasChanged = hasDeviceStatusChanged(state.deviceStatusData, data.deviceStatusData);
            
            // 如果有变化，设置缓冲区和过渡标志
            if (hasChanged) {
              // 只有当距上次更新超过500ms时才触发过渡，避免频繁过渡
              if (currentTime - state.deviceStatusLastUpdate > 500) {
                state.deviceStatusBuffer = [...data.deviceStatusData];
                state.deviceStatusTransition = true;
                state.deviceStatusLastUpdate = currentTime;
              } else {
                // 如果更新太频繁，则直接更新，不使用过渡
                state.deviceStatusData = [...data.deviceStatusData];
              }
            }
          }
        }
        
        state.deviceStatusLastUpdated = data.lastUpdated;
        state.isDeviceStatusInitialized = true;
      })
      .addCase(fetchDeviceStatusData.rejected, (state, action) => {
        state.deviceStatusLoading = false;
        state.deviceStatusError = action.payload || '获取裁床状态数据失败';
        state.isDeviceStatusInitialized = true; // 即使失败也标记为已初始化
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
  updateTableData,
  applyDeviceStatusBuffer
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
export const selectIsDeviceStatusInitialized = (state) => state.monitor.isDeviceStatusInitialized;
export const selectDeviceStatusLoading = (state) => state.monitor.deviceStatusLoading;
export const selectDeviceStatusError = (state) => state.monitor.deviceStatusError;
export const selectDeviceStatusLastUpdated = (state) => state.monitor.deviceStatusLastUpdated;
export const selectPagination = (state) => state.monitor.pagination;
export const selectLoadingMore = (state) => state.monitor.loadingMore;
export const selectDeviceStatusTransition = (state) => state.monitor.deviceStatusTransition;
export const selectDeviceStatusBuffer = (state) => state.monitor.deviceStatusBuffer;

export default monitorSlice.reducer; 