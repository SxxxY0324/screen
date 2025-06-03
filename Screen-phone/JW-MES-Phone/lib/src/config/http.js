"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("../utils/http");
const env_1 = require("./env");
// 使用环境配置创建HTTP客户端
const httpClient = new http_1.HttpClient(env_1.envConfig.apiBaseUrl);
// 配置请求超时时间
httpClient.interceptors_().addRequestInterceptor((options) => {
    return Object.assign(Object.assign({}, options), { timeout: env_1.envConfig.timeout });
});
// 开发环境日志拦截器
if (env_1.envConfig.enableLog) {
    // 请求日志
    httpClient.interceptors_().addRequestInterceptor((options) => {
        console.log(`[HTTP Request] ${options.method || 'GET'} ${options.url}`, {
            params: options.params,
            data: options.data,
            headers: options.headers
        });
        return options;
    });
    // 响应日志
    httpClient.interceptors_().addResponseInterceptor((response) => {
        console.log('[HTTP Response]', response);
        return response;
    });
    // 错误日志
    httpClient.interceptors_().addErrorInterceptor((error) => {
        console.error('[HTTP Error]', error);
        return error;
    });
}
exports.default = httpClient;
//# sourceMappingURL=http.js.map