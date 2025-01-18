import React from 'react';
import  useSocket  from '@/context/useSocket';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { io } from 'socket.io-client';
import { User, Lock, ArrowRight, UserPlus, Mail } from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setSocket } = useSocket();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/api/register', data); // Make API call
      if (response.status === 201) { // Check for successful status code
        // Connect to the Socket.IO server
        const socketConnection = io('http://localhost:3000', { withCredentials: true });
        setSocket(socketConnection);
        console.log("Connected to socket server")

        navigate('/dashboard'); // Redirect to dashboard
      } else {
        console.error('Failed to register:', response.data);
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      {/* Main Register Card */}
      <div className="bg-slate-800 rounded-xl border border-blue-500/20 shadow-xl shadow-blue-500/10 p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-slate-400">Fill in the details below to register</p>
        </div>
  
        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Input */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              id="username"
              {...register('username', { required: true })}
              placeholder="Username"
              className="w-full bg-slate-900/50 text-white rounded-lg pl-10 pr-4 py-3 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-500"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">Username is required</span>
            )}
          </div>
  
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="email"
              id="email"
              {...register('email', { required: true })}
              placeholder="Email"
              className="w-full bg-slate-900/50 text-white rounded-lg pl-10 pr-4 py-3 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">Email is required</span>
            )}
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
            {errors.password && (
              <span className="text-red-500 text-sm">Password is required</span>
            )}
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center group"
          >
            Register
          </button>
        </form>
  
        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-slate-700"></div>
          <span className="px-4 text-slate-500 text-sm">OR</span>
          <div className="flex-1 border-t border-slate-700"></div>
        </div>
  
        {/* Redirect to Login */}
        <p className="text-center mt-8 text-slate-400">
          Already have an account?{' '}
          <a href="/" className="text-blue-500 hover:text-blue-400 transition-colors">
            Login here
          </a>
        </p>
      </div>
    </div>
  </div>
  

  );
}

export default Register;
