import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'

// Lazy load heavy pages for better performance
const Foundation = lazy(() => import('./pages/Foundation'))
const Technologies = lazy(() => import('./pages/Technologies'))

// Loading component for code-split routes
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: 'VT323, monospace',
    fontSize: '1.5rem',
    color: 'var(--neon-cyan)',
    textShadow: '0 0 10px var(--neon-cyan)'
  }}>
    LOADING...
  </div>
)

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route
        path="/foundation"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Foundation />
          </Suspense>
        }
      />
      <Route
        path="/technologies"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Technologies />
          </Suspense>
        }
      />
    </Routes>
  )
}

export default App
