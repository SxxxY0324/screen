"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@tarojs/components");
const taro_1 = require("@tarojs/taro");
const taro_ui_1 = require("taro-ui");
require("./index.scss");
// 引入必要的Taro UI样式
require("taro-ui/dist/style/components/grid.scss");
require("taro-ui/dist/style/components/card.scss");
require("taro-ui/dist/style/components/button.scss");
require("taro-ui/dist/style/components/icon.scss");
function Service() {
    (0, taro_1.useLoad)(() => {
        console.log('Service page loaded.');
    });
    // 处理服务点击
    const handleServiceClick = (item, index) => {
        console.log('Service clicked:', item, index);
        // 这里可以添加跳转到对应服务页面的逻辑
    };
    // 处理联系客服
    const handleContactService = () => {
        console.log('Contact customer service');
        // 这里可以添加联系客服的逻辑
    };
    return ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'service-page' }, { children: [(0, jsx_runtime_1.jsx)(taro_ui_1.AtCard, Object.assign({ title: '\u5E38\u7528\u670D\u52A1' }, { children: (0, jsx_runtime_1.jsx)(taro_ui_1.AtGrid, { data: [
                        {
                            image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                            value: '设备维修'
                        },
                        {
                            image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                            value: '巡检服务'
                        },
                        {
                            image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
                            value: '备件订购'
                        },
                        {
                            image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
                            value: '设备升级'
                        },
                        {
                            image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                            value: '技术咨询'
                        },
                        {
                            image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
                            value: '教程资料'
                        }
                    ], onClick: handleServiceClick }) })), (0, jsx_runtime_1.jsx)(taro_ui_1.AtCard, Object.assign({ title: '\u5728\u7EBF\u5BA2\u670D', className: 'customer-service-card' }, { children: (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'customer-service' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'service-desc' }, { children: "\u5982\u6709\u95EE\u9898\uFF0C\u8BF7\u8054\u7CFB\u6211\u4EEC\u7684\u5BA2\u670D\u56E2\u961F" })), (0, jsx_runtime_1.jsx)(taro_ui_1.AtButton, Object.assign({ type: 'secondary', onClick: handleContactService }, { children: "\u8054\u7CFB\u5BA2\u670D" }))] })) })), (0, jsx_runtime_1.jsx)(taro_ui_1.AtCard, Object.assign({ title: '\u670D\u52A1\u70ED\u7EBF', className: 'service-hotline-card' }, { children: (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'service-hotline' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'hotline-number' }, { children: "400-123-4567" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'hotline-time' }, { children: "\u5DE5\u4F5C\u65F6\u95F4: \u5468\u4E00\u81F3\u5468\u4E94 9:00-18:00" }))] })) }))] })));
}
exports.default = Service;
//# sourceMappingURL=index.js.map