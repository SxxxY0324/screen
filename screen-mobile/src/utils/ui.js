/**
 * 跨平台UI工具类
 * 针对H5和微信小程序环境提供统一的UI交互API
 */

import Taro from '@tarojs/taro'

// 检测当前环境
const isH5 = process.env.TARO_ENV === 'h5'

/**
 * 显示模态对话框
 * @param {Object} options 配置项
 * @param {string} options.title 标题
 * @param {string} options.content 内容
 * @param {boolean} options.showCancel 是否显示取消按钮
 * @param {string} options.cancelText 取消按钮文本
 * @param {string} options.confirmText 确认按钮文本
 * @param {Function} options.success 成功回调
 * @param {Function} options.fail 失败回调
 * @param {Function} options.complete 完成回调
 * @returns {Promise} 返回一个Promise
 */
export function showModal(options) {
  // H5环境下使用原生confirm
  if (isH5) {
    return new Promise((resolve) => {
      const result = window.confirm(options.content || options.title || '提示')
      if (options.success) {
        options.success({
          confirm: result,
          cancel: !result
        })
      }
      resolve({
        confirm: result,
        cancel: !result
      })
    })
  } else {
    // 小程序环境使用Taro.showModal
    return Taro.showModal(options)
  }
}

/**
 * 显示消息提示框
 * @param {Object} options 配置项
 * @param {string} options.title 提示的内容
 * @param {string} options.icon 图标类型
 * @param {number} options.duration 提示的延迟时间
 * @param {Function} options.success 成功回调
 * @param {Function} options.fail 失败回调
 * @param {Function} options.complete 完成回调
 * @returns {Promise} 返回一个Promise
 */
export function showToast(options) {
  if (isH5) {
    return new Promise((resolve) => {
      // 创建一个简单的toast元素
      const toast = document.createElement('div')
      toast.className = 'taro-toast'
      toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        max-width: 80%;
        text-align: center;
        z-index: 10000;
      `
      toast.innerText = options.title || ''
      document.body.appendChild(toast)

      // 设定时间后移除
      const duration = options.duration || 1500
      setTimeout(() => {
        document.body.removeChild(toast)
        if (options.success) {
          options.success({})
        }
        resolve({})
      }, duration)
    })
  } else {
    return Taro.showToast(options)
  }
}

export default {
  showModal,
  showToast
} 