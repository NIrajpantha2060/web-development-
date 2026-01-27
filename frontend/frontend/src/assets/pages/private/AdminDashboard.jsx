// import React from "react";
// import { useAuth } from "../../../context/AuthContext";
// import { useNavigate } from 'react-router-dom';
// import '../../css/Dashboard.css';
// import '../../css/AdminDashboard.css';

// const AdminDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <div className="admin-container">
//       <header className="admin-header">
//         <h1>Lift Nepal – Admin Panel</h1>
//         <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">
//           Logout
//         </button>
//       </header>

//       <div className="admin-info">
//         <h2>Welcome, {user?.username}</h2>
//         <p>Role: {user?.role}</p>
//       </div>

//       <div className="admin-cards">
//         <div className="admin-card">👤 Manage Users</div>
//         <div className="admin-card">🚗 Manage Rides</div>
//         <div className="admin-card">📄 Reports</div>
//         <div className="admin-card">⚙️ Settings</div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../../context/AuthContext";
// import { useNavigate } from 'react-router-dom';
// import { adminAPI } from '../../../services/api';
// import '../../css/Dashboard.css';
// import '../../css/AdminDashboard.css';

// const AdminDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [activePage, setActivePage] = useState('pending-verifications');
//   const [verifications, setVerifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedVerification, setSelectedVerification] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
//   const [remarks, setRemarks] = useState('');
//   const [approvalType, setApprovalType] = useState('user'); // 'user', 'rider', 'both'
//   const [message, setMessage] = useState({ type: '', text: '' });

//   useEffect(() => {
//     if (activePage === 'pending-verifications') {
//       fetchPendingVerifications();
//     } else if (activePage === 'all-verifications') {
//       fetchAllVerifications();
//     }
//   }, [activePage]);

//   const fetchPendingVerifications = async () => {
//     setLoading(true);
//     try {
//       const data = await adminAPI.getPendingVerifications();
//       setVerifications(data.verifications);
//     } catch (error) {
//       console.error('Error fetching pending verifications:', error);
//       setMessage({ type: 'error', text: 'Failed to load pending verifications' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllVerifications = async () => {
//     setLoading(true);
//     try {
//       const data = await adminAPI.getAllVerifications();
//       setVerifications(data.verifications);
//     } catch (error) {
//       console.error('Error fetching all verifications:', error);
//       setMessage({ type: 'error', text: 'Failed to load verifications' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openApprovalModal = (verification) => {
//     setSelectedVerification(verification);
//     setActionType('approve');
//     setRemarks('');
//     setApprovalType('user');
//     setShowModal(true);
//   };

//   const openRejectionModal = (verification) => {
//     setSelectedVerification(verification);
//     setActionType('reject');
//     setRemarks('');
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedVerification(null);
//     setRemarks('');
//     setApprovalType('user');
//   };

//   const handleApprove = async () => {
//     if (!selectedVerification) return;

//     try {
//       await adminAPI.approveVerification(
//         selectedVerification.id,
//         approvalType,
//         remarks
//       );

//       setMessage({ type: 'success', text: `Verification approved as ${approvalType}!` });
//       closeModal();
      
//       // Refresh the list
//       if (activePage === 'pending-verifications') {
//         fetchPendingVerifications();
//       } else {
//         fetchAllVerifications();
//       }

//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     } catch (error) {
//       console.error('Error approving verification:', error);
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.message || 'Failed to approve verification'
//       });
//     }
//   };

//   const handleReject = async () => {
//     if (!selectedVerification) return;
    
//     if (!remarks.trim()) {
//       setMessage({ type: 'error', text: 'Please provide a reason for rejection' });
//       return;
//     }

//     try {
//       await adminAPI.rejectVerification(selectedVerification.id, remarks);

//       setMessage({ type: 'success', text: 'Verification rejected successfully!' });
//       closeModal();
      
//       // Refresh the list
//       if (activePage === 'pending-verifications') {
//         fetchPendingVerifications();
//       } else {
//         fetchAllVerifications();
//       }

