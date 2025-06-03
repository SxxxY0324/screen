"use strict";
/**
 * 环境配置
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProd = exports.isTest = exports.isDev = exports.envConfig = exports.ENV = exports.EnvType = void 0;
// 环境类型
var EnvType;
(function (EnvType) {
    EnvType["DEV"] = "development";
    EnvType["TEST"] = "test";
    EnvType["PROD"] = "production";
})(EnvType = exports.EnvType || (exports.EnvType = {}));
// 当前环境
exports.ENV = process.env.NODE_ENV || EnvType.DEV;
// 环境配置映射
const envConfigMap = {
    // 开发环境
    [EnvType.DEV]: {
        apiBaseUrl: 'http://localhost:3000/api',
        uploadUrl: 'http://localhost:3000/upload',
        timeout: 10000,
        enableLog: true,
        enableMock: true, // 开发环境默认使用模拟数据
    },
    // 测试环境
    [EnvType.TEST]: {
        apiBaseUrl: 'https://test-api.example.com',
        uploadUrl: 'https://test-api.example.com/upload',
        timeout: 15000,
        enableLog: true,
        enableMock: false,
    },
    // 生产环境
    [EnvType.PROD]: {
        apiBaseUrl: 'https://api.example.com',
        uploadUrl: 'https://api.example.com/upload',
        timeout: 20000,
        enableLog: false,
        enableMock: false,
    },
};
// 导出当前环境的配置
exports.envConfig = envConfigMap[exports.ENV];
// 导出环境判断函数
exports.isDev = exports.ENV === EnvType.DEV;
exports.isTest = exports.ENV === EnvType.TEST;
exports.isProd = exports.ENV === EnvType.PROD;
//# sourceMappingURL=env.js.map