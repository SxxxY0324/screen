import React from 'react'
import { View } from '@tarojs/components'
import { DeviceStatus, STATUS_COLORS } from '../../types/deviceStatus'
import './index.scss'

// 更新更清晰直观的SVG图标
const STATUS_ICONS_BASE64 = {
  // 裁剪中 - 使用更明确的运行中图标（添加内部小圆点表示运动）
  [DeviceStatus.CUTTING]: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjUxMiIgY3k9IjUxMiIgcj0iNDUwIiBmaWxsPSIjMDBDQzUyIiBzdHJva2U9IiMwMGEwNDIiIHN0cm9rZS13aWR0aD0iMjAiLz48Y2lyY2xlIGN4PSI1MTIiIGN5PSI1MTIiIHI9IjE1MCIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjciLz48L3N2Zz4=',
  
  // 待机中 - 使用更清晰的黄色圆形加暂停图标
  [DeviceStatus.STANDBY]: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjUxMiIgY3k9IjUxMiIgcj0iNDUwIiBmaWxsPSIjZjRlYTJhIiBzdHJva2U9IiNkZGQzMDAiIHN0cm9rZS13aWR0aD0iMjAiLz48cmVjdCB4PSIzNTAiIHk9IjM1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIzMjQiIGZpbGw9IiM1NTUiLz48cmVjdCB4PSI1NzQiIHk9IjM1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIzMjQiIGZpbGw9IiM1NTUiLz48L3N2Zz4=',
  
  // 非计划停机 - 进一步优化感叹号图标，使其更加清晰、粗壮并居中
  [DeviceStatus.UNPLANNED]: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjUxMiIgY3k9IjUxMiIgcj0iNDUwIiBmaWxsPSIjZDgxZTA2IiBzdHJva2U9IiNiMDBiMDAiIHN0cm9rZS13aWR0aD0iMjAiLz48cmVjdCB4PSI0NDIiIHk9IjIwMCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSI0MDAiIHJ4PSI0MCIgcnk9IjQwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iNDQyIiB5PSI2NTAiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIiByeD0iNzAiIHJ5PSI3MCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==',
  
  // 计划停机 - 使用灰色圆形加叉形图标（将加号旋转为叉）
  [DeviceStatus.PLANNED]: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjUxMiIgY3k9IjUxMiIgcj0iNDUwIiBmaWxsPSIjNTE1MTUxIiBzdHJva2U9IiMzMzMzMzMiIHN0cm9rZS13aWR0aD0iMjAiLz48cGF0aCBkPSJNMzY1LjcxIDY1OC4yOUw2NTguMjkgMzY1LjcxTTM2NS43MSAzNjUuNzFMNjU4LjI5IDY1OC4yOSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjYwIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4='
}

interface StatusIconProps {
  status: DeviceStatus
  size?: number
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, size = 28 }) => {
  const iconBase64 = STATUS_ICONS_BASE64[status] || STATUS_ICONS_BASE64[DeviceStatus.STANDBY]
  
  return (
    <View
      className='status-icon'
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url("${iconBase64}")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))' // 添加轻微阴影提升立体感
      }}
    />
  )
}

export default StatusIcon 