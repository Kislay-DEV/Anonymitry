import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userData || !userData.name) {
        throw new Error('Invalid user data');
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      setError(error.message);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setError(error.message);
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;