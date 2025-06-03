"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const components_1 = require("@tarojs/components");
const taro_1 = require("@tarojs/taro");
const taro_ui_1 = require("taro-ui");
const AppContext_1 = require("../../store/AppContext");
const platform_1 = require("../../utils/platform");
require("./index.scss");
// 引入必要的Taro UI样式
require("taro-ui/dist/style/components/button.scss");
require("taro-ui/dist/style/components/card.scss");
require("taro-ui/dist/style/components/icon.scss");
function Index() {
    var _a;
    const [count, setCount] = (0, react_1.useState)(0);
    const { state } = (0, AppContext_1.useAppContext)();
    (0, taro_1.useLoad)(() => {
        console.log('Index page loaded.');
    });
    // 跳转到我的页面
    const goToMine = () => {
        (0, taro_1.navigateTo)({ url: '/pages/mine/index' });
    };
    return ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'index' }, { children: [(0, jsx_runtime_1.jsx)(taro_ui_1.AtCard, Object.assign({ title: '\u5E73\u53F0\u4FE1\u606F', className: 'platform-card' }, { children: (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'platform-info' }, { children: ["\u5F53\u524D\u5E73\u53F0: ", platform_1.default.isWeapp ? '微信小程序' : platform_1.default.isH5 ? 'H5' : '其他平台'] })) })), (0, jsx_runtime_1.jsx)(taro_ui_1.AtCard, Object.assign({ title: '\u8BA1\u6570\u5668\u793A\u4F8B', className: 'counter-card' }, { children: (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'counter' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'count-number' }, { children: count })), (0, jsx_runtime_1.jsx)(taro_ui_1.AtButton, Object.assign({ type: 'primary', onClick: () => setCount(count + 1) }, { children: "\u589E\u52A0" }))] })) })), (0, jsx_runtime_1.jsx)(taro_ui_1.AtCard, Object.assign({ title: '\u7528\u6237\u4FE1\u606F', className: 'user-card' }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'user-info' }, { children: state.isLogin ? ((0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["\u6B22\u8FCE\u60A8, ", (_a = state.userInfo) === null || _a === void 0 ? void 0 : _a.name] })) : ((0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u60A8\u5C1A\u672A\u767B\u5F55" })) })) })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'navigation-btn' }, { children: (0, jsx_runtime_1.jsx)(taro_ui_1.AtButton, Object.assign({ type: 'secondary', onClick: goToMine }, { children: "\u524D\u5F80\u6211\u7684\u9875\u9762" })) }))] })));
}
exports.default = Index;
//# sourceMappingURL=index.js.map