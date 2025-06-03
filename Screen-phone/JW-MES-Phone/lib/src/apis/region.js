"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionApi = void 0;
const config_1 = require("../config");
const types_1 = require("./types");
// 区域API
exports.regionApi = {
    /**
     * 获取区域列表
     * @param params 分页参数
     */
    getRegionList: (params) => {
        return config_1.httpClient.get(types_1.API_PATHS.REGION.LIST, params);
    },
    /**
     * 获取区域详情
     * @param id 区域ID
     */
    getRegionDetail: (id) => {
        return config_1.httpClient.get(types_1.API_PATHS.REGION.DETAIL(id));
    },
    /**
     * 获取区域统计数据
     */
    getRegionStats: () => {
        return config_1.httpClient.get(types_1.API_PATHS.REGION.STATS);
    }
};
//# sourceMappingURL=region.js.map