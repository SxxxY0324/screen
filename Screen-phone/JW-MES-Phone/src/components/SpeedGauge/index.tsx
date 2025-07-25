import React from 'react'
import { View, Text } from '@tarojs/components'
import { useEnvironment } from '../../hooks/useEnvironment'
import './index.scss'

interface SpeedGaugeProps {
  currentSpeed: number
  maxSpeed?: number
  unit?: string
  size?: number
}

const SpeedGauge: React.FC<SpeedGaugeProps> = ({
  currentSpeed,
  maxSpeed = 10,
  unit = 'm/min',
  size = 240
}) => {
  // 环境检测
  const { isWeapp } = useEnvironment();
  
  // 先定义几何参数
  const radius = size * 0.25
  const centerX = size / 2
  const centerY = size * 0.45

  // 计算进度条末端的精确位置和角度
  const calculateProgressEndPosition = () => {
    // 角度计算：0刻度->180°(左), 5刻度->270°(底), 10刻度->360°(右)
    const anglePerUnit = 180 / maxSpeed
    const angle = 180 + (currentSpeed * anglePerUnit)
    const radian = (angle * Math.PI) / 180

    const x = centerX + radius * Math.cos(radian)
    const y = centerY + radius * Math.sin(radian)
    
    return {
      x: isNaN(x) ? centerX : x,
      y: isNaN(y) ? centerY : y,
      angle: angle
    }
  }

  const progressEnd = calculateProgressEndPosition()
  
  // 指针角度调整：从默认上方向调整到目标角度
  const pointerAngle = progressEnd.angle - 90 + 180

  // 根据速度确定指针和进度条颜色
  const getColor = (speed: number, max: number) => {
    const ratio = speed / max
    if (ratio <= 0.3) return '#52c41a' // 绿色
    if (ratio <= 0.7) return '#faad14' // 黄色
    return '#f5222d' // 红色
  }

  const color = getColor(currentSpeed, maxSpeed)

  // 微信小程序使用CSS实现的仪表盘
  const renderWeappGauge = () => {
    const progressPercent = (currentSpeed / maxSpeed) * 100;
    // 计算适合的圆形进度条尺寸，约为SVG版本的一半
    const circleSize = Math.round(size * 0.5);
    const strokeWidth = Math.round(circleSize * 0.08); // 约为尺寸的8%
    
    return (
      <View className='nutui-gauge-container'>
        {/* 使用纯CSS实现圆形进度条 */}
        <View className='gauge-wrapper'>
          <View className='css-circle-progress' style={{
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            background: `conic-gradient(${color} 0deg ${progressPercent * 3.6}deg, #e8e8e8 ${progressPercent * 3.6}deg 360deg)`
          }}>
            {/* 中心遮盖层创建环形效果 */}
            <View className='circle-inner' style={{
              top: `${strokeWidth}px`,
              left: `${strokeWidth}px`,
              right: `${strokeWidth}px`,
              bottom: `${strokeWidth}px`
            }}>
              {/* 中心内容：当前速度 */}
              <View className='gauge-center'>
                <Text className='speed-value-center' style={{
                  fontSize: `${Math.round(circleSize * 0.2)}px`
                }}>{currentSpeed.toFixed(1)}</Text>
                <Text className='speed-unit-center' style={{
                  fontSize: `${Math.round(circleSize * 0.1)}px`
                }}>{unit}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // 生成刻度线
  const generateTicks = () => {
    const ticks: JSX.Element[] = []
    
    for (let i = 0; i <= maxSpeed; i += 0.5) {
      const anglePerUnit = 180 / maxSpeed
      const angle = 180 + (i * anglePerUnit)
      const radian = (angle * Math.PI) / 180
      
      const isMajor = i % 2.5 === 0
      const innerRadius = radius + 8
      const outerRadius = radius + (isMajor ? 20 : 15)
      
      const x1 = centerX + innerRadius * Math.cos(radian)
      const y1 = centerY + innerRadius * Math.sin(radian)
      const x2 = centerX + outerRadius * Math.cos(radian)
      const y2 = centerY + outerRadius * Math.sin(radian)
      
      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isMajor ? '#333' : '#999'}
          strokeWidth={isMajor ? 2 : 1}
          strokeLinecap='round'
        />
      )
    }
    
    return ticks
  }

  // 生成刻度标签
  const generateLabels = () => {
    const labels: JSX.Element[] = []
    const labelValues = [0, 2.5, 5, 7.5, 10]
    // 计算字体大小，基于size动态调整
    const fontSize = Math.round(size * 0.06); // 约为尺寸的6%
    
    labelValues.forEach((value) => {
      const anglePerUnit = 180 / maxSpeed
      const angle = 180 + (value * anglePerUnit)
      const radian = (angle * Math.PI) / 180
      const labelRadius = radius + 30
      
      const x = centerX + labelRadius * Math.cos(radian)
      const y = centerY + labelRadius * Math.sin(radian)
      
      labels.push(
        <text
          key={`label-${value}`}
          x={x}
          y={y}
          fontSize={fontSize}
          fill="#333"
          textAnchor="middle"
          fontWeight="600"
          dominantBaseline="middle"
        >
          {value}
        </text>
      )
    })
    
    return labels
  }

  return (
    <View className='speed-gauge'>
      <View className='gauge-container'>
        {isWeapp ? (
          // 微信小程序：使用CSS实现的仪表盘
          renderWeappGauge()
        ) : (
          // H5：保持原有SVG实现
          <svg width={size} height={size * 0.55} className='gauge-svg' viewBox={`0 0 ${size} ${size * 0.55}`}>
            {/* 仪表盘背景弧线 */}
            <path
              d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
              fill='none'
              stroke='#e8e8e8'
              strokeWidth='8'
              strokeLinecap='round'
            />
            
            {/* 速度进度弧线 */}
            <path
              d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
              fill='none'
              stroke={color}
              strokeWidth='6'
              strokeLinecap='round'
              strokeDasharray={`${(currentSpeed / maxSpeed) * Math.PI * radius} ${Math.PI * radius}`}
              opacity='0.8'
            />
            
            {/* 刻度线 */}
            <g className='gauge-ticks'>
              {generateTicks()}
            </g>
            
            {/* 刻度标签 */}
            <g className='gauge-labels'>
              {generateLabels()}
            </g>
            
            {/* 指针 */}
            <g className='gauge-pointer' transform={`translate(${centerX}, ${centerY}) rotate(${pointerAngle})`}>
              {/* 主指针 */}
              <polygon
                points={`0,-${radius - 5} 4,0 0,8 -4,0`}
                fill={color}
              />
              {/* 指针中心圆点 */}
              <circle
                cx='0'
                cy='0'
                r='6'
                fill={color}
                stroke='#fff'
                strokeWidth='2'
              />
            </g>
          </svg>
        )}
        
        {/* 当前速度数字显示 - 只在H5时显示，小程序在圆环中心显示 */}
        {!isWeapp && (
          <View className='speed-display'>
            <Text className='speed-value'>{currentSpeed.toFixed(1)}</Text>
            <Text className='speed-label'>当前速度</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default SpeedGauge 