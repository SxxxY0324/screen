import { useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import MonitorPage from './pages/MonitorPage'
import ManagementPage from './pages/ManagementPage'
import AnalysisPage from './pages/AnalysisPage'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { selectActiveTab, setActiveTab, updateFilter } from './store/slices/appSlice'

function App() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  
  // 初始数据加载
  useEffect(() => {
    // 这里可以添加初始数据加载逻辑
  }, [dispatch]);
  
  // 处理标签点击
  const handleTabClick = (tabName) => {
    dispatch(setActiveTab(tabName));
  };
  
  // 处理过滤器更改
  const handleFilterChange = (filterKey, value) => {
    dispatch(updateFilter({ key: filterKey, value }));
  };
  
  // 根据当前活动标签返回对应的页面组件
  const renderActivePage = () => {
    switch(activeTab) {
      case '实时监控':
        return <MonitorPage />;
      case '维保管理':
        return <ManagementPage />;
      case '达标分析':
        return <AnalysisPage />;
      default:
        return <MonitorPage />;
    }
  };
  
  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="dashboard-content">
        {/* 导航按钮放在内容区域中，位于卡片上方 */}
        <div className="top-nav-container">
          <div className="top-nav">
            <div className="nav-left">
              <div 
                className={`nav-button ${activeTab === '实时监控' ? 'active' : ''}`}
                onClick={() => handleTabClick('实时监控')}
              >
                实时监控
              </div>
              <div 
                className={`nav-button ${activeTab === '维保管理' ? 'active' : ''}`}
                onClick={() => handleTabClick('维保管理')}
              >
                维保管理
              </div>
              <div 
                className={`nav-button ${activeTab === '达标分析' ? 'active' : ''}`}
                onClick={() => handleTabClick('达标分析')}
              >
                达标分析
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
