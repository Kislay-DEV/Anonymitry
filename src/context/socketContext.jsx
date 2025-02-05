import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';
import { useAuthContext } from './authContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuthContext();
  const [socket, setSocket] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  const connectSocket = useCallback(() => {
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server with ID:', newSocket.id);
      setConnectionError(null);
      if (user?.name) {
        newSocket.emit('userLoggedIn', user.name);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionError(error.message);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
      if (reason === 'io server disconnect') {
        connectSocket();
      }
    });

    setSocket(newSocket);
    return newSocket;
  }, [user]);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      if (user?.name) {
        socket.emit('userLoggedOut', user.name);
      }
      socket.disconnect();
      setSocket(null);
    }
  }, [socket, user]);

  useEffect(() => {
    let currentSocket = null;

    if (isAuthenticated && !socket) {
      currentSocket = connectSocket();
    } else if (!isAuthenticated && socket) {
      disconnectSocket();
    }

    return () => {
      if (currentSocket) {
        currentSocket.off('connect');
        currentSocket.off('disconnect');
        currentSocket.off('connect_error');
        currentSocket.disconnect();
      }
    };
  }, [isAuthenticated, socket, connectSocket, disconnectSocket]);

  const value = {
    socket,
    connectionError,
    connectSocket,
    disconnectSocket
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default SocketContext;
