import React from 'react';

// 颜色常量
const COLORS = {
  GREEN: '#4CAF50',
  YELLOW: '#FFEB3B',
  RED: '#F44336',
  GRAY: '#9E9E9E',
  ORANGE: '#ff9800',
  DEEP_ORANGE: '#ff5722',
  WHITE: '#ffffff',
  LIGHT_GRAY: '#e0e0e0',
  DARK_ORANGE: '#FF7A00',
  SHADOW: 'rgba(255, 152, 0, 0.5)'
};

// 使用SVG绘制状态图标
const StatusIcon = ({ status, color }) => {
  // 基础SVG路径
  const basePaths = [
    <path key="base-1" stroke="none" d="M0 0h24v24H0z" fill="none" />,
    <path key="base-2" d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />,
    <path key="base-3" d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />,
    <path key="base-4" d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />,
    <path key="base-5" d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />,
    <path key="base-6" d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
  ];

  // 不同状态的图标路径
  const statusPaths = {
    cutting: <path key="status" d="M12 9l-2 3h4l-2 3" />,
    standby: <path key="status" d="M9 12l2 2l4 -4" />,
    unplanned: [
      <path key="status-1" d="M12 8v4" />,
      <path key="status-2" d="M12 16v.01" />
    ],
    planned: [
      <path key="status-1" d="M14 14l-4 -4" />,
      <path key="status-2" d="M10 14l4 -4" />
    ]
  };

  const statusPath = statusPaths[status] || statusPaths.standby;
  const statusColor = color || {
    cutting: COLORS.GREEN,
    standby: COLORS.YELLOW,
    unplanned: COLORS.RED,
    planned: COLORS.GRAY
  }[status] || COLORS.YELLOW;

  // SVG内联样式，添加过渡效果
  const svgStyle = {
    transition: 'stroke 0.3s ease, transform 0.3s ease',
    transform: 'scale(1)',
    // 添加微小的缩放动画，使状态变化更加明显
    animation: 'statusPulse 0.3s ease'
  };

  // 为状态图标路径添加过渡效果的样式
  const pathStyle = {
    transition: 'all 0.3s ease'
  };

  return (
    <>
      {/* 添加一个全局的CSS @keyframes 动画 */}
      <style>
        {`
          @keyframes statusPulse {
            0% { transform: scale(0.95); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 0.9; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={statusColor} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={svgStyle}
      >
        {/* 为所有路径添加过渡效果 */}
        {basePaths.map((path, index) => 
          React.cloneElement(path, { style: pathStyle, key: `base-path-${index}` })
        )}
        
        {/* 为状态路径添加过渡效果 */}
        {Array.isArray(statusPath) 
          ? statusPath.map((path, index) => 
              React.cloneElement(path, { style: pathStyle, key: `status-path-${index}` })
            )
          : React.cloneElement(statusPath, { style: pathStyle })
        }
      </svg>
    </>
  );
};

export { COLORS };
export default StatusIcon; 