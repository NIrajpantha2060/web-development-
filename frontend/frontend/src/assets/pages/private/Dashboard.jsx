// import { useState, useEffect } from 'react';
// import { FiEye, FiEyeOff } from 'react-icons/fi';
// import RideCard from '../../components/RideCard';
// import ProfileDropdown from '../../components/ProfileDropdown';
// import { useAuth } from '../../../context/AuthContext';
// import { userAPI, verificationAPI, passwordAPI, rideAPI } from '../../../services/api';
// import '../../css/Dashboard.css';

// // ===================================================================
// // HELPER COMPONENTS - Upload Profile, Change Password, Verify, AddRide
// // ===================================================================

// // ✅ Delete Ride Confirmation Modal Component
// const DeleteRideModal = ({ isOpen, onClose, onConfirm, ride }) => {
//   if (!isOpen || !ride) return null;

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h3>Cancel Ride</h3>
//           <button className="modal-close" onClick={onClose}>×</button>
//         </div>
//         <div className="modal-body">
//           <p>Are you sure you want to cancel this ride?</p>
//           <div className="ride-summary">
//             <p><strong>From:</strong> {ride.from}</p>
//             <p><strong>To:</strong> {ride.to}</p>
//             <p><strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}</p>
//             <p><strong>Time:</strong> {ride.time}</p>
//           </div>
//           <p className="warning-text">This action cannot be undone. The ride will be marked as cancelled.</p>
//         </div>
//         <div className="modal-footer">
//           <button className="btn-secondary" onClick={onClose}>Keep Ride</button>
//           <button className="btn-danger" onClick={onConfirm}>Cancel Ride</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ✅ Upload Profile Page Component
// const UploadProfilePage = () => {
//   const { user, setUser } = useAuth();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const getProfilePictureUrl = () => {
//     if (user?.profilePicture) {
//       return `http://localhost:5000${user.profilePicture}?t=${Date.now()}`;
//     }
//     return null;
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         setMessage({ type: 'error', text: 'File size must be less than 5MB' });
//         return;
//       }

//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//       setMessage({ type: '', text: '' });
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setMessage({ type: 'error', text: 'Please select a file first' });
//       return;
//     }

//     setUploading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       await userAPI.uploadProfilePicture(selectedFile);
      
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       const updatedUserData = await userAPI.getInfo();
//       console.log('📸 Profile picture updated:', updatedUserData.user.profilePicture);
      
//       setUser(updatedUserData.user);

//       setMessage({ type: 'success', text: 'Profile picture uploaded successfully!' });
//       setSelectedFile(null);
//       setPreviewUrl(null);
      
//       const fileInputs = document.querySelectorAll('input[type="file"]');
//       fileInputs.forEach(input => input.value = '');
      
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     } catch (error) {
//       console.error('Upload error:', error);
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.message || 'Failed to upload profile picture'
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!user?.profilePicture) return;

//     if (!window.confirm('Are you sure you want to delete your profile picture?')) {
//       return;
//     }

//     setUploading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       await userAPI.deleteProfilePicture();
      
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       const updatedUserData = await userAPI.getInfo();
//       console.log('🗑️ Profile picture deleted');
      
//       setUser(updatedUserData.user);

