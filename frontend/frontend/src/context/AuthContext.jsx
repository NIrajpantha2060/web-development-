import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: Check if user is already logged in on app load
  useEffect(() => {
    const validateStoredToken = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // ✅ FIX: Fetch fresh user data from server instead of using stale localStorage
          const response = await axios.get('http://localhost:5000/api/user/info', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });

          // Token is valid and we have fresh user data
          setToken(storedToken);
          setUserState(response.data.user);
          
          // ✅ FIX: Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
          // Token expired or invalid - clear storage
          console.log('Token validation failed, logging out:', error.response?.data?.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    validateStoredToken();
  }, []);

  // ✅ CRITICAL FIX: Make login async and return Promise
  const login = async (userData, authToken) => {
    // Save to localStorage first
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update state
    setUserState(userData);
    setToken(authToken);
    
    // ✅ CRITICAL: Return promise that resolves after React processes state update
    return new Promise((resolve) => {
      // Use setTimeout to ensure state update is processed
      setTimeout(() => {
        console.log('✅ Login complete, context updated');
        resolve();
      }, 0);
    });
  };

  const logout = () => {
    setUserState(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // ✅ FIX: Update user data in both state and localStorage
  const updateUser = (userData) => {
    console.log('Updating user data:', userData); // Debug log
    setUserState(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ✅ NEW: Check if user is suspended
  const isSuspended = () => {
    return user?.isSuspended === true;
  };

  const value = {
    user,
    setUser: updateUser,
    token,
    login,
    logout,
    isAuthenticated,
    isSuspended,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};