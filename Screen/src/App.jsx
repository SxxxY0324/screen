import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import api from './api'

function App() {
  const [count, setCount] = useState(0)
  const [apiResponse, setApiResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const testApiConnection = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/test')
      setApiResponse(response)
    } catch (err) {
      setError('API连接失败: ' + (err.message || '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      
      <div className="card">
        <h2>前后端联调测试</h2>
        <button onClick={testApiConnection} disabled={loading}>
          {loading ? '请求中...' : '测试API连接'}
        </button>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {apiResponse && (
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <h3>API响应:</h3>
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
