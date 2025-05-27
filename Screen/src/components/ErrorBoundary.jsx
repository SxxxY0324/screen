import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // 发生错误时更新状态
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary捕获到错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 自定义错误显示
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          border: '1px solid #f44336',
          borderRadius: '4px',
          color: '#f44336'
        }}>
          <h2>出错了</h2>
          <p>应用遇到了问题，请尝试刷新页面或联系支持团队。</p>
          {this.props.showDetails && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
              <summary>错误详情</summary>
              <p>{this.state.error && this.state.error.toString()}</p>
              <p>组件栈:</p>
              <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
            </details>
          )}
          {this.props.fallback}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary; 