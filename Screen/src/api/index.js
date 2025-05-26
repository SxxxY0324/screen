import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 使用相对路径，不再硬编码localhost
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 控制是否输出详细请求错误日志
const DEBUG_API_ERRORS = false;

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加认证信息等
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 确保始终返回有效的数据结构
    const data = response.data;
    
    // 检查是否有数据
    if (data === null || data === undefined) {
      return {}; // 返回空对象避免错误
    }
    
    return data; // 直接返回数据部分
  },
  error => {
    // 只输出简化的错误信息，减少重复日志
    if (DEBUG_API_ERRORS || error.response?.status !== 404) {
      // 404错误太多，只在DEBUG模式下显示
      // 对于其他类型的错误，仍然输出有用的信息
      const endpoint = error.config?.url || '未知接口';
      const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
      const status = error.response?.status || '无状态码';
      console.error(`[API错误] ${method} ${endpoint} - ${status}`);
    }
    return Promise.reject(error);
  }
);

// 导出API服务
export * from './monitorApi';

export default api; 