import React, { useEffect, useRef, useCallback } from 'react';
import '../App.css';
import '../components/monitor/monitor.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchMonitorData,
  loadMoreTableData,
  fetchDeviceStatusData,
  selectMonitorData,
  selectTableData,
  selectTableHeaders,
  selectDeviceStatusData,
  selectStatusLegendItems,
  selectCutSetsValue,
  selectMonitorError,
  selectPagination,
  selectLoadingMore,
  selectDeviceStatusLoading
} from '../store/slices/monitorSlice';
import { selectDataRefreshInterval, selectSelectedDevices, selectSelectedWorkshops } from '../store/slices/appSlice';
import DeviceStatusTransition from '../components/common/DeviceStatusTransition';
import { COLORS } from '../components';

// 导入监控组件
import {
  EfficiencyMonitor,
  CutTimeMonitor,
  EnergyMonitor,
  CutSpeedMonitor, 
  PerimeterMonitor,
  CutSetsMonitor,
  StatusMonitor
} from '../components/monitor';

// 只保留裁剪套数图标，其他都用纯CSS实现
import cutSetsIconImg from '../assets/images/裁剪套数图标.jpg';

function MonitorPage() {
  const dispatch = useAppDispatch();
  const monitorData = useAppSelector(selectMonitorData);
  const tableData = useAppSelector(selectTableData);
  const tableHeaders = useAppSelector(selectTableHeaders);
  const deviceStatusData = useAppSelector(selectDeviceStatusData);
  const statusLegendItems = useAppSelector(selectStatusLegendItems);
  const cutSetsValue = useAppSelector(selectCutSetsValue);
  const errorMessage = useAppSelector(selectMonitorError);
  const pagination = useAppSelector(selectPagination);
  const isLoadingMore = useAppSelector(selectLoadingMore);
  const deviceStatusLoading = useAppSelector(selectDeviceStatusLoading);
  const selectedDevices = useAppSelector(selectSelectedDevices);
  const selectedWorkshops = useAppSelector(selectSelectedWorkshops);
  
  // 定时器ID
  const timerRef = useRef(null);
  
  // 刷新间隔
  const refreshInterval = useAppSelector(selectDataRefreshInterval);
  
  // 设备状态颜色映射
  const getStatusColor = (status) => {
    switch(status) {
      case 'cutting': return COLORS.GREEN;
      case 'standby': return COLORS.YELLOW;
      case 'unplanned': return COLORS.RED;
      default: return COLORS.GRAY;
    }
  };
  
  // 过滤设备状态数据，同时应用设备和车间的筛选条件
  const filteredDeviceStatusData = React.useMemo(() => {
    if (!deviceStatusData) return [];
    
    let filteredData = [...deviceStatusData];
    
    // 应用设备筛选
    if (selectedDevices && selectedDevices.length > 0) {
      filteredData = filteredData.filter(device => selectedDevices.includes(device.id));
    }
    
    // 应用车间筛选
    if (selectedWorkshops && selectedWorkshops.length > 0) {
      filteredData = filteredData.filter(device => device.workshop && selectedWorkshops.includes(device.workshop));
    }
    
    return filteredData;
  }, [deviceStatusData, selectedDevices, selectedWorkshops]);
  
  // 数据加载和定时刷新
  useEffect(() => {
    const loadData = () => {
      try {
        dispatch(fetchMonitorData());
        dispatch(fetchDeviceStatusData());
      } catch (error) {
        console.error('数据加载失败:', error);
      }
    };
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    loadData();
    
    timerRef.current = setInterval(loadData, refreshInterval);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dispatch, refreshInterval]);

  // 加载更多数据处理
  const handleLoadMore = useCallback(() => {
    if (pagination?.hasMoreData === false || isLoadingMore) {
      return;
    }
    
    const nextPage = (pagination?.currentPage || 0) + 1;
    
    dispatch(loadMoreTableData({page: nextPage, size: 20}));
  }, [dispatch, pagination, isLoadingMore, tableData?.length]);

  return (
    <>
      {/* 添加裁床状态数据过渡管理组件 - 非可视化组件 */}
      <DeviceStatusTransition delay={300} />
      
      <div className="dashboard-grid">
        {errorMessage && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            padding: '10px',
            backgroundColor: COLORS.RED,
            color: COLORS.WHITE,
            borderRadius: '5px',
            zIndex: 100
          }}>
            {errorMessage}
          </div>
        )}
        
        {/* 移动率MU */}
        <div className="card-efficiency">
          <EfficiencyMonitor 
            value={monitorData.efficiencyValue}
            defaultValue={69.03} 
          />
        </div>

        {/* 裁剪时间 */}
        <div className="card-cuttime">
          <CutTimeMonitor 
            value={monitorData.cutTimeValue}
            defaultValue={16.5} 
          />
        </div>
        
        {/* 总能耗 */}
        <div className="card-energy">
          <EnergyMonitor 
            value={monitorData.energyValue}
            defaultValue={298.6} 
          />
        </div>

        {/* 裁剪速度 */}
        <div className="card-cutspeed">
          <CutSpeedMonitor 
            value={monitorData.cutSpeedValue}
            defaultValue={6.5} 
          />
        </div>

        {/* 总周长 */}
        <div className="card-perimeter">
          <PerimeterMonitor 
            value={monitorData.perimeterValue}
            defaultValue={1238.5} 
          />
        </div>

        {/* 裁剪套数 */}
        <div className="card-cutsets">
          <CutSetsMonitor 
            value={cutSetsValue}
            iconSrc={cutSetsIconImg}
          />
        </div>

        {/* 裁床运行情况 */}
        <div className="card-status">
          <StatusMonitor 
            statusLegendItems={statusLegendItems}
            deviceData={filteredDeviceStatusData}
            isLoading={deviceStatusLoading}
            getStatusColor={getStatusColor}
            tableData={tableData}
            tableHeaders={tableHeaders}
            onLoadMore={handleLoadMore}
            canLoadMore={pagination?.hasMoreData}
            isLoadingMore={isLoadingMore}
          />
        </div>
      </div>
    </>
  );
}

export default MonitorPage; 