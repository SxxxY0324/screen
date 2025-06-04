/**
 * 图片预加载工具
 * 提供预加载图片功能，加快页面切换时的图片加载速度
 */
import imageCache from './imageCache';

// 监控页面的图片
import 移动率MUImg from '../assets/images/移动率MU.jpg';
import cutTimeImg from '../assets/images/裁剪时间.jpg';
import cutSpeedImg from '../assets/images/裁剪速度.jpg';
import totalEnergyImg from '../assets/images/总能耗.jpg';
import totalPerimeterImg from '../assets/images/总周长.jpg';
import cutSetsImg from '../assets/images/裁剪套数.jpg';
import cutSetsIconImg from '../assets/images/裁剪套数图标.jpg';
import 各裁床运行状态标题Img from '../assets/images/各裁床运行状态标题.jpg';
import 裁床运行情况Img from '../assets/images/裁床运行情况.jpg';

// 维保管理页面的图片
import faultCountImg from '../assets/images/故障台数.jpg';
import faultTimesImg from '../assets/images/故障次数.jpg';
import faultDurationImg from '../assets/images/故障时长.jpg';
import avgFaultTimeImg from '../assets/images/平均故障时长.jpg';
import bladeLifeImg from '../assets/images/刀片和磨刀棒寿命.jpg';
import faultListImg from '../assets/images/当前设备故障清单.jpg';

// 图片组
const monitorImages = [
  移动率MUImg,
  cutTimeImg,
  cutSpeedImg,
  totalEnergyImg,
  totalPerimeterImg,
  cutSetsImg,
  cutSetsIconImg,
  各裁床运行状态标题Img,
  裁床运行情况Img
];

const maintenanceImages = [
  faultCountImg,
  faultTimesImg,
  faultDurationImg,
  avgFaultTimeImg,
  bladeLifeImg,
  faultListImg
];

// 底部图片（高优先级）
const bottomRowImages = [
  cutSpeedImg,
  totalPerimeterImg,
  cutSetsImg,
  cutSetsIconImg
];

// 所有图片
const allImages = [
  ...monitorImages,
  ...maintenanceImages
];

/**
 * 预加载单张图片
 * @param {string} src 图片路径
 * @returns {Promise} 加载完成的Promise
 */
export const preloadImage = (src) => {
  // 使用新的缓存系统
  return imageCache.preload(src);
};

/**
 * 预加载图片组
 * @param {Array} images 图片路径数组
 * @param {Function} onProgress 进度回调函数(可选)
 * @returns {Promise} 所有图片加载完成的Promise
 */
export const preloadImages = (images, onProgress) => {
  return imageCache.preload(images, onProgress);
};

/**
 * 预加载监控页面图片
 * @param {Function} onProgress 进度回调
 * @returns {Promise} 加载完成Promise
 */
export const preloadMonitorImages = (onProgress) => {
  return preloadImages(monitorImages, onProgress);
};

/**
 * 预加载维保管理页面图片
 * @param {Function} onProgress 进度回调
 * @returns {Promise} 加载完成Promise
 */
export const preloadMaintenanceImages = (onProgress) => {
  return preloadImages(maintenanceImages, onProgress);
};

/**
 * 优先预加载底部行图片
 * @param {Function} onProgress 进度回调
 * @returns {Promise} 加载完成Promise
 */
export const preloadBottomRowImages = (onProgress) => {
  return preloadImages(bottomRowImages, onProgress);
};

/**
 * 预加载所有图片
 * @param {Function} onProgress 进度回调
 * @returns {Promise} 加载完成Promise
 */
export const preloadAllImages = (onProgress) => {
  // 先加载底部行图片，再加载其他图片
  return preloadBottomRowImages().then(() => {
    // 过滤已经加载过的图片
    const remainingImages = allImages.filter(img => 
      !bottomRowImages.includes(img) && !imageCache.isLoaded(img)
    );
    return preloadImages(remainingImages, onProgress);
  });
};

export default {
  preloadImage,
  preloadImages,
  preloadMonitorImages,
  preloadMaintenanceImages,
  preloadBottomRowImages,
  preloadAllImages,
  monitorImages,
  maintenanceImages,
  bottomRowImages,
  allImages
}; 