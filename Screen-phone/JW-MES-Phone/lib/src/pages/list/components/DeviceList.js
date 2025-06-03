"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const components_1 = require("@tarojs/components");
const taro_1 = require("@tarojs/taro");
function DeviceList({ initialDevices, onDeviceStatusChange }) {
    // 分页与加载状态 - 设备列表
    const [deviceData, setDeviceData] = (0, react_1.useState)([]);
    const [allDeviceData, setAllDeviceData] = (0, react_1.useState)([]);
    const [devicePageSize] = (0, react_1.useState)(6); // 设备列表每页6条数据
    const [deviceCurrentPage, setDeviceCurrentPage] = (0, react_1.useState)(1);
    const [deviceLoading, setDeviceLoading] = (0, react_1.useState)(false);
    const [deviceRefreshing, setDeviceRefreshing] = (0, react_1.useState)(false);
    const [deviceHasMore, setDeviceHasMore] = (0, react_1.useState)(true);
    // 初始化数据
    (0, react_1.useEffect)(() => {
        setAllDeviceData(initialDevices);
        const firstPageData = initialDevices.slice(0, devicePageSize);
        setDeviceData(firstPageData);
        setDeviceCurrentPage(1);
        setDeviceHasMore(initialDevices.length > devicePageSize);
    }, [initialDevices, devicePageSize]);
    // 设备列表刷新数据
    const handleDeviceRefresh = () => {
        if (deviceRefreshing)
            return;
        setDeviceRefreshing(true);
        // 模拟异步请求
        setTimeout(() => {
            // 只加载第一页设备数据
            const initialDevices = allDeviceData.slice(0, devicePageSize);
            setDeviceData(initialDevices);
            setDeviceCurrentPage(1);
            setDeviceHasMore(allDeviceData.length > devicePageSize);
            setDeviceRefreshing(false);
        }, 1000);
    };
    // 设备列表加载更多
    const handleDeviceLoadMore = () => {
        if (deviceLoading || !deviceHasMore)
            return;
        setDeviceLoading(true);
        // 计算下一页数据
        const nextPage = deviceCurrentPage + 1;
        const startIndex = (nextPage - 1) * devicePageSize;
        const endIndex = nextPage * devicePageSize;
        // 模拟异步请求
        setTimeout(() => {
            // 获取下一页数据
            const newData = allDeviceData.slice(startIndex, endIndex);
            if (newData.length > 0) {
                // 更新数据和页码
                setDeviceData([...deviceData, ...newData]);
                setDeviceCurrentPage(nextPage);
                // 判断是否还有更多数据
                setDeviceHasMore(endIndex < allDeviceData.length);
            }
            else {
                setDeviceHasMore(false);
            }
            setDeviceLoading(false);
        }, 1000);
    };
    // 处理设备列表滚动到底部事件
    const handleDeviceScrollToLower = () => {
        if (deviceHasMore && !deviceLoading) {
            handleDeviceLoadMore();
        }
    };
    // 处理设备卡片点击事件
    const handleDeviceCardClick = (device) => {
        // 去除名称中的括号及括号内容
        const cleanName = device.name.replace(/\([^)]*\)/g, '').trim();
        // 获取当前日期作为默认值
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        const startDate = weekAgo.toISOString().split('T')[0]; // 格式: YYYY-MM-DD
        const endDate = today.toISOString().split('T')[0]; // 格式: YYYY-MM-DD
        // 跳转到设备详情页面
        taro_1.default.navigateTo({
            url: `/pages/device-details/index?deviceId=${device.id}&deviceName=${cleanName}&deviceCode=${device.code}&startDate=${startDate}&endDate=${endDate}`
        });
    };
    return ((0, jsx_runtime_1.jsxs)(components_1.ScrollView, Object.assign({ className: 'scrollable-devices', scrollY: true, scrollTop: 0, refresherEnabled: true, refresherTriggered: deviceRefreshing, onRefresherRefresh: handleDeviceRefresh, onScrollToLower: handleDeviceScrollToLower, lowerThreshold: 20 }, { children: [(0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'device-list-container' }, { children: deviceData.map(device => ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'device-card', onClick: () => handleDeviceCardClick(device) }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'device-card-left' }, { children: [(0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'device-name' }, { children: device.name })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'device-code' }, { children: device.code })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'device-update-time' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'label' }, { children: "\u6700\u540E\u66F4\u65B0\u65F6\u95F4\uFF1A" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'value' }, { children: device.lastUpdateTime }))] }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'device-card-right' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'device-location' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'location-icon' }, { children: "\uD83D\uDCCD" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'location-text' }, { children: device.location }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'device-series' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'label' }, { children: "\u8BBE\u5907\u578B\u53F7\uFF1A" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'value' }, { children: device.series }))] })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'device-status' }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: `status-text ${device.isOn ? 'status-on' : 'status-off'}` }, { children: device.isOn ? '运行中' : '已停机' })) }))] }))] }), device.id))) })), deviceLoading && ((0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'loading-tip' }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'small-loading-text' }, { children: "\u6570\u636E\u52A0\u8F7D\u4E2D..." })) }))), !deviceHasMore && !deviceLoading && deviceData.length > 0 && ((0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'loading-complete' }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'small-loading-text' }, { children: "\u5DF2\u5168\u90E8\u52A0\u8F7D" })) })))] })));
}
exports.default = DeviceList;
//# sourceMappingURL=DeviceList.js.map