

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import '../css/ProfileDropdown.css';

// const ProfileDropdown = ({ onNavigate, isRiderMode }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const currentUser = user || {
//     username: 'Guest',
//     email: 'guest@example.com'
//   };

//   const handleNavigation = (page) => {
//     if (onNavigate) {
//       onNavigate(page);
//     }
//     setIsOpen(false);
//   };

//   const getInitials = (name) => {
//     return name.split(' ').map(n => n[0]).join('').toUpperCase();
//   };

//   const getProfilePictureUrl = () => {
//     if (user?.profilePicture) {
//       return `http://localhost:5000${user.profilePicture}`;
//     }
//     return null;
//   };

//   const isVerified = user?.isVerifiedUser || user?.isVerifiedRider;

//   return (
//     <div className="profile-dropdown-container">
//       <button
//         className="profile-btn"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="profile-avatar-container">
//           {getProfilePictureUrl() ? (
//             <img
//               src={getProfilePictureUrl()}
//               alt="Profile"
//               className="profile-avatar"
//             />
//           ) : (
//             <div className="profile-avatar-placeholder">
//               {getInitials(currentUser.username)}
//             </div>
//           )}
//           {/* ✅ UPDATED: Professional verification badges (Facebook/Instagram style) - No text, just checkmark */}
//           {user?.isVerifiedRider ? (
//             <div className="verification-tick rider-tick" title="Verified Rider"></div>
//           ) : user?.isVerifiedUser ? (
//             <div className="verification-tick user-tick" title="Verified User"></div>
//           ) : null}
//         </div>
//       </button>

//       {isOpen && (
//         <>
//           <div className="dropdown-overlay" onClick={() => setIsOpen(false)}></div>
//           <div className="dropdown-menu">
//             <div className="dropdown-header">
//               <div className="user-info">
//                 {getProfilePictureUrl() ? (
//                   <img 
//                     src={getProfilePictureUrl()} 
//                     alt="Profile" 
//                     className="user-avatar"
//                   />
//                 ) : (
//                   <div className="user-avatar-placeholder">
//                     {getInitials(currentUser.username)}
//                   </div>
//                 )}
//                 <div className="user-details">
//                   <h4>{currentUser.username}</h4>
//                   <p>{currentUser.email}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="dropdown-divider"></div>

//             <div className="dropdown-items">
//               <button 
//                 className="dropdown-item"
//                 onClick={() => handleNavigation('your-info')}
//               >
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 <span>Your Info</span>
//               </button>

//               <button 
//                 className="dropdown-item"
//                 onClick={() => handleNavigation('upload-profile')}
//               >
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span>Upload Profile</span>
//               </button>

//               <button
//                 className="dropdown-item"
//                 onClick={() => handleNavigation('verify-yourself')}
//               >
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//                 <span>{isVerified ? 'Update Verification' : 'Verify Yourself'}</span>
//               </button>

//               <button
//                 className="dropdown-item"
//                 onClick={() => handleNavigation('change-password')}
//               >
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
//                 </svg>
//                 <span>Change Password</span>
//               </button>

//               <button 
//                 className="dropdown-item"
//                 onClick={() => handleNavigation('payment-info')}
//               >
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                 </svg>
//                 <span>Payment Info</span>
//               </button>

//               <button 
//                 className="dropdown-item"
//                 onClick={() => handleNavigation('update-documents')}
//               >
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 <span>Update Documents</span>
//               </button>

//               {isRiderMode && (
//                 <button 
//                   className="dropdown-item"
//                   onClick={() => handleNavigation('vehicle-profile')}
//                 >
//                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                   </svg>
//                   <span>Upload Vehicle Profile</span>
//                 </button>
//               )}

//               <div className="dropdown-divider"></div>

//               <button className="dropdown-item logout-item" onClick={() => { logout(); navigate('/login'); }}>
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ProfileDropdown;



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../css/ProfileDropdown.css';

const ProfileDropdown = ({ onNavigate, isRiderMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const currentUser = user || {
    username: 'Guest',
    email: 'guest@example.com'
  };

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsOpen(false);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getProfilePictureUrl = () => {
    if (user?.profilePicture) {
      return `http://localhost:5000${user.profilePicture}`;
    }
    return null;
  };

  const isVerified = user?.isVerifiedUser || user?.isVerifiedRider;

  return (
    <div className="profile-dropdown-container">
      <button
        className="profile-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="profile-avatar-container">
          {getProfilePictureUrl() ? (
            <img
              src={getProfilePictureUrl()}
              alt="Profile"
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {getInitials(currentUser.username)}
            </div>
          )}
          {user?.isVerifiedRider ? (
            <div className="verification-tick rider-tick" title="Verified Rider"></div>
          ) : user?.isVerifiedUser ? (
            <div className="verification-tick user-tick" title="Verified User"></div>
          ) : null}
        </div>
      </button>

      {isOpen && (
        <>
          <div className="dropdown-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <div className="user-info">
                {getProfilePictureUrl() ? (
                  <img 
                    src={getProfilePictureUrl()} 
                    alt="Profile" 
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {getInitials(currentUser.username)}
                  </div>
                )}
                <div className="user-details">
                  <h4>{currentUser.username}</h4>
                  <p>{currentUser.email}</p>
                </div>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-items">
              <button 
                className="dropdown-item"
                onClick={() => handleNavigation('your-info')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Your Info</span>
              </button>

              <button 
                className="dropdown-item"
                onClick={() => handleNavigation('upload-profile')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Upload Profile</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => handleNavigation('verify-yourself')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{isVerified ? 'Update Verification' : 'Verify Yourself'}</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => handleNavigation('change-password')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Change Password</span>
              </button>

              <button 
                className="dropdown-item"
                onClick={() => handleNavigation('payment-info')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Payment Info</span>
              </button>

              {/* ✅ UPDATED: Changed "Upload Vehicle Profile" to "Update Vehicle Info" */}
              {isRiderMode && (
                <button 
                  className="dropdown-item"
                  onClick={() => handleNavigation('update-vehicle-info')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Update Vehicle Info</span>
                </button>
              )}

              <div className="dropdown-divider"></div>

              <button className="dropdown-item logout-item" onClick={() => { logout(); navigate('/login'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;