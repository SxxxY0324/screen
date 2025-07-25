import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import DeviceStatusDisplay from '../../components/DeviceStatusDisplay'
import { DeviceStatus, DeviceStatusInfo } from '../../types/deviceStatus'
import './index.scss'
import { useLoad } from '@tarojs/taro'

// 模拟裁床状态数据
const mockDeviceStatusData: DeviceStatusInfo[] = [
  { code: 'CN01001', status: DeviceStatus.CUTTING },
  { code: 'CN01002', status: DeviceStatus.STANDBY },
  { code: 'CN01003', status: DeviceStatus.UNPLANNED },
  { code: 'CN01004', status: DeviceStatus.PLANNED },
  { code: 'CN01005', status: DeviceStatus.CUTTING },
  { code: 'CN01006', status: DeviceStatus.STANDBY },
];

export default function DeviceStatusDemo() {
  const [deviceStatusData] = useState<DeviceStatusInfo[]>(mockDeviceStatusData);

  useLoad(() => {
    // 页面加载完成，可以在这里初始化数据或执行其他逻辑
  })

  return (
    <View className='device-status-demo'>
      <DeviceStatusDisplay devices={deviceStatusData} />
    </View>
  )
} 