import { View, Text } from '@tarojs/components'
import Taro, { useReady } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { useValueAnimation } from '../../hooks/useChartAnimation'
import { useEnvironment } from '../../hooks/useEnvironment'
import { 
  containerStyle, 
  headerSectionStyle, 
  headerTitleStyle, 
  contentStyle 
} from '../../constants/chart'

interface TotalCircumferenceProps {
  /** 总周长值 */
  value: number;
  /** 最大值 */
  max?: number;
  /** 单位 */
  unit?: string;
  /** 自定义类名 */
  className?: string;
  /** 环形图大小 */
  size?: number;
  /** 环形图线宽 */
  strokeWidth?: number;
  /** 是否可见（用于Tab切换时检测可见性） */
  isVisible?: boolean;
}

const TotalCircumference: React.FC<TotalCircumferenceProps> = ({ 
  value = 0, 
  max = 1000,
  unit = 'mm',
  className = '',
  size = 150,
  strokeWidth = 10,
  isVisible = true
}) => {
  // 使用环境检测Hook
  const { isWeapp } = useEnvironment();
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  
  // 确保值在0-max之间
  const normalizedValue = Math.min(Math.max(0, value), max);
  const percentage = Math.round((normalizedValue / max) * 100);
  
  // 使用动画Hook
  const { animatedValue, isAnimating } = useValueAnimation(
    percentage,
    isVisible,
    // 动画结束回调
    () => setIsLoading(false)
  );
  
  // 根据百分比设置颜色 (使用蓝色主题，可根据需求调整)
  const getColor = (percent: number) => {
    if (percent >= 80) return '#0066cc'; // 深蓝色，高值
    if (percent >= 60) return '#1890ff'; // 中蓝色，中高值
    if (percent >= 40) return '#69c0ff'; // 浅蓝色，中值
    return '#bae7ff'; // 极浅蓝色，低值
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
  
  // 通过CSS样式生成环形进度条动画的关键帧
  const getCircleStyle = () => {
    // 进度条旋转角度：根据百分比计算旋转角度
    // 100%对应360度，所以进度百分比乘以3.6得到角度
    const rotation = animatedValue * 3.6;
    
    // 如果进度小于50%，右半圆隐藏，左半圆根据进度旋转
    if (rotation <= 180) {
      return {
        rightCircle: {
          transform: 'rotate(0deg)',
          backgroundColor: '#f5f5f5' // 背景色
        },
        leftCircle: {
          transform: `rotate(${rotation}deg)`,
          backgroundColor: color // 进度颜色
        }
      };
    } 
    // 如果进度大于50%，右半圆根据进度旋转，左半圆显示满
    else {
      return {
        rightCircle: {
          transform: `rotate(${rotation - 180}deg)`,
          backgroundColor: color // 进度颜色
        },
        leftCircle: {
          transform: 'rotate(180deg)',
          backgroundColor: color // 进度颜色
        }
      };
    }
  };
  
  // 计算环形图样式
  const circleStyles = getCircleStyle();
  
  return (
    <View style={containerStyle}>
      <View style={headerSectionStyle}>
        <Text style={headerTitleStyle}>总周长</Text>
      </View>
      
      <View style={contentStyle}>
        <View style={{
          position: 'relative' as 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '10px 0',
          width: '100%'
        }}>
          {(isLoading || isAnimating) && renderLoadingSpinner()}
          
          {/* CSS实现的环形进度图 */}
          <View style={{
            position: 'relative',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: '#f5f5f5',
            overflow: 'hidden',
            zIndex: 1,
            visibility: (isLoading || isAnimating) ? 'hidden' : 'visible',
            transform: isWeapp ? 'translateZ(0)' : 'none' // 微信小程序环境下启用硬件加速
          }}>
            {/* 进度条背景 */}
            <View style={{
              position: 'absolute',
              top: `${strokeWidth}px`,
              left: `${strokeWidth}px`,
              right: `${strokeWidth}px`,
              bottom: `${strokeWidth}px`,
              borderRadius: '50%',
              backgroundColor: '#fff',
              zIndex: 3
            }} />
            
            {/* 左半圆 */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              transformOrigin: 'right center',
              zIndex: 1,
              transition: isWeapp ? 'none' : 'transform 0.3s ease-out',
              ...circleStyles.leftCircle
            }} />
            
            {/* 右半圆 */}
            <View style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              transformOrigin: 'left center',
              zIndex: 2,
              transition: isWeapp ? 'none' : 'transform 0.3s ease-out',
              ...circleStyles.rightCircle
            }} />
          </View>
          
          {/* 中央显示的值 */}
          <View 
            style={{
              position: 'absolute' as 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              visibility: (isLoading || isAnimating) ? 'hidden' : 'visible',
              zIndex: 4
            }}
          >
            <Text style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color,
              lineHeight: 1.2
            }}>{Math.round(animatedValue * max / 100)}</Text>
            <Text style={{
              fontSize: '16px',
              color: '#999',
              marginTop: '4px'
            }}>{unit}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TotalCircumference 