"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_PATHS = void 0;
// API路径常量
exports.API_PATHS = {
    // 区域相关接口
    REGION: {
        LIST: '/regions',
        DETAIL: (id) => `/regions/${id}`,
        STATS: '/regions/stats',
    },
    // 客户相关接口
    CUSTOMER: {
        LIST: (regionId) => `/regions/${regionId}/customers`,
        DETAIL: (id) => `/customers/${id}`,
    },
    // 设备相关接口
    DEVICE: {
        LIST: (customerId) => `/customers/${customerId}/devices`,
        DETAIL: (id) => `/devices/${id}`,
        UPDATE_STATUS: (id) => `/devices/${id}/status`,
    }
};
//# sourceMappingURL=types.js.map