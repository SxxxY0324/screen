import { useReducer, useCallback } from 'react';
import { MOCK_DATA, DEVICE_DETAILS_CONFIG } from '../constants/config';

// 定义Tab类型
export type TabType = 'monitor' | 'maintenance' | 'analysis';

// 设备能耗数据接口
interface DeviceEnergy {
  deviceCode: string;
  energyValue: number;
}

// 状态接口
interface DeviceDetailsState {
  activeTab: TabType;
  tabSwitchCount: number;
  dataLoaded: boolean;
  mobilityValue: number;
  energyData: DeviceEnergy[];
  circumferenceValue: number;
  fixedAreaHeight: number;
}

// Action类型
type DeviceDetailsAction =
  | { type: 'SET_ACTIVE_TAB'; payload: TabType }
  | { type: 'INCREMENT_TAB_SWITCH_COUNT' }
  | { type: 'SET_DATA_LOADED'; payload: boolean }
  | { type: 'SET_MOBILITY_VALUE'; payload: number }
  | { type: 'SET_ENERGY_DATA'; payload: DeviceEnergy[] }
  | { type: 'SET_CIRCUMFERENCE_VALUE'; payload: number }
  | { type: 'SET_FIXED_AREA_HEIGHT'; payload: number }
  | { type: 'LOAD_MOCK_DATA' }
  | { type: 'RESET_DATA' };

// 初始状态
const initialState: DeviceDetailsState = {
  activeTab: 'monitor',
  tabSwitchCount: 0,
  dataLoaded: false,
  mobilityValue: 0,
  energyData: [...MOCK_DATA.ENERGY_DATA],
  circumferenceValue: 0,
  fixedAreaHeight: 0,
};

// Reducer函数
function deviceDetailsReducer(state: DeviceDetailsState, action: DeviceDetailsAction): DeviceDetailsState {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'INCREMENT_TAB_SWITCH_COUNT':
      return { ...state, tabSwitchCount: state.tabSwitchCount + 1 };
    
    case 'SET_DATA_LOADED':
      return { ...state, dataLoaded: action.payload };
    
    case 'SET_MOBILITY_VALUE':
      return { ...state, mobilityValue: action.payload };
    
    case 'SET_ENERGY_DATA':
      return { ...state, energyData: action.payload };
    
    case 'SET_CIRCUMFERENCE_VALUE':
      return { ...state, circumferenceValue: action.payload };
    
    case 'SET_FIXED_AREA_HEIGHT':
      return { ...state, fixedAreaHeight: action.payload };
    
    case 'LOAD_MOCK_DATA':
      return {
        ...state,
        mobilityValue: MOCK_DATA.DEVICE_DEFAULTS.MOBILITY_VALUE,
        energyData: [...MOCK_DATA.ENERGY_DATA],
        circumferenceValue: MOCK_DATA.DEVICE_DEFAULTS.CIRCUMFERENCE_VALUE,
        dataLoaded: true,
      };
    
    case 'RESET_DATA':
      return {
        ...state,
        dataLoaded: false,
        mobilityValue: 0,
        circumferenceValue: 0,
      };
    
    default:
      return state;
  }
}

/**
 * 设备详情页面状态管理Hook
 * @returns 状态和操作方法
 */
export function useDeviceDetailsState() {
  const [state, dispatch] = useReducer(deviceDetailsReducer, initialState);

  // 切换Tab
  const handleTabChange = useCallback((tab: TabType) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    
    // 当切换到监控Tab时，重新加载数据
    if (tab === 'monitor') {
      dispatch({ type: 'RESET_DATA' });
      
      // 模拟数据加载
      setTimeout(() => {
        dispatch({ type: 'LOAD_MOCK_DATA' });
        dispatch({ type: 'INCREMENT_TAB_SWITCH_COUNT' });
      }, DEVICE_DETAILS_CONFIG.TAB_SWITCH_DELAY);
    }
  }, []);

  // 初始化数据加载
  const loadInitialData = useCallback(() => {
    setTimeout(() => {
      dispatch({ type: 'LOAD_MOCK_DATA' });
    }, DEVICE_DETAILS_CONFIG.TAB_SWITCH_DELAY + 300); // 稍微延长初始加载时间
  }, []);

  // 页面显示时重新加载数据（针对微信小程序）
  const reloadDataOnPageShow = useCallback(() => {
    if (state.activeTab === 'monitor') {
      dispatch({ type: 'RESET_DATA' });
      
      setTimeout(() => {
        dispatch({ type: 'LOAD_MOCK_DATA' });
        dispatch({ type: 'INCREMENT_TAB_SWITCH_COUNT' });
      }, DEVICE_DETAILS_CONFIG.PAGE_SHOW_RELOAD_DELAY);
    }
  }, [state.activeTab]);

  // 设置固定区域高度
  const setFixedAreaHeight = useCallback((height: number) => {
    dispatch({ type: 'SET_FIXED_AREA_HEIGHT', payload: height });
  }, []);

  return {
    // 状态
    state,
    
    // 操作方法
    handleTabChange,
    loadInitialData,
    reloadDataOnPageShow,
    setFixedAreaHeight,
    
    // 直接的dispatch方法（用于特殊情况）
    dispatch,
  };
} 