//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     } catch (error) {
//       console.error('Error rejecting verification:', error);
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.message || 'Failed to reject verification'
//       });
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: <span className="badge badge-orange">⏳ Pending</span>,
//       approved_user: <span className="badge badge-green">✓ Approved (User)</span>,
//       approved_rider: <span className="badge badge-purple">✓ Approved (Rider)</span>,
//       approved_both: <span className="badge badge-purple">✓ Approved (Both)</span>,
//       rejected: <span className="badge badge-gray">✗ Rejected</span>
//     };
//     return badges[status] || status;
//   };

//   const renderVerificationCard = (verification) => {
//     const hasLicense = verification.drivingLicenseFront && verification.drivingLicenseBack;
    
//     return (
//       <div key={verification.id} className="verification-card">
//         <div className="verification-header">
//           <div className="user-info-section">
//             {verification.user?.profilePicture ? (
//               <img 
//                 src={`http://localhost:5000${verification.user.profilePicture}`}
//                 alt={verification.user.username}
//                 className="user-avatar-small"
//               />
//             ) : (
//               <div className="user-avatar-placeholder-small">
//                 {verification.user?.username?.charAt(0).toUpperCase()}
//               </div>
//             )}
//             <div>
//               <h3>{verification.user?.username}</h3>
//               <p>{verification.user?.email}</p>
//               <p style={{ fontSize: '0.85rem', color: '#666' }}>
//                 Phone: {verification.user?.phone}
//               </p>
//             </div>
//           </div>
//           <div>
//             {getStatusBadge(verification.status)}
//           </div>
//         </div>

//         <div className="verification-details">
//           <div className="detail-row">
//             <strong>Verification Type:</strong>
//             <span style={{ textTransform: 'capitalize' }}>
//               {verification.verificationType.replace('_', ' ')}
//             </span>
//           </div>
//           <div className="detail-row">
//             <strong>Citizenship Number:</strong>
//             <span>{verification.citizenshipNumber}</span>
//           </div>
//           {hasLicense && (
//             <div className="detail-row">
//               <strong>License Number:</strong>
//               <span>{verification.drivingLicenseNumber}</span>
//             </div>
//           )}
//           <div className="detail-row">
//             <strong>Submitted:</strong>
//             <span>{new Date(verification.submittedAt).toLocaleString()}</span>
//           </div>
//         </div>

//         <div className="document-previews">
//           <h4>Citizenship Documents:</h4>
//           <div className="document-images">
//             <a 
//               href={`http://localhost:5000${verification.citizenshipFront}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <img 
//                 src={`http://localhost:5000${verification.citizenshipFront}`}
//                 alt="Citizenship Front"
//                 className="document-thumbnail"
//               />
//               <p>Front</p>
//             </a>
//             <a 
//               href={`http://localhost:5000${verification.citizenshipBack}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <img 
//                 src={`http://localhost:5000${verification.citizenshipBack}`}
//                 alt="Citizenship Back"
//                 className="document-thumbnail"
//               />
//               <p>Back</p>
//             </a>
//           </div>

//           {hasLicense && (
//             <>
//               <h4 style={{ marginTop: '1rem' }}>Driving License Documents:</h4>
//               <div className="document-images">
//                 <a 
//                   href={`http://localhost:5000${verification.drivingLicenseFront}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img 
//                     src={`http://localhost:5000${verification.drivingLicenseFront}`}
//                     alt="License Front"
//                     className="document-thumbnail"
//                   />
//                   <p>Front</p>
//                 </a>
//                 <a 
//                   href={`http://localhost:5000${verification.drivingLicenseBack}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img 
//                     src={`http://localhost:5000${verification.drivingLicenseBack}`}
//                     alt="License Back"
//                     className="document-thumbnail"
//                   />
//                   <p>Back</p>
//                 </a>
//               </div>
//             </>
//           )}
//         </div>

//         {verification.adminRemarks && (
//           <div className="admin-remarks">
//             <strong>Admin Remarks:</strong>
//             <p>{verification.adminRemarks}</p>
//           </div>
//         )}

