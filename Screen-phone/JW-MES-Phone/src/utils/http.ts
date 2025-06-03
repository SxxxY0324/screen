import Taro from '@tarojs/taro'

// 请求配置接口
export interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
  showLoading?: boolean
  loadingTitle?: string
  ignoreError?: boolean // 是否忽略默认错误处理
}

// API响应接口
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

// Http错误类
export class HttpError extends Error {
  code: number
  data?: any
  
  constructor(message: string, code: number, data?: any) {
    super(message)
    this.name = 'HttpError'
    this.code = code
    this.data = data
  }
}

// 创建拦截器容器
type RequestInterceptor = (options: RequestOptions) => RequestOptions
type ResponseInterceptor = <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>
type ErrorInterceptor = (error: any) => any

class HttpInterceptors {
  requestInterceptors: RequestInterceptor[] = []
  responseInterceptors: ResponseInterceptor[] = []
  errorInterceptors: ErrorInterceptor[] = []

  // 添加请求拦截器
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
    return this // 链式调用
  }

  // 添加响应拦截器
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
    return this // 链式调用
  }

  // 添加错误拦截器
  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor)
    return this
  }

  // 执行请求拦截器
  runRequestInterceptors(options: RequestOptions): RequestOptions {
    return this.requestInterceptors.reduce((opts, interceptor) => {
      return interceptor(opts)
    }, options)
  }

  // 执行响应拦截器
  async runResponseInterceptors<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
    let result = response
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result)
    }
    return result
  }

  // 执行错误拦截器
  runErrorInterceptors(error: any): any {
    return this.errorInterceptors.reduce((err, interceptor) => {
      try {
        return interceptor(err)
      } catch (e) {
        return e
      }
    }, error)
  }
}

// HTTP客户端类
export class HttpClient {
  private baseURL: string
  private interceptors = new HttpInterceptors()

  constructor(baseURL: string = '') {
    this.baseURL = baseURL
  }

  // 获取完整URL
  private getFullURL(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    return `${this.baseURL}${url.startsWith('/') ? url : `/${url}`}`
  }

  // 处理GET请求的参数
  private formatParams(params?: Record<string, any>): string {
    if (!params) return ''
    
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (typeof value === 'object') {
          return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      })
      .join('&')
    
    return queryString ? `?${queryString}` : ''
  }

  // 设置拦截器
  interceptors_() {
    return this.interceptors
  }

  // 核心请求方法
  async request<T = any>(options: RequestOptions): Promise<T> {
    // 应用请求拦截器
    const interceptedOptions = this.interceptors.runRequestInterceptors(options)
    
    // 解构处理后的选项
    const {
      url,
      method = 'GET',
      data,
      params,
      headers = {},
      timeout = 60000,
      showLoading = false,
      loadingTitle = '加载中...',
      ignoreError = false,
    } = interceptedOptions

    try {
      // 显示加载提示
      if (showLoading) {
        Taro.showLoading({ title: loadingTitle })
      }
      
      // 构造完整URL，GET请求处理URL参数
      const fullURL = this.getFullURL(url) + (method === 'GET' ? this.formatParams(params) : '')
      
      // 发起请求
      const response = await Taro.request({
        url: fullURL,
        method,
        data: method === 'GET' ? undefined : data,
        header: headers,
        timeout,
      })
      
      // 处理状态码错误
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw new HttpError(
          `HTTP Error: ${response.statusCode}`,
          response.statusCode,
          response.data
        )
      }
      
      // 假设响应格式为 {code, data, message}
      const apiResponse = response.data as ApiResponse<T>
      
      // 应用响应拦截器
      const processedResponse = await this.interceptors.runResponseInterceptors(apiResponse)
      
      // 处理业务错误码
      if (processedResponse.code !== 0) {
        throw new HttpError(
          processedResponse.message || '请求失败',
          processedResponse.code,
          processedResponse.data
        )
      }
      
      // 返回数据
      return processedResponse.data
    } catch (error) {
      // 应用错误拦截器
      const processedError = this.interceptors.runErrorInterceptors(error)
      
      // 除非忽略错误处理，否则统一显示错误提示
      if (!ignoreError) {
        const errorMessage = processedError instanceof HttpError 
          ? processedError.message
          : '网络请求失败，请检查网络连接'
        
        Taro.showToast({
          title: errorMessage,
          icon: 'none',
          duration: 3000
        })
      }
      
      // 继续抛出处理后的错误
      throw processedError
    } finally {
      // 隐藏加载提示
      if (showLoading) {
        Taro.hideLoading()
      }
    }
  }

  // 便捷方法: GET
  get<T = any>(url: string, params?: Record<string, any>, options?: Omit<RequestOptions, 'url' | 'method' | 'params'>): Promise<T> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...options
    })
  }

  // 便捷方法: POST
  post<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  // 便捷方法: PUT
  put<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<T> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  // 便捷方法: DELETE
  delete<T = any>(url: string, params?: Record<string, any>, options?: Omit<RequestOptions, 'url' | 'method' | 'params'>): Promise<T> {
    return this.request<T>({
      url,
      method: 'DELETE',
      params,
      ...options
    })
  }
} 