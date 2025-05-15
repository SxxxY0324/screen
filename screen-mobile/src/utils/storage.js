/**
 * 跨平台存储工具类
 * 针对H5和微信小程序环境提供统一的存储API
 */

import Taro from '@tarojs/taro'

// 检测当前环境
const isH5 = process.env.TARO_ENV === 'h5'

/**
 * 设置存储数据
 * @param {string} key 键名
 * @param {any} value 值
 */
export function setStorage(key, value) {
  if (isH5) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('存储数据失败:', e)
    }
  } else {
    try {
      Taro.setStorageSync(key, value)
    } catch (e) {
      console.error('存储数据失败:', e)
    }
  }
}

/**
 * 获取存储数据
 * @param {string} key 键名
 * @returns {any} 存储的数据
 */
export function getStorage(key) {
  if (isH5) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.error('获取数据失败:', e)
      return null
    }
  } else {
    try {
      return Taro.getStorageSync(key)
    } catch (e) {
      console.error('获取数据失败:', e)
      return null
    }
  }
}

/**
 * 移除存储数据
 * @param {string} key 键名
 */
export function removeStorage(key) {
  if (isH5) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('移除数据失败:', e)
    }
  } else {
    try {
      Taro.removeStorageSync(key)
    } catch (e) {
      console.error('移除数据失败:', e)
    }
  }
}

/**
 * 清除所有存储数据
 */
export function clearStorage() {
  if (isH5) {
    try {
      localStorage.clear()
    } catch (e) {
      console.error('清除数据失败:', e)
    }
  } else {
    try {
      Taro.clearStorageSync()
    } catch (e) {
      console.error('清除数据失败:', e)
    }
  }
}

export default {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage
}
