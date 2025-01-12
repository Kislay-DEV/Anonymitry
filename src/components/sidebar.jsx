/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from './../axiosConfig';

const Sidebar = (props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingMail, setIsEditingMail] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleEditUsernameForm = () => {
    setIsEditing(!isEditing);
    reset(); // Clear form fields
  };


  const toggleEditEmailForm = () => {
    setIsEditingMail(!isEditingMail);
    reset(); // Clear form fields
  };

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/api/profile/edit/username", { newUsername: data.newUsername });
      console.log('New Username:', response.data);
      alert(`Username updated to: ${data.newUsername}`);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating username:', error.response?.data || error.message);
      // alert('Failed to update username.');
    }
    try {
      const response = await axiosInstance.post("/api/profile/edit/email", { newEmail: data.newEmail });
      console.log('New email:', response.data);
      alert(`email updated to: ${data.newEmail}`);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating email:', error.response?.data || error.message);
      // alert('Failed to update email.');
    }
  };

  return (
    <div className="relative h-screen">
      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
        onClick={toggleSidebar}
      >
        <div className="space-y-1">
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ width: '250px' }}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center mt-8">
          <div className="w-24  h-24 object-contain rounded-full  bg-gray-700 flex justify-center items-center">
            <img
              // eslint-disable-next-line react/prop-types
              src={props.image}  // Replace with user-uploaded image URL
              alt="Profile Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h2 className="mt-4 text-xl font-semibold">{props.username}</h2>
        </div>

        {/* Edit Button */}
        <div className="mt-8">
          <button
            onClick={toggleEditUsernameForm}
            className="block mx-4 px-4 py-2 text-center bg-blue-600 rounded-md hover:bg-blue-500 transition"
          >
            {isEditing ? 'Close Form' : 'Edit Username'}
          </button>
        </div>




        {/* Form */}
        {isEditing && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 px-4 space-y-4"
          >
            <div>
              <label
                htmlFor="newUsername"
                className="block text-sm font-medium text-gray-300"
              >
                New Username
              </label>
              <input
                type="text"
                id="newUsername"
                {...register('newUsername', { required: true })}
                className="mt-1 w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-500 transition"
            >
              Save
            </button>
          </form>
        )}

        <div className="mt-8">
          <button
            onClick={toggleEditEmailForm}
            className="block mx-4 px-4 py-2 text-center bg-blue-600 rounded-md hover:bg-blue-500 transition"
          >
            {isEditingMail ? 'Close Form' : 'Edit UserEmail'}
          </button>
        </div>
        {isEditingMail && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 px-4 space-y-4"
          >
            <div>
              <label
                htmlFor="newEmail"
                className="block text-sm font-medium text-gray-300"
              >
                New Email
              </label>
              <input
                type="text"
                id="newEmail"
                {...register('newEmail', { required: true })}
                className="mt-1 w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-500 transition"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Sidebar;



