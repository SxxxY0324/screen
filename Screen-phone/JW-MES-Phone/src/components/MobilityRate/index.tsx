import { View, Text, Canvas } from '@tarojs/components'
import Taro, { useReady } from '@tarojs/taro'
import { useEffect, useState, useRef } from 'react'
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
  // 检查当前环境
  const [isWeapp, setIsWeapp] = useState(false);
  const canvasId = 'mobilityRateCanvas';
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    // 获取当前环境
    setIsWeapp(Taro.getEnv() === Taro.ENV_TYPE.WEAPP);
  }, []);

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

  // 微信小程序环境使用Canvas绘制环形图
  useReady(() => {
    if (isWeapp) {
      drawCircleProgress();
    }
  });

  useEffect(() => {
    // 值变化时，在微信小程序环境中重新绘制
    if (isWeapp) {
      drawCircleProgress();
    }
  }, [value, isWeapp]);

  // 绘制Canvas环形图
  const drawCircleProgress = async () => {
    if (!isWeapp) return;
    
    try {
      // 获取Canvas上下文
      const query = Taro.createSelectorQuery();
      const ctx = await new Promise<Taro.CanvasContext>((resolve) => {
        query
          .select(`#${canvasId}`)
          .fields({ node: true, size: true })
          .exec((res) => {
            if (res && res[0]) {
              const canvas = res[0].node;
              if (canvas) {
                const ctx = canvas.getContext('2d');
                const dpr = Taro.getSystemInfoSync().pixelRatio;
                canvas.width = size * dpr;
                canvas.height = size * dpr;
                ctx.scale(dpr, dpr);
                resolve(ctx as any);
              }
            }
          });
      });

      if (!ctx) return;

      // 清除画布
      ctx.clearRect(0, 0, size, size);
      const centerX = size / 2;
      const centerY = size / 2;
      
      // 绘制背景圆环
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = '#f5f5f5';
      ctx.stroke();
      
      // 绘制进度圆环
      const startAngle = -Math.PI / 2; // 从正上方开始
      const endAngle = startAngle + (2 * Math.PI * percentage / 100);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.stroke();
    } catch (error) {
      console.error('绘制Canvas环形图失败', error);
    }
  };
  
  return (
    <View className={`mobility-rate ${className}`}>
      <View className='chart-header'>
        <Text className='chart-title'>移动率 MU</Text>
      </View>
      
      <View className='chart-content'>
        {/* 根据环境选择实现方式 */}
        <View className='circle-progress'>
          {isWeapp ? (
            // 微信小程序使用Canvas实现
            <Canvas
              type='2d'
              id={canvasId}
              canvasId={canvasId}
              style={{
                width: `${size}px`,
                height: `${size}px`,
              }}
              className='canvas-circle'
            />
          ) : (
            // 其他环境(H5)使用SVG实现
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
          )}
          
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