"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = exports.httpClient = void 0;
// 导出环境配置
__exportStar(require("./env"), exports);
// 导出HTTP配置
var http_1 = require("./http");
Object.defineProperty(exports, "httpClient", { enumerable: true, get: function () { return http_1.default; } });
// 应用配置
exports.appConfig = {
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
        defaultExpireTime: 5 * 60 * 1000,
        maxCacheItems: 100, // 最大缓存项数
    }
};
//# sourceMappingURL=index.js.map