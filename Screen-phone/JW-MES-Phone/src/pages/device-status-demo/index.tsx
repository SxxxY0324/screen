import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import DeviceStatusDisplay, { DeviceStatus, DeviceStatusInfo } from '../../components/DeviceStatusDisplay'
import './index.scss'

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
    console.log('页面加载完成')
  })

  return (
    <View className='device-status-demo'>
      <DeviceStatusDisplay devices={deviceStatusData} />
    </View>
  )
} 