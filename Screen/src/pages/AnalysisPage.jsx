import React, { useEffect, useState } from 'react';
import '../App.css';
import { 
  MuChartAnalysis,
  PerimeterChartAnalysis,
  CutTimeChartAnalysis,
  CutSpeedChartAnalysis
} from '../components/analysis';

function AnalysisPage() {
  // 模拟数据 - 移动率MU
  const [muData, setMuData] = useState({
    categories: [
      'CN01001', 'CN01003', 'CN02002', 'CN02004', 
      'CN03002', 'CN03004', 'CN04002', 'CN04004',
      'CN01001', 'CN01003', 'CN02002', 'CN02004', 
      'CN03002', 'CN03004'
    ],
    values: [
      77, 77, 66, 67, 66, 65, 68, 67,
      65, 68, 66, 67, 68, 69
    ]
  });
  
  // 周长(M)数据
  const [perimeterData, setPerimeterData] = useState({
    categories: [
      'CN01001', 'CN01003', 'CN02002', 'CN02004', 
      'CN03002', 'CN03004', 'CN04002', 'CN04004'
    ],
    values: [
      680, 680, 600, 590, 610, 620, 610, 620
    ]
  });
  
  // 裁剪时间(H)数据
  const [cutTimeData, setCutTimeData] = useState({
    categories: [
      'CN01001', 'CN01003', 'CN02002', 'CN02004', 
      'CN03002', 'CN03004', 'CN04002', 'CN04004'
    ],
    values: [
      1950, 1980, 1650, 1680, 1620, 1670, 1730, 1750
    ]
  });

  // 裁剪速度(m/s)数据
  const [cutSpeedData, setCutSpeedData] = useState({
    categories: [
      'CN01001', 'CN01003', 'CN02002', 'CN02004', 
      'CN03002', 'CN03004', 'CN04002', 'CN04004'
    ],
    values: [
      4.6, 4.5, 4.7, 4.5, 4.6, 4.8, 4.6, 4.7
    ]
  });

  return (
    <div className="analysis-page" style={{ 
      position: 'relative',
      width: '100%',
      height: 'calc(100vh - 110px)',
      overflow: 'hidden',
      backgroundColor: '#111', // 深色背景
      backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(50, 50, 60, 0.2) 0%, rgba(30, 30, 40, 0.1) 80%)', // 手绘风格渐变背景
      boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.5)' // 内阴影效果
    }}>
      <div style={{ 
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        padding: '20px'
      }}>
        <div className="analysis-grid" style={{ gap: '16px' }}>
          {/* 左上: 移动率MU图表 */}
          <div className="dashboard-card" style={{ 
            borderRadius: '6px',
            backgroundColor: 'rgba(20, 20, 25, 0.7)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
          }}>
            <MuChartAnalysis 
              categories={muData.categories} 
              values={muData.values} 
            />
          </div>
          
          {/* 右上: 周长(M)图表 */}
          <div className="dashboard-card" style={{ 
            borderRadius: '6px',
            backgroundColor: 'rgba(20, 20, 25, 0.7)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
          }}>
            <PerimeterChartAnalysis 
              categories={perimeterData.categories} 
              values={perimeterData.values} 
            />
          </div>
          
          {/* 左下: 裁剪时间(H)图表 */}
          <div className="dashboard-card" style={{ 
            borderRadius: '6px',
            backgroundColor: 'rgba(20, 20, 25, 0.7)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
          }}>
            <CutTimeChartAnalysis 
              categories={cutTimeData.categories} 
              values={cutTimeData.values} 
            />
          </div>
          
          {/* 右下: 裁剪速度(m/s)图表 */}
          <div className="dashboard-card" style={{ 
            borderRadius: '6px',
            backgroundColor: 'rgba(20, 20, 25, 0.7)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
          }}>
            <CutSpeedChartAnalysis 
              categories={cutSpeedData.categories} 
              values={cutSpeedData.values} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;