//       setMessage({ type: 'success', text: 'Profile picture deleted successfully!' });
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     } catch (error) {
//       console.error('Delete error:', error);
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.message || 'Failed to delete profile picture'
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const getInitials = (name) => {
//     return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
//   };

//   return (
//     <div className="upload-profile-page">
//       <div className="page-header">
//         <h1>Upload Profile Picture</h1>
//         <p>Add or update your profile picture</p>
//       </div>

//       {message.text && (
//         <div className={`update-message ${message.type}`}>
//           {message.text}
//         </div>
//       )}

//       <div className="form-container">
//         <div className="profile-preview-section">
//           <div className="current-profile">
//             <h3>Current Profile Picture</h3>
//             <div className="profile-picture-display">
//               {getProfilePictureUrl() ? (
//                 <img src={getProfilePictureUrl()} alt="Profile" className="profile-img" />
//               ) : (
//                 <div className="profile-avatar-large">
//                   {getInitials(user?.username)}
//                 </div>
//               )}
//             </div>
//             {user?.profilePicture && (
//               <button 
//                 className="btn-delete" 
//                 onClick={handleDelete}
//                 disabled={uploading}
//               >
//                 Delete Current Picture
//               </button>
//             )}
//           </div>

//           {(previewUrl || selectedFile) && (
//             <div className="preview-section">
//               <h3>Preview</h3>
//               <div className="profile-picture-display">
//                 <img src={previewUrl} alt="Preview" className="profile-img" />
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="upload-section">
//           <div className="form-group">
//             <label>Select New Photo</label>
//             <input 
//               type="file" 
//               className="form-input" 
//               accept="image/*"
//               onChange={handleFileSelect}
//               disabled={uploading}
//             />
//             <small className="form-help">
//               Accepted formats: JPEG, PNG, GIF, WEBP (Max size: 5MB)
//             </small>
//           </div>

//           <button 
//             className="btn-submit" 
//             onClick={handleUpload}
//             disabled={!selectedFile || uploading}
//           >
//             {uploading ? 'Uploading...' : 'Upload Photo'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ✅ Change Password Page Component
// const ChangePasswordPage = () => {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState({
//     current: false,
//     new: false,
//     confirm: false
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }

//     if (message.text) {
//       setMessage({ type: '', text: '' });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.currentPassword) {
//       newErrors.currentPassword = 'Current password is required';
//     }

//     if (!formData.newPassword) {
//       newErrors.newPassword = 'New password is required';
//     } else if (formData.newPassword.length < 8) {
//       newErrors.newPassword = 'Password must be at least 8 characters long';
//     } else if (!/[A-Z]/.test(formData.newPassword)) {
//       newErrors.newPassword = 'Password must contain at least one capital letter';
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your new password';
//     } else if (formData.newPassword !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const response = await passwordAPI.changePassword({
//         currentPassword: formData.currentPassword,
//         newPassword: formData.newPassword,
//         confirmPassword: formData.confirmPassword
//       });

//       setMessage({ type: 'success', text: response.message });
//       setFormData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//     } catch (error) {
//       console.error('Change password error:', error);
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.message || 'Failed to change password. Please try again.'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="change-password-page">
//       <div className="page-header">
//         <h1>Change Password</h1>
//         <p>Update your account password</p>
//       </div>

//       {message.text && (
//         <div className={`update-message ${message.type}`}>
//           {message.text}
//         </div>
//       )}

//       <form className="form-container" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Current Password *</label>
//           <div className="password-input-wrapper">
//             <input
//               type={showPassword.current ? "text" : "password"}
//               name="currentPassword"
//               className={`form-input ${errors.currentPassword ? 'input-error' : ''}`}
//               value={formData.currentPassword}
//               onChange={handleChange}
//               placeholder="Enter your current password"
//               disabled={loading}
//             />
//             <button
//               type="button"
//               className="password-toggle-icon"
//               onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
//               disabled={loading}
//               aria-label={showPassword.current ? "Hide password" : "Show password"}
//             >
//               {showPassword.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//             </button>
//           </div>
//           {errors.currentPassword && (
//             <span className="error-text">{errors.currentPassword}</span>
//           )}
//         </div>

//         <div className="form-group">
//           <label>New Password *</label>
//           <div className="password-input-wrapper">
//             <input
//               type={showPassword.new ? "text" : "password"}
//               name="newPassword"
//               className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
//               value={formData.newPassword}
//               onChange={handleChange}
//               placeholder="Enter new password (min 8 characters, 1 capital letter)"
//               disabled={loading}
//             />
//             <button
//               type="button"
//               className="password-toggle-icon"
//               onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
//               disabled={loading}
//               aria-label={showPassword.new ? "Hide password" : "Show password"}
//             >
//               {showPassword.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//             </button>
//           </div>
//           {errors.newPassword && (
//             <span className="error-text">{errors.newPassword}</span>
//           )}
//         </div>

//         <div className="form-group">
//           <label>Confirm New Password *</label>
//           <div className="password-input-wrapper">
//             <input
//               type={showPassword.confirm ? "text" : "password"}
//               name="confirmPassword"
//               className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="Re-enter your new password"
//               disabled={loading}
//             />
//             <button
//               type="button"
//               className="password-toggle-icon"
//               onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
//               disabled={loading}
//               aria-label={showPassword.confirm ? "Hide password" : "Show password"}
//             >
//               {showPassword.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//             </button>
//           </div>
//           {errors.confirmPassword && (
//             <span className="error-text">{errors.confirmPassword}</span>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="btn-submit"
//           disabled={loading}
//         >
//           {loading ? 'Changing Password...' : 'Change Password'}
//         </button>
//       </form>
//     </div>
//   );
// };


// // ✅ Verify Yourself Page Component
// const VerifyYourselfPage = () => {
//   const { user, setUser } = useAuth();
//   const [verificationStatus, setVerificationStatus] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [activeTab, setActiveTab] = useState('citizenship');
  
//   const [citizenshipForm, setCitizenshipForm] = useState({
//     citizenshipNumber: ''
//   });
//   const [citizenshipFiles, setCitizenshipFiles] = useState({
//     front: null,
//     back: null
//   });
//   const [citizenshipPreviews, setCitizenshipPreviews] = useState({
//     front: null,
//     back: null
//   });

//   const [riderForm, setRiderForm] = useState({
//     licenseNumber: '',
//     expiryDate: ''
//   });
//   const [riderFiles, setRiderFiles] = useState({
//     front: null,
//     back: null
//   });
//   const [riderPreviews, setRiderPreviews] = useState({
//     front: null,
//     back: null
//   });

//   useEffect(() => {
//     fetchVerificationStatus();
//   }, []);

//   const fetchVerificationStatus = async () => {
//     try {
//       const data = await verificationAPI.getStatus();
//       setVerificationStatus(data);
      
//       if (!data.isVerifiedUser) {
//         setActiveTab('citizenship');
//       } else if (!data.isVerifiedRider) {
//         setActiveTab('rider');
//       }
//     } catch (error) {
//       console.error('Error fetching verification status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e, type, side) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
//     if (!validTypes.includes(file.type)) {
//       setMessage({ type: 'error', text: 'Please select a valid file (JPEG, PNG, PDF)' });
//       return;
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       setMessage({ type: 'error', text: 'File size must be less than 10MB' });
//       return;
//     }

//     if (type === 'citizenship') {
//       setCitizenshipFiles(prev => ({ ...prev, [side]: file }));
//       if (file.type.startsWith('image/')) {
//         setCitizenshipPreviews(prev => ({ ...prev, [side]: URL.createObjectURL(file) }));
//       }
//     } else {
//       setRiderFiles(prev => ({ ...prev, [side]: file }));
//       if (file.type.startsWith('image/')) {
//         setRiderPreviews(prev => ({ ...prev, [side]: URL.createObjectURL(file) }));
//       }
//     }
    
//     setMessage({ type: '', text: '' });
//   };

//   const handleSubmitCitizenship = async (e) => {
//     e.preventDefault();
    
//     if (!citizenshipFiles.front || !citizenshipFiles.back) {
//       setMessage({ type: 'error', text: 'Please upload both sides of your citizenship' });
//       return;
//     }

//     setSubmitting(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const formData = new FormData();
//       formData.append('citizenshipNumber', citizenshipForm.citizenshipNumber);
//       formData.append('citizenshipFront', citizenshipFiles.front);
//       formData.append('citizenshipBack', citizenshipFiles.back);

//       console.log('📤 Submitting citizenship verification...');
      
//       const response = await verificationAPI.submitCitizenshipVerification(formData);
      
//       console.log('✅ Citizenship verification submitted:', response);
      
//       setMessage({ type: 'success', text: 'Citizenship verification submitted successfully! ✅' });
      
//       setCitizenshipForm({ citizenshipNumber: '' });
//       setCitizenshipFiles({ front: null, back: null });
//       setCitizenshipPreviews({ front: null, back: null });
      
//       const fileInputs = document.querySelectorAll('input[type="file"]');
//       fileInputs.forEach(input => input.value = '');
      
//       setTimeout(async () => {
//         await fetchVerificationStatus();
//       }, 1000);
      
//     } catch (error) {
//       console.error('❌ Citizenship verification error:', error);
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.message || 'Failed to submit citizenship verification'
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleSubmitRider = async (e) => {
//     e.preventDefault();
    
//     if (!riderFiles.front) {
//       setMessage({ type: 'error', text: 'Please upload at least the front of your driving license' });
//       return;
//     }

//     setSubmitting(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const formData = new FormData();
//       formData.append('drivingLicenseNumber', riderForm.licenseNumber);
//       formData.append('licenseExpiryDate', riderForm.expiryDate);
//       formData.append('drivingLicenseFront', riderFiles.front);
//       if (riderFiles.back) {
//         formData.append('drivingLicenseBack', riderFiles.back);
//       }

//       console.log('📤 Submitting rider verification...');
      
//       let response;
//       if (verificationStatus?.isVerifiedUser) {
//         response = await verificationAPI.upgradeToRider(formData);
//         console.log('✅ Rider upgrade submitted:', response);
//         setMessage({ type: 'success', text: 'Rider upgrade request submitted successfully! ✅' });
//       } else {
//         response = await verificationAPI.submitRiderVerification(formData);
//         console.log('✅ Rider verification submitted:', response);
//         setMessage({ type: 'success', text: 'Rider verification submitted successfully! ✅' });
//       }
      
//       setRiderForm({ licenseNumber: '', expiryDate: '' });
//       setRiderFiles({ front: null, back: null });
//       setRiderPreviews({ front: null, back: null });
      
//       const fileInputs = document.querySelectorAll('input[type="file"]');
//       fileInputs.forEach(input => input.value = '');
      
//       setTimeout(async () => {
//         await fetchVerificationStatus();
//       }, 1000);
      
//     } catch (error) {
//       console.error('❌ Rider verification error:', error);
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.message || 'Failed to submit rider verification'
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="verify-page">
//         <div className="loading-state">Loading...</div>
//       </div>
//     );
//   }

//   const isPending = verificationStatus?.verification?.status === 'pending';
//   const isRejected = verificationStatus?.verification?.status === 'rejected';
//   const isVerifiedUser = verificationStatus?.isVerifiedUser;
//   const isVerifiedRider = verificationStatus?.isVerifiedRider;

//   return (
//     <div className="verify-page">
//       <div className="page-header">
//         <h1>{isVerifiedUser || isVerifiedRider ? 'Update Verification' : 'Verify Yourself'}</h1>
//         <p>Upload your identity documents for verification</p>
        
//         <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
//           {isVerifiedRider ? (
//             <span className="badge badge-purple" style={{ backgroundColor: '#3b82f6' }}>Verified Rider</span>
//           ) : isVerifiedUser ? (
//             <span className="badge badge-green">Verified User</span>
//           ) : (
//             <span className="badge badge-gray">⚠ Unverified</span>
//           )}
//         </div>
//       </div>

//       {message.text && (
//         <div className={`update-message ${message.type}`}>
//           {message.text}
//         </div>
//       )}

//       {isPending && (
//         <div className="info-banner pending">
//           <strong>⏳ Verification Pending</strong>
//           <p>Your verification request is under review. You'll be notified once it's processed.</p>
//         </div>
//       )}

//       {isRejected && (
//         <div className="info-banner rejected">
//           <strong>❌ Verification Rejected</strong>
//           <p><strong>Reason:</strong> {verificationStatus.verification.adminRemarks}</p>
//           <p>You can submit a new verification request below.</p>
//         </div>
//       )}

//       {!isPending && (
//         <>
//           <div className="verification-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
//             <button
//               className={`tab-btn ${activeTab === 'citizenship' ? 'active' : ''}`}
//               onClick={() => setActiveTab('citizenship')}
//               disabled={isVerifiedUser}
//               style={{
//                 padding: '10px 20px',
//                 border: 'none',
//                 borderRadius: '8px',
//                 backgroundColor: activeTab === 'citizenship' ? '#667eea' : '#f3f4f6',
//                 color: activeTab === 'citizenship' ? 'white' : '#6b7280',
//                 cursor: isVerifiedUser ? 'not-allowed' : 'pointer',
//                 fontWeight: '600',
//                 opacity: isVerifiedUser ? 0.5 : 1
//               }}
//             >
//               {isVerifiedUser ? '✓ User Verified' : 'Verify as User'}
//             </button>
            
//             <button
//               className={`tab-btn ${activeTab === 'rider' ? 'active' : ''}`}
//               onClick={() => setActiveTab('rider')}
//               disabled={isVerifiedRider}
//               style={{
//                 padding: '10px 20px',
//                 border: 'none',
//                 borderRadius: '8px',
//                 backgroundColor: activeTab === 'rider' ? '#667eea' : '#f3f4f6',
//                 color: activeTab === 'rider' ? 'white' : '#6b7280',
//                 cursor: isVerifiedRider ? 'not-allowed' : 'pointer',
//                 fontWeight: '600',
//                 opacity: isVerifiedRider ? 0.5 : 1
//               }}
//             >
//               {isVerifiedRider ? '✓ Rider Verified' : isVerifiedUser ? 'Upgrade to Rider' : 'Verify as Rider'}
//             </button>
//           </div>

//           {activeTab === 'citizenship' && !isVerifiedUser && (
//             <form className="form-container" onSubmit={handleSubmitCitizenship}>
//               <h3 style={{ color: '#10b981', marginBottom: '20px' }}>
//                 🟢 Citizenship Verification (User)
//               </h3>
              
//               <p style={{ marginBottom: '20px', color: '#6b7280' }}>
//                 Verify your citizenship to request rides and use the platform as a passenger.
//               </p>

//               <div className="form-group">
//                 <label>Citizenship Number *</label>
//                 <input 
//                   type="text"
//                   className="form-input"
//                   value={citizenshipForm.citizenshipNumber}
//                   onChange={(e) => setCitizenshipForm({ citizenshipNumber: e.target.value })}
//                   placeholder="Enter your citizenship number"
//                   required
//                 />
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Citizenship Front *</label>
//                   <input 
//                     type="file"
//                     className="form-input"
//                     accept="image/*,application/pdf"
//                     onChange={(e) => handleFileChange(e, 'citizenship', 'front')}
//                     required
//                   />
//                   {citizenshipPreviews.front && (
//                     <img src={citizenshipPreviews.front} alt="Preview" className="file-preview" />
//                   )}
//                 </div>

//                 <div className="form-group">
//                   <label>Citizenship Back *</label>
//                   <input 
//                     type="file"
//                     className="form-input"
//                     accept="image/*,application/pdf"
//                     onChange={(e) => handleFileChange(e, 'citizenship', 'back')}
//                     required
//                   />
//                   {citizenshipPreviews.back && (
//                     <img src={citizenshipPreviews.back} alt="Preview" className="file-preview" />
//                   )}
//                 </div>
//               </div>

//               <button 
//                 type="submit"
//                 className="btn-submit"
//                 disabled={submitting}
//                 style={{ backgroundColor: '#10b981' }}
//               >
//                 {submitting ? 'Submitting...' : 'Submit Citizenship Verification'}
//               </button>
//             </form>
//           )}

//           {activeTab === 'rider' && !isVerifiedRider && (
//             <form className="form-container" onSubmit={handleSubmitRider}>
//               <h3 style={{ color: '#3b82f6', marginBottom: '20px' }}>
//                 🔵 {isVerifiedUser ? 'Upgrade to Rider' : 'Rider Verification'}
//               </h3>
              
//               <p style={{ marginBottom: '20px', color: '#6b7280' }}>
//                 {isVerifiedUser 
//                   ? 'Upgrade your account to offer rides and become a verified rider.'
//                   : 'Verify your driving license to offer rides on the platform.'}
//               </p>

//               <div className="form-group">
//                 <label>Driving License Number *</label>
//                 <input 
//                   type="text"
//                   className="form-input"
//                   value={riderForm.licenseNumber}
//                   onChange={(e) => setRiderForm(prev => ({ ...prev, licenseNumber: e.target.value }))}
//                   placeholder="Enter your driving license number"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>License Expiry Date *</label>
//                 <input 
//                   type="date"
//                   className="form-input"
//                   value={riderForm.expiryDate}
//                   onChange={(e) => setRiderForm(prev => ({ ...prev, expiryDate: e.target.value }))}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Driving License Front *</label>
//                 <input
//                   type="file"
//                   className="form-input"
//                   accept="image/*,application/pdf"
//                   onChange={(e) => handleFileChange(e, 'rider', 'front')}
//                   required
//                 />
//                 {riderPreviews.front && (
//                   <img src={riderPreviews.front} alt="Preview" className="file-preview" />
//                 )}
//               </div>

//               <button 
//                 type="submit"
//                 className="btn-submit"
//                 disabled={submitting}
//                 style={{ backgroundColor: '#3b82f6' }}
//               >
//                 {submitting ? 'Submitting...' : isVerifiedUser ? 'Submit Rider Upgrade' : 'Submit Rider Verification'}
//               </button>
//             </form>
//           )}

//           {isVerifiedUser && activeTab === 'citizenship' && (
//             <div className="info-banner" style={{ backgroundColor: '#d1fae5', borderColor: '#10b981' }}>
//               <strong>✅ You are already verified as a User!</strong>
//               <p>You can request rides on the platform.</p>
//             </div>
//           )}

//           {isVerifiedRider && activeTab === 'rider' && (
//             <div className="info-banner" style={{ backgroundColor: '#dbeafe', borderColor: '#3b82f6' }}>
//               <strong>✅ You are already verified as a Rider!</strong>
//               <p>You can offer rides on the platform.</p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };


// // ✅ NEW: Add Ride Page Component
// const AddRidePage = ({ onRideAdded }) => {
//   const [formData, setFormData] = useState({
//     from: '',
//     to: '',
//     date: '',
//     time: '',
//     pickupLocation: '',
//     vehicleNumber: '',
//     vehicleType: 'car',
//     description: '',
//     price: '',
//     availableSeats: '1'
//   });
//   const [vehiclePhoto, setVehiclePhoto] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//     if (!validTypes.includes(file.type)) {
//       setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setMessage({ type: 'error', text: 'File size must be less than 5MB' });
//       return;
//     }

//     setVehiclePhoto(file);
//     setPhotoPreview(URL.createObjectURL(file));
//     setMessage({ type: '', text: '' });
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.from.trim()) newErrors.from = 'From location is required';
//     else if (formData.from.length > 30) newErrors.from = 'From location must be 30 characters or less';

//     if (!formData.to.trim()) newErrors.to = 'To location is required';
//     else if (formData.to.length > 30) newErrors.to = 'To location must be 30 characters or less';

//     if (!formData.date) newErrors.date = 'Date is required';
//     if (!formData.time) newErrors.time = 'Time is required';

//     if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required';
//     else if (formData.pickupLocation.length > 30) newErrors.pickupLocation = 'Pickup location must be 30 characters or less';

//     if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
//     else if (formData.vehicleNumber.length > 30) newErrors.vehicleNumber = 'Vehicle number must be 30 characters or less';

//     if (formData.description && formData.description.length > 400) {
//       newErrors.description = 'Description must be 400 characters or less';
//     }

//     if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
//       newErrors.price = 'Price must be a valid positive number';
//     }

//     if (formData.availableSeats && (isNaN(formData.availableSeats) || parseInt(formData.availableSeats) < 1 || parseInt(formData.availableSeats) > 10)) {
//       newErrors.availableSeats = 'Available seats must be between 1 and 10';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       setMessage({ type: 'error', text: 'Please fix the errors in the form' });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('from', formData.from.trim());
//       formDataToSend.append('to', formData.to.trim());
//       formDataToSend.append('date', formData.date);
//       formDataToSend.append('time', formData.time);
//       formDataToSend.append('pickupLocation', formData.pickupLocation.trim());
//       formDataToSend.append('vehicleNumber', formData.vehicleNumber.trim());
//       formDataToSend.append('vehicleType', formData.vehicleType);
//       if (formData.description.trim()) formDataToSend.append('description', formData.description.trim());
//       if (formData.price) formDataToSend.append('price', parseFloat(formData.price));
//       if (formData.availableSeats) formDataToSend.append('availableSeats', parseInt(formData.availableSeats));
//       if (vehiclePhoto) formDataToSend.append('vehiclePhoto', vehiclePhoto);

//       console.log('📤 Submitting ride...');
      
//       const response = await rideAPI.addRide(formDataToSend);
      
//       console.log('✅ Ride posted successfully:', response);
      
//       setMessage({ type: 'success', text: 'Ride posted successfully! 🎉' });
      
//       setFormData({
//         from: '',
//         to: '',
//         date: '',
//         time: '',
//         pickupLocation: '',
//         vehicleNumber: '',
//         vehicleType: 'car',
//         description: '',
//         price: '',
//         availableSeats: '1'
//       });
//       setVehiclePhoto(null);
//       setPhotoPreview(null);
      
//       const fileInput = document.querySelector('input[type="file"]');
//       if (fileInput) fileInput.value = '';
      
//       if (onRideAdded) {
//         setTimeout(() => onRideAdded(), 1000);
//       }
      
//       setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//     } catch (error) {
//       console.error('❌ Add ride error:', error);
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.message || 'Failed to post ride. Please try again.'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="add-ride-page">
//       <div className="page-header">
//         <h1>Add New Ride</h1>
//         <p>Offer a ride to fellow travelers</p>
//       </div>

//       {message.text && (
//         <div className={`update-message ${message.type}`}>
//           {message.text}
//         </div>
//       )}

//       <form className="form-container" onSubmit={handleSubmit}>
//         <div className="form-row">
//           <div className="form-group">
//             <label>From *</label>
//             <input 
//               type="text" 
//               name="from"
//               className={`form-input ${errors.from ? 'input-error' : ''}`}
//               placeholder="Starting location (max 30 chars)"
//               value={formData.from}
//               onChange={handleChange}
//               disabled={loading}
//               maxLength={30}
//             />
//             {errors.from && <span className="error-text">{errors.from}</span>}
//           </div>
//           <div className="form-group">
//             <label>To *</label>
//             <input 
//               type="text" 
//               name="to"
//               className={`form-input ${errors.to ? 'input-error' : ''}`}
//               placeholder="Destination (max 30 chars)"
//               value={formData.to}
//               onChange={handleChange}
//               disabled={loading}
//               maxLength={30}
//             />
//             {errors.to && <span className="error-text">{errors.to}</span>}
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Date *</label>
//             <input 
//               type="date" 
//               name="date"
//               className={`form-input ${errors.date ? 'input-error' : ''}`}
//               value={formData.date}
//               onChange={handleChange}
//               disabled={loading}
//               min={new Date().toISOString().split('T')[0]}
//             />
//             {errors.date && <span className="error-text">{errors.date}</span>}
//           </div>
//           <div className="form-group">
//             <label>Time *</label>
//             <input 
//               type="time" 
//               name="time"
//               className={`form-input ${errors.time ? 'input-error' : ''}`}
//               value={formData.time}
//               onChange={handleChange}
//               disabled={loading}
//             />
//             {errors.time && <span className="error-text">{errors.time}</span>}
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Pickup Location *</label>
//           <input 
//             type="text" 
//             name="pickupLocation"
//             className={`form-input ${errors.pickupLocation ? 'input-error' : ''}`}
//             placeholder="Exact pickup point (max 30 chars)"
//             value={formData.pickupLocation}
//             onChange={handleChange}
//             disabled={loading}
//             maxLength={30}
//           />
//           {errors.pickupLocation && <span className="error-text">{errors.pickupLocation}</span>}
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Vehicle Number *</label>
//             <input 
//               type="text" 
//               name="vehicleNumber"
//               className={`form-input ${errors.vehicleNumber ? 'input-error' : ''}`}
//               placeholder="BA 1 KHA 1234 (max 30 chars)"
//               value={formData.vehicleNumber}
//               onChange={handleChange}
//               disabled={loading}
//               maxLength={30}
//             />
//             {errors.vehicleNumber && <span className="error-text">{errors.vehicleNumber}</span>}
//           </div>
//           <div className="form-group">
//             <label>Vehicle Type *</label>
//             <select 
//               name="vehicleType"
//               className="form-input"
//               value={formData.vehicleType}
//               onChange={handleChange}
//               disabled={loading}
//             >
//               <option value="car">Car</option>
//               <option value="bike">Bike</option>
//             </select>
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Price per Seat (NPR)</label>
//             <input 
//               type="number" 
//               name="price"
//               className={`form-input ${errors.price ? 'input-error' : ''}`}
//               placeholder="500"
//               value={formData.price}
//               onChange={handleChange}
//               disabled={loading}
//               min="0"
//               step="0.01"
//             />
//             {errors.price && <span className="error-text">{errors.price}</span>}
//           </div>
//           <div className="form-group">
//             <label>Available Seats</label>
//             <input 
//               type="number" 
//               name="availableSeats"
//               className={`form-input ${errors.availableSeats ? 'input-error' : ''}`}
//               placeholder="1-10"
//               value={formData.availableSeats}
//               onChange={handleChange}
//               disabled={loading}
//               min="1"
//               max="10"
//             />
//             {errors.availableSeats && <span className="error-text">{errors.availableSeats}</span>}
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Vehicle Photo</label>
//           <input 
//             type="file" 
//             className="form-input"
//             accept="image/*"
//             onChange={handlePhotoChange}
//             disabled={loading}
//           />
//           <small className="form-help">
//             Accepted formats: JPEG, PNG, GIF, WEBP (Max size: 5MB)
//           </small>
//           {photoPreview && (
//             <div style={{ marginTop: '10px' }}>
//               <img 
//                 src={photoPreview} 
//                 alt="Vehicle preview" 
//                 style={{ 
//                   maxWidth: '200px', 
//                   maxHeight: '200px', 
//                   borderRadius: '8px',
//                   objectFit: 'cover'
//                 }} 
//               />
//             </div>
//           )}
//         </div>

//         <div className="form-group">
//           <label>Description (Optional)</label>
//           <textarea 
//             name="description"
//             className={`form-input ${errors.description ? 'input-error' : ''}`}
//             rows="4"
//             placeholder="Any additional information about the ride... (max 400 chars)"
//             value={formData.description}
//             onChange={handleChange}
//             disabled={loading}
//             maxLength={400}
//           ></textarea>
//           <small className="form-help">
//             {formData.description.length}/400 characters
//           </small>
//           {errors.description && <span className="error-text">{errors.description}</span>}
//         </div>

//         <button 
//           type="submit"
//           className="btn-submit" 
//           disabled={loading}
//         >
//           {loading ? 'Publishing Ride...' : 'Publish Ride'}
//         </button>
//       </form>
//     </div>
//   );
// };


// // ===================================================================
// // MAIN DASHBOARD COMPONENT
// // ===================================================================

// const Dashboard = () => {
//   const { user, login } = useAuth();
  
//   const [activePage, setActivePage] = useState('rides');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isRiderMode, setIsRiderMode] = useState(false);
//   const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
//   const [logoShake, setLogoShake] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [updateMessage, setUpdateMessage] = useState('');
  
//   // ✅ NEW: Vehicle filter state
//   const [vehicleFilter, setVehicleFilter] = useState('all');
  
//   // ✅ NEW: Rides state
//   const [rides, setRides] = useState([]);
//   const [loadingRides, setLoadingRides] = useState(false);
  
//   const [userFormData, setUserFormData] = useState({
//     username: '',
//     phone: ''
//   });

//   // ✅ NEW: Fetch rides based on mode
//   const fetchRides = async () => {
//     setLoadingRides(true);
//     try {
//       if (isRiderMode) {
//         const response = await rideAPI.getMyRides();
//         console.log('✅ My rides fetched:', response.count);
//         const activeRides = (response.rides || []).filter(ride => ride.status !== 'cancelled');
//         setRides(activeRides);
//       } else {
//         const filters = {};
//         if (vehicleFilter !== 'all') {
//           filters.vehicleType = vehicleFilter;
//         }
//         const response = await rideAPI.getAllRides(filters);
//         console.log('✅ All rides fetched:', response.count);
//         setRides(response.rides || []);
//       }
//     } catch (error) {
//       console.error('Error fetching rides:', error);
//       setRides([]);
//     } finally {
//       setLoadingRides(false);
//     }
//   };

//   // ✅ NEW: Handle ride deletion
//   const handleDeleteRide = async (ride) => {
//     if (!window.confirm(`Are you sure you want to cancel this ride from ${ride.from} to ${ride.to}?`)) {
//       return;
//     }

//     try {
//       await rideAPI.deleteRide(ride.id);
//       console.log('✅ Ride cancelled successfully');
//       setRides(prevRides => prevRides.filter(item => item.id !== ride.id));
//     } catch (error) {
//       console.error('Error cancelling ride:', error);
//       alert(error.response?.data?.message || 'Failed to cancel ride');
//     }
//   };

//   // ✅ NEW: Fetch rides on mount and when mode/filter changes
//   useEffect(() => {
//     fetchRides();
//   }, [isRiderMode, vehicleFilter]);

//   const handleNavigation = (page) => {
//     setActivePage(page);
//     setIsMobileMenuOpen(false);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const toggleModeDropdown = () => {
//     setIsModeDropdownOpen(!isModeDropdownOpen);
//   };

//   const switchMode = () => {
//     if (!isRiderMode && !user?.isVerifiedRider) {
//       alert('You need to be verified as a rider to access rider mode. Please complete your verification process.');
//       setIsModeDropdownOpen(false);
//       return;
//     }

//     setIsRiderMode(!isRiderMode);
//     setIsModeDropdownOpen(false);
//     setActivePage('rides');
//   };

//   const handleLogoClick = (e) => {
//     e.preventDefault();
//     setLogoShake(true);
//     setTimeout(() => setLogoShake(false), 500);
//   };

//   const handleUserFormChange = (e) => {
//     const { name, value } = e.target;
//     setUserFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleUpdateUserInfo = async () => {
//     setIsUpdating(true);
//     setUpdateMessage('');

//     try {
//       const response = await userAPI.updateInfo({
//         username: userFormData.username,
//         phone: userFormData.phone
//       });

//       const token = localStorage.getItem('token');
//       login(response.user, token);

//       setUpdateMessage('Profile updated successfully!');
//       setTimeout(() => setUpdateMessage(''), 3000);
//     } catch (error) {
//       console.error('Update error:', error);
//       setUpdateMessage(error.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const renderContent = () => {
//     switch (activePage) {
//       case 'rides':
//         return (
//           <div className="rides-page">
//             <div className="page-header">
//               <h1>{isRiderMode ? 'Your Posted Rides' : 'Available Rides'}</h1>
//               <p>{isRiderMode ? 'Manage your offered rides' : 'Find your perfect ride'}</p>
              
//               {/* ✅ Vehicle Filter Buttons - only for user mode */}
//               {!isRiderMode && (
//                 <div className="vehicle-filters">
//                   <button
//                     className={`filter-btn ${vehicleFilter === 'bike' ? 'active' : ''}`}
//                     onClick={() => setVehicleFilter(vehicleFilter === 'bike' ? 'all' : 'bike')}
//                   >
//                     <img src="/icons/bike logo.jpg" alt="Bike" style={{ width: '1.5rem', height: '1.5rem', flexShrink: 0 }} />
//                     <span>Bikes</span>
//                   </button>

//                   <button
//                     className={`filter-btn ${vehicleFilter === 'car' ? 'active' : ''}`}
//                     onClick={() => setVehicleFilter(vehicleFilter === 'car' ? 'all' : 'car')}
//                   >
//                     <img src="/icons/car logo.jpg" alt="Car" style={{ width: '1.5rem', height: '1.5rem', flexShrink: 0 }} />
//                     <span>Cars</span>
//                   </button>
//                 </div>
//               )}
//             </div>
            
//             {loadingRides ? (
//               <div className="loading-state">Loading rides...</div>
//             ) : rides.length === 0 ? (
//               <div className="empty-state">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 <h3>{isRiderMode ? 'No rides posted yet' : 'No rides available'}</h3>
//                 <p>{isRiderMode ? 'Start offering rides to fellow travelers' : 'Check back later for available rides'}</p>
//               </div>
//             ) : (
//               <div className="rides-grid">
//                 {rides.map(ride => (
//                   <div key={ride.id} className="ride-card-wrapper">
//                     <RideCard
//                       ride={{
//                         id: ride.id,
//                         driverName: ride.rider?.username || 'Anonymous',
//                         driverRating: 4.5,
//                         from: ride.from,
//                         to: ride.to,
//                         date: ride.date,
//                         time: ride.time,
//                         price: ride.price || 0,
//                         availableSeats: ride.availableSeats || 0,
//                         vehicleType: ride.vehicleType === 'bike' ? 'Bike' : 'Car',
//                         isVerified: ride.rider?.isVerifiedRider || false,
//                         pickupLocation: ride.pickupLocation,
//                         vehicleNumber: ride.vehicleNumber,
//                         vehiclePhoto: ride.vehiclePhoto,
//                         description: ride.description
//                       }}
//                     />
//                     {isRiderMode && (
//                       <div className="ride-management-actions">
//                         <button
//                           className="btn-danger btn-small"
//                           onClick={() => handleDeleteRide(ride)}
//                         >
//                           Cancel Ride
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         );

//       case 'history':
//         return (
//           <div className="history-page">
//             <div className="page-header">
//               <h1>Your Rides History</h1>
//               <p>View your past bookings and trips</p>
//             </div>
//             <div className="empty-state">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3>No ride history yet</h3>
//               <p>Your completed rides will appear here</p>
//             </div>
//           </div>
//         );

//       case 'add-issue':
//         return (
//           <div className="add-issue-page">
//             <div className="page-header">
//               <h1>Raise an Issue</h1>
//               <p>Report any problems you're facing</p>
//             </div>
//             <div className="form-container">
//               <div className="form-group">
//                 <label>Issue Type</label>
//                 <select className="form-input">
//                   <option>Select issue type</option>
//                   <option>Payment Issue</option>
//                   <option>Driver/Rider Behavior</option>
//                   <option>Ride Cancellation</option>
//                   <option>Vehicle Condition</option>
//                   <option>Technical Problem</option>
//                   <option>Other</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Subject</label>
//                 <input type="text" className="form-input" placeholder="Brief description" />
//               </div>
//               <div className="form-group">
//                 <label>Description</label>
//                 <textarea className="form-input" rows="6" placeholder="Describe your issue..."></textarea>
//               </div>
//               <button className="btn-submit">Submit Issue</button>
//             </div>
//           </div>
//         );

