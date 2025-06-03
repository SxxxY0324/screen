/**
 * 环境配置
 */

// 环境类型
export enum EnvType {
  DEV = 'development',
  TEST = 'test',
  PROD = 'production',
}

// 环境配置接口
export interface EnvConfig {
  apiBaseUrl: string; // API基础地址
  uploadUrl: string;  // 上传地址
  timeout: number;    // 请求超时时间(ms)
  enableLog: boolean; // 是否开启日志
  enableMock: boolean; // 是否使用模拟数据
}

// 当前环境
export const ENV = process.env.NODE_ENV as EnvType || EnvType.DEV;

// 环境配置映射
const envConfigMap: Record<EnvType, EnvConfig> = {
  // 开发环境
  [EnvType.DEV]: {
    apiBaseUrl: 'http://localhost:3000/api',
    uploadUrl: 'http://localhost:3000/upload',
    timeout: 10000, // 10秒
    enableLog: true,
    enableMock: true, // 开发环境默认使用模拟数据
  },
  
  // 测试环境
  [EnvType.TEST]: {
    apiBaseUrl: 'https://test-api.example.com',
    uploadUrl: 'https://test-api.example.com/upload',
    timeout: 15000, // 15秒
    enableLog: true,
    enableMock: false,
  },
  
  // 生产环境
  [EnvType.PROD]: {
    apiBaseUrl: 'https://api.example.com',
    uploadUrl: 'https://api.example.com/upload',
    timeout: 20000, // 20秒
    enableLog: false,
    enableMock: false,
  },
};

// 导出当前环境的配置
export const envConfig = envConfigMap[ENV];

// 导出环境判断函数
export const isDev = ENV === EnvType.DEV;
export const isTest = ENV === EnvType.TEST;
export const isProd = ENV === EnvType.PROD; 