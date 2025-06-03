import { View, Text } from '@tarojs/components'
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
}

const MobilityRate: React.FC<MobilityRateProps> = ({ 
  value = 0, 
  max = 100,
  className = '',
  size = 120,
  strokeWidth = 10
}) => {
  // 确保值在0-100之间
  const normalizedValue = Math.min(Math.max(0, value), max);
  const percentage = Math.round((normalizedValue / max) * 100);
  
  // 根据百分比设置颜色
  const getColor = (percent: number) => {
    if (percent >= 80) return '#52c41a'; // 绿色，优秀
    if (percent >= 60) return '#1890ff'; // 蓝色，良好
    if (percent >= 40) return '#faad14'; // 黄色，一般
    return '#f5222d'; // 红色，不佳
  };
  
  const color = getColor(percentage);
  
  // SVG环形图计算
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <View className={`mobility-rate ${className}`}>
      <View className='chart-header'>
        <Text className='chart-title'>移动率 MU</Text>
      </View>
      
      <View className='chart-content'>
        {/* SVG环形图 */}
        <View className='circle-progress'>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* 背景圆环 */}
            <circle
              className='circle-bg'
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            {/* 前景圆环（进度） */}
            <circle
              className='circle-progress-bar'
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              stroke={color}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>
          
          <View className='value-display'>
            <Text className='value-text' style={{ color }}>{normalizedValue}</Text>
            <Text className='unit-text'>/ {max}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default MobilityRate 