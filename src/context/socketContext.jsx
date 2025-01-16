import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children, isAuthenticated }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io('http://localhost:5173', {
        withCredentials: true,
      });
      setSocket(newSocket);

      // Cleanup on component unmount or logout
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default SocketContext;
