"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const components_1 = require("@tarojs/components");
const taro_1 = require("@tarojs/taro");
require("./index.scss");
// 引入自定义圆形进度条组件
const CircleProgress = ({ percent = 0, color = '#1890FF', size = 200 }) => {
    // 计算圆形进度条的参数
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percent / 100);
    return ((0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'circle-progress', style: { width: `${size}px`, height: `${size}px` } }, { children: (0, jsx_runtime_1.jsxs)("svg", Object.assign({ width: size, height: size, viewBox: `0 0 ${size} ${size}` }, { children: [(0, jsx_runtime_1.jsx)("circle", { cx: size / 2, cy: size / 2, r: radius, fill: 'none', stroke: '#E1E1E1', strokeWidth: '10' }), (0, jsx_runtime_1.jsx)("circle", { cx: size / 2, cy: size / 2, r: radius, fill: 'none', stroke: color, strokeWidth: '10', strokeDasharray: circumference, strokeDashoffset: strokeDashoffset, transform: `rotate(-90 ${size / 2} ${size / 2})`, strokeLinecap: 'round' })] })) })));
};
function DeviceDetails() {
    const router = (0, taro_1.useRouter)();
    const { deviceId, deviceName, deviceCode, startDate, endDate } = router.params;
    // 当前选中的Tab
    const [activeTab, setActiveTab] = (0, react_1.useState)('monitor');
    // 模拟的移动率数据
    const [mobilityRate, setMobilityRate] = (0, react_1.useState)(68);
    const [lastUpdateTime, setLastUpdateTime] = (0, react_1.useState)(new Date().toLocaleTimeString());
    // 计算天数差异
    const calculateDaysDifference = () => {
        if (!startDate || !endDate)
            return 1;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1; // 至少1天
    };
    const days = calculateDaysDifference();
    // 处理Tab切换
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    // 返回上一页
    const handleBack = () => {
        taro_1.default.navigateBack();
    };
    // 模拟实时数据更新
    (0, react_1.useEffect)(() => {
        let timer = null;
        // 仅在实时监控选项卡下更新数据
        if (activeTab === 'monitor') {
            timer = setInterval(() => {
                // 生成随机移动率数据 (50-90)
                const newRate = Math.floor(Math.random() * 41) + 50;
                setMobilityRate(newRate);
                setLastUpdateTime(new Date().toLocaleTimeString());
            }, 10000); // 每10秒更新一次
        }
        // 组件卸载时清除定时器
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [activeTab]);
    // 渲染当前选项卡内容
    const renderTabContent = () => {
        switch (activeTab) {
            case 'monitor':
                return ((0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'monitor-content' }, { children: (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'stat-card mobility-rate-card' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'stat-title' }, { children: "\u79FB\u52A8\u7387MU" })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'chart-container' }, { children: (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'progress-box' }, { children: [(0, jsx_runtime_1.jsx)(CircleProgress, { percent: mobilityRate, size: 180 }), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'rate-display' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.Text, Object.assign({ className: 'rate-value' }, { children: [mobilityRate, "%"] })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'rate-title' }, { children: "\u79FB\u52A8\u7387" }))] }))] })) })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'stat-footer' }, { children: (0, jsx_runtime_1.jsxs)(components_1.Text, Object.assign({ className: 'update-time' }, { children: ["\u6700\u540E\u66F4\u65B0: ", lastUpdateTime] })) }))] })) })));
            case 'maintenance':
                return ((0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'empty-content' }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'empty-text' }, { children: "\u7EF4\u4FDD\u7BA1\u7406\u5185\u5BB9\u5F85\u5B9E\u73B0" })) })));
            case 'analysis':
                return ((0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'empty-content' }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'empty-text' }, { children: "\u8FBE\u6807\u5206\u6790\u5185\u5BB9\u5F85\u5B9E\u73B0" })) })));
            default:
                return null;
        }
    };
    return ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'device-details-page' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'header-section' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'device-info' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'device-name' }, { children: deviceName || 'BullmerTest' })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'device-code' }, { children: deviceCode || '123456' }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'time-info' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-label' }, { children: "\u7D2F\u8BA1\u7EDF\u8BA1\u65F6\u95F4" })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'time-stats' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'days-count' }, { children: days })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'days-unit' }, { children: "\u5929" })), (0, jsx_runtime_1.jsxs)(components_1.Text, Object.assign({ className: 'date-range' }, { children: [startDate, " \u81F3 ", endDate] }))] }))] }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'tab-section' }, { children: [(0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: `tab-item ${activeTab === 'monitor' ? 'active' : ''}`, onClick: () => handleTabChange('monitor') }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u5B9E\u65F6\u76D1\u63A7" }) })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: `tab-item ${activeTab === 'maintenance' ? 'active' : ''}`, onClick: () => handleTabChange('maintenance') }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u7EF4\u4FDD\u7BA1\u7406" }) })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: `tab-item ${activeTab === 'analysis' ? 'active' : ''}`, onClick: () => handleTabChange('analysis') }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u8FBE\u6807\u5206\u6790" }) }))] })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'stats-content' }, { children: renderTabContent() }))] })));
}
exports.default = DeviceDetails;
//# sourceMappingURL=index.js.map