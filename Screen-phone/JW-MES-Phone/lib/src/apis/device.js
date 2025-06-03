"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceApi = void 0;
const config_1 = require("../config");
const types_1 = require("./types");
// 设备API
exports.deviceApi = {
    /**
     * 获取指定客户的设备列表
     * @param customerId 客户ID
     * @param params 分页参数
     */
    getDeviceList: (customerId, params) => {
        return config_1.httpClient.get(types_1.API_PATHS.DEVICE.LIST(customerId), params);
    },
    /**
     * 获取设备详情
     * @param id 设备ID
     */
    getDeviceDetail: (id) => {
        return config_1.httpClient.get(types_1.API_PATHS.DEVICE.DETAIL(id));
    },
    /**
     * 更新设备状态
     * @param id 设备ID
     * @param isOn 是否开启
     */
    updateDeviceStatus: (id, isOn) => {
        return config_1.httpClient.put(types_1.API_PATHS.DEVICE.UPDATE_STATUS(id), { isOn });
    }
};
//# sourceMappingURL=device.js.map