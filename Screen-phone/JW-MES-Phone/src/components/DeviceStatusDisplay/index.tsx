import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { 
  containerStyle, 
  headerSectionStyle, 
  headerTitleStyle, 
  contentStyle 
} from '../../constants/chart'
import './index.scss'

// 裁床状态枚举
export enum DeviceStatus {
  CUTTING = 'cutting',     // 裁剪中
  STANDBY = 'standby',     // 待机中
  UNPLANNED = 'unplanned', // 非计划停机
  PLANNED = 'planned'      // 计划停机
}

// 裁床状态信息接口
export interface DeviceStatusInfo {
  code: string;            // 设备编码
  status: DeviceStatus;    // 设备状态
}

// 状态颜色映射
const STATUS_COLORS = {
  [DeviceStatus.CUTTING]: '#00CC52',    // 绿色
  [DeviceStatus.STANDBY]: '#f4ea2a',    // 黄色
  [DeviceStatus.UNPLANNED]: '#d81e06',  // 红色
  [DeviceStatus.PLANNED]: '#515151'     // 灰色
};

// Base64编码的SVG图标（确保跨平台兼容性）
const STATUS_ICONS_BASE64 = {
  [DeviceStatus.CUTTING]: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik01MTIgMTAyMy45OTk0MzFhNTEwLjQwNjU0NCA1MTAuNDA2NTQ0IDAgMCAwIDM2Mi4wNDA0ODctMTQ5Ljk1ODk0NEE1MTAuNDA2NTQ0IDUxMC40MDY1NDQgMCAwIDAgMTAyMy45OTk0MzEgNTEyYTUxMC40MDY1NDQgNTEwLjQwNjU0NCAwIDAgMC0xNDkuOTU4OTQ0LTM2Mi4wNDA0ODdBNTEwLjQwNjU0NCA1MTAuNDA2NTQ0IDAgMCAwIDUxMiAwLjAwMDU2OWE1MTAuNDA2NTQ0IDUxMC40MDY1NDQgMCAwIDAtMzYyLjA0MDQ4NyAxNDkuOTU4OTQ0QTUxMC40MDY1NDQgNTEwLjQwNjU0NCAwIDAgMCAwLjAwMDU2OSA1MTJhNTEwLjQwNjU0NCA1MTAuNDA2NTQ0IDAgMCAwIDE0OS45NTg5NDQgMzYyLjA0MDQ4N0E1MTAuNDA2NTQ0IDUxMC40MDY1NDQgMCAwIDAgNTEyIDEwMjMuOTk5NDMxeiIgZmlsbD0iIzAwQ0M1MiI+PC9wYXRoPjxwYXRoIGQ9Ik00NTUuMTExMTc0IDYwMi4yMjU2NzhMMzI0LjY2NTA5NyA0NzEuNzc5NmE1Ni44ODg4MjYgNTYuODg4ODI2IDAgMCAwLTgwLjQ0MDc5OSA4MC40NDA4bDE3MC42NjY0NzcgMTcwLjY2NjQ3N2E1Ni44ODg4MjYgNTYuODg4ODI2IDAgMCAwIDgwLjQ0MDc5OSAwbDMxMi44ODg1NDEtMzEyLjg4ODU0MWE1Ni44ODg4MjYgNTYuODg4ODI2IDAgMSAwLTgwLjQ0MDc5OS04MC40NDA4TDQ1NS4xMTExNzQgNjAyLjIyNTY3OHoiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD48L3N2Zz4=',
  [DeviceStatus.STANDBY]: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik01NTYuNDQxNiAyMzEuMjE5MmE1Ni43Mjk2IDU2LjcyOTYgMCAwIDAtNDQuMDMyLTIwLjQ4IDU1LjcwNTYgNTUuNzA1NiAwIDAgMC00My4yMTI4IDIwLjQ4IDcxLjQ3NTIgNzEuNDc1MiAwIDAgMC0xOC42MzY4IDQ4LjUzNzZ2MjI1LjI4YTY5LjIyMjQgNjkuMjIyNCAwIDAgMCAxOC42MzY4IDQ3LjkyMzIgNjkuODM2OCA2OS44MzY4IDAgMCAwIDEyLjkwMjQgMTAuODU0NGwxNTkuMzM0NCAxMjkuMjI4OGE2NC4xMDI0IDY0LjEwMjQgMCAwIDAgNDYuNjk0NCAxNC43NDU2IDU4LjE2MzIgNTguMTYzMiAwIDAgMCA0Mi41OTg0LTIyLjExODQgNTYuOTM0NCA1Ni45MzQ0IDAgMCAwIDEyLjI4OC00NS40NjU2IDY1LjEyNjQgNjUuMTI2NCAwIDAgMC0yNC4xNjY0LTQyLjU5ODRMNTczLjQ0IDQ4MC4wNTEydi0yMDAuMjk0NGE3MS40NzUyIDcxLjQ3NTIgMCAwIDAtMTYuOTk4NC00OC41Mzc2ek04NTIuOTkyIDcyMy4xNDg4YTU3Ljc1MzYgNTcuNzUzNiAwIDEgMCA1Ny41NDg4IDU3LjU0ODggNTcuNTQ4OCA1Ny41NDg4IDAgMCAwLTU3LjU0ODgtNTcuNTQ4OHoiIGZpbGw9IiNmNGVhMmEiPjwvcGF0aD48cGF0aCBkPSJNOTg1LjA4OCA2NDcuMTY4di0yLjI1MjhBNDkxLjUyIDQ5MS41MiAwIDEgMCA1MTIgMTAwMy41MmE0ODkuNDcyIDQ4OS40NzIgMCAwIDAgMjUxLjkwNC02OS40MjcyIDU3LjU0ODggNTcuNTQ4OCAwIDAgMC0zMi41NjMyLTEwNS4wNjI0IDU1LjcwNTYgNTUuNzA1NiAwIDAgMC0yOC44NzY4IDcuOTg3MkEzNzYuMjE3NiAzNzYuMjE3NiAwIDEgMSA4ODguODMyIDUxMmEzNzkuMDg0OCAzNzkuMDg0OCAwIDAgMS0xNS45NzQ0IDEwOC41NDQgNjEuNDQgNjEuNDQgMCAwIDAtMS40MzM2IDEyLjQ5MjggNTcuNTQ4OCA1Ny41NDg4IDAgMCAwIDExMS44MjA4IDE5LjI1MTJjMC44MTkyLTEuMDI0IDEuMjI4OC0zLjA3MiAxLjg0MzItNS4xMnoiIGZpbGw9IiNmNGVhMmEiPjwvcGF0aD48L3N2Zz4=',
  [DeviceStatus.UNPLANNED]: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik01MDYuNzMzMzUyIDBhNTA2LjczMzM1MiA1MDYuNzMzMzUyIDAgMCAxIDQ3MC4xNjE5NSA2OTYuMTAwMDc0bC01OC41MTQyNDQtOTQuOTM5MzYxYTQyMi4yNTM0MTMgNDIyLjI1MzQxMyAwIDEgMC01MjYuMTE2MTk1IDMxMi4xNzM0OTJjLTkuODAxMTM2IDIwLjQ3OTk4NS0xNy4xODg1NTkgNDguMzQ3Mzk0LTYuOTQ4NTY3IDg1LjQzMDc5NkE1MDYuNzMzMzUyIDUwNi43MzMzNTIgMCAwIDEgNTA2LjczMzM1MiAweiIgZmlsbD0iI2Q4MWUwNiI+PC9wYXRoPjxwYXRoIGQ9Ik03NzguOTcwODcyIDUxNS4xNDQ3NzVhNTcuMDUxMzg4IDU3LjA1MTM4OCAwIDAgMSAxOC45NDM5ODcgMTkuMzgyODQzbDIzOC45NTc1NDMgNDAxLjQ4MDg1NmMxMC42MDU3MDcgMTcuODQ2ODQ0IDEwLjk3MTQyMSA0MC4yMjg1NDMgMC45NTA4NTcgNTguNTE0MjQ0YTU2LjM5MzEwMyA1Ni4zOTMxMDMgMCAwIDEtNDkuMzcxMzk0IDI5LjQ3NjU1MUg1MTAuNTM2Nzc4YTU2LjM5MzEwMyA1Ni4zOTMxMDMgMCAwIDEtNDkuMzcxMzkzLTI5LjU0OTY5NGE1OS4wMjYyNDQgNTkuMDI2MjQ0IDAgMCAxIDEuMDIzOTk5LTU4LjUxNDI0NGwyMzguOTU3NTQ0LTQwMS40MDc3MTNhNTYuNjg1Njc0IDU2LjY4NTY3NCAwIDAgMSAzNC45NjIyNi0yNi4xODUxMjQgNTUuNTg4NTMyIDU1LjU4ODUzMiAwIDAgMSA0Mi44NjE2ODQgNi44MDIyODF6IG0tMjkuNDc2NTUgMzU5LjkzNTc0M2EyNC41NzU5ODIgMjQuNTc1OTgyIDAgMCAwLTI0LjIxMDI2OSAyNC44Njg1NTNjMCAxMy42Nzc3MDUgMTAuODI1MTM1IDI0Ljc5NTQxMSAyNC4yMTAyNjkgMjQuNzk1NDExYTI0LjEzNzEyNiAyNC4xMzcxMjYgMCAwIDAgMjEuMDY1MTI4LTEyLjQzNDI3NyAyNS4zMDc0MSAyNS4zMDc0MSAwIDAgMCAwLTI0Ljc5NTQxIDI0LjEzNzEyNiAyNC4xMzcxMjYgMCAwIDAtMjEuMDY1MTI4LTEyLjQzNDI3N3ogbTAtMjIzLjMwNDk4NGEyNC41NzU5ODIgMjQuNTc1OTgyIDAgMCAwLTI0LjIxMDI2OSAyNC44Njg1NTR2MTI0LjA1MDE5N2MwIDEzLjY3NzcwNSAxMC44MjUxMzUgMjQuNzk1NDExIDI0LjIxMDI2OSAyNC43OTU0MTFhMjQuNTc1OTgyIDI0LjU3NTk4MiAwIDAgMCAyNC4yODM0MTEtMjQuODY4NTU0VjY3Ni41NzA5NDVhMjQuNTc1OTgyIDI0LjU3NTk4MiAwIDAgMC0yNC4yODM0MTEtMjQuNzk1NDExek01MzguMzMxMDQ0IDI1My4zNjY2NzZhNDIuMjAzMzk4IDQyLjIwMzM5OCAwIDAgMC00Mi4yMDMzOTggNDIuMjAzMzk5djIxMS4xNjMyNzdIMjg1LjAzNzUxMWE0Mi4yMDMzOTggNDIuMjAzMzk4IDAgMCAwIDAgODQuNDA2Nzk3SDUzOC4zMzEwNDRhNDIuMjAzMzk4IDQyLjIwMzM5OCAwIDAgMCA0Mi4yMDMzOTgtNDIuMjAzMzk4VjI5NS41NzAwNzVhNDIuMjAzMzk4IDQyLjIwMzM5OCAwIDAgMC00Mi4yMDMzOTgtNDIuMjAzMzk5eiIgZmlsbD0iI2Q4MWUwNiI+PC9wYXRoPjwvc3ZnPg==',
  [DeviceStatus.PLANNED]: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00ODguOSAyOTV2MjE4LjhIMjcwLjFjLTIxLjEgMC0zNy43IDE2LjYtMzcuNyAzNy43czE2LjYgMzcuNyAzNy43IDM3LjdoMjU2LjVjMjEuMSAwIDM3LjctMTYuNiAzNy43LTM3LjdWMjk1YzAtMjEuMS0xNi42LTM3LjctMzcuNy0zNy43cy0zNy43IDE2LjYtMzcuNyAzNy43eiIgZmlsbD0iIzUxNTE1MSI+PC9wYXRoPjxwYXRoIGQ9Ik02MzcuMyA4NjIuOWMtNDUuOSAxOS05NS4xIDI4LjctMTQ0LjggMjguNy0yMDkuNiAwLTM3OS42LTE3MC0zNzkuNi0zNzkuNiAwLTIwOS42IDE3MC0zNzkuNiAzNzkuNi0zNzkuNnMzNzkuNiAxNzAgMzc5LjYgMzc5LjZjMCAxNy0xLjIgMzMuNy0zLjQgNTAuMSAyNC44IDYuNyA0OC4xIDE4LjEgNjguNyAzMy40IDUuMS0yNy41IDcuNy01NS41IDcuNy04My41IDAtMjUwLTIwMi42LTQ1Mi42LTQ1Mi42LTQ1Mi42UzM5LjkgMjYyIDM5LjkgNTEyYzAgMjUwIDIwMi42IDQ1Mi42IDQ1Mi42IDQ1Mi42IDY5LjcgMCAxMzUuNy0xNS44IDE5NC43LTQzLjktMjAuMS0xNi0zNy0zNS42LTQ5LjktNTcuOHoiIGZpbGw9IiM1MTUxNTEiPjwvcGF0aD48cGF0aCBkPSJNODE2IDU5My41Yy05Mi43IDAtMTY3LjggNzUuMS0xNjcuOCAxNjcuOCAwIDkyLjcgNzUuMSAxNjcuOCAxNjcuOCAxNjcuOCA5Mi43IDAgMTY3LjgtNzUuMSAxNjcuOC0xNjcuOC0wLjEtOTIuNy03NS4yLTE2Ny44LTE2Ny44LTE2Ny44eiBtMjUuNSAyODkuNmMtMy4xIDUuMi02LjcgOS0xMC45IDExLjQtNC4xIDIuNC04LjggMy40LTE0IDMuMS01LjUgMC0xMC41LTEuMi0xNC44LTMuNi00LjMtMi40LTcuNy02LTEwLjEtMTAuNi0yLjQtNC42LTMuNi05LjYtMy42LTE0LjggMC00LjggMS4yLTkuNSAzLjYtMTQgMi4zLTQuNCA1LjktNy45IDEwLjQtMTAuMSA0LjUtMi4zIDkuNS0zLjYgMTQuNS0zLjkgNS4yIDAgOS44IDEuMiAxNCAzLjYgNC4xIDIuNCA3LjYgNiAxMC40IDEwLjYgMi44IDQuNyA0LjIgOS4zIDQuNCAxNCAwLjIgNC43LTEuMSA5LjUtMy45IDE0LjN6IG04LjItMjA2LjJsLTE2LjMgMTI1LjRjLTAuOCA0LjItMi42IDguMi01LjMgMTIuMi0yLjcgNC02LjggNS43LTEyLjIgNS4zLTQuNiAwLTguMy0xLjgtMTEuMy01LjMtMi45LTMuNC00LjYtNy43LTUtMTIuMkw3ODQgNjc2LjljLTEuMy02LjctMS4xLTEyLjUgMC42LTE3LjUgMS43LTUgNS4yLTkuNyAxMC42LTE0LjEgNS40LTQuNCAxMi4zLTYuOCAyMC42LTcuMiA3LjMgMCAxNC41IDIuMSAyMC42IDYuMyA2LjIgNC4yIDEwLjIgOS4xIDExLjkgMTQuNyAxLjggNS42IDIuMiAxMS41IDEuNCAxNy44eiIgZmlsbD0iIzUxNTE1MSI+PC9wYXRoPjwvc3ZnPg=='
};

