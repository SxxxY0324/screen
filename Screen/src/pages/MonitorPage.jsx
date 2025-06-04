import React, { useEffect, useRef, useCallback } from 'react';
import '../App.css';
import { EfficiencyChart, EnergyChart, PerimeterChart, CutTimeChart, CutSpeedChart } from '../components/charts';
import { StatusIcon, StatusTable, ErrorBoundary, COLORS } from '../components';
import ChartWrapper from '../components/charts/ChartWrapper';
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
import { selectDataRefreshInterval } from '../store/slices/appSlice';
import DeviceStatusTransition from '../components/common/DeviceStatusTransition';
import CachedImage from '../components/common/CachedImage';

// 导入背景图片
import cutTimeImg from '../assets/images/裁剪时间.jpg';
import cutSpeedImg from '../assets/images/裁剪速度.jpg';
import totalEnergyImg from '../assets/images/总能耗.jpg';
import totalPerimeterImg from '../assets/images/总周长.jpg';
import cutSetsImg from '../assets/images/裁剪套数.jpg';
import cutSetsIconImg from '../assets/images/裁剪套数图标.jpg';
import 移动率MUImg from '../assets/images/移动率MU.jpg';
import 裁床运行情况Img from '../assets/images/裁床运行情况.jpg';
import 各裁床运行状态标题Img from '../assets/images/各裁床运行状态标题.jpg';

// 样式常量
const STYLES = {
  chartOverlay: {
    position: 'absolute',
    top: '45px',
    left: 0,
    width: '100%',
    height: '90%',
    zIndex: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cutSetsOverlay: {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    padding: '0 5% 0 15%'
  },
  cutSetsIcon: {
    width: '80px', 
    height: '80px', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: '20px'
  },
  cutSetsIconImg: {
    maxWidth: '100%', 
    maxHeight: '100%', 
    objectFit: 'contain'
  },
  cutSetsValue: {
    fontSize: '70px', 
    fontWeight: 'bold', 
    color: COLORS.DARK_ORANGE, 
    fontFamily: 'Arial, sans-serif'
  },
  statusLegendContainer: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  statusLegendItem: {
    position: 'absolute',
    top: '6.6%',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center'
  },
  statusLegendLabel: {
    fontSize: '20px', 
    fontWeight: 'bold', 
    color: COLORS.WHITE, 
    marginRight: '8px', 
    paddingTop: '5px'
  },
  statusLegendIcon: {
    width: '26px', 
    height: '26px'
  },
  statusDivider: {
    position: 'absolute',
    top: '11%',
    left: '3%',
    right: '3%',
    height: '2px',
    background: COLORS.ORANGE,
    zIndex: 5
  },
  devicesContainer: {
    top: '12%',
    left: '5%',
    width: '90%',
    height: '50%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: '0',
    alignContent: 'start',
    padding: '0 50px'
  },
  deviceItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: '0',
    height: '32px',
    background: 'transparent'
  },
  deviceId: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginRight: '15px'
  },
  deviceIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center'
  },
  tableContainer: {
    top: '74%', 
    left: '7%', 
    width: '86%', 
    height: '25%'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  loadingText: {
    color: COLORS.WHITE,
    fontSize: '24px',
    fontWeight: 'bold'
  },
  errorOverlay: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    padding: '10px',
    backgroundColor: COLORS.RED,
    color: COLORS.WHITE,
    borderRadius: '5px',
    zIndex: 100
  }
};

