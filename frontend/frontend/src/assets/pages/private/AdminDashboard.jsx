




// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../../context/AuthContext";
// import { useNavigate } from 'react-router-dom';
// import { adminAPI } from '../../../services/api';
// import '../../css/Dashboard.css';
// import '../../css/AdminDashboard.css';

// // ✅ FIX: Define BASE_URL as a module-level constant
// const BASE_URL = 'http://localhost:5000';
// console.log('Module loaded, BASE_URL:', BASE_URL);

// const AdminDashboard = () => {
//   console.log('BASE_URL:', BASE_URL);
//   console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
//   const { user, logout, loading: authLoading } = useAuth();
//   const navigate = useNavigate();
//   const [activePage, setActivePage] = useState('pending-verifications');
//   const [verifications, setVerifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedVerification, setSelectedVerification] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [actionType, setActionType] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [approvalType, setApprovalType] = useState('user');
//   const [message, setMessage] = useState({ type: '', text: '' });

//   // ✅ FIX: Only fetch data after auth is loaded
//   useEffect(() => {
//     if (!authLoading && user) {
//       if (activePage === 'pending-verifications') {
//         fetchPendingVerifications();
//       } else if (activePage === 'all-verifications') {
//         fetchAllVerifications();
//       }
//     }
//   }, [activePage, authLoading, user]);

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
    
//     // ✅ FIX: Set default approvalType based on what user submitted
//     const hasLicense = verification.drivingLicenseFront;
//     const hasCitizenship = verification.citizenshipFront;
    
//     if (verification.verificationType === 'rider') {
//       setApprovalType('rider');
//     } else if (verification.verificationType === 'user_only') {
//       setApprovalType('user');
//     } else if (verification.verificationType === 'both') {
//       setApprovalType('both');
//     } else if (hasLicense && !hasCitizenship) {
//       setApprovalType('rider');
//     } else if (hasCitizenship && !hasLicense) {
//       setApprovalType('user');
//     } else {
//       setApprovalType('both');
//     }
    
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

//   // ✅ FIXED: Better error handling and logging
//   const handleApprove = async () => {
//     if (!selectedVerification) {
//       console.error('No verification selected');
//       return;
//     }

//     // ✅ FIX: Validate approvalType
//     if (!['user', 'rider', 'both'].includes(approvalType)) {
//       setMessage({ type: 'error', text: 'Invalid approval type selected' });
//       return;
//     }

//     // ✅ FIX: Check if trying to approve rider without license
//     const hasLicense = selectedVerification.drivingLicenseFront;
//     if ((approvalType === 'rider' || approvalType === 'both') && !hasLicense) {
//       setMessage({ type: 'error', text: 'Cannot approve as rider without driving license documents' });
//       return;
//     }

//     console.log('Approving verification:', {
//       id: selectedVerification.id,
//       approvalType,
//       remarks,
//       hasLicense
//     });

//     try {
//       const response = await adminAPI.approveVerification(
//         selectedVerification.id,
//         approvalType,
//         remarks
//       );

//       console.log('Approval response:', response);
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
//       console.error('Error response:', error.response?.data);
      
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.message || 'Failed to approve verification. Check console for details.'
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

//   // ✅ CRITICAL FIX: Helper function to safely construct image URLs
//   const renderDocumentImage = (path, alt, label) => {
//     if (!path) {
//       return (
//         <div className="document-placeholder">
//           <div className="placeholder-content">📄</div>
//           <p>{label} (Not Available)</p>
//         </div>
//       );
//     }

//     // ✅ CRITICAL FIX: Normalize path to ensure it starts with /
//     // This handles both "uploads/..." and "/uploads/..." formats
//     const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
//     // Construct URLs with normalized path
//     const imageUrl = `${BASE_URL}${normalizedPath}`;
//     const linkUrl = `${BASE_URL}${normalizedPath}`;

//     console.log('Rendering document image:', { 
//       originalPath: path, 
//       normalizedPath, 
//       imageUrl, 
//       linkUrl 
//     });

//     return (
//       <div 
//         className="document-image-container"
//         onClick={() => {
//           console.log('Opening URL:', linkUrl);
//           window.open(linkUrl, '_blank');
//         }}
//         style={{ cursor: 'pointer', display: 'inline-block' }}
//       >
//         <img 
//           src={imageUrl}
//           alt={alt}
//           className="document-thumbnail"
//           onError={(e) => {
//             console.error('Image failed to load:', imageUrl);
//             console.error('Actual src:', e.target.src);
//             e.target.style.display = 'none';
//             e.target.nextSibling.style.display = 'block';
//           }}
//         />
//         <div className="image-error" style={{ display: 'none', textAlign: 'center', padding: '10px', background: '#f5f5f5', border: '1px solid #ddd' }}>
//           📄 {label}<br/>
//           <small>Failed to load image</small>
//         </div>
//         <p>{label}</p>
//       </div>
//     );
//   };

