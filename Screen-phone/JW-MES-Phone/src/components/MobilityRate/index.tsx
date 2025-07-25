import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useReady } from '@tarojs/taro'
import { useEnvironment } from '../../hooks/useEnvironment'
import { useValueAnimation } from '../../hooks/useChartAnimation'
import { 
  containerStyle, 
  headerSectionStyle, 
  headerTitleStyle, 
  contentStyle 
} from '../../constants/chart'
import './index.scss'

interface MobilityRateProps {
  /** 移动率值，范围0-100 */
  value: number;
  /** 最大值 */
  max?: number;
  /** 自定义类名 */
  className?: string;
  /** 环形图大小 */
  size?: number;
  /** 环形图线宽 */
  strokeWidth?: number;
  /** 是否可见（用于Tab切换时检测可见性） */
  isVisible?: boolean;
  /** 是否隐藏标题 */
  hideTitle?: boolean;
  /** 样式变体 */
  variant?: 'default' | 'card' | 'embedded';
}

const MobilityRate: React.FC<MobilityRateProps> = ({ 
  value = 0, 
  max = 100,
  className = '',
  size = 150, 
  strokeWidth = 10,
  isVisible = true,
  hideTitle = false,
  variant = 'default'
}) => {
  // 使用环境检测Hook
  const { isWeapp } = useEnvironment();
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  
  // 确保值在0-100之间
  const normalizedValue = Math.min(Math.max(0, value), max);
  const percentage = Math.round((normalizedValue / max) * 100);
  
  // 使用动画Hook
  const { animatedValue, isAnimating } = useValueAnimation(
    percentage,
    isVisible,
    // 动画结束回调
    () => setIsLoading(false)
  );
  
  // 根据百分比设置颜色 - 改为固定蓝色主题
  const getColor = (percent: number) => {
    return '#1890ff'; // 固定蓝色主题
  };
  
  const color = getColor(animatedValue);

  // 组件准备就绪
  useReady(() => {
    // 将组件标记为正在加载
    setIsLoading(true);
  });

  // 监听可见性变化
  useEffect(() => {
    if (!isVisible) {
      setIsLoading(true);
    }
  }, [isVisible]);

  // 渲染加载动画
  const renderLoadingSpinner = () => {
    return (
      <View className='global-loading-spinner'>
        <View className='global-spinner' />
      </View>
    );
  };

  // 根据variant生成对应的CSS类名
  const getVariantClassName = () => {
    switch (variant) {
      case 'card':
        return 'mobility-rate-card';
      case 'embedded':
        return 'mobility-rate-embedded';
      case 'default':
      default:
        return 'mobility-rate';
    }
  };

  // 微信小程序和H5都使用CSS实现的环形进度条
  return (
    <View className={`${getVariantClassName()} ${className}`}>
      {!hideTitle && (
        <View style={headerSectionStyle}>
          <Text style={headerTitleStyle}>移动率 MU</Text>
        </View>
      )}
      
      <View className='chart-content'>
        <View className='circle-progress' style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '10px 0',
          width: '100%'
        }}>
          {(isLoading || isAnimating) && renderLoadingSpinner()}
          
          <View className='css-circle-progress' style={{
            width: `${size}px`,
            height: `${size}px`,
            background: `conic-gradient(${color} 0deg ${animatedValue * 3.6}deg, #e8e8e8 ${animatedValue * 3.6}deg 360deg)`,
            visibility: (isLoading || isAnimating) ? 'hidden' : 'visible'
          }}>
            {/* 中心遮盖层创建环形效果 */}
            <View className='circle-inner' style={{
              top: `${strokeWidth}px`,
              left: `${strokeWidth}px`,
              right: `${strokeWidth}px`,
              bottom: `${strokeWidth}px`
            }}>
              {/* 中心内容：移动率值 */}
              <View className='value-display'>
                <Text className='value-text' style={{ color }}>{Math.round(animatedValue * max / 100)}</Text>
                <Text className='unit-text'>/ {max}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default MobilityRate 