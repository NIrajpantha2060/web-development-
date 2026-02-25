

// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL
//   ? `${import.meta.env.VITE_API_URL}/api`
//   : 'http://localhost:5000/api';
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
//   getInfo: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_BASE_URL}/user/info`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   updateInfo: async (userData) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.put(`${API_BASE_URL}/user/update`, userData, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

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

//   deleteProfilePicture: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.delete(`${API_BASE_URL}/user/delete-profile`, {
//       headers: { Authorization: `Bearer ${token}` }
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

//   changePassword: async (data) => {
//     const response = await api.put('/password/change', data);
//     return response.data;
//   },
// };

// // ✅ UPDATED: Verification API calls with CORRECT backend endpoints
// export const verificationAPI = {
//   // ✅ Submit citizenship verification (user verification)
//   submitCitizenshipVerification: async (formData) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.post(`${API_BASE_URL}/verification/submit-citizenship`, formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   },

//   // ✅ Submit rider verification (driving license)
//   submitRiderVerification: async (formData) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.post(`${API_BASE_URL}/verification/submit-rider`, formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   },

//   // ✅ Upgrade to rider (for already verified users)
//   upgradeToRider: async (formData) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.post(`${API_BASE_URL}/verification/upgrade-to-rider`, formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   },

//   // ✅ Update verification documents
//   updateVerification: async (formData) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.post(`${API_BASE_URL}/verification/update`, formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   },

//   // Get verification status
//   getStatus: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_BASE_URL}/verification/status`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   // Get verification details
//   getDetails: async (id) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_BASE_URL}/verification/${id}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   }
// };

// // ✅ Notification API calls
// export const notificationAPI = {
//   // Get all notifications
//   getAll: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_BASE_URL}/notifications`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   // Get unread count
//   getUnreadCount: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   // Mark as read
//   markAsRead: async (id) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.put(`${API_BASE_URL}/notifications/${id}/read`, {}, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   // Mark all as read
//   markAllAsRead: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   // Delete notification
//   delete: async (id) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   }
// };

// // ✅ Admin API calls
// export const adminAPI = {
//   // Get pending verifications
//   getPendingVerifications: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_BASE_URL}/admin/verifications/pending`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   // Get all verifications
//   getAllVerifications: async (status = null) => {
//     const token = localStorage.getItem('token');
//     const url = status 
//       ? `${API_BASE_URL}/admin/verifications?status=${status}`
//       : `${API_BASE_URL}/admin/verifications`;
//     const response = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   // Approve verification
//   approveVerification: async (id, approvalType, remarks = '') => {
//     const token = localStorage.getItem('token');
//     const response = await axios.put(
//       `${API_BASE_URL}/admin/verifications/${id}/approve`,
//       { approvalType, remarks },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   },

//   // Reject verification
//   rejectVerification: async (id, remarks) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.put(
//       `${API_BASE_URL}/admin/verifications/${id}/reject`,
//       { remarks },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   },

//   // Delete verification
//   deleteVerification: async (id) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.delete(
//       `${API_BASE_URL}/admin/verifications/${id}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   }
// };

// // ✅ Ride API calls
// export const rideAPI = {
//   // Add new ride
//   addRide: async (formData) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.post(`${API_BASE_URL}/rides`, formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   },

//   // Get my posted rides
//   getMyRides: async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_BASE_URL}/rides/my-rides`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   // Get all active rides (with optional filters)
//   getAllRides: async (filters = {}) => {
//     const token = localStorage.getItem('token');
//     const params = new URLSearchParams();

//     if (filters.vehicleType) params.append('vehicleType', filters.vehicleType);
//     if (filters.from) params.append('from', filters.from);
//     if (filters.to) params.append('to', filters.to);
//     if (filters.date) params.append('date', filters.date);

//     const url = params.toString()
//       ? `${API_BASE_URL}/rides?${params.toString()}`
//       : `${API_BASE_URL}/rides`;

//     const response = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   },

//   // Delete/cancel a ride
//   deleteRide: async (rideId) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.delete(`${API_BASE_URL}/rides/${rideId}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   }
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
  async (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden - User is suspended
    if (error.response?.status === 403 && error.response?.data?.suspended) {
      // Update user data in localStorage with suspension info
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          userData.isSuspended = true;
          userData.suspensionReason = error.response.data.suspensionReason;
          userData.suspendedAt = error.response.data.suspendedAt;
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Reload the page to show suspension screen
          window.location.reload();
        } catch (e) {
          console.error('Error updating user suspension status:', e);
        }
      }
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

