import React from 'react';

// 颜色常量定义
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

// 状态图标组件 - 用SVG代替图片
const StatusIcon = ({ status, color }) => {
  // 基础SVG路径 - 共享部分
  const basePaths = [
    <path key="base-1" stroke="none" d="M0 0h24v24H0z" fill="none" />,
    <path key="base-2" d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />,
    <path key="base-3" d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />,
    <path key="base-4" d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />,
    <path key="base-5" d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />,
    <path key="base-6" d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
  ];

  // 状态特定路径
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

  // 默认使用待机状态
  const statusPath = statusPaths[status] || statusPaths.standby;
  const statusColor = color || {
    cutting: COLORS.GREEN,
    standby: COLORS.YELLOW,
    unplanned: COLORS.RED,
    planned: COLORS.GRAY
  }[status] || COLORS.YELLOW;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" 
         fill="none" stroke={statusColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {basePaths}
      {statusPath}
    </svg>
  );
};

export { COLORS };
export default StatusIcon; 