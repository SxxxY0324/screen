import { HttpClient } from '../utils/http'
import { envConfig } from './env'

// 使用环境配置创建HTTP客户端
const httpClient = new HttpClient(envConfig.apiBaseUrl)

// 配置请求超时时间
httpClient.interceptors_().addRequestInterceptor((options) => {
  return {
    ...options,
    timeout: envConfig.timeout
  }
})

// 开发环境日志拦截器
if (envConfig.enableLog) {
  // 请求日志
  httpClient.interceptors_().addRequestInterceptor((options) => {
    console.log(`[HTTP Request] ${options.method || 'GET'} ${options.url}`, {
      params: options.params,
      data: options.data,
      headers: options.headers
    })
    return options
  })
  
  // 响应日志
  httpClient.interceptors_().addResponseInterceptor((response) => {
    console.log('[HTTP Response]', response)
    return response
  })
  
  // 错误日志
  httpClient.interceptors_().addErrorInterceptor((error) => {
    console.error('[HTTP Error]', error)
    return error
  })
}

export default httpClient 