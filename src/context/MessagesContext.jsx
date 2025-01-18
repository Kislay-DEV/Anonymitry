import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import axiosInstance from '@/axiosConfig';
import PropTypes from 'prop-types';
import { useAuthContext } from './AuthContext';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { getAuthToken, user } = useAuthContext();

    const fetchMessages = useCallback(async (username) => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const response = await axiosInstance.get(`/api/messages/${username}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    }, [getAuthToken]);

    const sendMessage = async (receiverId, text) => {
        try {
            const token = getAuthToken();
            const response = await axiosInstance.post(
                `/api/messages/${receiverId}`,
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message');
            throw err;
        }
    };

    // Refresh messages when selected user changes
    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.username);
        }
    }, [selectedUser, fetchMessages]);

    const value = {
        messages,
        selectedUser,
        setSelectedUser,
        loading,
        error,
        sendMessage,
        fetchMessages
    };

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    );
};
MessageProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


// eslint-disable-next-line react-refresh/only-export-components
export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessages must be used within a MessageProvider');
    }
    return context;
};

export default MessageContext;