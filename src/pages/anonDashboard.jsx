import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

import { Button } from "@/components/ui/button"



export default function AnonDashboard() {
  const [username, setUsername] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [bannerImage, setBannerImage] = useState('');
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const fetchAnonymousUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/dashboard/anonymous');
        setUsername(response.data.username);
        if (response.data.image) {
          setBannerImage(`data:image/jpeg;base64,${response.data.image}`);
          console.log("Good")
        }
      } catch (error) {
        console.error('Error fetching anonymous user data:', error);
      }
    };
    fetchAnonymousUserData();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
        alert('Please select an image to upload');
        return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
        await axiosInstance.post('/api/image/upload/anonymous', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
        alert('Image uploaded successfully');
    } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Error: ${error.response?.data || "Failed to upload image"}`);
    }
};


  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-10">Welcome to Your Dashboard</h1>

      {/* User Details */}
      <div className="mt-8 p-6 flex justify-around bg-gray-800 rounded-lg shadow-lg w-1/3">
        <div className="w-24 h-24 object-contain rounded-full bg-gray-700 flex justify-center items-center">
          {bannerImage ? (
            <img
              src={bannerImage}
              alt="Profile Banner"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <img
              src="/8-512.webp"
              alt="Profile Banner"
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>
        <span className="flex flex-col ml-24 mt-6">
          <p><strong>Username:</strong> {username}</p>
        </span>
      </div>

      {/* Image Upload */}
      <div className="mt-8 p-6 flex justify-between bg-gray-800 rounded-lg shadow-lg w-3/4 md:w-1/2">
        <button
          className="bg-blue-500 px-2 text-sm font-semibold mt-2 py-1 rounded-md border-2 border-slate-700 h-10"
          onClick={() => { setToggle(!toggle); }}
        >
          Upload/Update profile pic
        </button>
        {toggle && (
          <span>
            <h2 className="text-2xl mb-4">Upload Profile Image</h2>
            <form onSubmit={handleImageUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block mb-4"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Upload Image
              </button>
              {/* <Button>helo</Button> */}
            </form>
          </span>
        )}
      </div>
     <Button>Search User</Button>
    </div>
  );
}

