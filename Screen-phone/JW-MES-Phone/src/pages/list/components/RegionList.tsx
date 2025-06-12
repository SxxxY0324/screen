import { View, ScrollView, Text } from '@tarojs/components'
import { RegionData } from '../../../components/RegionStats'
import { usePagination } from '../../../hooks/usePagination'
import { PAGINATION_CONFIG } from '../../../constants/config'

interface RegionListProps {
  allRegionData: RegionData[];
  onRegionClick: (regionId: string) => void;
}

export default function RegionList({ allRegionData, onRegionClick }: RegionListProps) {
  // 使用通用分页Hook
  const {
    data: regionData,
    isRefreshing,
    isLoading,
    hasMore,
    handleRefresh,
    handleScrollToLower
  } = usePagination(allRegionData, PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);

  return (
    <ScrollView 
      className='scrollable-regions'
      scrollY
      scrollTop={0}
      refresherEnabled
      refresherTriggered={isRefreshing}
      onRefresherRefresh={handleRefresh}
      onScrollToLower={handleScrollToLower}
      lowerThreshold={PAGINATION_CONFIG.SCROLL_LOWER_THRESHOLD}
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