// 图表错误回退组件
const ChartErrorFallback = ({ title }) => (
  <div style={{ 
    width: '100%', 
    height: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'column',
    color: COLORS.WHITE,
    backgroundColor: 'rgba(0,0,0,0.5)'
  }}>
    <div>图表加载失败</div>
    <div>{title}</div>
  </div>
);

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
          <div style={STYLES.errorOverlay}>
            {errorMessage}
          </div>
        )}
        
        {/* 移动率MU */}
        <div className="card-efficiency">
          <img src={移动率MUImg} className="card-image" alt="移动率MU" />
          <div className="chart-overlay">
            <ErrorBoundary fallback={<ChartErrorFallback title="移动率MU" />}>
              <ChartWrapper 
                Chart={EfficiencyChart} 
                value={monitorData.efficiencyValue} 
                defaultValue={69.03} 
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* 裁剪时间 */}
        <div className="card-cuttime">
          <img src={cutTimeImg} className="card-image" alt="裁剪时间" />
          <div className="chart-overlay">
            <ErrorBoundary fallback={<ChartErrorFallback title="裁剪时间" />}>
              <ChartWrapper 
                Chart={CutTimeChart} 
                value={monitorData.cutTimeValue} 
                defaultValue={16.5} 
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* 总能耗 */}
        <div className="card-energy">
          <img src={totalEnergyImg} className="card-image" alt="总能耗" />
          <div className="chart-overlay">
            <ErrorBoundary fallback={<ChartErrorFallback title="总能耗" />}>
              <ChartWrapper 
                Chart={EnergyChart} 
                value={monitorData.energyValue} 
                defaultValue={298.6} 
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* 裁剪速度 - 使用CachedImage替代普通img */}
        <div className="card-cutspeed">
          <CachedImage 
            src={cutSpeedImg} 
            className="card-image" 
            alt="裁剪速度" 
            loading="eager" 
          />
          <div className="chart-overlay">
            <ErrorBoundary fallback={<ChartErrorFallback title="裁剪速度" />}>
              <ChartWrapper 
                Chart={CutSpeedChart} 
                value={monitorData.cutSpeedValue} 
                defaultValue={6.5} 
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* 总周长 - 使用CachedImage替代普通img */}
        <div className="card-perimeter">
          <CachedImage 
            src={totalPerimeterImg} 
            className="card-image" 
            alt="总周长" 
            loading="eager" 
          />
          <div className="chart-overlay">
            <ErrorBoundary fallback={<ChartErrorFallback title="总周长" />}>
              <ChartWrapper 
                Chart={PerimeterChart} 
                value={monitorData.perimeterValue} 
                defaultValue={1238.5} 
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* 裁剪套数 - 使用CachedImage替代普通img */}
        <div className="card-cutsets">
          <CachedImage 
            src={cutSetsImg} 
            className="card-image" 
            alt="裁剪套数" 
            loading="eager" 
          />
          <div className="chart-overlay" style={STYLES.cutSetsOverlay}>
            <div style={STYLES.cutSetsIcon}>
              <CachedImage 
                src={cutSetsIconImg} 
                alt="裁剪套数图标" 
                style={STYLES.cutSetsIconImg} 
                loading="eager" 
              />
            </div>
            
            <div style={STYLES.cutSetsValue}>
              {cutSetsValue}
            </div>
          </div>
        </div>

        {/* 裁床运行情况 */}
        <div className="card-status">
          <img 
            src={各裁床运行状态标题Img}
            className="cutting-status-image"
            alt="各裁床运行状态"
          />
          
          {/* 状态图例 */}
          <div className="status-legend-container" style={STYLES.statusLegendContainer}>
            {statusLegendItems.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  ...STYLES.statusLegendItem,
                  left: item.left
                }}
              >
                <div style={STYLES.statusLegendLabel}>
                  {item.label}
                </div>
                <div style={STYLES.statusLegendIcon}>
                  <StatusIcon status={item.status} color={getStatusColor(item.status)} />
                </div>
              </div>
            ))}
          </div>
          
          <div style={STYLES.statusDivider}></div>
          
          {/* 设备状态指示器 */}
          <div className="chart-overlay" style={STYLES.devicesContainer}>
            {deviceStatusLoading || !deviceStatusData || deviceStatusData.length === 0 ? (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gridColumn: '1 / span 3',
                color: COLORS.WHITE,
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                加载中...
              </div>
            ) : (
              deviceStatusData.map((device, index) => (
                <div key={index} style={STYLES.deviceItem}>
                  <div style={STYLES.deviceId}>
                    {device.id}
                  </div>
                  
                  <div style={STYLES.deviceIcon}>
                    <StatusIcon 
                      status={device.status} 
                      color={getStatusColor(device.status)} 
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          
          <img 
            src={裁床运行情况Img}
            className="status-image"
            alt="裁床运行情况"
          />
          {/* 表格 */}
          <div className="chart-overlay" style={STYLES.tableContainer}>
            <StatusTable 
              tableData={tableData} 
              headers={tableHeaders} 
              scrollSpeed={0.3}
              visibleRows={4}
              onLoadMore={handleLoadMore}
              canLoadMore={pagination.hasMoreData}
              isLoadingMore={isLoadingMore}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default MonitorPage; 