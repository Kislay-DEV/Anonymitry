import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { Buffer } from 'buffer';
import { Search } from 'lucide-react';

export default function Messaging() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from the database
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/user');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    navigate('/user/profile/' + user.username);
  };

  const filteredUsers = searchTerm
    ? users.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    : users;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
  <div className="w-full max-w-lg">
    {/* Main Search Card */}
    <div className="bg-slate-800 rounded-xl border border-blue-500/20 shadow-xl shadow-blue-500/10 p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Search Users</h2>
        <p className="text-slate-400">Find and select users to chat with</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/50 text-white rounded-lg pl-10 pr-4 py-3 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-500"
        />
      </div>

      {/* User List */}
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 max-h-72 overflow-y-auto custom-scrollbar">
        <ul className="space-y-4">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              onClick={() => handleUserClick(user)}
              className="flex items-center p-3 cursor-pointer hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <img
                src={
                  user.image
                    ? `data:image/jpeg;base64,${Buffer.from(user.image.data).toString('base64')}`
                    : './../../8-512.webp'
                }
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-slate-600"
              />
              <span className="text-white font-medium">{user.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>

  {/* Scrollbar Styles */}
  <style>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(45deg, #3b82f6, #1e40af);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #1f2937;
      border-radius: 4px;
    }
  `}</style>
</div>


  );
}