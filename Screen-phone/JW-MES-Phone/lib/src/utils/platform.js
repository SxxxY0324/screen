"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlipay = exports.isH5 = exports.isWeapp = void 0;
const taro_1 = require("@tarojs/taro");
exports.isWeapp = taro_1.default.getEnv() === taro_1.default.ENV_TYPE.WEAPP;
exports.isH5 = taro_1.default.getEnv() === taro_1.default.ENV_TYPE.WEB;
exports.isAlipay = taro_1.default.getEnv() === taro_1.default.ENV_TYPE.ALIPAY;
exports.default = {
    isWeapp: exports.isWeapp,
    isH5: exports.isH5,
    isAlipay: exports.isAlipay
};
//# sourceMappingURL=platform.js.map