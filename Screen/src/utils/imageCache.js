/**
 * 图像资源缓存系统
 * 使用单例模式管理预加载的图像资源，确保图像只需加载一次
 */

// 图像缓存实例
let instance = null;

/**
 * 图像缓存类
 */
class ImageCache {
  constructor() {
    // 私有缓存存储
    this._cache = new Map();
    this._loadPromises = new Map();
    this._loadedURLs = new Set();
    this._status = {
      totalImages: 0,
      loadedImages: 0,
      failedImages: 0
    };
  }

  /**
   * 获取缓存单例实例
   */
  static getInstance() {
    if (!instance) {
      instance = new ImageCache();
    }
    return instance;
  }

  /**
   * 预加载图像并存入缓存
   * @param {string|Array} src 单个图像URL或URL数组
   * @param {Function} onProgress 加载进度回调
   * @returns {Promise} 加载完成的Promise
   */
  preload(src, onProgress = null) {
    if (Array.isArray(src)) {
      return this._preloadMultiple(src, onProgress);
    }
    return this._preloadSingle(src);
  }

  /**
   * 预加载单个图像
   * @param {string} src 图像URL
   * @returns {Promise} 加载完成的Promise
   */
  _preloadSingle(src) {
    // 如果已经加载过，直接返回缓存的Promise或图像元素
    if (this._cache.has(src)) {
      return Promise.resolve(this._cache.get(src));
    }

    // 如果正在加载，返回现有的Promise
    if (this._loadPromises.has(src)) {
      return this._loadPromises.get(src);
    }

    // 创建新的加载Promise
    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        // 加载成功，存入缓存
        this._cache.set(src, img);
        this._loadedURLs.add(src);
        this._status.loadedImages++;
        this._loadPromises.delete(src);
        resolve(img);
      };
      
      img.onerror = (err) => {
        // 加载失败
        this._loadPromises.delete(src);
        this._status.failedImages++;
        reject(new Error(`无法加载图像: ${src}`));
      };
      
      // 开始加载
      img.src = src;
    });

    // 存储加载Promise
    this._loadPromises.set(src, loadPromise);
    this._status.totalImages++;

    return loadPromise;
  }

  /**
   * 预加载多个图像
   * @param {Array} sources 图像URL数组
   * @param {Function} onProgress 加载进度回调
   * @returns {Promise} 所有图像加载完成的Promise
   */
  _preloadMultiple(sources, onProgress) {
    let loaded = 0;
    const total = sources.length;

    return Promise.all(
      sources.map(src => 
        this._preloadSingle(src)
          .then(() => {
            loaded++;
            if (onProgress) {
              onProgress(loaded / total);
            }
            return src;
          })
          .catch(err => {
            // 继续加载其他图像，但记录错误
            console.error(`图像加载失败: ${src}`, err);
            return null; // 返回null表示此图像加载失败
          })
      )
    );
  }

  /**
   * 获取已缓存的图像
   * @param {string} src 图像URL
   * @returns {HTMLImageElement|null} 已缓存的图像元素或null
   */
  get(src) {
    return this._cache.get(src) || null;
  }

  /**
   * 检查图像是否已加载
   * @param {string} src 图像URL
   * @returns {boolean} 是否已加载
   */
  isLoaded(src) {
    return this._loadedURLs.has(src);
  }

  /**
   * 获取当前缓存状态
   * @returns {Object} 缓存状态
   */
  getStatus() {
    return { ...this._status };
  }

  /**
   * 清除指定图像缓存
   * @param {string} src 图像URL
   */
  remove(src) {
    if (this._cache.has(src)) {
      this._cache.delete(src);
      this._loadedURLs.delete(src);
      this._status.loadedImages--;
    }
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this._cache.clear();
    this._loadPromises.clear();
    this._loadedURLs.clear();
    this._status = {
      totalImages: 0,
      loadedImages: 0,
      failedImages: 0
    };
  }
}

// 导出单例实例
const imageCache = ImageCache.getInstance();
export default imageCache; 