"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppContext = exports.AppProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// 定义初始状态
const initialState = {
    userInfo: null,
    isLogin: false
};
// 创建reducer
function reducer(state, action) {
    switch (action.type) {
        case 'SET_USER_INFO':
            return Object.assign(Object.assign({}, state), { userInfo: action.payload });
        case 'SET_LOGIN_STATUS':
            return Object.assign(Object.assign({}, state), { isLogin: action.payload });
        default:
            return state;
    }
}
// 创建Context
const AppContext = (0, react_1.createContext)({
    state: initialState,
    dispatch: () => null
});
// 创建Provider组件
const AppProvider = ({ children }) => {
    const [state, dispatch] = (0, react_1.useReducer)(reducer, initialState);
    return ((0, jsx_runtime_1.jsx)(AppContext.Provider, Object.assign({ value: { state, dispatch } }, { children: children })));
};
exports.AppProvider = AppProvider;
// 创建Hook便于使用Context
const useAppContext = () => (0, react_1.useContext)(AppContext);
exports.useAppContext = useAppContext;
//# sourceMappingURL=AppContext.js.map