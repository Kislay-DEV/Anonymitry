import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

export default function AnonDashboard() {
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const [bannerImage, setBannerImage] = useState('');

  useEffect(() => {
    const fetchAnonymousUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/anonymous');
        setUsername(response.data.username);
        if (response.data.image) {
          setBannerImage(`data:image/jpeg;base64,${response.data.image}`);
        }
      } catch (error) {
        console.error('Error fetching anonymous user data:', error);
      }
    };
    fetchAnonymousUserData();
  }, []);

  const handleImageUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('username', username);

    try {
      const response = await axiosInstance.post('/api/image/upload/anonymous', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Image uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <h1>Anonymous Dashboard</h1>
      <p>Username: {username}</p>
      {bannerImage && <img src={bannerImage} alt="Banner" />}
      <form onSubmit={handleImageUpload}>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
}