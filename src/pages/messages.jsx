import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { ScrollArea } from "@/components/ui/scroll-area"


export default function Messaging() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from the database
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/users');
        setUsers(response.data);
        console.log('Fetched Users:', response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const fetchMessages = async (username) => {
    try {
      const response = await axiosInstance.get(`/api/messages/${username}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchMessages(username);
    }
  }, [username]);

  const handleUserClick = (user) => {
    navigate(`/messages/${user.username}`);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/api/messages/${username}`, { text });
      setMessages(prevMessages => [...prevMessages, response.data]); // Update state safely
      setText(''); // Clear input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Filter users dynamically based on search term
  const filteredUsers = searchTerm
    ? users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  return (
    <div className="flex bg-gray-900 text-white">
      <ScrollArea className="w-[28vw] h-screen border-r border-gray-700 p-4">
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/4 p-2 fixed mb-4 bg-gray-800 border border-gray-700 rounded text-white"
          />
        <ul className="space-y-2">
          {filteredUsers.map(user => (
            <li
            key={user._id}
            onClick={() => handleUserClick(user)}
            className="flex items-center p-2 cursor-pointer hover:bg-gray-700 rounded"
            >
              <img
                src={user.image ? `data:image/jpeg;base64,${user.image}` :('./../../8-512.webp')}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-4"
                />
              <span className="font-bold">{user.username}</span>
            </li>
          ))}
        </ul>
          </ScrollArea>
      <div className="w-2/3 p-4">
        {username ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Chat with {username}</h2>
            <div className="messages space-y-4 overflow-y-auto h-4/5">
              {messages.map((message, index) => (
                <div key={index} className="message p-2 border-b border-gray-700">
                  <strong>{message.sender}</strong>: {message.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded-l text-white"
                placeholder="Type a message"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r">
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
