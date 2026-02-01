



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

// // User API calls
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

//   // Update user info
//   updateInfo: async (userData) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.put(`${API_BASE_URL}/user/update`, userData, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   },

//   // ✅ Upload profile picture
//   uploadProfilePicture: async (file) => {
//     const token = localStorage.getItem('token');
//     const formData = new FormData();
//     formData.append('profilePicture', file);

//     const response = await axios.post(`${API_BASE_URL}/user/upload-profile`, formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   },

//   // ✅ Delete profile picture
//   deleteProfilePicture: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.delete(`${API_BASE_URL}/user/delete-profile`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   }
// };

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

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';
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
  getInfo: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user/info`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateInfo: async (userData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/user/update`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

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

  deleteProfilePicture: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/user/delete-profile`, {
      headers: { Authorization: `Bearer ${token}` }
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

  changePassword: async (data) => {
    const response = await api.put('/password/change', data);
    return response.data;
  },
};

// ✅ NEW: Verification API calls
export const verificationAPI = {
  // Submit verification request
  submitVerification: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/verification/submit`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get verification status
  getStatus: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/verification/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get verification details
  getDetails: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/verification/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// ✅ NEW: Notification API calls
export const notificationAPI = {
  // Get all notifications
  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Mark as read
  markAsRead: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Delete notification
  delete: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// ✅ NEW: Admin API calls
export const adminAPI = {
  // Get pending verifications
  getPendingVerifications: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/admin/verifications/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get all verifications
  getAllVerifications: async (status = null) => {
    const token = localStorage.getItem('token');
    const url = status 
      ? `${API_BASE_URL}/admin/verifications?status=${status}`
      : `${API_BASE_URL}/admin/verifications`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Approve verification
  approveVerification: async (id, approvalType, remarks = '') => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_BASE_URL}/admin/verifications/${id}/approve`,
      { approvalType, remarks },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Reject verification
  rejectVerification: async (id, remarks) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_BASE_URL}/admin/verifications/${id}/reject`,
      { remarks },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};

export default api;