//       case 'add-ride':
//         return <AddRidePage onRideAdded={fetchRides} />;

//       case 'vehicle-profile':
//         return (
//           <div className="vehicle-profile-page">
//             <div className="page-header">
//               <h1>Vehicle Profile</h1>
//               <p>Upload and manage your vehicle information</p>
//             </div>
//             <div className="form-container">
//               <div className="form-group">
//                 <label>Vehicle Number</label>
//                 <input type="text" className="form-input" placeholder="BA 1 KHA 1234" />
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Vehicle Brand</label>
//                   <input type="text" className="form-input" placeholder="Toyota" />
//                 </div>
//                 <div className="form-group">
//                   <label>Model</label>
//                   <input type="text" className="form-input" placeholder="Corolla" />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Upload Vehicle Photos</label>
//                 <input type="file" className="form-input" accept="image/*" multiple />
//               </div>
//               <button className="btn-submit">Save Vehicle Profile</button>
//             </div>
//           </div>
//         );

//       case 'your-info':
//         return (
//           <div className="profile-page">
//             <div className="page-header">
//               <h1>Your Information</h1>
//               <p>View and update your personal details</p>
//             </div>
            
//             {updateMessage && (
//               <div className={`update-message ${updateMessage.includes('success') ? 'success' : 'error'}`}>
//                 {updateMessage}
//               </div>
//             )}
            
//             <div className="form-container">
//               <div className="form-group">
//                 <label>Username</label>
//                 <input 
//                   type="text" 
//                   name="username"
//                   className="form-input" 
//                   defaultValue={user?.username || ''} 
//                   onChange={handleUserFormChange}
//                   onFocus={(e) => setUserFormData(prev => ({ ...prev, username: e.target.value }))}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Email</label>
//                 <input 
//                   type="email" 
//                   className="form-input" 
//                   value={user?.email || 'Not available'} 
//                   disabled 
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Phone Number</label>
//                 <input 
//                   type="tel" 
//                   name="phone"
//                   className="form-input" 
//                   defaultValue={user?.phone || ''} 
//                   onChange={handleUserFormChange}
//                   onFocus={(e) => setUserFormData(prev => ({ ...prev, phone: e.target.value }))}
//                   placeholder="97xxxxxxxx or 98xxxxxxxx"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Account Type</label>
//                 <input 
//                   type="text" 
//                   className="form-input" 
//                   value={user?.role || 'User'} 
//                   disabled 
//                   style={{ textTransform: 'capitalize' }}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Account Created</label>
//                 <input 
//                   type="text" 
//                   className="form-input" 
//                   value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} 
//                   disabled 
//                 />
//               </div>
//               <button 
//                 className="btn-submit" 
//                 onClick={handleUpdateUserInfo}
//                 disabled={isUpdating}
//               >
//                 {isUpdating ? 'Updating...' : 'Update Information'}
//               </button>
//             </div>
//           </div>
//         );

//       case 'upload-profile':
//         return <UploadProfilePage />;

//       case 'change-password':
//         return <ChangePasswordPage />;

//       case 'verify-yourself':
//         return <VerifyYourselfPage />;

//       case 'payment-info':
//         return (
//           <div className="payment-page">
//             <div className="page-header">
//               <h1>Payment Information</h1>
//               <p>Manage your payment methods</p>
//             </div>
//             <div className="form-container">
//               <div className="form-group">
//                 <label>Payment Method</label>
//                 <select className="form-input">
//                   <option>eSewa</option>
//                   <option>Khalti</option>
//                   <option>Bank Account</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Account Number</label>
//                 <input type="text" className="form-input" />
//               </div>
//               <button className="btn-submit">Save</button>
//             </div>
//           </div>
//         );

