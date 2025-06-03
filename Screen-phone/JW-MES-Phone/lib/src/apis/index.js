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
exports.deviceApi = exports.customerApi = exports.regionApi = void 0;
// 导出API类型
__exportStar(require("./types"), exports);
// 导出API模块
var region_1 = require("./region");
Object.defineProperty(exports, "regionApi", { enumerable: true, get: function () { return region_1.regionApi; } });
var customer_1 = require("./customer");
Object.defineProperty(exports, "customerApi", { enumerable: true, get: function () { return customer_1.customerApi; } });
var device_1 = require("./device");
Object.defineProperty(exports, "deviceApi", { enumerable: true, get: function () { return device_1.deviceApi; } });
//# sourceMappingURL=index.js.map