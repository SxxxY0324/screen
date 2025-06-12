import { useState, useEffect } from 'react';

/**
 * 通用分页Hook
 * @param allData 全部数据
 * @param pageSize 每页显示数量
 * @returns 分页相关状态和方法
 */
export function usePagination<T>(allData: T[], pageSize: number = 6) {
  // 分页状态
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 加载初始数据
  const loadInitialData = () => {
    const initialData = allData.slice(0, pageSize);
    setData(initialData);
    setCurrentPage(1);
    
    // 判断是否还有更多数据
    setHasMore(allData.length > pageSize);
  };

  // 刷新数据
  const handleRefresh = () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    // 模拟异步请求
    setTimeout(() => {
      loadInitialData();
      setIsRefreshing(false);
    }, 1000);
  };

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
      const newData = allData.slice(startIndex, endIndex);
      
      if (newData.length > 0) {
        // 更新数据和页码
        setData(prevData => [...prevData, ...newData]);
        setCurrentPage(nextPage);
        
        // 判断是否还有更多数据
        setHasMore(endIndex < allData.length);
      } else {
        setHasMore(false);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  // 处理滚动到底部事件
  const handleScrollToLower = () => {
    if (hasMore && !isLoading) {
      handleLoadMore();
    }
  };

  // 重置分页状态（当全部数据变化时）
  const resetPagination = () => {
    loadInitialData();
  };

  // 当全部数据变化时，重新加载初始数据
  useEffect(() => {
    if (allData && allData.length >= 0) {
      loadInitialData();
    }
  }, [allData, pageSize]);

  return {
    // 状态
    data,
    currentPage,
    isRefreshing,
    isLoading,
    hasMore,
    
    // 方法
    handleRefresh,
    handleLoadMore,
    handleScrollToLower,
    resetPagination,
    loadInitialData
  };
} 