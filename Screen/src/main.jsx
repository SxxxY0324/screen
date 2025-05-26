import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import store from './store'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  // 暂时注释掉StrictMode以减少开发环境中的重复调用和日志
  // <StrictMode>
    <ErrorBoundary showDetails={process.env.NODE_ENV !== 'production'}>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  // </StrictMode>,
)
