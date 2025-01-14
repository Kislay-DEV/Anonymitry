import { useState, useEffect } from 'react'
import axiosInstance from './axiosConfig'
import { Routes, Route } from 'react-router-dom'
import { SocketProvider } from './context/socketContext'
import './App.css'

// Routes
import Login from "./pages/login"
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import Messaging from './pages/messages'
import AnonDashboard from "./pages/anonDashboard"

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch user data and set userId
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/user');
        setUserId(response.data._id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/anonymous/dashboard" element={<AnonDashboard />} />
        <Route path="/messages" element={<Messaging userId={userId} />} />
      </Routes>
    </SocketProvider>

    </>
  )
}

export default App
