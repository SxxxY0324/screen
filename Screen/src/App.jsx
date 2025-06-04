import { useEffect, useState, Suspense, lazy } from 'react'
import './App.css'
import Header from './components/Header'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { selectActiveTab, setActiveTab, updateFilter } from './store/slices/appSlice'
import LoadingIndicator from './components/common/LoadingIndicator'
import { warmupApp } from './utils/initializeApp'
import imageCache from './utils/imageCache'

// 懒加载页面组件
const MonitorPage = lazy(() => import('./pages/MonitorPage'));
const ManagementPage = lazy(() => import('./pages/ManagementPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));

function App() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  
  // 应用初始化状态
  const [appInitialized, setAppInitialized] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  
  // 页面切换过渡状态
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  
  // 应用预热和初始化
  useEffect(() => {
    // 只在首次加载时执行初始化
    if (!appInitialized) {
      warmupApp((progress) => {
        setInitProgress(progress);
      }).then((result) => {
        if (result.success) {
          console.info('应用初始化完成', result.stats);
          setAppInitialized(true);
        } else {
          console.error('应用初始化失败:', result.error);
          // 尽管失败，仍然继续显示应用
          setAppInitialized(true);
        }
      });
    }
  }, [appInitialized]);
  
  // 处理标签点击和页面切换
  const handleTabClick = (tabName) => {
    // 如果点击当前活动标签，不执行切换
    if (tabName === activeTab) return;
    
    // 在切换前预加载下一个页面的图片
    const preloadNextPageImages = async () => {
      try {
        // 根据目标页面预加载不同的图片组
        if (tabName === '维保管理') {
          await import('./utils/imagePreloader').then(module => module.default.preloadMaintenanceImages());
        } else if (tabName === '实时监控') {
          await import('./utils/imagePreloader').then(module => module.default.preloadMonitorImages());
        }
      } catch (err) {
        console.warn('预加载图片失败:', err);
      }
    };
    
    // 启动预加载和过渡效果
    preloadNextPageImages();
    
    // 启动过渡效果
    setIsTransitioning(true);
    setNextTab(tabName);
    
    // 在过渡动画后切换标签
    setTimeout(() => {
      dispatch(setActiveTab(tabName));
      
      // 在标签切换后，让新页面淡入
      setTimeout(() => {
        setIsTransitioning(false);
        setNextTab(null);
      }, 50); // 非常短的延迟，仅用于确保DOM更新
    }, 300); // 匹配CSS过渡时间
  };
  
  // 处理过滤器更改
  const handleFilterChange = (filterKey, value) => {
    dispatch(updateFilter({ key: filterKey, value }));
  };
  
  // 根据当前活动标签返回对应的页面组件
  const renderActivePage = () => {
    // 添加淡入淡出类
    const transitionClass = isTransitioning ? 'page-exit' : 'page-enter';
    
    // 根据活动标签渲染不同页面组件
    switch(activeTab) {
      case '实时监控':
        return (
          <div className={`page-container ${transitionClass}`}>
            <Suspense fallback={<LoadingIndicator />}>
              <MonitorPage />
            </Suspense>
          </div>
        );
      case '维保管理':
        return (
          <div className={`page-container ${transitionClass}`}>
            <Suspense fallback={<LoadingIndicator />}>
              <ManagementPage />
            </Suspense>
          </div>
        );
      case '业绩分析':
        return (
          <div className={`page-container ${transitionClass}`}>
            <Suspense fallback={<LoadingIndicator />}>
              <AnalysisPage />
            </Suspense>
          </div>
        );
      default:
        return (
          <div className={`page-container ${transitionClass}`}>
            <Suspense fallback={<LoadingIndicator />}>
              <MonitorPage />
            </Suspense>
          </div>
        );
    }
  };
  
  // 如果应用尚未初始化完成，显示加载指示器
  if (!appInitialized) {
    return (
      <div className="preloader-container">
        <LoadingIndicator progress={initProgress} message="资源加载中..." />
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="dashboard-content">
        {/* 导航按钮放在内容区域中，位于卡片上方 */}
        <div className="top-nav-container">
          <div className="top-nav">
            <div className="nav-left">
              <div 
                className={`nav-button ${activeTab === '实时监控' ? 'active' : ''} ${nextTab === '实时监控' ? 'next-active' : ''}`}
                onClick={() => handleTabClick('实时监控')}
              >
                实时监控
              </div>
              <div 
                className={`nav-button ${activeTab === '维保管理' ? 'active' : ''} ${nextTab === '维保管理' ? 'next-active' : ''}`}
                onClick={() => handleTabClick('维保管理')}
              >
                维保管理
              </div>
              <div 
                className={`nav-button ${activeTab === '业绩分析' ? 'active' : ''} ${nextTab === '业绩分析' ? 'next-active' : ''}`}
                onClick={() => handleTabClick('业绩分析')}
              >
                业绩分析
              </div>
            </div>
            <div className="nav-right">
              <div className="ai-button">
                <span className="ai-icon">AI</span>
              </div>
              <select 
                className="nav-select" 
                onChange={(e) => handleFilterChange('country', e.target.value)}
              >
                <option>中国</option>
              </select>
              <select 
                className="nav-select"
                onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              >
                <option>年间</option>
              </select>
              <select 
                className="nav-select"
                onChange={(e) => handleFilterChange('yearMode', e.target.value)}
              >
                <option>本年</option>
              </select>
              <select 
                className="nav-select"
                onChange={(e) => handleFilterChange('additional', e.target.value)}
              >
                <option>本年</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* 渲染当前活动页面 */}
        {renderActivePage()}
      </div>
    </div>
  )
}

export default App
