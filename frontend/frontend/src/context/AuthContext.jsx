


// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check if user is already logged in on app load
//   useEffect(() => {
//     const validateStoredToken = async () => {
//       const storedToken = localStorage.getItem('token');
//       const storedUser = localStorage.getItem('user');
      
//       if (storedToken && storedUser) {
//         try {
//           // Verify token is still valid with backend
//           const response = await axios.get('http://localhost:5000/api/auth/verify', {
//             headers: {
//               Authorization: `Bearer ${storedToken}`
//             }
//           });

//           // Token is valid, restore session
//           if (response.data.valid) {
//             setToken(storedToken);
//             setUser(JSON.parse(storedUser));
//           }
//         } catch (error) {
//           // Token expired or invalid - clear storage
//           console.log('Token validation failed, logging out:', error.response?.data?.message);
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//         }
//       }
      
//       setLoading(false);
//     };

//     validateStoredToken();
//   }, []);

//   const login = (userData, authToken) => {
//     setUser(userData);
//     setToken(authToken);
//     localStorage.setItem('token', authToken);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   };

//   const isAuthenticated = () => {
//     return !!token && !!user;
//   };

//   const value = {
//     user,
//     token,
//     login,
//     logout,
//     isAuthenticated,
//     loading,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };


import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const validateStoredToken = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Verify token is still valid with backend
          const response = await axios.get('http://localhost:5000/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });

          // Token is valid, restore session
          if (response.data.valid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
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

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // ✅ ADD this function to update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    setUser: updateUser,  // ✅ Export setUser
    token,
    login,
    logout,
    isAuthenticated,
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