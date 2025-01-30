import React, { useEffect, useState } from 'react';
import axiosInstance from '@/axiosConfig';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Buffer } from 'buffer';

export default function User() {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/api/user/profile/${userId}`);
        setUser(response.data);
        if (response.isFollowing == true) {
          setIsFollowing(!isFollowing);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, [isFollowing, userId]);

  const handleFollow = async () => {
    try {
      await axiosInstance.put(`/api/user/follow/${userId}`);
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosInstance.put(`/api/user/unfollow/${userId}`);
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-gray-900 text-gray-200 p-8">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={
              user.image
                ? `data:image/jpeg;base64,${Buffer.from(user.image.data).toString('base64')}`
                : '/8-512.webp'
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
          />
          <div>
            <h1 className="text-2xl font-semibold text-white">{user.username}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <div className="text-center">
              <span className="text-xl font-semibold text-white">{user.posts?.length || 0}</span>
              <p className="text-gray-400">Posts</p>
            </div>
            <div className="text-center">
              <span className="text-xl font-semibold text-white">{user.followers?.length || 0}</span>
              <p className="text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <span className="text-xl font-semibold text-white">{user.following?.length || 0}</span>
              <p className="text-gray-400">Following</p>
            </div>
          </div>
          <div>
            {isFollowing ? (
              <Button onClick={handleUnfollow} className="bg-red-500 hover:bg-red-600 text-white">
                Unfollow
              </Button>
            ) : (
              <Button onClick={handleFollow} className="bg-blue-500 hover:bg-blue-600 text-white">
                Follow
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {user.posts?.map((post) => (
            <div key={post._id} className="bg-gray-800 rounded-lg shadow p-4">
              <img
                src={`data:image/jpeg;base64,${Buffer.from(post.image.data).toString('base64')}`}
                alt="Post"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-gray-300 mt-2">{post.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}