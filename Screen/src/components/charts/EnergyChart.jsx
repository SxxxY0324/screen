import React, { memo, useState, useEffect, useRef, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectDeviceEnergyData, selectIsDataInitialized } from '../../store/slices/monitorSlice';

// 颜色常量定义
const COLORS = {
  GREEN: '#4CAF50',
  YELLOW: '#FFEB3B',
  RED: '#F44336',
  GRAY: '#9E9E9E',
  ORANGE: '#ff9800',
  DEEP_ORANGE: '#ff5722',
  WHITE: '#ffffff',
  LIGHT_GRAY: '#e0e0e0',
  DARK_ORANGE: '#FF7A00',
  SHADOW: 'rgba(255, 152, 0, 0.5)',
  GRADIENT_START: '#FFEB3B',
  GRADIENT_END: '#ff9800'
};

// 配置常量
const ROW_HEIGHT = 30; // 调整每行高度为30px
const SCROLL_SPEED = 0.8; // 调整滚动速度为0.8
const VISIBLE_ROWS = 7; // 增加可见行数到7行

const EnergyChart = () => {
  // 获取设备能耗数据和数据初始化状态
  const deviceEnergyData = useAppSelector(selectDeviceEnergyData);
  const isDataInitialized = useAppSelector(selectIsDataInitialized);
  
  // 滚动相关状态
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef(null);
  const isPaused = useRef(false);
  const lastTimeRef = useRef(0);
  // 添加容器引用，用于获取可视区域高度
  const containerRef = useRef(null);
  const scrollAreaRef = useRef(null);
  
  // 安全检查设备数据
  const isDataValid = useMemo(() => {
    return deviceEnergyData && Array.isArray(deviceEnergyData) && deviceEnergyData.length > 0;
  }, [deviceEnergyData]);
  
  // 计算最大能耗，用于确保进度条比例合适
  const maxEnergy = useMemo(() => {
    if (!isDataValid) return 0;
    return deviceEnergyData.reduce((max, item) => {
      const energy = typeof item.energy === 'number' ? item.energy : 0;
      return energy > max ? energy : max;
    }, 0);
  }, [deviceEnergyData, isDataValid]);
  
  // 创建三组数据以确保更流畅的无限滚动
  const duplicatedData = useMemo(() => {
    if (!isDataValid) return [];
    // 使用三组数据，确保滚动时总有足够的内容
    return [...deviceEnergyData, ...deviceEnergyData, ...deviceEnergyData];
  }, [deviceEnergyData, isDataValid]);
  
  // 启动滚动动画
  const startScrolling = () => {
    const animate = (timestamp) => {
      if (isPaused.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // 优化帧率控制
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      
      if (deltaTime >= 16) { // 约60fps
        lastTimeRef.current = timestamp;
        
        // 仅当有有效数据时才滚动
        if (isDataValid && deviceEnergyData.length > 0) {
          // 调整滚动速度
          const adjustedSpeed = Math.max(0.1, SCROLL_SPEED * (10 / Math.max(10, deviceEnergyData.length)));
          const pixelsToScroll = (adjustedSpeed * deltaTime) / 16.67;
          
          setScrollPosition(prevPos => {
            // 计算新位置
            const newPos = prevPos + pixelsToScroll;
            
            // 计算单组数据高度
            const dataHeight = deviceEnergyData.length * ROW_HEIGHT;
            
            // 获取容器高度，如果无法获取则使用默认值
            const containerHeight = scrollAreaRef.current?.clientHeight || VISIBLE_ROWS * ROW_HEIGHT;
            
            // 精确计算重置点：只有在第一组数据完全滚出视窗时才重置
            // 确保最后一行数据也完全消失才重置，防止提前重置导致的闪现
            // 计算的精确位置是：数据高度 + 额外缓冲距离
            const resetPoint = dataHeight + ROW_HEIGHT*2; // 添加双行高度作为缓冲，确保完全滚出
            
            if (newPos >= resetPoint) {
              // 重置到初始位置0，而不是使用取余操作
              // 由于此时视窗中显示的全是第二组数据，重置对用户不可见
              return 0;
            }
            
            return newPos;
          });
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // 停止滚动
  const stopScrolling = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      lastTimeRef.current = 0;
    }
  };
  
  // 鼠标事件处理
  const handleMouseEnter = () => {
    isPaused.current = true;
  };
  
  const handleMouseLeave = () => {
    isPaused.current = false;
  };
  
  // 组件挂载和卸载时控制动画
  useEffect(() => {
    if (isDataValid) {
      startScrolling();
    }
    
    // 组件卸载时清理
    return () => {
      stopScrolling();
    };
  }, [isDataValid, deviceEnergyData?.length]);
  
  // 如果数据无效，显示加载状态
  if (!isDataValid) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: COLORS.WHITE,
        fontSize: '20px'
      }}>
        数据加载中...
      </div>
    );
  }
  
  // 计算内容样式，精确控制位置
  // 移除transition属性，避免在位置重置时产生动画效果
  const contentStyle = {
    transform: `translateY(-${scrollPosition}px)`,
    willChange: 'transform'
  };
  
  // 计算进度条宽度的函数，基于最大值的比例
  const calculateWidth = (energy) => {
    if (typeof energy !== 'number' || energy <= 0) return 0;
    // 使用相对于最大值的比例，并乘以0.9保证最大值的进度条不会占满整个容器
    return Math.min(95, (energy / maxEnergy) * 95);
  };
  
  return (
    <div 
      ref={containerRef}
      className="energy-scroll-container"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'transparent',
        padding: '2px 5px 2px 0', // 减少上下内边距，左边距设为0
        marginLeft: '-20px', // 整体向左移动
        marginTop: '60px', // 调整为60px，使其与标题部分下方对齐
        marginBottom: '0px', // 移除底部间距
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 滚动内容区域 */}
      <div 
        ref={scrollAreaRef}
        style={{
          height: 'calc(100% - 10px)', // 调整为10px的偏移，确保底部与模块底部对齐
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 内容容器 */}
        <div style={contentStyle}>
          {/* 使用三组数据确保无限滚动效果 */}
          <div style={{ position: 'relative' }}>
            {/* 渲染所有三组数据，确保滚动过程中总有足够的内容 */}
            {duplicatedData.map((item, index) => (
              <div 
                key={`${item.deviceId || 'unknown'}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: `${ROW_HEIGHT}px`,
                  padding: '0 0 0 0',
                  marginBottom: '2px', // 减少行间距
                }}
              >
                {/* 设备ID - 直接显示原始设备编码 */}
                <div style={{
                  fontSize: '14px', // 稍微减小字体
                  fontWeight: 'bold',
                  color: COLORS.WHITE,
                  flex: '0 0 35%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  paddingLeft: '8px', // 增加左内边距，弥补容器左移
                }}>
                  {item.deviceId || '未知设备'}
                </div>
                
                {/* 能耗进度条区域 - 包含进度条和显示值 */}
                <div style={{
                  flex: '1',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {/* 进度条容器 */}
                  <div style={{
                    flex: '1',
                    height: '18px', // 减小进度条高度
                    position: 'relative',
                    marginRight: '10px',
                  }}>
                    {/* 背景条 */}
                    <div style={{
                      width: '100%',
                      height: '18px', // 减小背景条高度
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '9px',
                    }}></div>
                    
                    {/* 能耗进度 */}
                    <div style={{
                      width: `${calculateWidth(item.energy)}%`,
                      height: '18px', // 减小进度条高度
                      background: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="0%"><stop stop-color="%23FFEB3B"/><stop offset="1" stop-color="%23ff9800"/></linearGradient><rect width="100%" height="100%" fill="url(%23g)"/></svg>')`,
                      borderRadius: '9px',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}></div>
                  </div>
                  
                  {/* 能耗值 - 现在位于进度条右侧 */}
                  <div style={{
                    minWidth: '50px',
                    textAlign: 'right',
                    color: COLORS.WHITE,
                    fontWeight: 'bold',
                    fontSize: '14px', // 稍微减小字体
                    paddingRight: '5px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  }}>
                    {typeof item.energy === 'number' ? item.energy.toFixed(1) : '0.0'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 使用React.memo优化性能，避免不必要的重渲染
export default memo(EnergyChart); 