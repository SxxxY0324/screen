import { createSlice } from '@reduxjs/toolkit';

// 初始状态
const initialState = {
  activeTab: '实时监控', // 当前激活的标签页
  isLoading: false,      // 全局加载状态
  error: null,           // 全局错误信息
  theme: 'dark',         // 应用主题
  dataRefreshInterval: 60000, // 数据刷新间隔(毫秒)
  filters: {
    country: '中国',
    timeRange: '年间',
    yearMode: '本年',
    additional: '本年'
  }
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setGlobalLoading(state, action) {
      state.isLoading = action.payload;
    },
    setGlobalError(state, action) {
      state.error = action.payload;
    },
    clearGlobalError(state) {
      state.error = null;
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setDataRefreshInterval(state, action) {
      state.dataRefreshInterval = action.payload;
    },
    updateFilter(state, action) {
      const { key, value } = action.payload;
      if (state.filters.hasOwnProperty(key)) {
        state.filters[key] = value;
      }
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    }
  }
});

// 导出Action Creators
export const { 
  setActiveTab,
  setGlobalLoading,
  setGlobalError,
  clearGlobalError,
  setTheme,
  setDataRefreshInterval,
  updateFilter,
  resetFilters
} = appSlice.actions;

// 导出选择器
export const selectActiveTab = (state) => state.app.activeTab;
export const selectIsLoading = (state) => state.app.isLoading;
export const selectError = (state) => state.app.error;
export const selectTheme = (state) => state.app.theme;
export const selectDataRefreshInterval = (state) => state.app.dataRefreshInterval;
export const selectFilters = (state) => state.app.filters;

export default appSlice.reducer; 