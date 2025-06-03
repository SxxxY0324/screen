"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const taro_1 = require("@tarojs/taro");
const AppContext_1 = require("./store/AppContext");
require("./app.scss");
// 引入Taro UI全局样式
require("taro-ui/dist/style/index.scss");
function App({ children }) {
    (0, taro_1.useLaunch)(() => {
        console.log('App launched.');
    });
    // 使用AppProvider包装应用
    return ((0, jsx_runtime_1.jsx)(AppContext_1.AppProvider, { children: children }));
}
exports.default = App;
//# sourceMappingURL=app.js.map