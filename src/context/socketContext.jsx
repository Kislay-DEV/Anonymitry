import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children, isAuthenticated, user }) => {
  const [socket, setSocket] = useState(null);

  const connectSocket = useCallback(() => {
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server with ID:', newSocket.id);
      if (user?.name) {
        newSocket.emit('userLoggedIn', user.name);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    setSocket(newSocket);
    return newSocket;
  }, [user]);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [socket]);

  useEffect(() => {
    if (isAuthenticated && !socket) {
      connectSocket();
    } else if (!isAuthenticated && socket) {
      disconnectSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated, socket, connectSocket, disconnectSocket]);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string
  })
};

export default SocketContext;
