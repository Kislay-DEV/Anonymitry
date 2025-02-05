import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuthContext } from '../context/authContext';
import useSocket from '../context/useSocket';
import { io } from 'socket.io-client';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuthContext();
  const { socket, connectSocket } = useSocket();
  const {Socket ,setSocket} = useState();

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const onSubmit = async (data) => {
    try {

      const response = await axiosInstance.post('/api/login', data);
      console.log('Login successful:', response.data);

      if (!socket) {
        const socketConnection = io('http://localhost:3000', { withCredentials: true });
        // setSocket(socketConnection);

        socketConnection.on('connect', () => {
          console.log('Connected to socket server with ID:', socketConnection.id);
          // Emit userLoggedIn event after successful connection
          socketConnection.emit('userLoggedIn', User.name);
        });

        socketConnection.on('disconnect', () => {
          console.log('Disconnected from socket server');
        });
      } else {
        // If socket already exists, just emit the login event
        socket.emit('userLoggedIn', User.name);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in. Please check your credentials.');
    }
  };

  


  const sendAnonymousData = async () => {
    try {
      const anonymousData = { username: 'Anonymous' };
      const response = await axiosInstance.post('/api/anonymous', anonymousData);
      console.log('Anonymous data sent:', response.data);

      // Log in as anonymous user
      await login({ ...response.data, isAnonymous: true });

      // Socket connection will be handled by SocketProvider
      if (!socket) {
        console.log('Initializing anonymous socket connection...');
        connectSocket();
      }

      navigate('/anonymous/dashboard');
    } catch (error) {
      console.error('Error sending anonymous data:', error);
      alert('Failed to create an anonymous session.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-slate-800 rounded-xl border border-blue-500/20 shadow-xl shadow-blue-500/10 p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Please enter your details</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Input */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                {...register('userId', { required: true })}
                id="userId"
                placeholder="Username / Email"
                className="w-full bg-slate-900/50 text-white rounded-lg pl-10 pr-4 py-3 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-500"
              />
              {errors.userId && 
                <span className="text-red-500 text-sm mt-1">This field is required</span>
              }
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="password"
                id="password"
                {...register('password', { required: true })}
                placeholder="Password"
                className="w-full bg-slate-900/50 text-white rounded-lg pl-10 pr-4 py-3 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-500"
              />
              {errors.password && 
                <span className="text-red-500 text-sm mt-1">This field is required</span>
              }
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-300">
                <input type="checkbox" className="mr-2 rounded border-slate-700 bg-slate-900/50" />
                Remember me
              </label>
              <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center group"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-700"></div>
            <span className="px-4 text-slate-500 text-sm">OR</span>
            <div className="flex-1 border-t border-slate-700"></div>
          </div>

          {/* Anonymous Login Button */}
          <button 
            onClick={sendAnonymousData} 
            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center group"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Continue Anonymously
          </button>

          {/* Register Link */}
          <p className="text-center mt-8 text-slate-400">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-blue-500 hover:text-blue-400 transition-colors">
              Create one now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;