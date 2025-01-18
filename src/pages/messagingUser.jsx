import React, { useState, useRef, useEffect } from 'react';
import { useMessages } from '../context/MessagesContext';
import { useAuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const ChatComponent = () => {
    const { username } = useParams();
    const [newMessage, setNewMessage] = useState('');
    const { messages, selectedUser, setSelectedUser, sendMessage, loading, fetchMessages, fetchUserByUsername } = useMessages();
    const { user } = useAuthContext();
    const messagesEndRef = useRef(null);

    console.log("Current params:", username); // Debug log
    console.log("Current selected user:", selectedUser); // Debug log
    console.log("Current messages:", messages); // Debug log

    useEffect(() => {
        const initializeChat = async () => {
            if (username) {
                const userData = await fetchUserByUsername(username);
                if (userData) {
                    setSelectedUser(userData);
                    await fetchMessages(username);
                }
            }
        };

        initializeChat();
    }, [fetchMessages, fetchUserByUsername, selectedUser, setSelectedUser, username]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage(username, newMessage.trim());
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    // Add loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading chat...</p>
            </div>
        );
    }

    // Add error state if no user is found
    if (!username) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Could not find user: {username}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-white border-b p-4">
                <h2 className="text-lg font-semibold">
                    {username}
                </h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`mb-4 flex ${message.senderId === user?._id ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.senderId === user?._id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200'
                                }`}
                        >
                            <p>{message.text}</p>
                            <span className="text-xs opacity-70">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSend} className="border-t p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg border p-2 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatComponent;