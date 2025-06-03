"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const components_1 = require("@tarojs/components");
function CustomerList({ initialCustomers, onCustomerClick }) {
    // 分页与加载状态 - 客户列表
    const [customers, setCustomers] = (0, react_1.useState)([]);
    const [allCustomerData, setAllCustomerData] = (0, react_1.useState)([]);
    const [customerPageSize] = (0, react_1.useState)(6); // 客户列表每页6条数据
    const [customerCurrentPage, setCustomerCurrentPage] = (0, react_1.useState)(1);
    const [customerLoading, setCustomerLoading] = (0, react_1.useState)(false);
    const [customerRefreshing, setCustomerRefreshing] = (0, react_1.useState)(false);
    const [customerHasMore, setCustomerHasMore] = (0, react_1.useState)(true);
    // 初始化数据
    (0, react_1.useEffect)(() => {
        setAllCustomerData(initialCustomers);
        const firstPageData = initialCustomers.slice(0, customerPageSize);
        setCustomers(firstPageData);
        setCustomerCurrentPage(1);
        setCustomerHasMore(initialCustomers.length > customerPageSize);
    }, [initialCustomers, customerPageSize]);
    // 客户列表刷新数据
    const handleCustomerRefresh = () => {
        if (customerRefreshing)
            return;
        setCustomerRefreshing(true);
        // 模拟异步请求
        setTimeout(() => {
            // 只加载第一页数据
            const initialCustomers = allCustomerData.slice(0, customerPageSize);
            setCustomers(initialCustomers);
            setCustomerCurrentPage(1);
            setCustomerHasMore(allCustomerData.length > customerPageSize);
            setCustomerRefreshing(false);
        }, 1000);
    };
    // 客户列表加载更多
    const handleCustomerLoadMore = () => {
        if (customerLoading || !customerHasMore)
            return;
        setCustomerLoading(true);
        // 计算下一页数据
        const nextPage = customerCurrentPage + 1;
        const startIndex = (nextPage - 1) * customerPageSize;
        const endIndex = nextPage * customerPageSize;
        // 模拟异步请求
        setTimeout(() => {
            // 获取下一页数据
            const newData = allCustomerData.slice(startIndex, endIndex);
            if (newData.length > 0) {
                // 更新数据和页码
                setCustomers([...customers, ...newData]);
                setCustomerCurrentPage(nextPage);
                // 判断是否还有更多数据
                setCustomerHasMore(endIndex < allCustomerData.length);
            }
            else {
                setCustomerHasMore(false);
            }
            setCustomerLoading(false);
        }, 1000);
    };
    // 处理客户列表滚动到底部事件
    const handleCustomerScrollToLower = () => {
        if (customerHasMore && !customerLoading) {
            handleCustomerLoadMore();
        }
    };
    return ((0, jsx_runtime_1.jsxs)(components_1.ScrollView, Object.assign({ className: 'scrollable-customers', scrollY: true, scrollTop: 0, refresherEnabled: true, refresherTriggered: customerRefreshing, onRefresherRefresh: handleCustomerRefresh, onScrollToLower: handleCustomerScrollToLower, lowerThreshold: 20 }, { children: [(0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'customer-list-container' }, { children: customers.map(customer => ((0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'customer-card' }, { children: [(0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'customer-name' }, { children: customer.name })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'customer-body' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'customer-info' }, { children: [(0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'info-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'info-label' }, { children: "\u7535\u8BDD\uFF1A" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'info-value' }, { children: customer.phone }))] })), (0, jsx_runtime_1.jsxs)(components_1.View, Object.assign({ className: 'info-row' }, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'info-label' }, { children: "\u5730\u5740\uFF1A" })), (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'info-value' }, { children: customer.address }))] }))] })), (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'customer-action' }, { children: (0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'view-detail-btn', onClick: () => onCustomerClick(customer.id) }, { children: "\u67E5\u770B\u8BE6\u60C5" })) }))] }))] }), customer.id))) })), customerLoading && ((0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'loading-tip' }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'small-loading-text' }, { children: "\u6570\u636E\u52A0\u8F7D\u4E2D..." })) }))), !customerHasMore && !customerLoading && customers.length > 0 && ((0, jsx_runtime_1.jsx)(components_1.View, Object.assign({ className: 'loading-complete' }, { children: (0, jsx_runtime_1.jsx)(components_1.Text, Object.assign({ className: 'small-loading-text' }, { children: "\u5DF2\u5168\u90E8\u52A0\u8F7D" })) })))] })));
}
exports.default = CustomerList;
//# sourceMappingURL=CustomerList.js.map