"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerService = void 0;
const apis_1 = require("../apis");
// 客户列表缓存
const customerListCaches = {};
// 缓存时间（5分钟）
const CACHE_TIME = 5 * 60 * 1000;
/**
 * 客户服务
 */
exports.customerService = {
    /**
     * 获取客户列表
     * @param regionId 区域ID
     * @param params 分页参数
     * @param forceRefresh 是否强制刷新（不使用缓存）
     */
    async getCustomerList(regionId, params, forceRefresh = false) {
        var _a, _b;
        const now = Date.now();
        const cacheKey = regionId;
        // 如有有效缓存且不强制刷新，直接使用缓存
        if (!forceRefresh &&
            ((_a = customerListCaches[cacheKey]) === null || _a === void 0 ? void 0 : _a.data) &&
            now - (((_b = customerListCaches[cacheKey]) === null || _b === void 0 ? void 0 : _b.timestamp) || 0) < CACHE_TIME) {
            return customerListCaches[cacheKey].data;
        }
        // 否则请求新数据
        try {
            const result = await apis_1.customerApi.getCustomerList(regionId, params);
            // 更新缓存
            customerListCaches[cacheKey] = {
                data: result,
                timestamp: now
            };
            return result;
        }
        catch (error) {
            console.error(`获取区域(${regionId})的客户列表失败:`, error);
            throw error;
        }
    },
    /**
     * 获取客户详情
     * @param id 客户ID
     */
    async getCustomerDetail(id) {
        try {
            return await apis_1.customerApi.getCustomerDetail(id);
        }
        catch (error) {
            console.error(`获取客户(${id})详情失败:`, error);
            throw error;
        }
    },
    /**
     * 清除指定区域的客户列表缓存
     * @param regionId 区域ID，不传则清除所有缓存
     */
    clearCache(regionId) {
        if (regionId) {
            delete customerListCaches[regionId];
        }
        else {
            // 清除所有缓存
            Object.keys(customerListCaches).forEach(key => {
                delete customerListCaches[key];
            });
        }
    }
};
//# sourceMappingURL=customer.js.map