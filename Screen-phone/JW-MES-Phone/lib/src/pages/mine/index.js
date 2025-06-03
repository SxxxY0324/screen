"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@tarojs/components");
const taro_1 = require("@tarojs/taro");
const taro_ui_1 = require("taro-ui");
const AppContext_1 = require("../../store/AppContext");
require("./index.scss");
// 引入必要的样式
require("taro-ui/dist/style/components/avatar.scss");
require("taro-ui/dist/style/components/button.scss");
require("taro-ui/dist/style/components/list.scss");
require("taro-ui/dist/style/components/icon.scss");
function Mine() {
    var _a, _b;
    const { state, dispatch } = (0, AppContext_1.useAppContext)();
    (0, taro_1.useLoad)(() => {
        console.log('Mine page loaded.');
    });
    // 模拟登录操作
    const handleLogin = () => {
        dispatch({
            type: 'SET_USER_INFO',
            payload: {
                name: '测试用户',
                avatar: 'https://jdc.jd.com/img/200'
            }
        });
        dispatch({ type: 'SET_LOGIN_STATUS', payload: true });
    };
    // 模拟退出登录
    const handleLogout = () => {
        dispatch({ type: 'SET_USER_INFO', payload: null });
        dispatch({ type: 'SET_LOGIN_STATUS', payload: false });
    };
    return ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'mine-page' }, { children: [(0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'user-card' }, { children: state.isLogin ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'user-info' }, { children: [(0, jsx_runtime_1.jsx)(taro_ui_1.AtAvatar, { circle: true, image: (_a = state.userInfo) === null || _a === void 0 ? void 0 : _a.avatar }), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'username' }, { children: (_b = state.userInfo) === null || _b === void 0 ? void 0 : _b.name }))] })), (0, jsx_runtime_1.jsx)(taro_ui_1.AtButton, Object.assign({ type: 'secondary', size: 'small', onClick: handleLogout }, { children: "\u9000\u51FA\u767B\u5F55" }))] })) : ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'login-section' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'login-tip' }, { children: "\u60A8\u5C1A\u672A\u767B\u5F55" })), (0, jsx_runtime_1.jsx)(taro_ui_1.AtButton, Object.assign({ type: 'primary', onClick: handleLogin }, { children: "\u767B\u5F55" }))] }))) })), (0, jsx_runtime_1.jsxs)(taro_ui_1.AtList, { children: [(0, jsx_runtime_1.jsx)(taro_ui_1.AtListItem, { title: '\u4E2A\u4EBA\u8BBE\u7F6E', arrow: 'right' }), (0, jsx_runtime_1.jsx)(taro_ui_1.AtListItem, { title: '\u6D88\u606F\u901A\u77E5', arrow: 'right' }), (0, jsx_runtime_1.jsx)(taro_ui_1.AtListItem, { title: '\u5E2E\u52A9\u4E2D\u5FC3', arrow: 'right' }), (0, jsx_runtime_1.jsx)(taro_ui_1.AtListItem, { title: '\u5173\u4E8E\u6211\u4EEC', arrow: 'right' })] })] })));
}
exports.default = Mine;
//# sourceMappingURL=index.js.map