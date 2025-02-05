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
import MessagingUser from './pages/messagingUser'
import Feed from './pages/feed'
import Post from './pages/post'
import Comment from './pages/comment'
import User from './pages/user'
import Server from './pages/servercreate'
import Serverlist from './pages/serverListing'
import Serverjoin from './pages/serverjoin'
import ServerPanel from './pages/serverPanel'
import { AuthProvider } from './context/AuthContext'

function App() {
  const [userId, setUserId] = useState(null);
  const isAuthenticated = !!userId; // Determine authentication status

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/user');
        setUserId(response.data._id); // Now expects a single user object
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <AuthProvider>

    <SocketProvider isAuthenticated={isAuthenticated}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/anonymous/dashboard" element={<AnonDashboard />} />
        <Route path="/messages" element={<Messaging userId={userId} />} />
        <Route path="/messages/:username" element={<MessagingUser />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/comment/:postId" element={<Comment />} />
        <Route path="/user/profile/:userId" element={<User />} />
        <Route path="/server" element={<Server />} />
        <Route path="/serverlisting" element={<Serverlist />} />
        <Route path="/server/:serverId" element={<Serverjoin />} />
        <Route path="/serverpanel/:serverId" element={<ServerPanel />} />
        
        
      </Routes>
    </SocketProvider>
    </AuthProvider>
  );
}

export default App;
