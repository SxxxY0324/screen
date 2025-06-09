import { useState, useEffect } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

// 模拟客户数据类型
interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  address: string;
}

interface CustomerListProps {
  initialCustomers: CustomerInfo[];
  onCustomerClick: (customerId: string) => void;
}

export default function CustomerList({ initialCustomers, onCustomerClick }: CustomerListProps) {
  // 分页与加载状态 - 客户列表
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const [allCustomerData, setAllCustomerData] = useState<CustomerInfo[]>([]);
  const [customerPageSize] = useState(6); // 客户列表每页6条数据
  const [customerCurrentPage, setCustomerCurrentPage] = useState(1);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerRefreshing, setCustomerRefreshing] = useState(false);
  const [customerHasMore, setCustomerHasMore] = useState(true);
  const [isWeapp, setIsWeapp] = useState(false);
  
  // 检查当前环境
  useEffect(() => {
    setIsWeapp(Taro.getEnv() === Taro.ENV_TYPE.WEAPP);
  }, []);

  // 初始化数据
  useEffect(() => {
    setAllCustomerData(initialCustomers);
    const firstPageData = initialCustomers.slice(0, customerPageSize);
    setCustomers(firstPageData);
    setCustomerCurrentPage(1);
    setCustomerHasMore(initialCustomers.length > customerPageSize);
  }, [initialCustomers, customerPageSize]);

  // 客户列表刷新数据
  const handleCustomerRefresh = () => {
    if (customerRefreshing) return;
    
    setCustomerRefreshing(true);
    
    // 模拟异步请求
    setTimeout(() => {
      // 只加载第一页数据
      const initialCustomers = allCustomerData.slice(0, customerPageSize);
      setCustomers(initialCustomers);
      setCustomerCurrentPage(1);
      setCustomerHasMore(allCustomerData.length > customerPageSize);
      
      setCustomerRefreshing(false);
    }, 1000);
  }

  // 客户列表加载更多
  const handleCustomerLoadMore = () => {
    if (customerLoading || !customerHasMore) return;
    
    setCustomerLoading(true);
    
    // 计算下一页数据
    const nextPage = customerCurrentPage + 1;
    const startIndex = (nextPage - 1) * customerPageSize;
    const endIndex = nextPage * customerPageSize;
    
    // 模拟异步请求
    setTimeout(() => {
      // 获取下一页数据
      const newData = allCustomerData.slice(startIndex, endIndex);
      
      if (newData.length > 0) {
        // 更新数据和页码
        setCustomers([...customers, ...newData]);
        setCustomerCurrentPage(nextPage);
        
        // 判断是否还有更多数据
        setCustomerHasMore(endIndex < allCustomerData.length);
      } else {
        setCustomerHasMore(false);
      }
      
      setCustomerLoading(false);
    }, 1000);
  }
  
  // 处理客户列表滚动到底部事件
  const handleCustomerScrollToLower = () => {
    if (customerHasMore && !customerLoading) {
      handleCustomerLoadMore();
    }
  }

  return (
    <ScrollView 
      className='scrollable-customers'
      scrollY
      scrollTop={0}
      refresherEnabled
      refresherTriggered={customerRefreshing}
      onRefresherRefresh={handleCustomerRefresh}
      onScrollToLower={handleCustomerScrollToLower}
      lowerThreshold={20}
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