// 导出环境配置
export * from './env'

// 导出HTTP配置
export { default as httpClient } from './http'

// 应用配置
export const appConfig = {
  name: 'Screen-1.0',
  version: '1.0.0',
  
  // 认证相关
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpireKey: 'token_expire_time',
  },
  
  // 缓存设置
  cache: {
    defaultExpireTime: 5 * 60 * 1000, // 5分钟默认缓存过期时间
    maxCacheItems: 100, // 最大缓存项数
  }
} 