//   const renderVerificationCard = (verification) => {
//     const hasLicense = verification.drivingLicenseFront;
//     const hasCitizenship = verification.citizenshipFront;
    
//     // ✅ FIX: Normalize profile picture path too
//     const profilePicPath = verification.user?.profilePicture;
//     const normalizedProfilePath = profilePicPath 
//       ? (profilePicPath.startsWith('/') ? profilePicPath : `/${profilePicPath}`)
//       : null;
    
//     return (
//       <div key={verification.id} className="verification-card">
//         <div className="verification-header">
//           <div className="user-info-section">
//             {normalizedProfilePath ? (
//               <img 
//                 src={`${BASE_URL}${normalizedProfilePath}`}
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
          
//           {/* ✅ Show citizenship number only if it exists */}
//           {verification.citizenshipNumber && (
//             <div className="detail-row">
//               <strong>Citizenship Number:</strong>
//               <span>{verification.citizenshipNumber}</span>
//             </div>
//           )}
          
//           {/* ✅ Show license number only if it exists */}
//           {verification.drivingLicenseNumber && (
//             <div className="detail-row">
//               <strong>License Number:</strong>
//               <span>{verification.drivingLicenseNumber}</span>
//             </div>
//           )}
          
//           {/* ✅ Show license expiry date if it exists */}
//           {verification.licenseExpiryDate && (
//             <div className="detail-row">
//               <strong>License Expiry:</strong>
//               <span>{new Date(verification.licenseExpiryDate).toLocaleDateString()}</span>
//             </div>
//           )}
          
//           <div className="detail-row">
//             <strong>Submitted:</strong>
//             <span>{new Date(verification.submittedAt).toLocaleString()}</span>
//           </div>
//         </div>

//         {/* ✅ CRITICAL FIX: Show documents based on what exists, not verificationType */}
//         <div className="document-previews">
//           {/* ✅ Show citizenship documents only if they exist */}
//           {hasCitizenship && (
//             <>
//               <h4>Citizenship Documents:</h4>
//               <div className="document-images">
//                 {renderDocumentImage(verification.citizenshipFront, "Citizenship Front", "Front")}
//                 {renderDocumentImage(verification.citizenshipBack, "Citizenship Back", "Back")}
//               </div>
//             </>
//           )}

//           {/* ✅ Show driving license documents if they exist */}
//           {hasLicense && (
//             <>
//               <h4 style={{ marginTop: hasCitizenship ? '1rem' : '0' }}>Driving License Documents:</h4>
//               <div className="document-images">
//                 {renderDocumentImage(verification.drivingLicenseFront, "License Front", "Front")}
//                 {verification.drivingLicenseBack && renderDocumentImage(verification.drivingLicenseBack, "License Back", "Back")}
//               </div>
//             </>
//           )}
          
//           {/* ✅ Show message if no documents */}
//           {!hasCitizenship && !hasLicense && (
//             <div className="empty-state" style={{ padding: '1rem', background: '#f5f5f5' }}>
//               <p>No documents uploaded</p>
//             </div>
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

