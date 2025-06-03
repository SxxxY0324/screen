"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionService = void 0;
const apis_1 = require("../apis");
// 缓存控制
const CACHE_TIME = 5 * 60 * 1000; // 5分钟缓存时间
let regionListCache = {
    data: null,
    timestamp: 0
};
/**
 * 区域服务
 */
exports.regionService = {
    /**
     * 获取区域列表
     * @param params 分页参数
     * @param forceRefresh 是否强制刷新（不使用缓存）
     */
    async getRegionList(params, forceRefresh = false) {
        const now = Date.now();
        // 如有有效缓存且不强制刷新，直接使用缓存
        if (!forceRefresh &&
            regionListCache.data &&
            now - regionListCache.timestamp < CACHE_TIME) {
            return regionListCache.data;
        }
        // 否则请求新数据
        try {
            const result = await apis_1.regionApi.getRegionList(params);
            // 更新缓存
            regionListCache = {
                data: result,
                timestamp: now
            };
            return result;
        }
        catch (error) {
            console.error('获取区域列表失败:', error);
            throw error;
        }
    },
    /**
     * 获取区域详情
     * @param id 区域ID
     */
    async getRegionDetail(id) {
        try {
            return await apis_1.regionApi.getRegionDetail(id);
        }
        catch (error) {
            console.error(`获取区域(${id})详情失败:`, error);
            throw error;
        }
    },
    /**
     * 计算区域设备总数和运行中设备总数
     */
    calculateTotals(regions) {
        const totalDevices = regions.reduce((sum, region) => sum + region.deviceCount, 0);
        const totalRunning = regions.reduce((sum, region) => sum + region.runningCount, 0);
        return {
            totalDevices,
            totalRunning
        };
    },
    /**
     * 清除缓存
     */
    clearCache() {
        regionListCache = {
            data: null,
            timestamp: 0
        };
    }
};
//# sourceMappingURL=region.js.map