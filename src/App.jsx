import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Routes, Route } from 'react-router-dom'
import './App.css'

// Routes
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import Anonymous from './pages/anonymous'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/anonymous' element={<Anonymous/>} />
     </Routes>

    </>
  )
}

export default App
