import { View, Text } from '@tarojs/components'
import './index.scss'

// 裁剪周长数据接口
interface CuttingPerimeterData {
  statisticsDays: number;        // 统计时间（天）
  dailyAvgPerimeter: number;     // 日均裁剪周长（米）
  maxDailyPerimeter: number;     // 最大单日裁剪周长（米）
  minDailyPerimeter: number;     // 最小单日裁剪周长（米）
  totalPerimeterKM: number;      // 总裁剪周长（千米）
}

// 组件Props接口
interface CuttingPerimeterProps {
  data: CuttingPerimeterData;
}

const CuttingPerimeter: React.FC<CuttingPerimeterProps> = ({ data }) => {
  // 格式化数值显示（添加千分位分隔符）
  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  return (
    <View className='cutting-perimeter-module'>
      <View className='module-title'>裁剪周长</View>
      <View className='perimeter-content'>
        {/* 总周长展示区域 */}
        <View className='total-perimeter-section'>
          <View className='total-perimeter-display'>
            <Text className='total-number'>{data.totalPerimeterKM}</Text>
            <Text className='total-unit'>KM</Text>
          </View>
          <Text className='total-label'>总裁剪周长</Text>
        </View>

        {/* 修改为换行显示的信息区域 */}
        <View className='perimeter-info-section'>
          <View className='perimeter-info-item'>
            <Text className='info-label'>统计时间：</Text>
            <Text className='info-value'>{data.statisticsDays}天</Text>
          </View>
          <View className='perimeter-info-item'>
            <Text className='info-label'>日均裁剪周长：</Text>
            <Text className='info-value'>{formatNumber(data.dailyAvgPerimeter)}m</Text>
          </View>
          <View className='perimeter-info-item'>
            <Text className='info-label'>最大单日裁剪周长：</Text>
            <Text className='info-value'>{formatNumber(data.maxDailyPerimeter)}m</Text>
          </View>
          <View className='perimeter-info-item'>
            <Text className='info-label'>最小单日裁剪周长：</Text>
            <Text className='info-value'>{formatNumber(data.minDailyPerimeter)}m</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CuttingPerimeter 