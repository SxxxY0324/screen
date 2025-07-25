import { View, Text } from '@tarojs/components'
import SpeedGauge from '../SpeedGauge'
import './index.scss'

// 裁剪速度数据接口
interface CuttingSpeedData {
  currentSpeed: number;          // 当前速度（m/min）
  avgCuttingSpeed: number;       // 平均裁剪速度（m/min）
  avgIdleSpeed: number;          // 平均空走速度（m/min）
  overallAvgSpeed: number;       // 整体平均速度（m/min）
  maxSpeed: number;              // 最大速度（m/min）
  minSpeed: number;              // 最小速度（m/min）
}

// 组件Props接口
interface CuttingSpeedProps {
  data: CuttingSpeedData;
}

const CuttingSpeed: React.FC<CuttingSpeedProps> = ({ data }) => {
  // 格式化速度显示
  const formatSpeed = (speed: number): string => {
    return `${speed.toFixed(1)}m/min`
  }

  return (
    <View className='cutting-speed-module'>
      <View className='module-title'>裁剪速度</View>
      <View className='speed-content'>
        {/* 仪表盘区域 - 使用SpeedGauge组件 */}
        <View className='gauge-section'>
          <SpeedGauge
            currentSpeed={data.currentSpeed}
            maxSpeed={10}
            unit='m/min'
            size={240}
          />
        </View>

        {/* 速度信息展示区域 */}
        <View className='speed-info-section'>
          <View className='speed-info-item'>
            <Text className='speed-label'>平均裁剪速度：</Text>
            <Text className='speed-value'>{formatSpeed(data.avgCuttingSpeed)}</Text>
          </View>
          <View className='speed-info-item'>
            <Text className='speed-label'>平均空走速度：</Text>
            <Text className='speed-value'>{formatSpeed(data.avgIdleSpeed)}</Text>
          </View>
          <View className='speed-info-item'>
            <Text className='speed-label'>整体平均速度：</Text>
            <Text className='speed-value'>{formatSpeed(data.overallAvgSpeed)}</Text>
          </View>
          <View className='speed-info-item'>
            <Text className='speed-label'>最大速度：</Text>
            <Text className='speed-value'>{formatSpeed(data.maxSpeed)}</Text>
          </View>
          <View className='speed-info-item'>
            <Text className='speed-label'>最小速度：</Text>
            <Text className='speed-value'>{formatSpeed(data.minSpeed)}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CuttingSpeed 