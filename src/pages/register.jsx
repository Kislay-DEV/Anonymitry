import React from 'react';
import  useSocket  from '@/context/useSocket';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { io } from 'socket.io-client';

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
    <div className="bg-slate-600 flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 rounded-2xl border-blue-500 border-4 space-y-1 p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-semibold text-blue-700 mt-5 mb-9 text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center flex-col">
          <div className="mb-4 w-full">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
            <input
              type="text"
              id="username"
              {...register('username', { required: true })}
              className="mt-1 block w-full px-3 py-2 bg-transparent border-2 border-blue-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.username && <span className="text-red-500 text-sm">Username is required</span>}
          </div>
          <div className="mb-4 w-full">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', { required: true })}
              className="mt-1 block w-full px-3 py-2 bg-transparent border-2 border-blue-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
          </div>
          <div className="mb-4 w-full">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', { required: true })}
              className="mt-1 block w-full px-3 py-2 bg-transparent border-2 border-blue-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
          </div>
          <button type="submit" className="mt-4 px-24 py-2 mb-3 bg-blue-600 text-white rounded-md">Register</button>
        </form>
        <p className="block mt-16 ml-[78px] text-white relative -bottom-1">Already have an account? <a className="text-blue-500" href="/login">login</a></p>
      </div>
    </div>
  );
}

export default Register;