//   // ✅ FIX: Show loading while auth is being verified
//   if (authLoading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         fontSize: '1.5rem',
//         color: '#667eea'
//       }}>
//         Loading...
//       </div>
//     );
//   }

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
//                         Rider Only (Blue Tick)
//                         {!selectedVerification?.drivingLicenseFront && ' - No License Uploaded'}
//                       </option>
//                       <option 
//                         value="both"
//                         disabled={!selectedVerification?.drivingLicenseFront || !selectedVerification?.citizenshipFront}
//                       >
//                         Both User & Rider
//                         {(!selectedVerification?.drivingLicenseFront || !selectedVerification?.citizenshipFront) && ' - Missing Documents'}
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
import { adminAPI, reportAPI } from '../../../services/api';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [verificationToDelete, setVerificationToDelete] = useState(null);

  // ✅ NEW: Reports state
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStatus, setReportStatus] = useState('');
  const [reportAdminRemarks, setReportAdminRemarks] = useState('');
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  // ✅ NEW: User Management state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalAction, setUserModalAction] = useState(''); // 'suspend', 'unsuspend', 'delete', 'view'
  const [suspensionReason, setSuspensionReason] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // ✅ FIX: Only fetch data after auth is loaded
  useEffect(() => {
    if (!authLoading && user) {
      if (activePage === 'pending-verifications') {
        fetchPendingVerifications();
      } else if (activePage === 'all-verifications') {
        fetchAllVerifications();
      } else if (activePage === 'reports') {
        fetchReports();
      } else if (activePage === 'users') {
        fetchUsers();
      }
      // Always fetch pending reports count for badge
      fetchPendingReportsCount();
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

  // ✅ NEW: Fetch reports
  const fetchReports = async (status = null) => {
    setLoadingReports(true);
    try {
      const data = await reportAPI.getAllReports(status);
      setReports(data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setMessage({ type: 'error', text: 'Failed to load reports' });
    } finally {
      setLoadingReports(false);
    }
  };

  // ✅ NEW: Fetch pending reports count
  const fetchPendingReportsCount = async () => {
    try {
      const data = await reportAPI.getPendingCount();
      setPendingReportsCount(data.count);
    } catch (error) {
      console.error('Error fetching pending reports count:', error);
    }
  };

  // ✅ NEW: Open report modal
  const openReportModal = (report) => {
    setSelectedReport(report);
    setReportStatus(report.status);
    setReportAdminRemarks(report.adminRemarks || '');
    setShowReportModal(true);
  };

  // ✅ NEW: Close report modal
  const closeReportModal = () => {
    setShowReportModal(false);
    setSelectedReport(null);
    setReportStatus('');
    setReportAdminRemarks('');
  };

  // ✅ NEW: Handle update report status
  const handleUpdateReportStatus = async () => {
    if (!selectedReport) return;

    try {
      await reportAPI.updateReportStatus(selectedReport.id, reportStatus, reportAdminRemarks);
      setMessage({ type: 'success', text: `Report status updated to ${reportStatus}` });
      closeReportModal();
      fetchReports();
      fetchPendingReportsCount();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating report status:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update report status'
      });
    }
  };

  // ✅ NEW: Handle delete report
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      await reportAPI.deleteReport(reportId);
      setMessage({ type: 'success', text: 'Report deleted successfully' });
      fetchReports();
      fetchPendingReportsCount();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error deleting report:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete report'
      });
    }
  };

  // =====================================================
  // ✅ USER MANAGEMENT FUNCTIONS
  // =====================================================

  // Fetch all users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await adminAPI.getAllUsers();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoadingUsers(false);
    }
  };

  // Open user modal for different actions
  const openUserModal = (user, action) => {
    setSelectedUser(user);
    setUserModalAction(action);
    setSuspensionReason('');
    setShowUserModal(true);
  };

  // Close user modal
  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setUserModalAction('');
    setSuspensionReason('');
  };

  // Handle suspend user
  const handleSuspendUser = async () => {
    if (!selectedUser) return;
    
    if (!suspensionReason.trim()) {
      setMessage({ type: 'error', text: 'Please provide a reason for suspension' });
      return;
    }

    try {
      await adminAPI.suspendUser(selectedUser.id, suspensionReason);
      setMessage({ type: 'success', text: `User ${selectedUser.username} has been suspended` });
      closeUserModal();
      fetchUsers();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error suspending user:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to suspend user'
      });
    }
  };

  // Handle unsuspend user
  const handleUnsuspendUser = async () => {
    if (!selectedUser) return;

    try {
      await adminAPI.unsuspendUser(selectedUser.id);
      setMessage({ type: 'success', text: `User ${selectedUser.username} has been reactivated` });
      closeUserModal();
      fetchUsers();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error reactivating user:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to reactivate user'
      });
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await adminAPI.deleteUser(selectedUser.id);
      setMessage({ type: 'success', text: `User ${selectedUser.username} has been deleted` });
      closeUserModal();
      fetchUsers();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete user'
      });
    }
  };

  // Get filtered users based on search term
  const getFilteredUsers = () => {
    if (!userSearchTerm.trim()) return users;
    
    const searchLower = userSearchTerm.toLowerCase();
    return users.filter(u => 
      u.username.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      u.phone.includes(searchLower) ||
      u.id.toString().includes(searchLower)
    );
  };

  // ✅ Get issue type label
  const getIssueTypeLabel = (issueType) => {
    const labels = {
      safety: '⚠️ Safety Concern',
      behavior: '😤 Inappropriate Behavior',
      vehicle_condition: '🚗 Vehicle Condition',
      route_deviation: '🗺️ Route Deviation',
      overcharging: '💰 Overcharging',
      late_arrival: '⏰ Late Arrival',
      other: '📋 Other'
    };
    return labels[issueType] || issueType;
  };

  // ✅ Get report status badge
  const getReportStatusBadge = (status) => {
    const badges = {
      pending: <span className="badge badge-orange">⏳ Pending</span>,
      under_review: <span className="badge badge-blue">🔍 Under Review</span>,
      resolved: <span className="badge badge-green">✓ Resolved</span>,
      dismissed: <span className="badge badge-gray">✗ Dismissed</span>
    };
    return badges[status] || status;
  };

  // ✅ UPDATED: Automatically set approval type based on submitted documents
  const openApprovalModal = (verification) => {
    setSelectedVerification(verification);
    setActionType('approve');
    setRemarks('');
    
    // ✅ Set approval type based on what was submitted
    const hasLicense = verification.drivingLicenseFront;
    const hasCitizenship = verification.citizenshipFront;
    
    if (hasLicense && !hasCitizenship) {
      // Only license submitted = rider verification
      setApprovalType('rider');
    } else if (hasCitizenship && !hasLicense) {
      // Only citizenship submitted = user verification
      setApprovalType('user');
    } else if (hasLicense && hasCitizenship) {
      // Both submitted (legacy case) - default to user, admin can choose
      setApprovalType('user');
    } else {
      // Fallback
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
    if (!['user', 'rider'].includes(approvalType)) {
      setMessage({ type: 'error', text: 'Invalid approval type selected' });
      return;
    }

    // ✅ FIX: Check if trying to approve rider without license
    const hasLicense = selectedVerification.drivingLicenseFront;
    const hasCitizenship = selectedVerification.citizenshipFront;
    
    if (approvalType === 'rider' && !hasLicense) {
      setMessage({ type: 'error', text: 'Cannot approve as rider without driving license documents' });
      return;
    }
    
    if (approvalType === 'user' && !hasCitizenship) {
      setMessage({ type: 'error', text: 'Cannot approve as user without citizenship documents' });
      return;
    }

    console.log('Approving verification:', {
      id: selectedVerification.id,
      approvalType,
      remarks,
      hasLicense,
      hasCitizenship
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

  const openDeleteModal = (verification) => {
    setVerificationToDelete(verification);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setVerificationToDelete(null);
  };

  const handleDelete = async () => {
    if (!verificationToDelete) return;

    try {
      await adminAPI.deleteVerification(verificationToDelete.id);

      setMessage({ type: 'success', text: 'Verification deleted successfully!' });
      closeDeleteModal();

      // Refresh the list
      if (activePage === 'pending-verifications') {
        fetchPendingVerifications();
      } else {
        fetchAllVerifications();
      }

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error deleting verification:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete verification'
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

  // ✅ CRITICAL FIX: Helper function to safely construct image URLs
  const renderDocumentImage = (path, alt, label) => {
    if (!path) {
      return (
        <div className="document-placeholder">
          <div className="placeholder-content">📄</div>
          <p>{label} (Not Available)</p>
        </div>
      );
    }

    // ✅ CRITICAL FIX: Normalize path to ensure it starts with /
    // This handles both "uploads/..." and "/uploads/..." formats
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Construct URLs with normalized path
    const imageUrl = `${BASE_URL}${normalizedPath}`;
    const linkUrl = `${BASE_URL}${normalizedPath}`;

    console.log('Rendering document image:', { 
      originalPath: path, 
      normalizedPath, 
      imageUrl, 
      linkUrl 
    });

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
    const hasLicense = verification.drivingLicenseFront;
    const hasCitizenship = verification.citizenshipFront;
    
    // ✅ FIX: Normalize profile picture path too
    const profilePicPath = verification.user?.profilePicture;
    const normalizedProfilePath = profilePicPath 
      ? (profilePicPath.startsWith('/') ? profilePicPath : `/${profilePicPath}`)
      : null;
    
    return (
      <div key={verification.id} className="verification-card">
        <div className="verification-header">
          <div className="user-info-section">
            {normalizedProfilePath ? (
              <img 
                src={`${BASE_URL}${normalizedProfilePath}`}
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
          
          {/* ✅ Show citizenship number only if it exists */}
          {verification.citizenshipNumber && (
            <div className="detail-row">
              <strong>Citizenship Number:</strong>
              <span>{verification.citizenshipNumber}</span>
            </div>
          )}
          
          {/* ✅ Show license number only if it exists */}
          {verification.drivingLicenseNumber && (
            <div className="detail-row">
              <strong>License Number:</strong>
              <span>{verification.drivingLicenseNumber}</span>
            </div>
          )}
          
          {/* ✅ Show license expiry date if it exists */}
          {verification.licenseExpiryDate && (
            <div className="detail-row">
              <strong>License Expiry:</strong>
              <span>{new Date(verification.licenseExpiryDate).toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="detail-row">
            <strong>Submitted:</strong>
            <span>{new Date(verification.submittedAt).toLocaleString()}</span>
          </div>
        </div>

        {/* ✅ CRITICAL FIX: Show documents based on what exists, not verificationType */}
        <div className="document-previews">
          {/* ✅ Show citizenship documents only if they exist */}
          {hasCitizenship && (
            <>
              <h4>Citizenship Documents:</h4>
              <div className="document-images">
                {renderDocumentImage(verification.citizenshipFront, "Citizenship Front", "Front")}
                {renderDocumentImage(verification.citizenshipBack, "Citizenship Back", "Back")}
              </div>
            </>
          )}

          {/* ✅ Show driving license documents if they exist */}
          {hasLicense && (
            <>
              <h4 style={{ marginTop: hasCitizenship ? '1rem' : '0' }}>Driving License Documents:</h4>
              <div className="document-images">
                {renderDocumentImage(verification.drivingLicenseFront, "License Front", "Front")}
                {verification.drivingLicenseBack && renderDocumentImage(verification.drivingLicenseBack, "License Back", "Back")}
              </div>
            </>
          )}
          
          {/* ✅ Show message if no documents */}
          {!hasCitizenship && !hasLicense && (
            <div className="empty-state" style={{ padding: '1rem', background: '#f5f5f5' }}>
              <p>No documents uploaded</p>
            </div>
          )}
        </div>

        {verification.adminRemarks && (
          <div className="admin-remarks">
            <strong>Admin Remarks:</strong>
            <p>{verification.adminRemarks}</p>
          </div>
        )}

        <div className="verification-actions">
          {verification.status === 'pending' && (
            <>
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
            </>
          )}
          <button
            className="btn-delete"
            onClick={() => openDeleteModal(verification)}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '8px'
            }}
          >
            🗑️ Delete
          </button>
        </div>
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
          className={`admin-tab ${activePage === 'reports' ? 'active' : ''}`}
          onClick={() => setActivePage('reports')}
        >
          🚨 Reports {pendingReportsCount > 0 && <span className="badge-count">{pendingReportsCount}</span>}
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
          : activePage === 'reports' ? (
            // ✅ Reports Section
            <div className="reports-section">
              <div className="section-header">
                <h2>🚨 User Reports</h2>
                <p>Review and manage reports submitted by users against riders</p>
              </div>
              
              {loadingReports ? (
                <div className="loading-state">Loading reports...</div>
              ) : reports.length === 0 ? (
                <div className="empty-state">
                  <h3>No Reports</h3>
                  <p>No reports have been submitted yet.</p>
                </div>
              ) : (
                <div className="reports-list">
                  {reports.map(report => (
                    <div key={report.id} className="report-card">
                      <div className="report-card-header">
                        <div className="report-info">
                          <span className="report-id">Report #{report.id}</span>
                          {getReportStatusBadge(report.status)}
                        </div>
                        <span className="report-date">
                          {new Date(report.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      
                      <div className="report-card-body">
                        <div className="report-parties">
                          <div className="report-party">
                            <span className="party-label">Reporter:</span>
                            <div className="party-info">
                              {report.reporter?.profilePicture ? (
                                <img 
                                  src={`${BASE_URL}${report.reporter.profilePicture}`} 
                                  alt={report.reporter.username}
                                  className="party-avatar"
                                />
                              ) : (
                                <span className="party-avatar-placeholder">
                                  {report.reporter?.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              )}
                              <div>
                                <span className="party-name">{report.reporter?.username}</span>
                                <span className="party-email">{report.reporter?.email}</span>
                                <span className="party-phone">📞 {report.reporter?.phone || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="report-arrow">→</div>
                          
                          <div className="report-party">
                            <span className="party-label">Reported Rider:</span>
                            <div className="party-info">
                              {report.reportedRider?.profilePicture ? (
                                <img 
                                  src={`${BASE_URL}${report.reportedRider.profilePicture}`} 
                                  alt={report.reportedRider.username}
                                  className="party-avatar"
                                />
                              ) : (
                                <span className="party-avatar-placeholder">
                                  {report.reportedRider?.username?.charAt(0).toUpperCase() || 'R'}
                                </span>
                              )}
                              <div>
                                <span className="party-name">{report.reportedRider?.username}</span>
                                <span className="party-email">{report.reportedRider?.email}</span>
                                <span className="party-phone">📞 {report.reportedRider?.phone || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="report-ride-details">
                          <span className="ride-route">
                            <strong>{report.ride?.from}</strong> → <strong>{report.ride?.to}</strong>
                          </span>
                          <span className="ride-info">
                            {new Date(report.ride?.date).toLocaleDateString()} at {report.ride?.time}
                          </span>
                        </div>
                        
                        <div className="report-issue">
                          <span className="issue-type">{getIssueTypeLabel(report.issueType)}</span>
                          <p className="issue-remarks">{report.remarks}</p>
                        </div>
                        
                        {report.adminRemarks && (
                          <div className="admin-response">
                            <span className="response-label">Admin Response:</span>
                            <p className="response-text">{report.adminRemarks}</p>
                            {report.reviewer && (
                              <span className="response-by">
                                By: {report.reviewer.username} on {new Date(report.reviewedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="report-card-footer">
                        <button 
                          className="btn-review"
                          onClick={() => openReportModal(report)}
                        >
                          {report.status === 'pending' ? '🔍 Review' : '✏️ Update'}
                        </button>
                        <button 
                          className="btn-delete-report"
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activePage === 'users' ? (
            // =====================================================
            // ✅ USER MANAGEMENT SECTION
            // =====================================================
            <div className="users-section">
              <div className="section-header">
                <h2>👥 Manage Users</h2>
                <p>View all users, manage suspensions, and delete accounts</p>
              </div>

              {/* Search Bar */}
              <div className="user-search-bar">
                <input
                  type="text"
                  placeholder="🔍 Search by name, email, phone, or ID..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="user-search-input"
                />
                {userSearchTerm && (
                  <button 
                    className="clear-search-btn"
                    onClick={() => setUserSearchTerm('')}
                  >
                    ✕
                  </button>
                )}
              </div>

              {loadingUsers ? (
                <div className="loading-state">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="empty-state">
                  <h3>No Users</h3>
                  <p>No registered users found.</p>
                </div>
              ) : (
                <>
                  <div className="users-summary">
                    <span className="summary-item">
                      <strong>Total Users:</strong> {users.length}
                    </span>
                    <span className="summary-item">
                      <strong>Suspended:</strong> {users.filter(u => u.isSuspended).length}
                    </span>
                    <span className="summary-item">
                      <strong>Verified Users:</strong> {users.filter(u => u.isVerifiedUser).length}
                    </span>
                    <span className="summary-item">
                      <strong>Verified Riders:</strong> {users.filter(u => u.isVerifiedRider).length}
                    </span>
                  </div>

                  <div className="users-table-container">
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>User</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Reports</th>
                          <th>Rating</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredUsers().map(u => (
                          <tr key={u.id} className={u.isSuspended ? 'suspended-row' : ''}>
                            <td className="user-id">#{u.id}</td>
                            <td className="user-info-cell">
                              <div className="user-info-row">
                                {u.profilePicture ? (
                                  <img 
                                    src={`${BASE_URL}${u.profilePicture.startsWith('/') ? '' : '/'}${u.profilePicture}`}
                                    alt={u.username}
                                    className="user-avatar-tiny"
                                  />
                                ) : (
                                  <div className="user-avatar-placeholder-tiny">
                                    {u.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="user-name-badges">
                                  <span className="user-name">{u.username}</span>
                                  <div className="user-badges">
                                    {u.isVerifiedUser && <span className="badge-tick green" title="Verified User">✓</span>}
                                    {u.isVerifiedRider && <span className="badge-tick blue" title="Verified Rider">🚗</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="user-phone">{u.phone}</td>
                            <td className="user-email">{u.email}</td>
                            <td className="user-status">
                              {u.isSuspended ? (
                                <span className="badge badge-red">🚫 Suspended</span>
                              ) : (
                                <span className="badge badge-green">✓ Active</span>
                              )}
                            </td>
                            <td className="user-reports">
                              {u.reportCount > 0 ? (
                                <span className={`report-count ${u.pendingReportCount > 0 ? 'has-pending' : ''}`}>
                                  {u.reportCount} {u.pendingReportCount > 0 && <span className="pending-badge">({u.pendingReportCount} pending)</span>}
                                </span>
                              ) : (
                                <span className="no-reports">0</span>
                              )}
                            </td>
                            <td className="user-rating">
                              {u.riderAverageRating ? (
                                <span className="rating-display">
                                  ⭐ {parseFloat(u.riderAverageRating).toFixed(1)}
                                  <span className="rating-count">({u.totalRatingsReceived})</span>
                                </span>
                              ) : (
                                <span className="no-rating">-</span>
                              )}
                            </td>
                            <td className="user-joined">
                              {new Date(u.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </td>
                            <td className="user-actions">
                              <div className="action-buttons">
                                {u.isSuspended ? (
                                  <button 
                                    className="btn-action btn-unsuspend"
                                    onClick={() => openUserModal(u, 'unsuspend')}
                                    title="Reactivate User"
                                  >
                                    ✓ Reactivate
                                  </button>
                                ) : (
                                  <button 
                                    className="btn-action btn-suspend"
                                    onClick={() => openUserModal(u, 'suspend')}
                                    title="Suspend User"
                                  >
                                    🚫 Suspend
                                  </button>
                                )}
                                <button 
                                  className="btn-action btn-delete-user"
                                  onClick={() => openUserModal(u, 'delete')}
                                  title="Delete User"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {getFilteredUsers().length === 0 && userSearchTerm && (
                    <div className="no-search-results">
                      <p>No users found matching "{userSearchTerm}"</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Coming Soon</h3>
              <p>This section is under development.</p>
            </div>
          )}
      </main>

      {/* ✅ Report Review Modal */}
      {showReportModal && selectedReport && (
        <>
          <div className="modal-overlay" onClick={closeReportModal}></div>
          <div className="modal report-review-modal">
            <div className="modal-header">
              <h2>🔍 Review Report #{selectedReport.id}</h2>
              <button className="modal-close" onClick={closeReportModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="report-summary">
                <div className="summary-row">
                  <span className="label">Issue Type:</span>
                  <span className="value">{getIssueTypeLabel(selectedReport.issueType)}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Reporter (Passenger):</span>
                  <span className="value">{selectedReport.reporter?.username} ({selectedReport.reporter?.email}) - 📞 {selectedReport.reporter?.phone || 'N/A'}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Reported Rider:</span>
                  <span className="value">{selectedReport.reportedRider?.username} ({selectedReport.reportedRider?.email}) - 📞 {selectedReport.reportedRider?.phone || 'N/A'}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Ride:</span>
                  <span className="value">{selectedReport.ride?.from} → {selectedReport.ride?.to}</span>
                </div>
              </div>

              <div className="report-full-remarks">
                <label>User's Report:</label>
                <div className="remarks-box">{selectedReport.remarks}</div>
              </div>

              <div className="form-group">
                <label>Update Status: *</label>
                <select 
                  className="form-input"
                  value={reportStatus}
                  onChange={(e) => setReportStatus(e.target.value)}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="under_review">🔍 Under Review</option>
                  <option value="resolved">✓ Resolved</option>
                  <option value="dismissed">✗ Dismissed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Admin Remarks:</label>
                <textarea
                  className="form-input"
                  rows="4"
                  value={reportAdminRemarks}
                  onChange={(e) => setReportAdminRemarks(e.target.value)}
                  placeholder="Add notes about the action taken..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeReportModal}>
                Cancel
              </button>
              <button 
                className="btn-approve"
                onClick={handleUpdateReportStatus}
              >
                ✓ Update Status
              </button>
            </div>
          </div>
        </>
      )}

      {/* ✅✅✅ UPDATED APPROVAL/REJECTION MODAL - "BOTH" OPTION REMOVED ✅✅✅ */}
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
                      {/* ✅ UPDATED: Only show relevant options based on submitted documents */}
                      {selectedVerification?.citizenshipFront && (
                        <option value="user">User Only (Green Tick ✓)</option>
                      )}
                      {selectedVerification?.drivingLicenseFront && (
                        <option value="rider">Rider Only (Blue Tick 🔵)</option>
                      )}
                      
                      {/* ❌ REMOVED: "Both" option - users verify separately now */}
                    </select>
                    
                    {/* ✅ Show helpful message */}
                    <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                      {selectedVerification?.citizenshipFront && !selectedVerification?.drivingLicenseFront && 
                        '✓ Citizenship verification - User can upgrade to Rider later'}
                      {selectedVerification?.drivingLicenseFront && !selectedVerification?.citizenshipFront && 
                        '🔵 Rider verification/upgrade - User already verified or verifying license only'}
                      {selectedVerification?.citizenshipFront && selectedVerification?.drivingLicenseFront && 
                        '⚠️ Both documents submitted - Choose which to approve'}
                    </small>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className="modal-overlay" onClick={closeDeleteModal}></div>
          <div className="modal">
            <div className="modal-header">
              <h2>🗑️ Delete Verification</h2>
              <button className="modal-close" onClick={closeDeleteModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="modal-user-info">
                <strong>User:</strong> {verificationToDelete?.user?.username}
                <br />
                <strong>Email:</strong> {verificationToDelete?.user?.email}
                <br />
                <strong>Type:</strong> {verificationToDelete?.verificationType?.replace('_', ' ')}
                <br />
                <strong>Status:</strong> {verificationToDelete?.status}
              </div>

              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
                <strong>⚠️ Warning:</strong> This action cannot be undone. The verification record will be permanently deleted from the database.
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button
                className="btn-delete"
                onClick={handleDelete}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Delete Permanently
              </button>
            </div>
          </div>
        </>
      )}

      {/* ✅ User Management Modal */}
      {showUserModal && selectedUser && (
        <>
          <div className="modal-overlay" onClick={closeUserModal}></div>
          <div className="modal user-management-modal">
            <div className="modal-header">
              <h2>
                {userModalAction === 'suspend' && '🚫 Suspend User'}
                {userModalAction === 'unsuspend' && '✓ Reactivate User'}
                {userModalAction === 'delete' && '🗑️ Delete User'}
              </h2>
              <button className="modal-close" onClick={closeUserModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="modal-user-info">
                <div className="user-profile-section">
                  {selectedUser.profilePicture ? (
                    <img 
                      src={`${BASE_URL}${selectedUser.profilePicture.startsWith('/') ? '' : '/'}${selectedUser.profilePicture}`}
                      alt={selectedUser.username}
                      className="user-avatar-modal"
                    />
                  ) : (
                    <div className="user-avatar-placeholder-modal">
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="user-details-modal">
                    <h3>{selectedUser.username}</h3>
                    <p>📧 {selectedUser.email}</p>
                    <p>📞 {selectedUser.phone}</p>
                    <p>🆔 User ID: #{selectedUser.id}</p>
                  </div>
                </div>
                
                <div className="user-stats-modal">
                  <div className="stat-item">
                    <span className="stat-label">Reports Against:</span>
                    <span className={`stat-value ${selectedUser.reportCount > 0 ? 'warning' : ''}`}>
                      {selectedUser.reportCount || 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Pending Reports:</span>
                    <span className={`stat-value ${selectedUser.pendingReportCount > 0 ? 'danger' : ''}`}>
                      {selectedUser.pendingReportCount || 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Rating:</span>
                    <span className="stat-value">
                      {selectedUser.riderAverageRating 
                        ? `⭐ ${parseFloat(selectedUser.riderAverageRating).toFixed(1)} (${selectedUser.totalRatingsReceived})` 
                        : 'No ratings'}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Verified:</span>
                    <span className="stat-value">
                      {selectedUser.isVerifiedUser && '✓ User '}
                      {selectedUser.isVerifiedRider && '🚗 Rider'}
                      {!selectedUser.isVerifiedUser && !selectedUser.isVerifiedRider && 'Not verified'}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Status:</span>
                    <span className={`stat-value ${selectedUser.isSuspended ? 'danger' : 'success'}`}>
                      {selectedUser.isSuspended ? '🚫 Suspended' : '✓ Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Suspend User Form */}
              {userModalAction === 'suspend' && (
                <div className="action-form">
                  <div className="form-group">
                    <label>Suspension Reason: *</label>
                    <textarea
                      className="form-input"
                      rows="4"
                      value={suspensionReason}
                      onChange={(e) => setSuspensionReason(e.target.value)}
                      placeholder="Please provide a clear reason for suspension (e.g., repeated violations, inappropriate behavior, fraud)..."
                      required
                    />
                  </div>
                  <div className="warning-box">
                    <strong>⚠️ Note:</strong> The user will be notified of this suspension and will not be able to use the platform until reactivated.
                  </div>
                </div>
              )}

              {/* Unsuspend User Confirmation */}
              {userModalAction === 'unsuspend' && (
                <div className="action-form">
                  <div className="info-box">
                    <strong>ℹ️ Reactivate Account</strong>
                    <p>This will restore the user's account and allow them to use all platform features again.</p>
                    {selectedUser.suspensionReason && (
                      <p><strong>Previous suspension reason:</strong> {selectedUser.suspensionReason}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Delete User Confirmation */}
              {userModalAction === 'delete' && (
                <div className="action-form">
                  <div className="danger-box">
                    <strong>🚨 DANGER: Permanent Deletion</strong>
                    <p>This action cannot be undone. The following will be permanently deleted:</p>
                    <ul>
                      <li>User account and profile</li>
                      <li>All rides created by this user</li>
                      <li>All bookings made by this user</li>
                      <li>All verification documents</li>
                      <li>All associated data</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeUserModal}>
                Cancel
              </button>
              
              {userModalAction === 'suspend' && (
                <button 
                  className="btn-suspend-action"
                  onClick={handleSuspendUser}
                  disabled={!suspensionReason.trim()}
                >
                  🚫 Suspend User
                </button>
              )}
              
              {userModalAction === 'unsuspend' && (
                <button 
                  className="btn-unsuspend-action"
                  onClick={handleUnsuspendUser}
                >
                  ✓ Reactivate User
                </button>
              )}
              
              {userModalAction === 'delete' && (
                <button 
                  className="btn-delete-action"
                  onClick={handleDeleteUser}
                >
                  🗑️ Delete Permanently
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
