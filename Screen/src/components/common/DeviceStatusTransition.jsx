import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectDeviceStatusTransition, applyDeviceStatusBuffer } from '../../store/slices/monitorSlice';

/**
 * 裁床状态数据过渡管理组件
 * 监控裁床状态数据变化，并在适当的时机触发平滑过渡
 * 
 * 这是一个非可视组件，不渲染任何UI元素
 * 
 * @param {Object} props 组件属性
 * @param {number} props.delay 应用缓冲数据的延迟时间(毫秒)
 */
const DeviceStatusTransition = ({ delay = 300 }) => {
  const dispatch = useAppDispatch();
  const isTransitioning = useAppSelector(selectDeviceStatusTransition);
  
  // 监听数据变化并触发过渡
  useEffect(() => {
    let transitionTimer = null;
    
    // 当过渡标记激活时，设置定时器延迟应用缓冲数据
    if (isTransitioning) {
      transitionTimer = setTimeout(() => {
        dispatch(applyDeviceStatusBuffer());
      }, delay);
    }
    
    // 清理函数
    return () => {
      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }
    };
  }, [isTransitioning, dispatch, delay]);
  
  // 这是一个非可视组件，不返回任何JSX
  return null;
};

export default DeviceStatusTransition; 