import { useState, useEffect } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { RegionData } from '../../../components/RegionStats'

interface RegionListProps {
  allRegionData: RegionData[];
  onRegionClick: (regionId: string) => void;
}

export default function RegionList({ allRegionData, onRegionClick }: RegionListProps) {
  // 分页与加载状态 - 地区列表
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6); // 每页显示6条数据
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isWeapp, setIsWeapp] = useState(false);
  
  // 检查当前环境
  useEffect(() => {
    setIsWeapp(Taro.getEnv() === Taro.ENV_TYPE.WEAPP);
  }, []);
  
  // 加载初始数据
  const loadInitialData = () => {
    // 地区数据
    const initialData = allRegionData.slice(0, pageSize);
    setRegionData(initialData);
    setCurrentPage(1);
    
    // 如果总数据量小于等于页大小，说明已经没有更多数据了
    if (allRegionData.length <= pageSize) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }

  // 刷新数据
  const handleRefresh = () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    // 模拟异步请求
    setTimeout(() => {
      loadInitialData();
      setIsRefreshing(false);
    }, 1000);
  }

  // 加载更多数据
  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // 计算下一页数据的起始索引和结束索引
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * pageSize;
    const endIndex = nextPage * pageSize;
    
    // 模拟异步请求
    setTimeout(() => {
      // 获取下一页数据
      const newData = allRegionData.slice(startIndex, endIndex);
      
      if (newData.length > 0) {
        // 更新数据和页码
        setRegionData([...regionData, ...newData]);
        setCurrentPage(nextPage);
        
        // 判断是否还有更多数据
        setHasMore(endIndex < allRegionData.length);
      } else {
        setHasMore(false);
      }
      
      setIsLoading(false);
    }, 1000);
  }

  // 处理滚动到底部事件
  const handleScrollToLower = () => {
    if (hasMore && !isLoading) {
      handleLoadMore();
    }
  }
  
  // 在组件挂载时加载初始数据
  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <ScrollView 
      className='scrollable-regions'
      scrollY
      scrollTop={0}
      refresherEnabled
      refresherTriggered={isRefreshing}
      onRefresherRefresh={handleRefresh}
      onScrollToLower={handleScrollToLower}
      lowerThreshold={20}
      enableBackToTop
    >
      <View className='region-list-container'>
        {regionData.map(region => (
          <View key={region.id} className='region-card'>
            {/* 区域名称 */}
            <View className='region-header'>
              {region.name}
            </View>
            <View className='region-body'>
              {/* 统计信息 */}
              <View className='region-stats-left'>
                {/* 设备总数 */}
                <View className='stat-row'>
                  <Text className='stat-label'>设备总数：</Text>
                  <Text className='stat-value'>{region.deviceCount}</Text>
                </View>
                {/* 当前运行中 */}
                <View className='stat-row'>
                  <Text className='stat-label'>当前运行中：</Text>
                  <Text className='stat-value running'>{region.runningCount}</Text>
                </View>
              </View>
              {/* 查看详情按钮 */}
              <View className='region-action'>
                <View 
                  className='view-detail-btn'
                  onClick={() => onRegionClick(region.id)}
                >
                  查看详情
                </View>
              </View>
            </View>
          </View>
        ))}
        
        {/* 加载状态提示 */}
        {isLoading && (
          <View className='loading-tip'>
            <Text className='small-loading-text'>数据加载中...</Text>
          </View>
        )}
        
        {/* 已全部加载提示 - 始终在列表底部显示 */}
        {!hasMore && !isLoading && regionData.length > 0 && (
          <View className='loading-complete' style={{ paddingBottom: '80px' }}>
            <Text className='small-loading-text'>已全部加载</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
} 