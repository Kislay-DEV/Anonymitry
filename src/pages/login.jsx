import React from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../axiosConfig';
import {useNavigate} from "react-router-dom"

function Login() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(`/api/login`, data); // Use /api/login
      console.log(response.data);
      navigate('/dashboard')
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const sendAnonymousData = async () => {
    try {
      const anonymousData = {
        username: 'Anonymous'
      };
      const response = await axiosInstance.post('/api/anonymous', anonymousData);
      console.log('Anonymous data sent:', response.data);
      console.log('Received userid:', response.data.userid);
    } catch (error) {
      console.error('Error sending anonymous data:', error);
    }
  };

  return (
    <div className="bg-slate-600 flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 rounded-2xl border-blue-500 border-4 space-y-2 i h-96 w-72">
        <span className="text-3xl font-semibold text-blue-700 my-8 ml-24 inline-block">LOGIN</span>
        <form className="flex justify-center items-center flex-col" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="mt-6 px-2 py-1 bg-transparent border-2 border-blue-600 rounded-md my-2 mx-4 text-white"
            type="text"
            name="username"
            placeholder="Username"
            {...register('username', { required: true })}
          />
          {errors.username && <span className="text-red-500">Username is required</span>}
          <input
            className="px-2 py-1 bg-transparent border-2 border-blue-600 rounded-md my-2 mx-4 text-white"
            type="password"
            name="password"
            placeholder="Password"
            {...register('password', { required: true })}
          />
          {errors.password && <span className="text-red-500">Password is required</span>}
          <input
            className="bg-blue-500 relative cursor-pointer font-semibold rounded-md px-14 py-1 my-6 text-white"
            type="submit"
            value="Login"
          />
        </form>
        <p className="block mt-16 ml-7 text-white relative -bottom-3">Don&apos;t have an account? <a className="text-blue-500" href="/register">Register</a></p>
      </div>
      <button onClick={sendAnonymousData}
       className=' text-white text-lg flex space-x-3  px-5 py-2 ml-10 font-semibold bg-slate-800 border-2 border-blue-500 rounded-lg shadow-lg'><img src="/8-512.webp" className='w-7 h-7 mr-2 rounded-full ' alt="" /> Create Anonymous</button>
    </div>
  );
}

export default Login;