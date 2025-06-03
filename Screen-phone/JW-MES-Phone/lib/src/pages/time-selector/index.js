"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const components_1 = require("@tarojs/components");
const taro_1 = require("@tarojs/taro");
require("./index.scss");
function TimeSelector() {
    // 获取路由参数
    const router = (0, taro_1.useRouter)();
    const { deviceId, deviceName, deviceCode } = router.params;
    // 日期状态
    const [startDate, setStartDate] = (0, react_1.useState)('');
    const [endDate, setEndDate] = (0, react_1.useState)('');
    // 初始化日期为当天
    (0, react_1.useEffect)(() => {
        const today = new Date();
        const formattedDate = formatDate(today);
        setStartDate(formattedDate);
        setEndDate(formattedDate);
    }, []);
    // 格式化日期为 YYYY-MM-DD 格式
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    // 计算相对于今天的日期
    const calculateDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return formatDate(date);
    };
    // 处理快捷按钮点击
    const handleQuickSelect = (days) => {
        const end = formatDate(new Date());
        const start = calculateDate(days);
        setStartDate(start);
        setEndDate(end);
    };
    // 处理详情查看按钮点击
    const handleViewDetails = () => {
        // 跳转到设备详情页面
        taro_1.default.navigateTo({
            url: `/pages/device-details/index?deviceId=${deviceId}&deviceName=${deviceName}&deviceCode=${deviceCode}&startDate=${startDate}&endDate=${endDate}`
        });
    };
    // 返回上一页
    const handleBack = () => {
        taro_1.default.navigateBack();
    };
    return ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'time-selector-page' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'device-info-section' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'device-name' }, { children: deviceName || 'BullmerTest' })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'device-code' }, { children: deviceCode || '123456' })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'time-range-section' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'time-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-label' }, { children: "\u5F00\u59CB\u65F6\u95F4" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-value' }, { children: startDate }))] })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-separator' }, { children: "\u81F3" })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'time-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-label' }, { children: "\u622A\u81F3\u65F6\u95F4" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-value' }, { children: endDate }))] }))] }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'quick-buttons' }, { children: [(0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'button-item', onClick: () => handleQuickSelect(3) }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u4E09\u5929" }) })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'button-item', onClick: () => handleQuickSelect(7) }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u4E03\u5929" }) })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'button-item', onClick: () => handleQuickSelect(15) }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u5341\u4E94\u5929" }) })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'button-item', onClick: () => handleQuickSelect(30) }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u4E09\u5341\u5929" }) }))] })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'action-button', onClick: handleViewDetails }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u67E5\u770B\u8BE6\u60C5" }) }))] })));
}
exports.default = TimeSelector;
//# sourceMappingURL=index.js.map