//       case 'update-documents':
//         return (
//           <div className="documents-page">
//             <div className="page-header">
//               <h1>Update Documents</h1>
//               <p>Upload and update your documents</p>
//             </div>
//             <div className="form-container">
//               <div className="form-group">
//                 <label>Driving License</label>
//                 <input type="file" className="form-input" accept="image/*" />
//               </div>
//               <button className="btn-submit">Update</button>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="top-navbar">
//         <div className="navbar-container">
//           <div 
//             className={`navbar-left ${logoShake ? 'shake' : ''}`} 
//             onClick={handleLogoClick}
//           >
//             <img src="/images/logo.png" alt="Lift Nepal" className="navbar-logo" />
//             <span className="navbar-brand">Lift Nepal</span>
//           </div>

//           <nav className="navbar-menu">
//             <button 
//               className={`nav-link ${activePage === 'rides' ? 'active' : ''}`}
//               onClick={() => handleNavigation('rides')}
//             >
//               Rides
//             </button>
//             <button 
//               className={`nav-link ${activePage === 'history' ? 'active' : ''}`}
//               onClick={() => handleNavigation('history')}
//             >
//               Your Rides History
//             </button>
//             <button 
//               className={`nav-link ${activePage === 'add-issue' ? 'active' : ''}`}
//               onClick={() => handleNavigation('add-issue')}
//             >
//               Raise Issue
//             </button>
//             {isRiderMode && (
//               <button 
//                 className={`nav-link ${activePage === 'add-ride' ? 'active' : ''}`}
//                 onClick={() => handleNavigation('add-ride')}
//               >
//                 Add Ride
//               </button>
//             )}
//           </nav>

//           <div className="navbar-right">
//             <button className="notification-icon" aria-label="Notifications">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//               </svg>
//               <span className="notification-badge">3</span>
//             </button>

//             <ProfileDropdown 
//               onNavigate={handleNavigation}
//               isRiderMode={isRiderMode}
//             />

//             <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
//               {isMobileMenuOpen ? '✕' : '☰'}
//             </button>
//           </div>
//         </div>
//       </header>

//       {isMobileMenuOpen && (
//         <div className="mobile-menu">
//           <button 
//             className={`mobile-nav-link ${activePage === 'rides' ? 'active' : ''}`}
//             onClick={() => handleNavigation('rides')}
//           >
//             Rides
//           </button>
//           <button 
//             className={`mobile-nav-link ${activePage === 'history' ? 'active' : ''}`}
//             onClick={() => handleNavigation('history')}
//           >
//             Your Rides History
//           </button>
//           <button 
//             className={`mobile-nav-link ${activePage === 'add-issue' ? 'active' : ''}`}
//             onClick={() => handleNavigation('add-issue')}
//           >
//             Raise Issue
//           </button>
//           {isRiderMode && (
//             <button 
//               className={`mobile-nav-link ${activePage === 'add-ride' ? 'active' : ''}`}
//               onClick={() => handleNavigation('add-ride')}
//             >
//               Add Ride
//             </button>
//           )}
//         </div>
//       )}

//       <main className="dashboard-main-content">
//         {renderContent()}
//       </main>

//       <div className="mode-toggle-container">
//         <button className="mode-toggle-trigger" onClick={toggleModeDropdown}>
//           <svg className="mode-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//             {isRiderMode ? (
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//             ) : (
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             )}
//           </svg>
//           <span>{isRiderMode ? 'Rider Mode' : 'User Mode'}</span>
//           <svg className={`mode-toggle-arrow ${isModeDropdownOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </button>

//         {isModeDropdownOpen && (
//           <div className="mode-toggle-dropdown">
//             <button className="mode-option" onClick={switchMode}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 {isRiderMode ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                 )}
//               </svg>
//               <span>{isRiderMode ? 'User Mode' : 'Rider Mode'}</span>
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// PART 1 of 2 - Dashboard.jsx (Lines 1-450)

import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import RideCard from '../../components/RideCard';
import RideDetailsModal from '../../components/RideDetailsModal';
import ProfileDropdown from '../../components/ProfileDropdown';
import UpdateVehicleInfoPage from './UpdateVehicleInfo';
import AddRidePageComponent from './Addridepage'; // ✅ Import smart AddRidePage
import { useAuth } from '../../../context/AuthContext';
import { userAPI, verificationAPI, passwordAPI, rideAPI } from '../../../services/api';
import '../../css/Dashboard.css';

// ===================================================================
// HELPER COMPONENTS - Upload Profile, Change Password, Verify, AddRide
// ===================================================================

// ✅ Delete Ride Confirmation Modal Component
const DeleteRideModal = ({ isOpen, onClose, onConfirm, ride }) => {
  if (!isOpen || !ride) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Cancel Ride</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to cancel this ride?</p>
          <div className="ride-summary">
            <p><strong>From:</strong> {ride.from}</p>
            <p><strong>To:</strong> {ride.to}</p>
            <p><strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {ride.time}</p>
          </div>
          <p className="warning-text">This action cannot be undone. The ride will be marked as cancelled.</p>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Keep Ride</button>
          <button className="btn-danger" onClick={onConfirm}>Cancel Ride</button>
        </div>
      </div>
    </div>
  );
};

