"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("@tarojs/components");
require("./index.scss");
const Banner = ({ data, onBannerClick }) => {
    const handleClick = (id) => {
        if (onBannerClick) {
            onBannerClick(id);
        }
    };
    return ((0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'banner-container' }, { children: (0, jsx_runtime_1.jsx)(components_1.Swiper, Object.assign({ className: 'banner-swiper', indicatorColor: '#999', indicatorActiveColor: '#1890FF', circular: true, indicatorDots: true, autoplay: true }, { children: data.map(banner => ((0, jsx_runtime_1.jsx)(components_1.SwiperItem, Object.assign({ onClick: () => handleClick(banner.id) }, { children: (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'banner-item' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Image, { className: 'banner-image', src: banner.imageUrl, mode: 'aspectFill' }), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'banner-title' }, { children: banner.title }))] })) }), banner.id))) })) })));
};
exports.default = Banner;
//# sourceMappingURL=index.js.map