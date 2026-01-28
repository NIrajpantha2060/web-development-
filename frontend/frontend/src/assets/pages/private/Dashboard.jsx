



// import { useState, useRef } from 'react';
// import RideCard from '../../components/RideCard';
// import ProfileDropdown from '../../components/ProfileDropdown';
// import { useAuth } from '../../../context/AuthContext';
// import { userAPI } from '../../../services/api';
// import '../../css/Dashboard.css';

// // ✅ Upload Profile Page Component
// const UploadProfilePage = () => {
//   const { user, setUser } = useAuth();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const getProfilePictureUrl = () => {
//     if (user?.profilePicture) {
//       return `http://localhost:5000${user.profilePicture}`;
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
      
//       const updatedUserData = await userAPI.getInfo();
//       setUser(updatedUserData.user);

//       setMessage({ type: 'success', text: 'Profile picture uploaded successfully!' });
//       setSelectedFile(null);
//       setPreviewUrl(null);
      
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
      
//       const updatedUserData = await userAPI.getInfo();
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

// const Dashboard = () => {
//   const { user, login } = useAuth();
  
//   const [activePage, setActivePage] = useState('rides');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isRiderMode, setIsRiderMode] = useState(false);
//   const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
//   const [logoShake, setLogoShake] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [updateMessage, setUpdateMessage] = useState('');
  
//   // Form state for user info
//   const [userFormData, setUserFormData] = useState({
//     username: '',
//     phone: ''
//   });

//   const mockRides = [
//     {
//       id: 1,
//       driverName: 'Suman Shrestha',
//       driverRating: 4.8,
//       from: 'Kathmandu',
//       to: 'Pokhara',
//       date: '2026-01-22',
//       time: '08:00 AM',
//       price: 1500,
//       availableSeats: 3,
//       vehicleType: 'Sedan',
//       isVerified: true
//     },
//     {
//       id: 2,
//       driverName: 'Prakash Thapa',
//       driverRating: 4.6,
//       from: 'Lalitpur',
//       to: 'Chitwan',
//       date: '2026-01-23',
//       time: '09:30 AM',
//       price: 1200,
//       availableSeats: 2,
//       vehicleType: 'SUV',
//       isVerified: true
//     },
//     {
//       id: 3,
//       driverName: 'Maya Gurung',
//       driverRating: 4.9,
//       from: 'Bhaktapur',
//       to: 'Nagarkot',
//       date: '2026-01-24',
//       time: '06:00 AM',
//       price: 800,
//       availableSeats: 4,
//       vehicleType: 'Hatchback',
//       isVerified: true
//     }
//   ];

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
//     setIsRiderMode(!isRiderMode);
//     setIsModeDropdownOpen(false);
//     setActivePage('rides');
//   };

//   const handleLogoClick = (e) => {
//     e.preventDefault();
//     setLogoShake(true);
//     setTimeout(() => setLogoShake(false), 500);
//   };

//   // Handle form input changes
//   const handleUserFormChange = (e) => {
//     const { name, value } = e.target;
//     setUserFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle update user info
//   const handleUpdateUserInfo = async () => {
//     setIsUpdating(true);
//     setUpdateMessage('');

//     try {
//       const response = await userAPI.updateInfo({
//         username: userFormData.username,
//         phone: userFormData.phone
//       });

//       // Update the user context with new data
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
//             </div>
//             {isRiderMode ? (
//               <div className="empty-state">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 <h3>No rides posted yet</h3>
//                 <p>Start offering rides to fellow travelers</p>
//               </div>
//             ) : (
//               <div className="rides-grid">
//                 {mockRides.map(ride => (
//                   <RideCard key={ride.id} ride={ride} />
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
//         return (
//           <div className="add-ride-page">
//             <div className="page-header">
//               <h1>Add New Ride</h1>
//               <p>Offer a ride to fellow travelers</p>
//             </div>
//             <div className="form-container">
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>From</label>
//                   <input type="text" className="form-input" placeholder="Starting location" />
//                 </div>
//                 <div className="form-group">
//                   <label>To</label>
//                   <input type="text" className="form-input" placeholder="Destination" />
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Date</label>
//                   <input type="date" className="form-input" />
//                 </div>
//                 <div className="form-group">
//                   <label>Time</label>
//                   <input type="time" className="form-input" />
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Price per Seat (NPR)</label>
//                   <input type="number" className="form-input" placeholder="500" />
//                 </div>
//                 <div className="form-group">
//                   <label>Available Seats</label>
//                   <input type="number" className="form-input" placeholder="3" />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Vehicle Type</label>
//                 <select className="form-input">
//                   <option>Select vehicle type</option>
//                   <option>Sedan</option>
//                   <option>SUV</option>
//                   <option>Hatchback</option>
//                   <option>Van</option>
//                 </select>
//               </div>
//               <button className="btn-submit">Publish Ride</button>
//             </div>
//           </div>
//         );

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