//         {verification.status === 'pending' && (
//           <div className="verification-actions">
//             <button 
//               className="btn-approve"
//               onClick={() => openApprovalModal(verification)}
//             >
//               ✓ Approve
//             </button>
//             <button 
//               className="btn-reject"
//               onClick={() => openRejectionModal(verification)}
//             >
//               ✗ Reject
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderContent = () => {
//     if (loading) {
//       return <div className="loading-state">Loading verifications...</div>;
//     }

//     if (verifications.length === 0) {
//       return (
//         <div className="empty-state">
//           <h3>No verifications found</h3>
//           <p>
//             {activePage === 'pending-verifications' 
//               ? 'There are no pending verification requests at the moment.'
//               : 'No verification records available.'}
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div className="verifications-grid">
//         {verifications.map(renderVerificationCard)}
//       </div>
//     );
//   };

//   return (
//     <div className="admin-container">
//       <header className="admin-header">
//         <h1>🚗 Lift Nepal – Admin Panel</h1>
//         <div className="admin-header-right">
//           <span className="admin-name">Welcome, {user?.username}</span>
//           <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">
//             Logout
//           </button>
//         </div>
//       </header>

//       {message.text && (
//         <div className={`update-message ${message.type}`}>
//           {message.text}
//         </div>
//       )}

//       <div className="admin-tabs">
//         <button 
//           className={`admin-tab ${activePage === 'pending-verifications' ? 'active' : ''}`}
//           onClick={() => setActivePage('pending-verifications')}
//         >
//           ⏳ Pending Verifications
//         </button>
//         <button 
//           className={`admin-tab ${activePage === 'all-verifications' ? 'active' : ''}`}
//           onClick={() => setActivePage('all-verifications')}
//         >
//           📋 All Verifications
//         </button>
//         <button 
//           className={`admin-tab ${activePage === 'users' ? 'active' : ''}`}
//           onClick={() => setActivePage('users')}
//         >
//           👥 Manage Users
//         </button>
//         <button 
//           className={`admin-tab ${activePage === 'rides' ? 'active' : ''}`}
//           onClick={() => setActivePage('rides')}
//         >
//           🚗 Manage Rides
//         </button>
//       </div>

//       <main className="admin-main-content">
//         {(activePage === 'pending-verifications' || activePage === 'all-verifications') 
//           ? renderContent()
//           : (
//             <div className="empty-state">
//               <h3>Coming Soon</h3>
//               <p>This section is under development.</p>
//             </div>
//           )}
//       </main>

//       {/* Approval/Rejection Modal */}
//       {showModal && (
//         <>
//           <div className="modal-overlay" onClick={closeModal}></div>
//           <div className="modal">
//             <div className="modal-header">
//               <h2>
//                 {actionType === 'approve' ? '✓ Approve Verification' : '✗ Reject Verification'}
//               </h2>
//               <button className="modal-close" onClick={closeModal}>×</button>
//             </div>

//             <div className="modal-body">
//               <div className="modal-user-info">
//                 <strong>User:</strong> {selectedVerification?.user?.username}
//                 <br />
//                 <strong>Email:</strong> {selectedVerification?.user?.email}
//                 <br />
//                 <strong>Type:</strong> {selectedVerification?.verificationType?.replace('_', ' ')}
//               </div>

//               {actionType === 'approve' ? (
//                 <>
//                   <div className="form-group">
//                     <label>Approve As: *</label>
//                     <select 
//                       className="form-input"
//                       value={approvalType}
//                       onChange={(e) => setApprovalType(e.target.value)}
//                     >
//                       <option value="user">User Only (Green Tick)</option>
//                       <option 
//                         value="rider"
//                         disabled={!selectedVerification?.drivingLicenseFront}
//                       >
//                         Rider Only (Purple Tick)
//                         {!selectedVerification?.drivingLicenseFront && ' - No License Uploaded'}
//                       </option>
//                       <option 
//                         value="both"
//                         disabled={!selectedVerification?.drivingLicenseFront}
//                       >
//                         Both User & Rider
//                         {!selectedVerification?.drivingLicenseFront && ' - No License Uploaded'}
//                       </option>
//                     </select>
//                   </div>

//                   <div className="form-group">
//                     <label>Remarks (Optional):</label>
//                     <textarea
//                       className="form-input"
//                       rows="3"
//                       value={remarks}
//                       onChange={(e) => setRemarks(e.target.value)}
//                       placeholder="Add any notes for the user..."
//                     />
//                   </div>
//                 </>
//               ) : (
//                 <div className="form-group">
//                   <label>Rejection Reason: *</label>
//                   <textarea
//                     className="form-input"
//                     rows="4"
//                     value={remarks}
//                     onChange={(e) => setRemarks(e.target.value)}
//                     placeholder="Please provide a clear reason for rejection..."
//                     required
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="modal-footer">
//               <button className="btn-cancel" onClick={closeModal}>
//                 Cancel
//               </button>
//               <button 
//                 className={actionType === 'approve' ? 'btn-approve' : 'btn-reject'}
//                 onClick={actionType === 'approve' ? handleApprove : handleReject}
//               >
//                 {actionType === 'approve' ? '✓ Approve' : '✗ Reject'}
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;



import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../../services/api';
import '../../css/Dashboard.css';
import '../../css/AdminDashboard.css';

// ✅ FIX: Define BASE_URL as a module-level constant
const BASE_URL = 'http://localhost:5000';
console.log('Module loaded, BASE_URL:', BASE_URL);

const AdminDashboard = () => {
  console.log('BASE_URL:', BASE_URL);
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('pending-verifications');
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [remarks, setRemarks] = useState('');
  const [approvalType, setApprovalType] = useState('user');
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ FIX: Only fetch data after auth is loaded
  useEffect(() => {
    if (!authLoading && user) {
      if (activePage === 'pending-verifications') {
        fetchPendingVerifications();
      } else if (activePage === 'all-verifications') {
        fetchAllVerifications();
      }
    }
  }, [activePage, authLoading, user]);

  const fetchPendingVerifications = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getPendingVerifications();
      setVerifications(data.verifications);
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
      setMessage({ type: 'error', text: 'Failed to load pending verifications' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVerifications = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getAllVerifications();
      setVerifications(data.verifications);
    } catch (error) {
      console.error('Error fetching all verifications:', error);
      setMessage({ type: 'error', text: 'Failed to load verifications' });
    } finally {
      setLoading(false);
    }
  };

  const openApprovalModal = (verification) => {
    setSelectedVerification(verification);
    setActionType('approve');
    setRemarks('');
    
    // ✅ FIX: Set default approvalType based on what user submitted
    const hasLicense = verification.drivingLicenseFront && verification.drivingLicenseBack;
    if (hasLicense && verification.verificationType === 'both') {
      setApprovalType('both');
    } else if (hasLicense && verification.verificationType === 'rider') {
      setApprovalType('rider');
    } else {
      setApprovalType('user');
    }
    
    setShowModal(true);
  };

  const openRejectionModal = (verification) => {
    setSelectedVerification(verification);
    setActionType('reject');
    setRemarks('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVerification(null);
    setRemarks('');
    setApprovalType('user');
  };

  // ✅ FIXED: Better error handling and logging
  const handleApprove = async () => {
    if (!selectedVerification) {
      console.error('No verification selected');
      return;
    }

    // ✅ FIX: Validate approvalType
    if (!['user', 'rider', 'both'].includes(approvalType)) {
      setMessage({ type: 'error', text: 'Invalid approval type selected' });
      return;
    }

    // ✅ FIX: Check if trying to approve rider without license
    const hasLicense = selectedVerification.drivingLicenseFront && selectedVerification.drivingLicenseBack;
    if ((approvalType === 'rider' || approvalType === 'both') && !hasLicense) {
      setMessage({ type: 'error', text: 'Cannot approve as rider without driving license documents' });
      return;
    }

    console.log('Approving verification:', {
      id: selectedVerification.id,
      approvalType,
      remarks,
      hasLicense
    });

    try {
      const response = await adminAPI.approveVerification(
        selectedVerification.id,
        approvalType,
        remarks
      );

      console.log('Approval response:', response);
      setMessage({ type: 'success', text: `Verification approved as ${approvalType}!` });
      closeModal();
      
      // Refresh the list
      if (activePage === 'pending-verifications') {
        fetchPendingVerifications();
      } else {
        fetchAllVerifications();
      }

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error approving verification:', error);
      console.error('Error response:', error.response?.data);
      
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to approve verification. Check console for details.'
      });
    }
  };

  const handleReject = async () => {
    if (!selectedVerification) return;
    
    if (!remarks.trim()) {
      setMessage({ type: 'error', text: 'Please provide a reason for rejection' });
      return;
    }

    try {
      await adminAPI.rejectVerification(selectedVerification.id, remarks);

      setMessage({ type: 'success', text: 'Verification rejected successfully!' });
      closeModal();
      
      // Refresh the list
      if (activePage === 'pending-verifications') {
        fetchPendingVerifications();
      } else {
        fetchAllVerifications();
      }

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error rejecting verification:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to reject verification'
      });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="badge badge-orange">⏳ Pending</span>,
      approved_user: <span className="badge badge-green">✓ Approved (User)</span>,
      approved_rider: <span className="badge badge-purple">✓ Approved (Rider)</span>,
      approved_both: <span className="badge badge-purple">✓ Approved (Both)</span>,
      rejected: <span className="badge badge-gray">✗ Rejected</span>
    };
    return badges[status] || status;
  };

  // ✅ FIX: Helper function to safely render document images
  const renderDocumentImage = (path, alt, label) => {
    if (!path) {
      return (
        <div className="document-placeholder">
          <div className="placeholder-content">📄</div>
          <p>{label} (Not Available)</p>
        </div>
      );
    }

    // Construct URLs explicitly
    const imageUrl = BASE_URL + path;
    const linkUrl = BASE_URL + path;

    console.log('Rendering document image:', { path, imageUrl, linkUrl });

    return (
      <div 
        className="document-image-container"
        onClick={() => {
          console.log('Opening URL:', linkUrl);
          window.open(linkUrl, '_blank');
        }}
        style={{ cursor: 'pointer', display: 'inline-block' }}
      >
        <img 
          src={imageUrl}
          alt={alt}
          className="document-thumbnail"
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            console.error('Actual src:', e.target.src);
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div className="image-error" style={{ display: 'none', textAlign: 'center', padding: '10px', background: '#f5f5f5', border: '1px solid #ddd' }}>
          📄 {label}<br/>
          <small>Failed to load image</small>
        </div>
        <p>{label}</p>
      </div>
    );
  };

  const renderVerificationCard = (verification) => {
    const hasLicense = verification.drivingLicenseFront && verification.drivingLicenseBack;
    
    return (
      <div key={verification.id} className="verification-card">
        <div className="verification-header">
          <div className="user-info-section">
            {verification.user?.profilePicture ? (
              <img 
                src={`${BASE_URL}${verification.user.profilePicture}`}
                alt={verification.user.username}
                className="user-avatar-small"
              />
            ) : (
              <div className="user-avatar-placeholder-small">
                {verification.user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3>{verification.user?.username}</h3>
              <p>{verification.user?.email}</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                Phone: {verification.user?.phone}
              </p>
            </div>
          </div>
          <div>
            {getStatusBadge(verification.status)}
          </div>
        </div>

        <div className="verification-details">
          <div className="detail-row">
            <strong>Verification Type:</strong>
            <span style={{ textTransform: 'capitalize' }}>
              {verification.verificationType.replace('_', ' ')}
            </span>
          </div>
          <div className="detail-row">
            <strong>Citizenship Number:</strong>
            <span>{verification.citizenshipNumber}</span>
          </div>
          {hasLicense && (
            <div className="detail-row">
              <strong>License Number:</strong>
              <span>{verification.drivingLicenseNumber}</span>
            </div>
          )}
          <div className="detail-row">
            <strong>Submitted:</strong>
            <span>{new Date(verification.submittedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="document-previews">
          <h4>Citizenship Documents:</h4>
          <div className="document-images">
            {renderDocumentImage(verification.citizenshipFront, "Citizenship Front", "Front")}
            {renderDocumentImage(verification.citizenshipBack, "Citizenship Back", "Back")}
          </div>

          {hasLicense && (
            <>
              <h4 style={{ marginTop: '1rem' }}>Driving License Documents:</h4>
              <div className="document-images">
                {renderDocumentImage(verification.drivingLicenseFront, "License Front", "Front")}
                {renderDocumentImage(verification.drivingLicenseBack, "License Back", "Back")}
              </div>
            </>
          )}
        </div>

        {verification.adminRemarks && (
          <div className="admin-remarks">
            <strong>Admin Remarks:</strong>
            <p>{verification.adminRemarks}</p>
          </div>
        )}

        {verification.status === 'pending' && (
          <div className="verification-actions">
            <button 
              className="btn-approve"
              onClick={() => openApprovalModal(verification)}
            >
              ✓ Approve
            </button>
            <button 
              className="btn-reject"
              onClick={() => openRejectionModal(verification)}
            >
              ✗ Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading-state">Loading verifications...</div>;
    }

    if (verifications.length === 0) {
      return (
        <div className="empty-state">
          <h3>No verifications found</h3>
          <p>
            {activePage === 'pending-verifications' 
              ? 'There are no pending verification requests at the moment.'
              : 'No verification records available.'}
          </p>
        </div>
      );
    }

    return (
      <div className="verifications-grid">
        {verifications.map(renderVerificationCard)}
      </div>
    );
  };

  // ✅ FIX: Show loading while auth is being verified
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>🚗 Lift Nepal – Admin Panel</h1>
        <div className="admin-header-right">
          <span className="admin-name">Welcome, {user?.username}</span>
          <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {message.text && (
        <div className={`update-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activePage === 'pending-verifications' ? 'active' : ''}`}
          onClick={() => setActivePage('pending-verifications')}
        >
          ⏳ Pending Verifications
        </button>
        <button 
          className={`admin-tab ${activePage === 'all-verifications' ? 'active' : ''}`}
          onClick={() => setActivePage('all-verifications')}
        >
          📋 All Verifications
        </button>
        <button 
          className={`admin-tab ${activePage === 'users' ? 'active' : ''}`}
          onClick={() => setActivePage('users')}
        >
          👥 Manage Users
        </button>
        <button 
          className={`admin-tab ${activePage === 'rides' ? 'active' : ''}`}
          onClick={() => setActivePage('rides')}
        >
          🚗 Manage Rides
        </button>
      </div>

      <main className="admin-main-content">
        {(activePage === 'pending-verifications' || activePage === 'all-verifications') 
          ? renderContent()
          : (
            <div className="empty-state">
              <h3>Coming Soon</h3>
              <p>This section is under development.</p>
            </div>
          )}
      </main>

      {/* Approval/Rejection Modal */}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal">
            <div className="modal-header">
              <h2>
                {actionType === 'approve' ? '✓ Approve Verification' : '✗ Reject Verification'}
              </h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="modal-user-info">
                <strong>User:</strong> {selectedVerification?.user?.username}
                <br />
                <strong>Email:</strong> {selectedVerification?.user?.email}
                <br />
                <strong>Type:</strong> {selectedVerification?.verificationType?.replace('_', ' ')}
              </div>

              {actionType === 'approve' ? (
                <>
                  <div className="form-group">
                    <label>Approve As: *</label>
                    <select 
                      className="form-input"
                      value={approvalType}
                      onChange={(e) => setApprovalType(e.target.value)}
                    >
                      <option value="user">User Only (Green Tick)</option>
                      <option 
                        value="rider"
                        disabled={!selectedVerification?.drivingLicenseFront}
                      >
                        Rider Only (Purple Tick)
                        {!selectedVerification?.drivingLicenseFront && ' - No License Uploaded'}
                      </option>
                      <option 
                        value="both"
                        disabled={!selectedVerification?.drivingLicenseFront}
                      >
                        Both User & Rider
                        {!selectedVerification?.drivingLicenseFront && ' - No License Uploaded'}
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Remarks (Optional):</label>
                    <textarea
                      className="form-input"
                      rows="3"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add any notes for the user..."
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Rejection Reason: *</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Please provide a clear reason for rejection..."
                    required
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className={actionType === 'approve' ? 'btn-approve' : 'btn-reject'}
                onClick={actionType === 'approve' ? handleApprove : handleReject}
              >
                {actionType === 'approve' ? '✓ Approve' : '✗ Reject'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;