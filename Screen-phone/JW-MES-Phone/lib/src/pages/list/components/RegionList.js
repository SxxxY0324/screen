"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const components_1 = require("@tarojs/components");
function RegionList({ allRegionData, onRegionClick }) {
    // 分页与加载状态 - 地区列表
    const [regionData, setRegionData] = (0, react_1.useState)([]);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [pageSize] = (0, react_1.useState)(6); // 每页显示6条数据
    const [isRefreshing, setIsRefreshing] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [hasMore, setHasMore] = (0, react_1.useState)(true);
    // 加载初始数据
    const loadInitialData = () => {
        // 地区数据
        const initialData = allRegionData.slice(0, pageSize);
        setRegionData(initialData);
        setCurrentPage(1);
        // 如果总数据量小于等于页大小，说明已经没有更多数据了
        if (allRegionData.length <= pageSize) {
            setHasMore(false);
        }
        else {
            setHasMore(true);
        }
    };
    // 刷新数据
    const handleRefresh = () => {
        if (isRefreshing)
            return;
        setIsRefreshing(true);
        // 模拟异步请求
        setTimeout(() => {
            loadInitialData();
            setIsRefreshing(false);
        }, 1000);
    };
    // 加载更多数据
    const handleLoadMore = () => {
        if (isLoading || !hasMore)
            return;
        setIsLoading(true);
        // 计算下一页数据的起始索引和结束索引
        const nextPage = currentPage + 1;
        const startIndex = (nextPage - 1) * pageSize;
        const endIndex = nextPage * pageSize;
        // 模拟异步请求
        setTimeout(() => {
            // 获取下一页数据
            const newData = allRegionData.slice(startIndex, endIndex);
            if (newData.length > 0) {
                // 更新数据和页码
                setRegionData([...regionData, ...newData]);
                setCurrentPage(nextPage);
                // 判断是否还有更多数据
                setHasMore(endIndex < allRegionData.length);
            }
            else {
                setHasMore(false);
            }
            setIsLoading(false);
        }, 1000);
    };
    // 处理滚动到底部事件
    const handleScrollToLower = () => {
        if (hasMore && !isLoading) {
            handleLoadMore();
        }
    };
    // 在组件挂载时加载初始数据
    (0, react_1.useState)(() => {
        loadInitialData();
    });
    return ((0, jsx_runtime_1.jsxs)(components_1.ScrollView, Object.assign({ className: 'scrollable-regions', scrollY: true, scrollTop: 0, refresherEnabled: true, refresherTriggered: isRefreshing, onRefresherRefresh: handleRefresh, onScrollToLower: handleScrollToLower, lowerThreshold: 20 }, { children: [(0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'region-list-container' }, { children: regionData.map(region => ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'region-card' }, { children: [(0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'region-header' }, { children: region.name })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'region-body' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'region-stats-left' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'stat-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'stat-label' }, { children: "\u8BBE\u5907\u603B\u6570\uFF1A" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'stat-value' }, { children: region.deviceCount }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'stat-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'stat-label' }, { children: "\u5F53\u524D\u8FD0\u884C\u4E2D\uFF1A" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'stat-value running' }, { children: region.runningCount }))] }))] })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'region-action' }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'view-detail-btn', onClick: () => onRegionClick(region.id) }, { children: "\u67E5\u770B\u8BE6\u60C5" })) }))] }))] }), region.id))) })), isLoading && ((0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'loading-tip' }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'small-loading-text' }, { children: "\u6570\u636E\u52A0\u8F7D\u4E2D..." })) }))), !hasMore && !isLoading && regionData.length > 0 && ((0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'loading-complete' }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'small-loading-text' }, { children: "\u5DF2\u5168\u90E8\u52A0\u8F7D" })) })))] })));
}
exports.default = RegionList;
//# sourceMappingURL=RegionList.js.map