//       case 'verify-yourself':
//         return (
//           <div className="verify-page">
//             <div className="page-header">
//               <h1>Verify Yourself</h1>
//               <p>Upload your identity documents</p>
//             </div>
//             <div className="form-container">
//               <div className="form-group">
//                 <label>Document Type</label>
//                 <select className="form-input">
//                   <option>Citizenship</option>
//                   <option>Driving License</option>
//                   <option>Passport</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Document Number</label>
//                 <input type="text" className="form-input" />
//               </div>
//               <div className="form-group">
//                 <label>Upload Document</label>
//                 <input type="file" className="form-input" accept="image/*" />
//               </div>
//               <button className="btn-submit">Submit</button>
//             </div>
//           </div>
//         );

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


import { useState, useRef, useEffect } from 'react';
import RideCard from '../../components/RideCard';
import ProfileDropdown from '../../components/ProfileDropdown';
import { useAuth } from '../../../context/AuthContext';
import { userAPI, verificationAPI } from '../../../services/api';
import '../../css/Dashboard.css';

// ✅ Upload Profile Page Component
const UploadProfilePage = () => {
  const { user, setUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ FIXED: Add cache busting to prevent browser caching
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

  // ✅ FIXED: Better async handling and refresh prevention
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      await userAPI.uploadProfilePicture(selectedFile);
      
      // ✅ FIX: Add delay to ensure server processed the upload
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // ✅ FIX: Fetch fresh user data from server
      const updatedUserData = await userAPI.getInfo();
      console.log('📸 Profile picture updated:', updatedUserData.user.profilePicture);
      
      // ✅ FIX: Update user context (updates both state and localStorage)
      setUser(updatedUserData.user);

      setMessage({ type: 'success', text: 'Profile picture uploaded successfully!' });
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // ✅ FIX: Clear file input
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

  // ✅ FIXED: Same improvements for delete
  const handleDelete = async () => {
    if (!user?.profilePicture) return;

    if (!window.confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      await userAPI.deleteProfilePicture();
      
      // ✅ FIX: Add delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // ✅ FIX: Fetch fresh user data
      const updatedUserData = await userAPI.getInfo();
      console.log('🗑️ Profile picture deleted');
      
      // ✅ FIX: Update user context
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

// ✅ Verify Yourself Page Component
const VerifyYourselfPage = () => {
  const { user, setUser } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    citizenshipNumber: '',
    drivingLicenseNumber: '',
    verificationType: 'user_only'
  });

  const [files, setFiles] = useState({
    citizenshipFront: null,
    citizenshipBack: null,
    drivingLicenseFront: null,
    drivingLicenseBack: null
  });

  const [previews, setPreviews] = useState({
    citizenshipFront: null,
    citizenshipBack: null,
    drivingLicenseFront: null,
    drivingLicenseBack: null
  });

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const data = await verificationAPI.getStatus();
      setVerificationStatus(data);
    } catch (error) {
      console.error('Error fetching verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please select a valid file (JPEG, PNG, PDF)' });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 10MB' });
        return;
      }

      setFiles(prev => ({ ...prev, [fieldName]: file }));
      
      if (file.type.startsWith('image/')) {
        setPreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
      } else {
        setPreviews(prev => ({ ...prev, [fieldName]: null }));
      }
      
      setMessage({ type: '', text: '' });
    }
  };

  // ✅ FIXED: Better form submission handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files.citizenshipFront || !files.citizenshipBack) {
      setMessage({ type: 'error', text: 'Please upload both sides of your citizenship' });
      return;
    }

    if ((formData.verificationType === 'rider' || formData.verificationType === 'both') &&
        (!files.drivingLicenseFront || !files.drivingLicenseBack)) {
      setMessage({ type: 'error', text: 'Please upload both sides of your driving license for rider verification' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // ✅ FIX: Create FormData properly
      const submitFormData = new FormData();
      submitFormData.append('citizenshipNumber', formData.citizenshipNumber);
      submitFormData.append('verificationType', formData.verificationType);
      
      // ✅ FIX: Always append citizenship files
      submitFormData.append('citizenshipFront', files.citizenshipFront);
      submitFormData.append('citizenshipBack', files.citizenshipBack);
      
      // ✅ FIX: Only append license fields if provided
      if (formData.verificationType === 'rider' || formData.verificationType === 'both') {
        submitFormData.append('drivingLicenseNumber', formData.drivingLicenseNumber);
        submitFormData.append('drivingLicenseFront', files.drivingLicenseFront);
        submitFormData.append('drivingLicenseBack', files.drivingLicenseBack);
      }

      // ✅ FIX: Debug logging
      console.log('📤 Submitting verification...');
      console.log('Form data keys:', Array.from(submitFormData.keys()));
      
      // ✅ FIX: Wait for API response
      const response = await verificationAPI.submitVerification(submitFormData);
      
      console.log('✅ Verification submitted:', response);
      
      // ✅ FIX: Show success message immediately
      setMessage({ type: 'success', text: 'Verification request submitted successfully! ✅' });
      
      // ✅ FIX: Clear form immediately
      setFormData({
        citizenshipNumber: '',
        drivingLicenseNumber: '',
        verificationType: 'user_only'
      });
      setFiles({
        citizenshipFront: null,
        citizenshipBack: null,
        drivingLicenseFront: null,
        drivingLicenseBack: null
      });
      setPreviews({
        citizenshipFront: null,
        citizenshipBack: null,
        drivingLicenseFront: null,
        drivingLicenseBack: null
      });
      
      // ✅ FIX: Clear file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');
      
      // ✅ FIX: Fetch updated status after delay
      setTimeout(async () => {
        await fetchVerificationStatus();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Verification submit error:', error);
      console.error('Error response:', error.response?.data);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit verification request. Please try again.'
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

  const getVerificationBadge = () => {
    if (verificationStatus?.isVerifiedUser && verificationStatus?.isVerifiedRider) {
      return <span className="badge badge-purple">✓ Fully Verified (User + Rider)</span>;
    } else if (verificationStatus?.isVerifiedRider) {
      return <span className="badge badge-purple">✓ Verified Rider</span>;
    } else if (verificationStatus?.isVerifiedUser) {
      return <span className="badge badge-green">✓ Verified User</span>;
    } else {
      return <span className="badge badge-gray">⚠ Unverified</span>;
    }
  };

  const isPending = verificationStatus?.verification?.status === 'pending';
  const isRejected = verificationStatus?.verification?.status === 'rejected';

  return (
    <div className="verify-page">
      <div className="page-header">
        <h1>Verify Yourself</h1>
        <p>Upload your identity documents</p>
        {getVerificationBadge()}
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
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Verification Type *</label>
            <select 
              name="verificationType"
              className="form-input"
              value={formData.verificationType}
              onChange={handleInputChange}
              required
            >
              <option value="user_only">User Only (Citizenship only)</option>
              <option value="rider">Rider Only (Citizenship + Driving License)</option>
              <option value="both">Both User & Rider</option>
            </select>
            <small className="form-help">
              • User Only: Request rides only (Green tick ✓)<br />
              • Rider: Offer rides only (Purple tick ✓)<br />
              • Both: Request and offer rides
            </small>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Citizenship Documents *</h3>
          
          <div className="form-group">
            <label>Citizenship Number *</label>
            <input 
              type="text"
              name="citizenshipNumber"
              className="form-input"
              value={formData.citizenshipNumber}
              onChange={handleInputChange}
              placeholder="Enter citizenship number"
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
                onChange={(e) => handleFileChange(e, 'citizenshipFront')}
                required
              />
              {previews.citizenshipFront && (
                <img src={previews.citizenshipFront} alt="Preview" className="file-preview" />
              )}
            </div>

            <div className="form-group">
              <label>Citizenship Back *</label>
              <input 
                type="file"
                className="form-input"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, 'citizenshipBack')}
                required
              />
              {previews.citizenshipBack && (
                <img src={previews.citizenshipBack} alt="Preview" className="file-preview" />
              )}
            </div>
          </div>

          {(formData.verificationType === 'rider' || formData.verificationType === 'both') && (
            <>
              <h3 style={{ marginTop: '2rem' }}>Driving License Documents *</h3>
              
              <div className="form-group">
                <label>Driving License Number *</label>
                <input 
                  type="text"
                  name="drivingLicenseNumber"
                  className="form-input"
                  value={formData.drivingLicenseNumber}
                  onChange={handleInputChange}
                  placeholder="Enter driving license number"
                  required={formData.verificationType === 'rider' || formData.verificationType === 'both'}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Driving License Front *</label>
                  <input 
                    type="file"
                    className="form-input"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, 'drivingLicenseFront')}
                    required={formData.verificationType === 'rider' || formData.verificationType === 'both'}
                  />
                  {previews.drivingLicenseFront && (
                    <img src={previews.drivingLicenseFront} alt="Preview" className="file-preview" />
                  )}
                </div>

                <div className="form-group">
                  <label>Driving License Back *</label>
                  <input 
                    type="file"
                    className="form-input"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, 'drivingLicenseBack')}
                    required={formData.verificationType === 'rider' || formData.verificationType === 'both'}
                  />
                  {previews.drivingLicenseBack && (
                    <img src={previews.drivingLicenseBack} alt="Preview" className="file-preview" />
                  )}
                </div>
              </div>
            </>
          )}

          <button 
            type="submit"
            className="btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Verification Request'}
          </button>
        </form>
      )}
    </div>
  );
};