// 状态图例项
const STATUS_LEGEND_ITEMS = [
  { label: '裁剪中', status: DeviceStatus.CUTTING },
  { label: '待机中', status: DeviceStatus.STANDBY },
  { label: '非计划停机', status: DeviceStatus.UNPLANNED },
  { label: '计划停机', status: DeviceStatus.PLANNED }
];

// 模拟裁床状态数据
const MOCK_DEVICE_STATUS_DATA: DeviceStatusInfo[] = [
  { code: 'CN01001', status: DeviceStatus.CUTTING },
  { code: 'CN01002', status: DeviceStatus.STANDBY },
  { code: 'CN01003', status: DeviceStatus.UNPLANNED },
  { code: 'CN01004', status: DeviceStatus.PLANNED },
  { code: 'CN01005', status: DeviceStatus.CUTTING },
  { code: 'CN01006', status: DeviceStatus.STANDBY },
];

interface DeviceStatusDisplayProps {
  /** 设备状态数据列表，不传则使用模拟数据 */
  devices?: DeviceStatusInfo[];
  /** 自定义类名 */
  className?: string;
}

/**
 * 各裁床运行状态组件
 * 展示所有裁床的编码和状态图标
 */
const DeviceStatusDisplay: React.FC<DeviceStatusDisplayProps> = ({
  devices = MOCK_DEVICE_STATUS_DATA,
  className = ''
}) => {
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 渲染状态图标 - 使用base64编码的SVG确保跨平台兼容性
  const renderStatusIcon = (status: DeviceStatus, size = 28) => {
    const iconBase64 = STATUS_ICONS_BASE64[status] || STATUS_ICONS_BASE64[DeviceStatus.STANDBY];
    
    return (
      <View 
        className='device-status-icon' 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          backgroundImage: `url(${iconBase64})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      />
    );
  };

  // 渲染加载动画
  const renderLoadingSpinner = () => {
    return (
      <View className='device-status-loading'>
        <View className='device-status-spinner' />
      </View>
    );
  };
  
  // 渲染空状态
  const renderEmpty = () => {
    return (
      <View className='device-status-empty'>
        <Text className='device-status-empty-text'>暂无设备状态数据</Text>
      </View>
    );
  };

  return (
    <View className={className} style={containerStyle}>
      <View style={headerSectionStyle}>
        <Text style={headerTitleStyle}>各裁床运行状态</Text>
      </View>
      
      <View style={contentStyle}>
        {/* 状态图例 */}
        <View className='device-status-legend'>
          {STATUS_LEGEND_ITEMS.map((item, index) => (
            <View key={index} className='device-status-legend-item'>
              {renderStatusIcon(item.status, 32)}
              <Text className='device-status-legend-label'>{item.label}</Text>
            </View>
          ))}
        </View>
        
        {/* 设备状态列表 */}
        {isLoading ? (
          renderLoadingSpinner()
        ) : devices.length === 0 ? (
          renderEmpty()
        ) : (
          <View className='device-status-list'>
            {devices.map((device, index) => (
              <View key={index} className='device-status-item'>
                <Text className='device-status-code'>{device.code}</Text>
                {renderStatusIcon(device.status, 44)}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default DeviceStatusDisplay; 