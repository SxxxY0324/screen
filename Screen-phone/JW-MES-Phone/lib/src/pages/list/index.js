"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const components_1 = require("@tarojs/components");
const taro_1 = require("@tarojs/taro");
const Banner_1 = require("../../components/Banner");
require("./index.scss");
// 引入必要的Taro UI样式
require("taro-ui/dist/style/components/list.scss");
require("taro-ui/dist/style/components/icon.scss");
require("taro-ui/dist/style/components/search-bar.scss");
require("taro-ui/dist/style/components/button.scss");
// 引入类型定义
const types_1 = require("../../types");
// 引入子组件
const RegionList_1 = require("./components/RegionList");
const CustomerList_1 = require("./components/CustomerList");
const DeviceList_1 = require("./components/DeviceList");
function List() {
    // 页面状态 - 列表模式
    const [pageMode, setPageMode] = (0, react_1.useState)(types_1.PageMode.REGION_LIST);
    const [currentRegionId, setCurrentRegionId] = (0, react_1.useState)('');
    const [currentCustomerId, setCurrentCustomerId] = (0, react_1.useState)('');
    const [regionName, setRegionName] = (0, react_1.useState)('');
    const [customers, setCustomers] = (0, react_1.useState)([]);
    const [deviceData, setDeviceData] = (0, react_1.useState)([]);
    // 轮播图数据
    const [bannerData] = (0, react_1.useState)([
        { id: 1, imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg', title: '设备工业4.0' },
        { id: 2, imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg', title: '智能制造' },
        { id: 3, imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg', title: '数字化转型' },
    ]);
    // 区域统计数据
    const [allRegionData] = (0, react_1.useState)([
        { id: 'north', name: '华北地区', deviceCount: 3, runningCount: 0 },
        { id: 'northeast', name: '东北地区', deviceCount: 1, runningCount: 0 },
        { id: 'east', name: '华东地区', deviceCount: 133, runningCount: 38 },
        { id: 'central', name: '华中地区', deviceCount: 11, runningCount: 7 },
        { id: 'south', name: '华南地区', deviceCount: 78, runningCount: 15 },
        { id: 'southwest', name: '西南地区', deviceCount: 42, runningCount: 9 },
    ]);
    // 模拟设备数据
    const mockDevices = [
        {
            id: '1',
            name: 'BullmerTest(裁床)',
            code: '123456',
            lastUpdateTime: '2025-05-16 11:39:11',
            location: '中国-北京 东城',
            series: 'E系列',
            isOn: false
        },
        {
            id: '2',
            name: 'BullmerTest(裁床)',
            code: '654321',
            lastUpdateTime: '2024-02-02 12:54:47',
            location: '中国-北京 东城',
            series: 'D系列',
            isOn: false
        },
        {
            id: '3',
            name: 'BullmerTest(裁床)',
            code: '123456789',
            lastUpdateTime: '2023-11-30 09:45:47',
            location: '中国-北京 东城',
            series: 'E系列',
            isOn: false
        },
    ];
    // 模拟客户数据
    const mockCustomers = {
        'north': [
            { id: 'c1', name: 'BullmerTest', phone: '010-12345678', address: '北京市朝阳区' },
            { id: 'c2', name: '北方科技', phone: '010-87654321', address: '天津市南开区' },
        ],
        'northeast': [
            { id: 'c3', name: '东北实业', phone: '024-12345678', address: '沈阳市和平区' },
        ],
        'east': [
            { id: 'c4', name: '江南制造', phone: '021-12345678', address: '上海市浦东新区' },
            { id: 'c5', name: '杭州智能', phone: '0571-87654321', address: '杭州市西湖区' },
        ],
        'central': [
            { id: 'c6', name: '中原科技', phone: '027-12345678', address: '武汉市洪山区' },
        ],
        'south': [
            { id: 'c7', name: '南方智造', phone: '020-12345678', address: '广州市天河区' },
        ],
        'southwest': [
            { id: 'c8', name: '西南企业', phone: '028-12345678', address: '成都市锦江区' },
        ],
    };
    // 区域名称映射
    const regionNameMap = {
        'north': '华北地区',
        'northeast': '东北地区',
        'east': '华东地区',
        'central': '华中地区',
        'south': '华南地区',
        'southwest': '西南地区',
    };
    // 计算设备总数和运行中总数
    const totalDevices = allRegionData.reduce((sum, region) => sum + region.deviceCount, 0);
    const totalRunning = allRegionData.reduce((sum, region) => sum + region.runningCount, 0);
    (0, taro_1.useLoad)(() => {
        console.log('List page loaded.');
    });
    // 轮播图点击
    const handleBannerClick = (id) => {
        console.log('Banner clicked:', id);
    };
    // 区域卡片点击
    const handleRegionClick = (regionId) => {
        console.log('Region clicked:', regionId);
        // 切换到客户列表模式
        setCurrentRegionId(regionId);
        // 设置区域名称
        if (regionNameMap[regionId]) {
            const name = regionNameMap[regionId];
            setRegionName(name);
            taro_1.default.setNavigationBarTitle({ title: name });
        }
        // 加载客户数据
        if (mockCustomers[regionId]) {
            setCustomers(mockCustomers[regionId]);
        }
        // 切换到客户列表模式并重置滚动位置
        setPageMode(types_1.PageMode.CUSTOMER_LIST);
        // 使用setTimeout确保DOM更新后再滚动
        setTimeout(() => {
            // 重置滚动位置
            taro_1.default.pageScrollTo({
                scrollTop: 0,
                duration: 0
            });
        }, 50);
    };
    // 返回地区列表
    const handleBackToRegionList = () => {
        // 恢复列表模式
        setPageMode(types_1.PageMode.REGION_LIST);
        setCurrentRegionId('');
        // 恢复原标题
        taro_1.default.setNavigationBarTitle({ title: '列表' });
        // 重置客户列表状态
        setCustomers([]);
        // 重置滚动位置
        setTimeout(() => {
            taro_1.default.pageScrollTo({
                scrollTop: 0,
                duration: 0
            });
        }, 50);
    };
    // 客户详情点击
    const handleCustomerDetail = (customerId) => {
        console.log('Customer detail clicked:', customerId);
        // 保存当前客户ID
        setCurrentCustomerId(customerId);
        // 设置页面标题
        taro_1.default.setNavigationBarTitle({ title: '设备列表' });
        // 模拟从API获取该客户的设备数据
        // 这里使用mockDevices来模拟，实际应该根据customerId从API获取
        setDeviceData(mockDevices);
        // 切换到设备列表模式
        setPageMode(types_1.PageMode.DEVICE_LIST);
        // 重置滚动位置
        setTimeout(() => {
            taro_1.default.pageScrollTo({
                scrollTop: 0,
                duration: 0
            });
        }, 50);
    };
    // 从设备列表返回到客户列表
    const handleBackToCustomerList = () => {
        setPageMode(types_1.PageMode.CUSTOMER_LIST);
        setCurrentCustomerId('');
        // 重置设备列表状态
        setDeviceData([]);
        // 重置滚动位置
        setTimeout(() => {
            taro_1.default.pageScrollTo({
                scrollTop: 0,
                duration: 0
            });
        }, 50);
        // 恢复区域标题
        if (regionName) {
            taro_1.default.setNavigationBarTitle({ title: regionName });
        }
    };
    // 切换设备开关状态
    const handleDeviceSwitchChange = (id, isChecked) => {
        console.log(`设备 ${id} 状态已切换为: ${isChecked ? 'on' : 'off'}`);
        // 更新设备状态
        const updatedDevices = deviceData.map(device => {
            if (device.id === id) {
                return Object.assign(Object.assign({}, device), { isOn: isChecked });
            }
            return device;
        });
        setDeviceData(updatedDevices);
    };
    return ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'list-page' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'fixed-content' }, { children: [(0, jsx_runtime_1.jsx)(Banner_1.default, { data: bannerData, onBannerClick: handleBannerClick }), pageMode === types_1.PageMode.REGION_LIST && ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'fixed-stats' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'stat-item' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'stat-label' }, { children: "\u8BBE\u5907\u603B\u6570\uFF1A" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'stat-value' }, { children: totalDevices }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'stat-item' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'stat-label' }, { children: "\u5F53\u524D\u8FD0\u884C\u4E2D\uFF1A" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'stat-value running' }, { children: totalRunning }))] }))] }))), pageMode === types_1.PageMode.CUSTOMER_LIST && ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'detail-header' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'back-button', onClick: handleBackToRegionList }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'back-icon' }, { children: "\u2190" })), (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u8FD4\u56DE" })] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'breadcrumb' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'breadcrumb-item', onClick: handleBackToRegionList }, { children: "\u5730\u533A\u5217\u8868" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'breadcrumb-separator' }, { children: "/" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'breadcrumb-item active' }, { children: "\u5BA2\u6237\u5217\u8868" }))] }))] }))), pageMode === types_1.PageMode.DEVICE_LIST && ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'detail-header' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'back-button', onClick: handleBackToCustomerList }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'back-icon' }, { children: "\u2190" })), (0, jsx_runtime_1.jsx)(components_1.Text, { children: "\u8FD4\u56DE" })] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'breadcrumb' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'breadcrumb-item', onClick: handleBackToRegionList }, { children: "\u5730\u533A\u5217\u8868" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'breadcrumb-separator' }, { children: "/" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'breadcrumb-item', onClick: handleBackToCustomerList }, { children: "\u5BA2\u6237\u5217\u8868" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'breadcrumb-separator' }, { children: "/" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'breadcrumb-item active' }, { children: "\u8BBE\u5907\u5217\u8868" }))] }))] })))] })), pageMode === types_1.PageMode.REGION_LIST && ((0, jsx_runtime_1.jsx)(RegionList_1.default, { allRegionData: allRegionData, onRegionClick: handleRegionClick })), pageMode === types_1.PageMode.CUSTOMER_LIST && ((0, jsx_runtime_1.jsx)(CustomerList_1.default, { initialCustomers: customers, onCustomerClick: handleCustomerDetail })), pageMode === types_1.PageMode.DEVICE_LIST && ((0, jsx_runtime_1.jsx)(DeviceList_1.default, { initialDevices: deviceData, onDeviceStatusChange: handleDeviceSwitchChange }))] })));
}
exports.default = List;
//# sourceMappingURL=index.js.map