import { useState, useEffect } from 'react'
import './App.css'
import api from './api'
import Header from './components/Header'
import EmptyCard from './components/EmptyCard'
import StatusCard from './components/StatusCard'

// 导入背景图片
import cutTimeImg from './assets/images/裁剪时间.jpg'
import cutSpeedImg from './assets/images/裁剪速度.jpg'
import totalEnergyImg from './assets/images/总能耗.jpg'
import totalPerimeterImg from './assets/images/总周长.jpg'
import cutSetsImg from './assets/images/裁剪套数.jpg'
import 移动率MUImg from './assets/images/移动率MU.jpg'

function App() {
  // 添加状态管理活动标签
  const [activeTab, setActiveTab] = useState('实时监控');
  
  // 处理标签点击
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
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
                className={`nav-button ${activeTab === '集中管理' ? 'active' : ''}`}
                onClick={() => handleTabClick('集中管理')}
              >
                集中管理
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
              <select className="nav-select">
                <option>中国</option>
              </select>
              <select className="nav-select">
                <option>年间</option>
              </select>
              <select className="nav-select">
                <option>本年</option>
              </select>
              <select className="nav-select">
                <option>本年</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="dashboard-grid">
          <div className="card-efficiency">
            <EmptyCard backgroundImage={移动率MUImg} />
          </div>
          <div className="card-cuttime">
            <EmptyCard backgroundImage={cutTimeImg} />
          </div>
          <div className="card-energy">
            <EmptyCard backgroundImage={totalEnergyImg} />
          </div>
          <div className="card-cutspeed">
            <EmptyCard backgroundImage={cutSpeedImg} />
          </div>
          <div className="card-perimeter">
            <EmptyCard backgroundImage={totalPerimeterImg} />
          </div>
          <div className="card-cutsets">
            <EmptyCard backgroundImage={cutSetsImg} />
          </div>
          <div className="card-status">
            <StatusCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
