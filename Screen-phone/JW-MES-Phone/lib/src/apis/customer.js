"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerApi = void 0;
const config_1 = require("../config");
const types_1 = require("./types");
// 客户API
exports.customerApi = {
    /**
     * 获取指定区域的客户列表
     * @param regionId 区域ID
     * @param params 分页参数
     */
    getCustomerList: (regionId, params) => {
        return config_1.httpClient.get(types_1.API_PATHS.CUSTOMER.LIST(regionId), params);
    },
    /**
     * 获取客户详情
     * @param id 客户ID
     */
    getCustomerDetail: (id) => {
        return config_1.httpClient.get(types_1.API_PATHS.CUSTOMER.DETAIL(id));
    }
};
//# sourceMappingURL=customer.js.map