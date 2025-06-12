import { View, Text } from '@tarojs/components'
import Taro, { useReady } from '@tarojs/taro'
import { useEffect, useState, useMemo } from 'react'
import { useValuesAnimation } from '../../hooks/useChartAnimation'
import { useEnvironment } from '../../hooks/useEnvironment'
import { 
  containerStyle, 
  headerSectionStyle, 
  headerTitleStyle, 
  contentStyle 
} from '../../constants/chart'
import { DELAY_CONFIG } from '../../constants/config'

// 设备能耗数据接口
interface DeviceEnergy {
  /** 设备编号 */
  deviceCode: string;
  /** 能耗值 */
  energyValue: number;
}

interface EnergyConsumptionProps {
  /** 设备能耗数据列表 */
  devices: DeviceEnergy[];
  /** 最大能耗值 */
  maxValue?: number;
  /** 自定义类名 */
  className?: string;
  /** 是否可见（用于Tab切换时检测可见性） */
  isVisible?: boolean;
}

// 扩展样式常量
const extendedStyles = {
  emptyState: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px'
  },
  emptyText: {
    color: '#999',
    fontSize: '16px'
  },
  barChart: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '16px',
    width: '100%'
  },
  barItem: {
    display: 'flex',
    alignItems: 'center',
    height: '30px'
  },
  deviceCode: {
    width: '90px',
    fontSize: '16px',
    color: '#333',
    marginRight: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: 500
  },
  barWrapper: {
    flex: 1,
    height: '20px',
    backgroundColor: '#f0f2f5',
    borderRadius: '10px',
    overflow: 'hidden',
    marginRight: '12px',
    position: 'relative' as 'relative'
  },
  energyValue: {
    color: '#1890ff',
    minWidth: '40px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'right' as 'right',
    marginLeft: '4px'
  }
};

const EnergyConsumption: React.FC<EnergyConsumptionProps> = ({ 
  devices = [], 
  maxValue = 100,
  className = '',
  isVisible = true
}) => {
  // 使用环境检测Hook
  const { isWeapp } = useEnvironment();
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  
  // 使用 useMemo 稳定 normalizedValues 数组引用，避免不必要的重新计算
  const normalizedValues = useMemo(() => {
    if (!devices || devices.length === 0) {
      return [];
    }
    return devices.map(device => 
      Math.min(Math.max(0, device.energyValue), maxValue)
    );
  }, [devices, maxValue]);
  
  // 使用动画Hook
  const { animatedValues, isAnimating } = useValuesAnimation(
    normalizedValues,
    isVisible,
    // 动画结束回调
    () => {
      setIsLoading(false);
    }
  );

  // 确保组件准备就绪后再开始渲染
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

  // 添加容错机制：如果动画超时，强制结束加载状态
  useEffect(() => {
    if (isVisible && devices.length > 0) {
      // 设置一个容错定时器，使用配置常量
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      }, DELAY_CONFIG.COMPONENT_TIMEOUT);

      return () => clearTimeout(timeoutId);
    }
  }, [isVisible, devices.length, isLoading]);
  
  // 渲染加载动画
  const renderLoadingSpinner = () => {
    return (
      <View className='global-loading-spinner'>
        <View className='global-spinner' />
      </View>
    );
  };
  
  // 渲染空状态
  const renderEmpty = () => {
    return (
      <View style={extendedStyles.emptyState}>
        <Text style={extendedStyles.emptyText}>暂无能耗数据</Text>
      </View>
    );
  };

  // 获取进度条样式
  const getProgressStyle = (percentage: number) => {
    return {
      position: 'absolute' as 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: `${percentage}%`,
      backgroundColor: '#1890ff',
      borderRadius: '10px',
      zIndex: 1
    };
  };

  // 检查是否应该显示内容
  const shouldShowContent = !isLoading && !isAnimating && devices.length > 0;
  const shouldShowEmpty = !isLoading && !isAnimating && devices.length === 0;
  const shouldShowLoading = isLoading || isAnimating;

  return (
    <View style={containerStyle}>
      <View style={headerSectionStyle}>
        <Text style={headerTitleStyle}>总能耗</Text>
      </View>
      
      <View style={contentStyle}>
        {shouldShowLoading && renderLoadingSpinner()}
        
        {shouldShowEmpty && renderEmpty()}
        
        {shouldShowContent && (
          <View style={{
            ...extendedStyles.barChart,
            visibility: shouldShowLoading ? 'hidden' : 'visible'
          }}>
            {devices.map((device, index) => {
              // 确保 animatedValues 有对应的值，否则使用 0
              const animatedValue = animatedValues[index] || 0;
              const percentage = animatedValue ? (animatedValue / maxValue) * 100 : 0;
              
              return (
                <View style={extendedStyles.barItem} key={device.deviceCode}>
                  <Text style={extendedStyles.deviceCode}>{device.deviceCode}</Text>
                  
                  <View style={extendedStyles.barWrapper}>
                    <View style={getProgressStyle(percentage)} />
                  </View>
                  
                  <Text style={extendedStyles.energyValue}>
                    {Math.round(animatedValue)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default EnergyConsumption 