// ✅ UPDATED: Verification API calls with CORRECT backend endpoints
export const verificationAPI = {
  // ✅ Submit citizenship verification (user verification)
  submitCitizenshipVerification: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/verification/submit-citizenship`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // ✅ Submit rider verification (driving license)
  submitRiderVerification: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/verification/submit-rider`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // ✅ Upgrade to rider (for already verified users)
  upgradeToRider: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/verification/upgrade-to-rider`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // ✅ Update verification documents
  updateVerification: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/verification/update`, formData, {
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

// ✅ Notification API calls
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

// ✅ Admin API calls
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
  },

  // Delete verification
  deleteVerification: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_BASE_URL}/admin/verifications/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // =====================================================
  // USER MANAGEMENT
  // =====================================================

  // Get all users with report counts
  getAllUsers: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get single user details
  getUserDetails: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Suspend a user
  suspendUser: async (userId, reason) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_BASE_URL}/admin/users/${userId}/suspend`,
      { reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Unsuspend (reactivate) a user
  unsuspendUser: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_BASE_URL}/admin/users/${userId}/unsuspend`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Delete a user
  deleteUser: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_BASE_URL}/admin/users/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // =====================================================
  // RIDE MANAGEMENT
  // =====================================================

  // Get all rides with search/filter
  getAllRides: async (search = '', status = 'all') => {
    const token = localStorage.getItem('token');
    let url = `${API_BASE_URL}/admin/rides?`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (status && status !== 'all') url += `status=${status}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get single ride details with all passengers
  getRideDetails: async (rideId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/admin/rides/${rideId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Cancel a ride
  cancelRide: async (rideId, reason = '') => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_BASE_URL}/admin/rides/${rideId}/cancel`,
      { reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Delete a ride
  deleteRide: async (rideId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_BASE_URL}/admin/rides/${rideId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};

// ✅ Ride API calls
export const rideAPI = {
  // Add new ride
  addRide: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/rides`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Check if user has an active ride
  checkActiveRide: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/rides/check-active`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get my active/upcoming rides (date >= today)
  getMyRides: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/rides/my-rides`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get my ride history (past rides, cancelled, completed)
  getMyRideHistory: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/rides/my-history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get all active rides (with optional filters)
  getAllRides: async (filters = {}) => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();

    if (filters.vehicleType) params.append('vehicleType', filters.vehicleType);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.date) params.append('date', filters.date);

    const url = params.toString()
      ? `${API_BASE_URL}/rides?${params.toString()}`
      : `${API_BASE_URL}/rides`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Delete/cancel a ride
  deleteRide: async (rideId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/rides/${rideId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// ✅ NEW: Vehicle API calls
export const vehicleAPI = {
  // Get vehicle profile
  getVehicleProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/vehicles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Create vehicle profile
  createVehicleProfile: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/vehicles`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Update vehicle profile
  updateVehicleProfile: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/vehicles`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete vehicle profile
  deleteVehicleProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/vehicles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// ✅ NEW: Booking & Payment API calls
export const bookingAPI = {
  // Setup MPIN (first time)
  setupMpin: async (mpin) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/bookings/mpin/setup`, { mpin }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Verify MPIN
  verifyMpin: async (mpin) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/bookings/mpin/verify`, { mpin }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Change MPIN
  changeMpin: async (currentMpin, newMpin) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/bookings/mpin/change`, { currentMpin, newMpin }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Setup payment info (debit card)
  setupPayment: async (cardDetails) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/bookings/payment/setup`, cardDetails, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/bookings/payment/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Apply for ride (book with payment)
  applyForRide: async (rideId, seatsToBook, mpin) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/bookings/apply`, { rideId, seatsToBook, mpin }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get my bookings (as passenger)
  getMyBookings: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/bookings/my-bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // ✅ NEW: Get my ride history (completed/past rides as passenger)
  getMyRideHistory: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/bookings/my-history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // ✅ NEW: Rate a rider (after ride completion)
  rateRider: async (bookingId, rating, review = null) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/bookings/${bookingId}/rate`, { rating, review }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get passengers for my ride (as driver)
  getRidePassengers: async (rideId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/bookings/ride/${rideId}/passengers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

// ✅ NEW: Report API calls
export const reportAPI = {
  // Submit a report against a rider
  submitReport: async (bookingId, issueType, remarks) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/reports/submit`, { bookingId, issueType, remarks }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get user's own reports
  getMyReports: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/reports/my-reports`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // ADMIN: Get all reports
  getAllReports: async (status = null) => {
    const token = localStorage.getItem('token');
    const url = status 
      ? `${API_BASE_URL}/reports/all?status=${status}`
      : `${API_BASE_URL}/reports/all`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // ADMIN: Get pending reports count
  getPendingCount: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/reports/pending-count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // ADMIN: Update report status
  updateReportStatus: async (reportId, status, adminRemarks = '') => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_BASE_URL}/reports/${reportId}/status`,
      { status, adminRemarks },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // ADMIN: Delete a report
  deleteReport: async (reportId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_BASE_URL}/reports/${reportId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};

// ✅ NEW: Issue API calls (for general issues, not reports)
export const issueAPI = {
  // Submit a new issue
  submitIssue: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/issues/submit`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get user's own issues
  getMyIssues: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/issues/my-issues`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get single issue details
  getIssueDetails: async (issueId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/issues/my-issues/${issueId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // ADMIN: Get all issues
  getAllIssues: async (status = null) => {
    const token = localStorage.getItem('token');
    const url = status 
      ? `${API_BASE_URL}/issues/all?status=${status}`
      : `${API_BASE_URL}/issues/all`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // ADMIN: Get open issues count
  getOpenCount: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/issues/open-count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // ADMIN: Get issue details
  getIssueDetailsAdmin: async (issueId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/issues/${issueId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // ADMIN: Update issue status
  updateIssueStatus: async (issueId, status) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_BASE_URL}/issues/${issueId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // ADMIN: Respond to issue
  respondToIssue: async (issueId, response, status = null) => {
    const token = localStorage.getItem('token');
    const resp = await axios.post(
      `${API_BASE_URL}/issues/${issueId}/respond`,
      { response, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return resp.data;
  },

  // ADMIN: Delete an issue
  deleteIssue: async (issueId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_BASE_URL}/issues/${issueId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};

export default api;