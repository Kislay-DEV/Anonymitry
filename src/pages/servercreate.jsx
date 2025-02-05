import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import axiosInstance from '@/axiosConfig';
import { Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServerForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [serverIcon, setServerIcon] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
     const response = await axiosInstance.post('/api/server', data);
      navigate(`/serverpanel/${response.data.serverId}`)
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-[#313338] w-full max-w-md rounded-md shadow-lg">
        {/* Header */}
        <div className="relative p-4 text-center border-b border-[#3f4147]">
          <h2 className="text-xl font-bold text-white">Create a Server</h2>
          <p className="text-[#B5BAC1] text-sm mt-1">
            Your server is where you and your friends hang out
          </p>
          <button 
            onClick={() => setShowModal(false)}
            className="absolute right-4 top-4 text-[#B5BAC1] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          {/* Server Icon Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-[#1e1f22] flex items-center justify-center group-hover:bg-[#404249] transition-colors">
                {serverIcon ? (
                  <img 
                    src={serverIcon} 
                    alt="Server icon" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-[#B5BAC1] group-hover:text-white" />
                )}
              </div>
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setServerIcon(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>

          {/* Server Name Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#B5BAC1] uppercase mb-2">
              Server Name
            </label>
            <input
              {...register("serverName", {
                required: "Server name is required",
                minLength: {
                  value: 3,
                  message: "Server name must be at least 3 characters"
                }
              })}
              className="w-full px-3 py-2 bg-[#1e1f22] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
              placeholder="Enter server name"
            />
            {errors.serverName && (
              <p className="mt-1 text-[#f23f42] text-xs">
                {errors.serverName.message}
              </p>
            )}
          </div>

          {/* Server IP Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-[#B5BAC1] uppercase mb-2">
              Server IP
            </label>
            <input
              {...register("serverIP", {
                required: "IP address is required",
                // pattern: {
                //   value: /^(\d{1,3}\.){3}\d{1,3}$/,
                //   message: "Please enter a valid IP address"
                // }
              })}
              className="w-full px-3 py-2 bg-[#1e1f22] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865f2]"
              placeholder="xxx.xxx.xxx.xxx"
            />
            {errors.serverIP && (
              <p className="mt-1 text-[#f23f42] text-xs">
                {errors.serverIP.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Server"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServerForm;