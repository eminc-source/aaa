import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Foundation from './pages/Foundation'
import Technologies from './pages/Technologies'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/foundation" element={<Foundation />} />
      <Route path="/technologies" element={<Technologies />} />
    </Routes>
  )
}

export default App
