import { View, ScrollView, Text } from '@tarojs/components'
import { CustomerInfo } from '../../../types'
import { usePagination } from '../../../hooks/usePagination'
import { PAGINATION_CONFIG } from '../../../constants/config'

interface CustomerListProps {
  initialCustomers: CustomerInfo[];
  onCustomerClick: (customerId: string) => void;
}

export default function CustomerList({ initialCustomers, onCustomerClick }: CustomerListProps) {
  // 使用通用分页Hook
  const {
    data: customers,
    isRefreshing: customerRefreshing,
    isLoading: customerLoading,
    hasMore: customerHasMore,
    handleRefresh: handleCustomerRefresh,
    handleScrollToLower: handleCustomerScrollToLower
  } = usePagination(initialCustomers, PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);

  return (
    <ScrollView 
      className='scrollable-customers'
      scrollY
      refresherEnabled
      refresherTriggered={customerRefreshing}
      onRefresherRefresh={handleCustomerRefresh}
      onScrollToLower={handleCustomerScrollToLower}
      lowerThreshold={PAGINATION_CONFIG.SCROLL_LOWER_THRESHOLD}
      enableBackToTop
    >
      <View className='customer-list-container'>
        {customers.map(customer => (
          <View key={customer.id} className='customer-card'>
            <View className='customer-name'>{customer.name}</View>
            <View className='customer-body'>
              <View className='customer-info'>
                <View className='info-row'>
                  <Text className='info-label'>电话：</Text>
                  <Text className='info-value'>{customer.phone}</Text>
                </View>
                <View className='info-row'>
                  <Text className='info-label'>地址：</Text>
                  <Text className='info-value'>{customer.address}</Text>
                </View>
              </View>
              <View className='customer-action'>
                <View 
                  className='view-detail-btn'
                  onClick={() => onCustomerClick(customer.id)}
                >
                  查看详情
                </View>
              </View>
            </View>
          </View>
        ))}
        
        {/* 加载状态提示 */}
        {customerLoading && (
          <View className='loading-tip'>
            <Text className='small-loading-text'>数据加载中...</Text>
          </View>
        )}
        
        {/* 已全部加载提示 - 内嵌到容器中，确保在微信端可见 */}
        {!customerHasMore && !customerLoading && customers.length > 0 && (
          <View className='loading-complete' style={{ paddingBottom: '80px' }}>
            <Text className='small-loading-text'>已全部加载</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
} 