// ✅ Upload Profile Page Component
const UploadProfilePage = () => {
  const { user, setUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const getProfilePictureUrl = () => {
    if (user?.profilePicture) {
      return `http://localhost:5000${user.profilePicture}?t=${Date.now()}`;
    }
    return null;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      await userAPI.uploadProfilePicture(selectedFile);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUserData = await userAPI.getInfo();
      console.log('📸 Profile picture updated:', updatedUserData.user.profilePicture);
      
      setUser(updatedUserData.user);

      setMessage({ type: 'success', text: 'Profile picture uploaded successfully!' });
      setSelectedFile(null);
      setPreviewUrl(null);
      
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload profile picture'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.profilePicture) return;

    if (!window.confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      await userAPI.deleteProfilePicture();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUserData = await userAPI.getInfo();
      console.log('🗑️ Profile picture deleted');
      
      setUser(updatedUserData.user);

      setMessage({ type: 'success', text: 'Profile picture deleted successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete profile picture'
      });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="upload-profile-page">
      <div className="page-header">
        <h1>Upload Profile Picture</h1>
        <p>Add or update your profile picture</p>
      </div>

      {message.text && (
        <div className={`update-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-container">
        <div className="profile-preview-section">
          <div className="current-profile">
            <h3>Current Profile Picture</h3>
            <div className="profile-picture-display">
              {getProfilePictureUrl() ? (
                <img src={getProfilePictureUrl()} alt="Profile" className="profile-img" />
              ) : (
                <div className="profile-avatar-large">
                  {getInitials(user?.username)}
                </div>
              )}
            </div>
            {user?.profilePicture && (
              <button 
                className="btn-delete" 
                onClick={handleDelete}
                disabled={uploading}
              >
                Delete Current Picture
              </button>
            )}
          </div>

          {(previewUrl || selectedFile) && (
            <div className="preview-section">
              <h3>Preview</h3>
              <div className="profile-picture-display">
                <img src={previewUrl} alt="Preview" className="profile-img" />
              </div>
            </div>
          )}
        </div>

        <div className="upload-section">
          <div className="form-group">
            <label>Select New Photo</label>
            <input 
              type="file" 
              className="form-input" 
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <small className="form-help">
              Accepted formats: JPEG, PNG, GIF, WEBP (Max size: 5MB)
            </small>
          </div>

          <button 
            className="btn-submit" 
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Change Password Page Component
const ChangePasswordPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one capital letter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await passwordAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      setMessage({ type: 'success', text: response.message });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Change password error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="page-header">
        <h1>Change Password</h1>
        <p>Update your account password</p>
      </div>

      {message.text && (
        <div className={`update-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password *</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword.current ? "text" : "password"}
              name="currentPassword"
              className={`form-input ${errors.currentPassword ? 'input-error' : ''}`}
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle-icon"
              onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
              disabled={loading}
              aria-label={showPassword.current ? "Hide password" : "Show password"}
            >
              {showPassword.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.currentPassword && (
            <span className="error-text">{errors.currentPassword}</span>
          )}
        </div>

        <div className="form-group">
          <label>New Password *</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password (min 8 characters, 1 capital letter)"
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle-icon"
              onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
              disabled={loading}
              aria-label={showPassword.new ? "Hide password" : "Show password"}
            >
              {showPassword.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <span className="error-text">{errors.newPassword}</span>
          )}
        </div>

        <div className="form-group">
          <label>Confirm New Password *</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your new password"
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle-icon"
              onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
              disabled={loading}
              aria-label={showPassword.confirm ? "Hide password" : "Show password"}
            >
              {showPassword.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="error-text">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

// END OF PART 1
// PART 2 of 2 - Dashboard.jsx (Lines 451-end)

// ✅ Verify Yourself Page Component
const VerifyYourselfPage = () => {
  const { user, setUser } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('citizenship');
  
  const [citizenshipForm, setCitizenshipForm] = useState({
    citizenshipNumber: ''
  });
  const [citizenshipFiles, setCitizenshipFiles] = useState({
    front: null,
    back: null
  });
  const [citizenshipPreviews, setCitizenshipPreviews] = useState({
    front: null,
    back: null
  });

  const [riderForm, setRiderForm] = useState({
    licenseNumber: '',
    expiryDate: ''
  });
  const [riderFiles, setRiderFiles] = useState({
    front: null,
    back: null
  });
  const [riderPreviews, setRiderPreviews] = useState({
    front: null,
    back: null
  });

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const data = await verificationAPI.getStatus();
      setVerificationStatus(data);
      
      if (!data.isVerifiedUser) {
        setActiveTab('citizenship');
      } else if (!data.isVerifiedRider) {
        setActiveTab('rider');
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, type, side) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please select a valid file (JPEG, PNG, PDF)' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 10MB' });
      return;
    }

    if (type === 'citizenship') {
      setCitizenshipFiles(prev => ({ ...prev, [side]: file }));
      if (file.type.startsWith('image/')) {
        setCitizenshipPreviews(prev => ({ ...prev, [side]: URL.createObjectURL(file) }));
      }
    } else {
      setRiderFiles(prev => ({ ...prev, [side]: file }));
      if (file.type.startsWith('image/')) {
        setRiderPreviews(prev => ({ ...prev, [side]: URL.createObjectURL(file) }));
      }
    }
    
    setMessage({ type: '', text: '' });
  };

  const handleSubmitCitizenship = async (e) => {
    e.preventDefault();
    
    if (!citizenshipFiles.front || !citizenshipFiles.back) {
      setMessage({ type: 'error', text: 'Please upload both sides of your citizenship' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('citizenshipNumber', citizenshipForm.citizenshipNumber);
      formData.append('citizenshipFront', citizenshipFiles.front);
      formData.append('citizenshipBack', citizenshipFiles.back);

      console.log('📤 Submitting citizenship verification...');
      
      const response = await verificationAPI.submitCitizenshipVerification(formData);
      
      console.log('✅ Citizenship verification submitted:', response);
      
      setMessage({ type: 'success', text: 'Citizenship verification submitted successfully! ✅' });
      
      setCitizenshipForm({ citizenshipNumber: '' });
      setCitizenshipFiles({ front: null, back: null });
      setCitizenshipPreviews({ front: null, back: null });
      
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');
      
      setTimeout(async () => {
        await fetchVerificationStatus();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Citizenship verification error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit citizenship verification'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRider = async (e) => {
    e.preventDefault();
    
    if (!riderFiles.front) {
      setMessage({ type: 'error', text: 'Please upload at least the front of your driving license' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('drivingLicenseNumber', riderForm.licenseNumber);
      formData.append('licenseExpiryDate', riderForm.expiryDate);
      formData.append('drivingLicenseFront', riderFiles.front);
      if (riderFiles.back) {
        formData.append('drivingLicenseBack', riderFiles.back);
      }

      console.log('📤 Submitting rider verification...');
      
      let response;
      if (verificationStatus?.isVerifiedUser) {
        response = await verificationAPI.upgradeToRider(formData);
        console.log('✅ Rider upgrade submitted:', response);
        setMessage({ type: 'success', text: 'Rider upgrade request submitted successfully! ✅' });
      } else {
        response = await verificationAPI.submitRiderVerification(formData);
        console.log('✅ Rider verification submitted:', response);
        setMessage({ type: 'success', text: 'Rider verification submitted successfully! ✅' });
      }
      
      setRiderForm({ licenseNumber: '', expiryDate: '' });
      setRiderFiles({ front: null, back: null });
      setRiderPreviews({ front: null, back: null });
      
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');
      
      setTimeout(async () => {
        await fetchVerificationStatus();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Rider verification error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit rider verification'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="verify-page">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  const isPending = verificationStatus?.verification?.status === 'pending';
  const isRejected = verificationStatus?.verification?.status === 'rejected';
  const isVerifiedUser = verificationStatus?.isVerifiedUser;
  const isVerifiedRider = verificationStatus?.isVerifiedRider;

  return (
    <div className="verify-page">
      <div className="page-header">
        <h1>{isVerifiedUser || isVerifiedRider ? 'Update Verification' : 'Verify Yourself'}</h1>
        <p>Upload your identity documents for verification</p>
        
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {isVerifiedRider ? (
            <span className="badge badge-purple" style={{ backgroundColor: '#3b82f6' }}>Verified Rider</span>
          ) : isVerifiedUser ? (
            <span className="badge badge-green">Verified User</span>
          ) : (
            <span className="badge badge-gray">⚠ Unverified</span>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`update-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {isPending && (
        <div className="info-banner pending">
          <strong>⏳ Verification Pending</strong>
          <p>Your verification request is under review. You'll be notified once it's processed.</p>
        </div>
      )}

      {isRejected && (
        <div className="info-banner rejected">
          <strong>❌ Verification Rejected</strong>
          <p><strong>Reason:</strong> {verificationStatus.verification.adminRemarks}</p>
          <p>You can submit a new verification request below.</p>
        </div>
      )}

      {!isPending && (
        <>
          <div className="verification-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
            <button
              className={`tab-btn ${activeTab === 'citizenship' ? 'active' : ''}`}
              onClick={() => setActiveTab('citizenship')}
              disabled={isVerifiedUser}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: activeTab === 'citizenship' ? '#667eea' : '#f3f4f6',
                color: activeTab === 'citizenship' ? 'white' : '#6b7280',
                cursor: isVerifiedUser ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: isVerifiedUser ? 0.5 : 1
              }}
            >
              {isVerifiedUser ? '✓ User Verified' : 'Verify as User'}
            </button>
            
            <button
              className={`tab-btn ${activeTab === 'rider' ? 'active' : ''}`}
              onClick={() => setActiveTab('rider')}
              disabled={isVerifiedRider}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: activeTab === 'rider' ? '#667eea' : '#f3f4f6',
                color: activeTab === 'rider' ? 'white' : '#6b7280',
                cursor: isVerifiedRider ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: isVerifiedRider ? 0.5 : 1
              }}
            >
              {isVerifiedRider ? '✓ Rider Verified' : isVerifiedUser ? 'Upgrade to Rider' : 'Verify as Rider'}
            </button>
          </div>

          {activeTab === 'citizenship' && !isVerifiedUser && (
            <form className="form-container" onSubmit={handleSubmitCitizenship}>
              <h3 style={{ color: '#10b981', marginBottom: '20px' }}>
                🟢 Citizenship Verification (User)
              </h3>
              
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>
                Verify your citizenship to request rides and use the platform as a passenger.
              </p>

              <div className="form-group">
                <label>Citizenship Number *</label>
                <input 
                  type="text"
                  className="form-input"
                  value={citizenshipForm.citizenshipNumber}
                  onChange={(e) => setCitizenshipForm({ citizenshipNumber: e.target.value })}
                  placeholder="Enter your citizenship number"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Citizenship Front *</label>
                  <input 
                    type="file"
                    className="form-input"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, 'citizenship', 'front')}
                    required
                  />
                  {citizenshipPreviews.front && (
                    <img src={citizenshipPreviews.front} alt="Preview" className="file-preview" />
                  )}
                </div>

                <div className="form-group">
                  <label>Citizenship Back *</label>
                  <input 
                    type="file"
                    className="form-input"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, 'citizenship', 'back')}
                    required
                  />
                  {citizenshipPreviews.back && (
                    <img src={citizenshipPreviews.back} alt="Preview" className="file-preview" />
                  )}
                </div>
              </div>

              <button 
                type="submit"
                className="btn-submit"
                disabled={submitting}
                style={{ backgroundColor: '#10b981' }}
              >
                {submitting ? 'Submitting...' : 'Submit Citizenship Verification'}
              </button>
            </form>
          )}

          {activeTab === 'rider' && !isVerifiedRider && (
            <form className="form-container" onSubmit={handleSubmitRider}>
              <h3 style={{ color: '#3b82f6', marginBottom: '20px' }}>
                🔵 {isVerifiedUser ? 'Upgrade to Rider' : 'Rider Verification'}
              </h3>
              
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>
                {isVerifiedUser 
                  ? 'Upgrade your account to offer rides and become a verified rider.'
                  : 'Verify your driving license to offer rides on the platform.'}
              </p>

              <div className="form-group">
                <label>Driving License Number *</label>
                <input 
                  type="text"
                  className="form-input"
                  value={riderForm.licenseNumber}
                  onChange={(e) => setRiderForm(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  placeholder="Enter your driving license number"
                  required
                />
              </div>

              <div className="form-group">
                <label>License Expiry Date *</label>
                <input 
                  type="date"
                  className="form-input"
                  value={riderForm.expiryDate}
                  onChange={(e) => setRiderForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Driving License Front *</label>
                <input
                  type="file"
                  className="form-input"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, 'rider', 'front')}
                  required
                />
                {riderPreviews.front && (
                  <img src={riderPreviews.front} alt="Preview" className="file-preview" />
                )}
              </div>

              <button 
                type="submit"
                className="btn-submit"
                disabled={submitting}
                style={{ backgroundColor: '#3b82f6' }}
              >
                {submitting ? 'Submitting...' : isVerifiedUser ? 'Submit Rider Upgrade' : 'Submit Rider Verification'}
              </button>
            </form>
          )}

          {isVerifiedUser && activeTab === 'citizenship' && (
            <div className="info-banner" style={{ backgroundColor: '#d1fae5', borderColor: '#10b981' }}>
              <strong>✅ You are already verified as a User!</strong>
              <p>You can request rides on the platform.</p>
            </div>
          )}

          {isVerifiedRider && activeTab === 'rider' && (
            <div className="info-banner" style={{ backgroundColor: '#dbeafe', borderColor: '#3b82f6' }}>
              <strong>✅ You are already verified as a Rider!</strong>
              <p>You can offer rides on the platform.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ✅ Payment Method Page Component
const PaymentMethodPage = () => {
  const [formData, setFormData] = useState({
    debitCardNumber: '',
    mpin: '',
    confirmMpin: ''
  });
  const [showMpin, setShowMpin] = useState({
    mpin: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [savedPayment, setSavedPayment] = useState(null);

  // Load saved payment info on mount
  useEffect(() => {
    const saved = localStorage.getItem('paymentMethod');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedPayment(parsed);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow numbers for debit card and MPIN
    if (name === 'debitCardNumber') {
      const cleaned = value.replace(/\D/g, '').slice(0, 16);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else if (name === 'mpin' || name === 'confirmMpin') {
      const cleaned = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const maskCardNumber = (number) => {
    if (!number) return '';
    const last4 = number.slice(-4);
    return `**** **** **** ${last4}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.debitCardNumber) {
      newErrors.debitCardNumber = 'Debit card number is required';
    } else if (formData.debitCardNumber.length < 13 || formData.debitCardNumber.length > 16) {
      newErrors.debitCardNumber = 'Card number must be 13-16 digits';
    }

    if (!formData.mpin) {
      newErrors.mpin = 'MPIN is required';
    } else if (formData.mpin.length < 4 || formData.mpin.length > 6) {
      newErrors.mpin = 'MPIN must be 4-6 digits';
    }

    if (!formData.confirmMpin) {
      newErrors.confirmMpin = 'Please confirm your MPIN';
    } else if (formData.mpin !== formData.confirmMpin) {
      newErrors.confirmMpin = 'MPIN does not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage (simulated for college project)
      const paymentData = {
        debitCardNumber: formData.debitCardNumber,
        mpin: formData.mpin, // In real app, this should be hashed
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem('paymentMethod', JSON.stringify(paymentData));
      setSavedPayment(paymentData);

      setMessage({ type: 'success', text: 'Payment method saved successfully! You can use this for future ride payments.' });
      setFormData({
        debitCardNumber: '',
        mpin: '',
        confirmMpin: ''
      });
    } catch (error) {
      console.error('Save payment error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save payment method. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePayment = () => {
    if (window.confirm('Are you sure you want to remove your saved payment method?')) {
      localStorage.removeItem('paymentMethod');
      setSavedPayment(null);
      setMessage({ type: 'success', text: 'Payment method removed successfully.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="payment-page">
      <div className="page-header">
        <h1>Payment Method</h1>
        <p>Add your debit card for ride payments</p>
      </div>

      {message.text && (
        <div className={`update-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {savedPayment && (
        <div className="saved-payment-card" style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #22c55e',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ color: '#16a34a', marginBottom: '12px' }}>💳 Saved Payment Method</h3>
          <p style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '2px', marginBottom: '8px' }}>
            {maskCardNumber(savedPayment.debitCardNumber)}
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
            Added on {new Date(savedPayment.savedAt).toLocaleDateString()}
          </p>
          <button 
            className="btn-delete"
            onClick={handleRemovePayment}
            style={{ 
              backgroundColor: '#ef4444', 
              color: 'white', 
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Remove Payment Method
          </button>
        </div>
      )}

      <form className="form-container" onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '20px', color: '#374151' }}>
          {savedPayment ? 'Update Payment Method' : 'Add New Payment Method'}
        </h3>

        <div className="form-group">
          <label>Debit Card Number *</label>
          <input
            type="text"
            name="debitCardNumber"
            className={`form-input ${errors.debitCardNumber ? 'input-error' : ''}`}
            value={formatCardNumber(formData.debitCardNumber)}
            onChange={handleChange}
            placeholder="Enter 13-16 digit card number"
            disabled={loading}
            maxLength={19}
          />
          {errors.debitCardNumber && (
            <span className="error-text">{errors.debitCardNumber}</span>
          )}
          <small className="form-help">Enter your debit card number (13-16 digits)</small>
        </div>

        <div className="form-group">
          <label>MPIN (4-6 digits) *</label>
          <div className="password-input-wrapper">
            <input
              type={showMpin.mpin ? "text" : "password"}
              name="mpin"
              className={`form-input ${errors.mpin ? 'input-error' : ''}`}
              value={formData.mpin}
              onChange={handleChange}
              placeholder="Enter 4-6 digit MPIN"
              disabled={loading}
              maxLength={6}
            />
            <button
              type="button"
              className="password-toggle-icon"
              onClick={() => setShowMpin(prev => ({ ...prev, mpin: !prev.mpin }))}
              disabled={loading}
              aria-label={showMpin.mpin ? "Hide MPIN" : "Show MPIN"}
            >
              {showMpin.mpin ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.mpin && (
            <span className="error-text">{errors.mpin}</span>
          )}
          <small className="form-help">This MPIN will be used to confirm payments when booking rides</small>
        </div>

        <div className="form-group">
          <label>Confirm MPIN *</label>
          <div className="password-input-wrapper">
            <input
              type={showMpin.confirm ? "text" : "password"}
              name="confirmMpin"
              className={`form-input ${errors.confirmMpin ? 'input-error' : ''}`}
              value={formData.confirmMpin}
              onChange={handleChange}
              placeholder="Re-enter your MPIN"
              disabled={loading}
              maxLength={6}
            />
            <button
              type="button"
              className="password-toggle-icon"
              onClick={() => setShowMpin(prev => ({ ...prev, confirm: !prev.confirm }))}
              disabled={loading}
              aria-label={showMpin.confirm ? "Hide MPIN" : "Show MPIN"}
            >
              {showMpin.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.confirmMpin && (
            <span className="error-text">{errors.confirmMpin}</span>
          )}
        </div>

        <button 
          type="submit"
          className="btn-submit" 
          disabled={loading}
        >
          {loading ? 'Saving...' : savedPayment ? 'Update Payment Method' : 'Save Payment Method'}
        </button>

        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <strong>🔒 Security Note:</strong> Your payment information is stored securely. 
          The MPIN will be required when you book a ride to confirm the payment.
        </div>
      </form>
    </div>
  );
};


// ✅ NEW: Add Ride Page Component
const AddRidePage = ({ onRideAdded }) => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    pickupLocation: '',
    vehicleNumber: '',
    vehicleType: 'car',
    description: '',
    price: '',
    availableSeats: '1'
  });
  const [vehiclePhoto, setVehiclePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    setVehiclePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.from.trim()) newErrors.from = 'From location is required';
    else if (formData.from.length > 30) newErrors.from = 'From location must be 30 characters or less';

    if (!formData.to.trim()) newErrors.to = 'To location is required';
    else if (formData.to.length > 30) newErrors.to = 'To location must be 30 characters or less';

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';

    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required';
    else if (formData.pickupLocation.length > 30) newErrors.pickupLocation = 'Pickup location must be 30 characters or less';

    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
    else if (formData.vehicleNumber.length > 30) newErrors.vehicleNumber = 'Vehicle number must be 30 characters or less';

    if (formData.description && formData.description.length > 400) {
      newErrors.description = 'Description must be 400 characters or less';
    }

    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (formData.availableSeats && (isNaN(formData.availableSeats) || parseInt(formData.availableSeats) < 1 || parseInt(formData.availableSeats) > 10)) {
      newErrors.availableSeats = 'Available seats must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors in the form' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('from', formData.from.trim());
      formDataToSend.append('to', formData.to.trim());
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('pickupLocation', formData.pickupLocation.trim());
      formDataToSend.append('vehicleNumber', formData.vehicleNumber.trim());
      formDataToSend.append('vehicleType', formData.vehicleType);
      if (formData.description.trim()) formDataToSend.append('description', formData.description.trim());
      if (formData.price) formDataToSend.append('price', parseFloat(formData.price));
      if (formData.availableSeats) formDataToSend.append('availableSeats', parseInt(formData.availableSeats));
      if (vehiclePhoto) formDataToSend.append('vehiclePhoto', vehiclePhoto);

      console.log('📤 Submitting ride...');
      
      const response = await rideAPI.addRide(formDataToSend);
      
      console.log('✅ Ride posted successfully:', response);
      
      setMessage({ type: 'success', text: 'Ride posted successfully! 🎉' });
      
      setFormData({
        from: '',
        to: '',
        date: '',
        time: '',
        pickupLocation: '',
        vehicleNumber: '',
        vehicleType: 'car',
        description: '',
        price: '',
        availableSeats: '1'
      });
      setVehiclePhoto(null);
      setPhotoPreview(null);
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      if (onRideAdded) {
        setTimeout(() => onRideAdded(), 1000);
      }
      
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('❌ Add ride error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to post ride. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-ride-page">
      <div className="page-header">
        <h1>Add New Ride</h1>
        <p>Offer a ride to fellow travelers</p>
      </div>

      {message.text && (
        <div className={`update-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>From *</label>
            <input 
              type="text" 
              name="from"
              className={`form-input ${errors.from ? 'input-error' : ''}`}
              placeholder="Starting location (max 30 chars)"
              value={formData.from}
              onChange={handleChange}
              disabled={loading}
              maxLength={30}
            />
            {errors.from && <span className="error-text">{errors.from}</span>}
          </div>
          <div className="form-group">
            <label>To *</label>
            <input 
              type="text" 
              name="to"
              className={`form-input ${errors.to ? 'input-error' : ''}`}
              placeholder="Destination (max 30 chars)"
              value={formData.to}
              onChange={handleChange}
              disabled={loading}
              maxLength={30}
            />
            {errors.to && <span className="error-text">{errors.to}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date *</label>
            <input 
              type="date" 
              name="date"
              className={`form-input ${errors.date ? 'input-error' : ''}`}
              value={formData.date}
              onChange={handleChange}
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label>Time *</label>
            <input 
              type="time" 
              name="time"
              className={`form-input ${errors.time ? 'input-error' : ''}`}
              value={formData.time}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.time && <span className="error-text">{errors.time}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Pickup Location *</label>
          <input 
            type="text" 
            name="pickupLocation"
            className={`form-input ${errors.pickupLocation ? 'input-error' : ''}`}
            placeholder="Exact pickup point (max 30 chars)"
            value={formData.pickupLocation}
            onChange={handleChange}
            disabled={loading}
            maxLength={30}
          />
          {errors.pickupLocation && <span className="error-text">{errors.pickupLocation}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Vehicle Number *</label>
            <input 
              type="text" 
              name="vehicleNumber"
              className={`form-input ${errors.vehicleNumber ? 'input-error' : ''}`}
              placeholder="BA 1 KHA 1234 (max 30 chars)"
              value={formData.vehicleNumber}
              onChange={handleChange}
              disabled={loading}
              maxLength={30}
            />
            {errors.vehicleNumber && <span className="error-text">{errors.vehicleNumber}</span>}
          </div>
          <div className="form-group">
            <label>Vehicle Type *</label>
            <select 
              name="vehicleType"
              className="form-input"
              value={formData.vehicleType}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price per Seat (NPR)</label>
            <input 
              type="number" 
              name="price"
              className={`form-input ${errors.price ? 'input-error' : ''}`}
              placeholder="500"
              value={formData.price}
              onChange={handleChange}
              disabled={loading}
              min="0"
              step="0.01"
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label>Available Seats</label>
            <input 
              type="number" 
              name="availableSeats"
              className={`form-input ${errors.availableSeats ? 'input-error' : ''}`}
              placeholder="1-10"
              value={formData.availableSeats}
              onChange={handleChange}
              disabled={loading}
              min="1"
              max="10"
            />
            {errors.availableSeats && <span className="error-text">{errors.availableSeats}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Vehicle Photo</label>
          <input 
            type="file" 
            className="form-input"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={loading}
          />
          <small className="form-help">
            Accepted formats: JPEG, PNG, GIF, WEBP (Max size: 5MB)
          </small>
          {photoPreview && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={photoPreview} 
                alt="Vehicle preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  borderRadius: '8px',
                  objectFit: 'cover'
                }} 
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea 
            name="description"
            className={`form-input ${errors.description ? 'input-error' : ''}`}
            rows="4"
            placeholder="Any additional information about the ride... (max 400 chars)"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            maxLength={400}
          ></textarea>
          <small className="form-help">
            {formData.description.length}/400 characters
          </small>
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <button 
          type="submit"
          className="btn-submit" 
          disabled={loading}
        >
          {loading ? 'Publishing Ride...' : 'Publish Ride'}
        </button>
      </form>
    </div>
  );
};


// ===================================================================
// MAIN DASHBOARD COMPONENT
// ===================================================================

const Dashboard = () => {
  const { user, login } = useAuth();
  
  const [activePage, setActivePage] = useState('rides');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRiderMode, setIsRiderMode] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [logoShake, setLogoShake] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [rides, setRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(false);
  
  // ✅ State for ride details modal
  const [selectedRide, setSelectedRide] = useState(null);
  const [showRideDetailsModal, setShowRideDetailsModal] = useState(false);
  
  const [userFormData, setUserFormData] = useState({
    username: '',
    phone: ''
  });

  const fetchRides = async () => {
    setLoadingRides(true);
    try {
      if (isRiderMode) {
        const response = await rideAPI.getMyRides();
        console.log('✅ My rides fetched:', response.count);
        const activeRides = (response.rides || []).filter(ride => ride.status !== 'cancelled');
        setRides(activeRides);
      } else {
        const filters = {};
        if (vehicleFilter !== 'all') {
          filters.vehicleType = vehicleFilter;
        }
        const response = await rideAPI.getAllRides(filters);
        console.log('✅ All rides fetched:', response.count);
        setRides(response.rides || []);
      }
    } catch (error) {
      console.error('Error fetching rides:', error);
      setRides([]);
    } finally {
      setLoadingRides(false);
    }
  };

  const handleDeleteRide = async (ride) => {
    try {
      await rideAPI.deleteRide(ride.id);
      console.log('✅ Ride cancelled successfully');
      setRides(prevRides => prevRides.filter(item => item.id !== ride.id));
    } catch (error) {
      console.error('Error cancelling ride:', error);
      alert(error.response?.data?.message || 'Failed to cancel ride');
    }
  };

  // ✅ Handle view ride details
  const handleViewRideDetails = (rideData) => {
    setSelectedRide(rideData);
    setShowRideDetailsModal(true);
  };

  const closeRideDetailsModal = () => {
    setShowRideDetailsModal(false);
    setSelectedRide(null);
  };

  useEffect(() => {
    fetchRides();
  }, [isRiderMode, vehicleFilter]);

  const handleNavigation = (page) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleModeDropdown = () => {
    setIsModeDropdownOpen(!isModeDropdownOpen);
  };

  const switchMode = () => {
    if (!isRiderMode && !user?.isVerifiedRider) {
      alert('You need to be verified as a rider to access rider mode. Please complete your verification process.');
      setIsModeDropdownOpen(false);
      return;
    }

    setIsRiderMode(!isRiderMode);
    setIsModeDropdownOpen(false);
    setActivePage('rides');
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setLogoShake(true);
    setTimeout(() => setLogoShake(false), 500);
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUserInfo = async () => {
    setIsUpdating(true);
    setUpdateMessage('');

    try {
      const response = await userAPI.updateInfo({
        username: userFormData.username,
        phone: userFormData.phone
      });

      const token = localStorage.getItem('token');
      login(response.user, token);

      setUpdateMessage('Profile updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      console.error('Update error:', error);
      setUpdateMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'rides':
        return (
          <div className="rides-page">
            <div className="page-header">
              <h1>{isRiderMode ? 'Your Posted Rides' : 'Available Rides'}</h1>
              <p>{isRiderMode ? 'Manage your offered rides' : 'Find your perfect ride'}</p>
              
              {!isRiderMode && (
                <div className="vehicle-filters">
                  <button
                    className={`filter-btn ${vehicleFilter === 'bike' ? 'active' : ''}`}
                    onClick={() => setVehicleFilter(vehicleFilter === 'bike' ? 'all' : 'bike')}
                  >
                    <img src="/icons/bike logo.jpg" alt="Bike" style={{ width: '1.5rem', height: '1.5rem', flexShrink: 0 }} />
                    <span>Bikes</span>
                  </button>

                  <button
                    className={`filter-btn ${vehicleFilter === 'car' ? 'active' : ''}`}
                    onClick={() => setVehicleFilter(vehicleFilter === 'car' ? 'all' : 'car')}
                  >
                    <img src="/icons/car logo.jpg" alt="Car" style={{ width: '1.5rem', height: '1.5rem', flexShrink: 0 }} />
                    <span>Cars</span>
                  </button>
                </div>
              )}
            </div>
            
            {loadingRides ? (
              <div className="loading-state">Loading rides...</div>
            ) : rides.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3>{isRiderMode ? 'No rides posted yet' : 'No rides available'}</h3>
                <p>{isRiderMode ? 'Start offering rides to fellow travelers' : 'Check back later for available rides'}</p>
              </div>
            ) : (
              <div className="rides-grid">
                {rides.map(ride => (
                  <div key={ride.id} className="ride-card-wrapper">
                    <RideCard
                      ride={{
                        id: ride.id,
                        driverName: ride.rider?.username || 'Anonymous',
                        driverRating: 4.5,
                        driverPhone: ride.rider?.phone || '',
                        driverPhoto: ride.rider?.profilePicture || null,
                        driverTotalRides: ride.rider?.totalRides || 0,
                        from: ride.from,
                        to: ride.to,
                        date: ride.date,
                        time: ride.time,
                        price: ride.price || 0,
                        availableSeats: ride.availableSeats || 0,
                        vehicleType: ride.vehicleType === 'bike' ? 'Bike' : 'Car',
                        isVerified: ride.rider?.isVerifiedRider || false,
                        pickupLocation: ride.pickupLocation,
                        vehicleNumber: ride.vehicleNumber,
                        vehiclePhoto: ride.vehiclePhoto,
                        description: ride.description
                      }}
                      onViewDetails={handleViewRideDetails}
                    />
                    {isRiderMode && (
                      <button
                        className="btn-delete-cross"
                        onClick={() => {
                          if (window.confirm(`Do you want to delete your posted ride from ${ride.from} to ${ride.to}?`)) {
                            handleDeleteRide(ride);
                          }
                        }}
                        title="Delete Ride"
                        aria-label="Delete Ride"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="history-page">
            <div className="page-header">
              <h1>Your Rides History</h1>
              <p>View your past bookings and trips</p>
            </div>
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>No ride history yet</h3>
              <p>Your completed rides will appear here</p>
            </div>
          </div>
        );

      case 'add-issue':
        return (
          <div className="add-issue-page">
            <div className="page-header">
              <h1>Raise an Issue</h1>
              <p>Report any problems you're facing</p>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label>Issue Type</label>
                <select className="form-input">
                  <option>Select issue type</option>
                  <option>Payment Issue</option>
                  <option>Driver/Rider Behavior</option>
                  <option>Ride Cancellation</option>
                  <option>Vehicle Condition</option>
                  <option>Technical Problem</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" className="form-input" placeholder="Brief description" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" rows="6" placeholder="Describe your issue..."></textarea>
              </div>
              <button className="btn-submit">Submit Issue</button>
            </div>
          </div>
        );

      case 'add-ride':
        return <AddRidePageComponent onRideAdded={fetchRides} onNavigate={setActivePage} />;

      // ✅ UPDATED: Changed from 'vehicle-profile' to 'update-vehicle-info'
      case 'update-vehicle-info':
        return <UpdateVehicleInfoPage />;

      case 'your-info':
        return (
          <div className="profile-page">
            <div className="page-header">
              <h1>Your Information</h1>
              <p>View and update your personal details</p>
            </div>
            
            {updateMessage && (
              <div className={`update-message ${updateMessage.includes('success') ? 'success' : 'error'}`}>
                {updateMessage}
              </div>
            )}
            
            <div className="form-container">
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  name="username"
                  className="form-input" 
                  defaultValue={user?.username || ''} 
                  onChange={handleUserFormChange}
                  onFocus={(e) => setUserFormData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={user?.email || 'Not available'} 
                  disabled 
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  className="form-input" 
                  defaultValue={user?.phone || ''} 
                  onChange={handleUserFormChange}
                  onFocus={(e) => setUserFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="97xxxxxxxx or 98xxxxxxxx"
                />
              </div>
              <div className="form-group">
                <label>Account Type</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={user?.role || 'User'} 
                  disabled 
                  style={{ textTransform: 'capitalize' }}
                />
              </div>
              <div className="form-group">
                <label>Account Created</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} 
                  disabled 
                />
              </div>
              <button 
                className="btn-submit" 
                onClick={handleUpdateUserInfo}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Information'}
              </button>
            </div>
          </div>
        );

      case 'upload-profile':
        return <UploadProfilePage />;

      case 'change-password':
        return <ChangePasswordPage />;

      case 'verify-yourself':
        return <VerifyYourselfPage />;

      case 'payment-info':
        return <PaymentMethodPage />;

      case 'update-documents':
        return (
          <div className="documents-page">
            <div className="page-header">
              <h1>Update Documents</h1>
              <p>Upload and update your documents</p>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label>Driving License</label>
                <input type="file" className="form-input" accept="image/*" />
              </div>
              <button className="btn-submit">Update</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="top-navbar">
        <div className="navbar-container">
          <div 
            className={`navbar-left ${logoShake ? 'shake' : ''}`} 
            onClick={handleLogoClick}
          >
            <img src="/images/logo.png" alt="Lift Nepal" className="navbar-logo" />
            <span className="navbar-brand">Lift Nepal</span>
          </div>

          <nav className="navbar-menu">
            <button 
              className={`nav-link ${activePage === 'rides' ? 'active' : ''}`}
              onClick={() => handleNavigation('rides')}
            >
              Rides
            </button>
            <button 
              className={`nav-link ${activePage === 'history' ? 'active' : ''}`}
              onClick={() => handleNavigation('history')}
            >
              Your Rides History
            </button>
            <button 
              className={`nav-link ${activePage === 'add-issue' ? 'active' : ''}`}
              onClick={() => handleNavigation('add-issue')}
            >
              Raise Issue
            </button>
            {isRiderMode && (
              <button 
                className={`nav-link ${activePage === 'add-ride' ? 'active' : ''}`}
                onClick={() => handleNavigation('add-ride')}
              >
                Add Ride
              </button>
            )}
          </nav>

          <div className="navbar-right">
            <button className="notification-icon" aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="notification-badge">3</span>
            </button>

            <ProfileDropdown 
              onNavigate={handleNavigation}
              isRiderMode={isRiderMode}
            />

            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <button 
            className={`mobile-nav-link ${activePage === 'rides' ? 'active' : ''}`}
            onClick={() => handleNavigation('rides')}
          >
            Rides
          </button>
          <button 
            className={`mobile-nav-link ${activePage === 'history' ? 'active' : ''}`}
            onClick={() => handleNavigation('history')}
          >
            Your Rides History
          </button>
          <button 
            className={`mobile-nav-link ${activePage === 'add-issue' ? 'active' : ''}`}
            onClick={() => handleNavigation('add-issue')}
          >
            Raise Issue
          </button>
          {isRiderMode && (
            <button 
              className={`mobile-nav-link ${activePage === 'add-ride' ? 'active' : ''}`}
              onClick={() => handleNavigation('add-ride')}
            >
              Add Ride
            </button>
          )}
        </div>
      )}

      <main className="dashboard-main-content">
        {renderContent()}
      </main>

      {/* ✅ Ride Details Modal */}
      <RideDetailsModal
        isOpen={showRideDetailsModal}
        onClose={closeRideDetailsModal}
        ride={selectedRide}
      />

      <div className="mode-toggle-container">
        <button className="mode-toggle-trigger" onClick={toggleModeDropdown}>
          <svg className="mode-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {isRiderMode ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            )}
          </svg>
          <span>{isRiderMode ? 'Rider Mode' : 'User Mode'}</span>
          <svg className={`mode-toggle-arrow ${isModeDropdownOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isModeDropdownOpen && (
          <div className="mode-toggle-dropdown">
            <button className="mode-option" onClick={switchMode}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {isRiderMode ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                )}
              </svg>
              <span>{isRiderMode ? 'User Mode' : 'Rider Mode'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

// END OF PART 2 - DASHBOARD.JSX COMPLETE ✅