// ✅ Main Dashboard Component (NO CHANGES NEEDED - keeping your original code)
const Dashboard = () => {
  const { user, login } = useAuth();
  
  const [activePage, setActivePage] = useState('rides');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRiderMode, setIsRiderMode] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [logoShake, setLogoShake] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  
  const [userFormData, setUserFormData] = useState({
    username: '',
    phone: ''
  });

  const mockRides = [
    {
      id: 1,
      driverName: 'Suman Shrestha',
      driverRating: 4.8,
      from: 'Kathmandu',
      to: 'Pokhara',
      date: '2026-01-22',
      time: '08:00 AM',
      price: 1500,
      availableSeats: 3,
      vehicleType: 'Sedan',
      isVerified: true
    },
    {
      id: 2,
      driverName: 'Prakash Thapa',
      driverRating: 4.6,
      from: 'Lalitpur',
      to: 'Chitwan',
      date: '2026-01-23',
      time: '09:30 AM',
      price: 1200,
      availableSeats: 2,
      vehicleType: 'SUV',
      isVerified: true
    },
    {
      id: 3,
      driverName: 'Maya Gurung',
      driverRating: 4.9,
      from: 'Bhaktapur',
      to: 'Nagarkot',
      date: '2026-01-24',
      time: '06:00 AM',
      price: 800,
      availableSeats: 4,
      vehicleType: 'Hatchback',
      isVerified: true
    }
  ];

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
            </div>
            {isRiderMode ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3>No rides posted yet</h3>
                <p>Start offering rides to fellow travelers</p>
              </div>
            ) : (
              <div className="rides-grid">
                {mockRides.map(ride => (
                  <RideCard key={ride.id} ride={ride} />
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
        return (
          <div className="add-ride-page">
            <div className="page-header">
              <h1>Add New Ride</h1>
              <p>Offer a ride to fellow travelers</p>
            </div>
            <div className="form-container">
              <div className="form-row">
                <div className="form-group">
                  <label>From</label>
                  <input type="text" className="form-input" placeholder="Starting location" />
                </div>
                <div className="form-group">
                  <label>To</label>
                  <input type="text" className="form-input" placeholder="Destination" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" className="form-input" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price per Seat (NPR)</label>
                  <input type="number" className="form-input" placeholder="500" />
                </div>
                <div className="form-group">
                  <label>Available Seats</label>
                  <input type="number" className="form-input" placeholder="3" />
                </div>
              </div>
              <div className="form-group">
                <label>Vehicle Type</label>
                <select className="form-input">
                  <option>Select vehicle type</option>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Hatchback</option>
                  <option>Van</option>
                </select>
              </div>
              <button className="btn-submit">Publish Ride</button>
            </div>
          </div>
        );

      case 'vehicle-profile':
        return (
          <div className="vehicle-profile-page">
            <div className="page-header">
              <h1>Vehicle Profile</h1>
              <p>Upload and manage your vehicle information</p>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label>Vehicle Number</label>
                <input type="text" className="form-input" placeholder="BA 1 KHA 1234" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Brand</label>
                  <input type="text" className="form-input" placeholder="Toyota" />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input type="text" className="form-input" placeholder="Corolla" />
                </div>
              </div>
              <div className="form-group">
                <label>Upload Vehicle Photos</label>
                <input type="file" className="form-input" accept="image/*" multiple />
              </div>
              <button className="btn-submit">Save Vehicle Profile</button>
            </div>
          </div>
        );

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

      case 'verify-yourself':
        return <VerifyYourselfPage />;

      case 'payment-info':
        return (
          <div className="payment-page">
            <div className="page-header">
              <h1>Payment Information</h1>
              <p>Manage your payment methods</p>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label>Payment Method</label>
                <select className="form-input">
                  <option>eSewa</option>
                  <option>Khalti</option>
                  <option>Bank Account</option>
                </select>
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input type="text" className="form-input" />
              </div>
              <button className="btn-submit">Save</button>
            </div>
          </div>
        );

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