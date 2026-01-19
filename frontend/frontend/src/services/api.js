


// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests if it exists
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Handle response errors globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid - logout user
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth API calls
// export const authAPI = {
//   signup: async (userData) => {
//     const response = await api.post('/auth/signup', userData);
//     return response.data;
//   },
  
//   login: async (credentials) => {
//     const response = await api.post('/auth/login', credentials);
//     return response.data;
//   },
// };

// // user API calls
// export const userAPI = {
//   // Get user info
//   getInfo: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_BASE_URL}/user/info`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   },

//   updateInfo: async (userData) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.put(`${API_BASE_URL}/user/update`, userData, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   }
// }

// // Password API calls
// export const passwordAPI = {
//   forgotPassword: async (data) => {
//     const response = await api.post('/password/forgot', data);
//     return response.data;
//   },
  
//   resetPassword: async (data) => {
//     const response = await api.post('/password/reset', data);
//     return response.data;
//   },
// };

// export default api;


import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// User API calls
export const userAPI = {
  // Get user info
  getInfo: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/info`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Update user info
  updateInfo: async (userData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/user/update`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // ✅ Upload profile picture
  uploadProfilePicture: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await axios.post(`${API_BASE_URL}/user/upload-profile`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // ✅ Delete profile picture
  deleteProfilePicture: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/user/delete-profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

// Password API calls
export const passwordAPI = {
  forgotPassword: async (data) => {
    const response = await api.post('/password/forgot', data);
    return response.data;
  },
  
  resetPassword: async (data) => {
    const response = await api.post('/password/reset', data);
    return response.data;
  },
};

export default api;