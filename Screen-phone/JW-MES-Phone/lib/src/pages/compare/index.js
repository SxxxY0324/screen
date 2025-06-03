"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const components_1 = require("@tarojs/components");
const taro_1 = require("@tarojs/taro");
require("./index.scss");
// 引入必要的Taro UI样式
require("taro-ui/dist/style/components/button.scss");
function Compare() {
    const [device1, setDevice1] = (0, react_1.useState)('');
    const [device2, setDevice2] = (0, react_1.useState)('');
    const [startDate1, setStartDate1] = (0, react_1.useState)('');
    const [endDate1, setEndDate1] = (0, react_1.useState)('');
    const [startDate2, setStartDate2] = (0, react_1.useState)('');
    const [endDate2, setEndDate2] = (0, react_1.useState)('');
    const [startTime1, setStartTime1] = (0, react_1.useState)('00:00');
    const [endTime1, setEndTime1] = (0, react_1.useState)('23:59');
    const [startTime2, setStartTime2] = (0, react_1.useState)('00:00');
    const [endTime2, setEndTime2] = (0, react_1.useState)('23:59');
    const [deviceList] = (0, react_1.useState)([
        '设备A-12345',
        '设备B-67890',
        '设备C-13579',
        '设备D-24680',
        '设备E-54321'
    ]);
    (0, taro_1.useLoad)(() => {
        console.log('Compare page loaded.');
        // 初始化当前日期
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;
        setStartDate1(currentDate);
        setEndDate1(currentDate);
        setStartDate2(currentDate);
        setEndDate2(currentDate);
    });
    // 设备1选择
    const handleDevice1Change = (e) => {
        const index = e.detail.value;
        setDevice1(deviceList[index]);
    };
    // 设备2选择
    const handleDevice2Change = (e) => {
        const index = e.detail.value;
        setDevice2(deviceList[index]);
    };
    // 开始日期1变更
    const handleStartDate1Change = (e) => {
        setStartDate1(e.detail.value);
    };
    // 截止日期1变更
    const handleEndDate1Change = (e) => {
        setEndDate1(e.detail.value);
    };
    // 开始日期2变更
    const handleStartDate2Change = (e) => {
        setStartDate2(e.detail.value);
    };
    // 截止日期2变更
    const handleEndDate2Change = (e) => {
        setEndDate2(e.detail.value);
    };
    // 开始时间1变更
    const handleStartTime1Change = (e) => {
        setStartTime1(e.detail.value);
    };
    // 截止时间1变更
    const handleEndTime1Change = (e) => {
        setEndTime1(e.detail.value);
    };
    // 开始时间2变更
    const handleStartTime2Change = (e) => {
        setStartTime2(e.detail.value);
    };
    // 截止时间2变更
    const handleEndTime2Change = (e) => {
        setEndTime2(e.detail.value);
    };
    // 开始对比
    const handleStartCompare = () => {
        if (!device1 || !device2) {
            console.log('请选择设备');
            return;
        }
        console.log('开始对比', {
            device1,
            startDate1,
            endDate1,
            startTime1,
            endTime1,
            device2,
            startDate2,
            endDate2,
            startTime2,
            endTime2
        });
        // 这里可以添加跳转到对比结果页面的逻辑
    };
    return ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'compare-page' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'device-card' }, { children: [(0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'card-title' }, { children: "\u7B2C\u4E00\u53F0\u8BBE\u5907SN" })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'device-selector' }, { children: (0, jsx_runtime_1.jsx)(components_1.Picker, Object.assign({ mode: 'selector', range: deviceList, onChange: handleDevice1Change }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'picker-value' }, { children: device1 || '点击选择设备' })) })) })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'date-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'date-label' }, { children: "\u5F00\u59CB\u65E5\u671F" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'date-label right' }, { children: "\u622A\u81F3\u65E5\u671F" }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'date-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Picker, Object.assign({ mode: 'date', value: startDate1, onChange: handleStartDate1Change }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'date-picker' }, { children: startDate1 || '选择日期' })) })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'date-separator' }, { children: "\u81F3" })), (0, jsx_runtime_1.jsx)(components_1.Picker, Object.assign({ mode: 'date', value: endDate1, onChange: handleEndDate1Change }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'date-picker' }, { children: endDate1 || '选择日期' })) }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'time-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-label' }, { children: "\u5F00\u59CB\u65F6\u95F4" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-label right' }, { children: "\u622A\u81F3\u65F6\u95F4" }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'time-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Picker, Object.assign({ mode: 'time', value: startTime1, onChange: handleStartTime1Change }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'time-value' }, { children: startTime1 })) })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-separator' }, { children: "\u81F3" })), (0, jsx_runtime_1.jsx)(components_1.Picker, Object.assign({ mode: 'time', value: endTime1, onChange: handleEndTime1Change }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'time-value' }, { children: endTime1 })) }))] }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'device-card' }, { children: [(0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'card-title' }, { children: "\u7B2C\u4E8C\u53F0\u8BBE\u5907SN" })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'device-selector' }, { children: (0, jsx_runtime_1.jsx)(components_1.Picker, Object.assign({ mode: 'selector', range: deviceList, onChange: handleDevice2Change }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'picker-value' }, { children: device2 || '点击选择设备' })) })) })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'date-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'date-label' }, { children: "\u5F00\u59CB\u65E5\u671F" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'date-label right' }, { children: "\u622A\u81F3\u65E5\u671F" }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'date-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Picker, Object.assign({ mode: 'date', value: startDate2, onChange: handleStartDate2Change }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'date-picker' }, { children: startDate2 || '选择日期' })) })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'date-separator' }, { children: "\u81F3" })), (0, jsx_runtime_1.jsx)(components_1.Picker, Object.assign({ mode: 'date', value: endDate2, onChange: handleEndDate2Change }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'date-picker' }, { children: endDate2 || '选择日期' })) }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'time-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-label' }, { children: "\u5F00\u59CB\u65F6\u95F4" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-label right' }, { children: "\u622A\u81F3\u65F6\u95F4" }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'time-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Picker, Object.assign({ mode: 'time', value: startTime2, onChange: handleStartTime2Change }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'time-value' }, { children: startTime2 })) })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'time-separator' }, { children: "\u81F3" })), (0, jsx_runtime_1.jsx)(components_1.Picker, Object.assign({ mode: 'time', value: endTime2, onChange: handleEndTime2Change }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'time-value' }, { children: endTime2 })) }))] }))] })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'compare-btn', onClick: handleStartCompare }, { children: "\u5BF9\u6BD4" }))] })));
}
exports.default = Compare;
//# sourceMappingURL=index.js.map