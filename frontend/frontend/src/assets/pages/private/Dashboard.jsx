

import { useState, useEffect, useRef } from 'react';
import { FiEye, FiEyeOff, FiPhone, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import RideCard from '../../components/RideCard';
import RideDetailsModal from '../../components/RideDetailsModal';
import ApplyRideModal from '../../components/ApplyRideModal';
import ProfileDropdown from '../../components/ProfileDropdown';
import UpdateVehicleInfoPage from './UpdateVehicleInfo';
import AddRidePageComponent from './Addridepage'; 
import { useAuth } from '../../../context/AuthContext';
import { userAPI, verificationAPI, passwordAPI, rideAPI, bookingAPI, notificationAPI, reportAPI, issueAPI } from '../../../services/api';
import '../../css/Dashboard.css';


// HELPER COMPONENTS - Upload Profile, Change Password, Verify, AddRide


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

      toast.success('Profile picture uploaded successfully! 📸');
      setMessage({ type: 'success', text: 'Profile picture uploaded successfully!' });
      setSelectedFile(null);
      setPreviewUrl(null);
      
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => input.value = '');
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
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

      toast.success('Profile picture deleted successfully!');
      setMessage({ type: 'success', text: 'Profile picture deleted successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete profile picture');
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

// ✅ Raise Issue Page Component
const RaiseIssuePage = () => {
  const [formData, setFormData] = useState({
    issueType: '',
    subject: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [myIssues, setMyIssues] = useState([]);
  const [showMyIssues, setShowMyIssues] = useState(false);
  const [loadingIssues, setLoadingIssues] = useState(false);

  const issueTypes = [
    { value: 'booking', label: 'Booking Issue' },
    { value: 'verification', label: 'Verification Problem' },
    { value: 'payment', label: 'Payment Issue' },
    { value: 'ride_experience', label: 'Ride Experience' },
    { value: 'technical', label: 'Technical Problem' },
    { value: 'account', label: 'Account Issue' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const fetchMyIssues = async () => {
    setLoadingIssues(true);
    try {
      const response = await issueAPI.getMyIssues();
      setMyIssues(response.issues || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoadingIssues(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.issueType) {
      setMessage({ type: 'error', text: 'Please select an issue type' });
      return;
    }
    if (formData.subject.length < 10) {
      setMessage({ type: 'error', text: 'Subject must be at least 10 characters' });
      return;
    }
    if (formData.description.length < 20) {
      setMessage({ type: 'error', text: 'Description must be at least 20 characters' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const submitData = new FormData();
      submitData.append('issueType', formData.issueType);
      submitData.append('subject', formData.subject);
      submitData.append('description', formData.description);
      if (selectedFile) {
        submitData.append('photo', selectedFile);
      }

      await issueAPI.submitIssue(submitData);
      
      toast.success('Issue submitted successfully! Our team will review it shortly. 📩');
      setMessage({ type: 'success', text: 'Issue submitted successfully! Our team will review it shortly.' });
      setFormData({ issueType: '', subject: '', description: '' });
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Refresh issues list if shown
      if (showMyIssues) {
        fetchMyIssues();
      }

      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('Submit issue error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit issue. Please try again.');
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit issue. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: <span className="badge badge-orange">⏳ Open</span>,
      in_progress: <span className="badge badge-blue">🔍 In Progress</span>,
      resolved: <span className="badge badge-green">✓ Resolved</span>,
      closed: <span className="badge badge-gray">✗ Closed</span>
    };
    return badges[status] || status;
  };

  const getIssueTypeLabel = (type) => {
    const found = issueTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  return (
    <div className="add-issue-page">
      <div className="page-header">
        <h1>Raise an Issue</h1>
        <p>Report any problems you're facing with the platform</p>
      </div>

      {message.text && (
        <div className={`update-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="issue-tabs">
        <button 
          className={`tab-btn ${!showMyIssues ? 'active' : ''}`}
          onClick={() => setShowMyIssues(false)}
        >
          Submit New Issue
        </button>
        <button 
          className={`tab-btn ${showMyIssues ? 'active' : ''}`}
          onClick={() => { setShowMyIssues(true); fetchMyIssues(); }}
        >
          My Issues
        </button>
      </div>

      {!showMyIssues ? (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Issue Type *</label>
              <select 
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select issue type</option>
                {issueTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subject * (min 10 characters)</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input" 
                placeholder="Brief description of your issue"
                minLength={10}
                maxLength={100}
                required
              />
              <small className="form-help">{formData.subject.length}/100 characters</small>
            </div>

            <div className="form-group">
              <label>Description * (min 20 characters)</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input" 
                rows="6" 
                placeholder="Describe your issue in detail..."
                minLength={20}
                required
              ></textarea>
              <small className="form-help">{formData.description.length} characters</small>
            </div>

            <div className="form-group">
              <label>Screenshot/Photo (optional)</label>
              <input 
                type="file" 
                className="form-input" 
                accept="image/*"
                onChange={handleFileSelect}
              />
              <small className="form-help">Max size: 5MB (JPEG, PNG, GIF, WEBP)</small>
              
              {previewUrl && (
                <div className="photo-preview">
                  <img src={previewUrl} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '8px' }} />
                  <button type="button" className="btn-remove-photo" onClick={clearFile}>
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Issue'}
            </button>
          </form>
        </div>
      ) : (
        <div className="my-issues-section">
          {loadingIssues ? (
            <div className="loading-state">Loading your issues...</div>
          ) : myIssues.length === 0 ? (
            <div className="empty-state">
              <p>You haven't submitted any issues yet.</p>
            </div>
          ) : (
            <div className="issues-list">
              {myIssues.map(issue => (
                <div key={issue.id} className="issue-card">
                  <div className="issue-header">
                    <span className="issue-type">{getIssueTypeLabel(issue.issueType)}</span>
                    {getStatusBadge(issue.status)}
                  </div>
                  <h3 className="issue-subject">{issue.subject}</h3>
                  <p className="issue-description">{issue.description}</p>
                  {issue.photo && (
                    <div className="issue-photo">
                      <img 
                        src={`http://localhost:5000${issue.photo}`} 
                        alt="Issue attachment" 
                        style={{ maxWidth: '150px', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                  <div className="issue-meta">
                    <span>Submitted: {new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                  {issue.adminResponse && (
                    <div className="admin-response">
                      <strong>Admin Response:</strong>
                      <p>{issue.adminResponse}</p>
                      {issue.respondedAt && (
                        <small>Responded on: {new Date(issue.respondedAt).toLocaleDateString()}</small>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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

      toast.success('Password changed successfully! 🔐');
      setMessage({ type: 'success', text: response.message });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.response?.data?.message || 'Failed to change password. Please try again.');
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
      toast.error('Please select a valid file (JPEG, PNG, PDF)');
      setMessage({ type: 'error', text: 'Please select a valid file (JPEG, PNG, PDF)' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
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
      toast.warning('Please upload both sides of your citizenship');
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
      
      toast.success('Citizenship verification submitted successfully! ✅');
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
      toast.error(error.response?.data?.message || 'Failed to submit citizenship verification');
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
      toast.warning('Please upload at least the front of your driving license');
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
        toast.success('Rider upgrade request submitted successfully! ✅');
        setMessage({ type: 'success', text: 'Rider upgrade request submitted successfully! ✅' });
      } else {
        response = await verificationAPI.submitRiderVerification(formData);
        console.log('✅ Rider verification submitted:', response);
        toast.success('Rider verification submitted successfully! ✅');
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
      toast.error(error.response?.data?.message || 'Failed to submit rider verification');
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

// ✅ Payment Method Page Component - Debit Card & MPIN
const PaymentMethodPage = () => {
  const [paymentStatus, setPaymentStatus] = useState({
    hasPaymentSetup: false,
    hasMpinSetup: false,
    cardLastFour: null,
    cardBrand: null,
    cardHolderName: null,
    cardExpiry: null
  });
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'mpin'
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardHolderName: '',
    cardExpiry: '',
    cvv: ''
  });
  const [mpinForm, setMpinForm] = useState({
    mpin: '',
    confirmMpin: '',
    currentMpin: '',
    newMpin: '',
    confirmNewMpin: ''
  });
  const [showMpin, setShowMpin] = useState({
    mpin: false,
    confirm: false,
    current: false,
    new: false,
    confirmNew: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch payment status on mount
  useEffect(() => {
    fetchPaymentStatus();
  }, []);

  const fetchPaymentStatus = async () => {
    setFetchingStatus(true);
    try {
      const status = await bookingAPI.getPaymentStatus();
      setPaymentStatus(status);
      // Set active tab based on status
      if (status.hasPaymentSetup && !status.hasMpinSetup) {
        setActiveTab('mpin');
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
    } finally {
      setFetchingStatus(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardChange = (field, value) => {
    setMessage({ type: '', text: '' });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));

    if (field === 'cardNumber') {
      setCardForm(prev => ({ ...prev, cardNumber: formatCardNumber(value) }));
    } else if (field === 'cardExpiry') {
      const cleaned = value.replace(/[^0-9/]/g, '');
      if (cleaned.length <= 5) {
        setCardForm(prev => ({ ...prev, cardExpiry: formatExpiry(cleaned.replace('/', '')) }));
      }
    } else if (field === 'cvv') {
      const cleaned = value.replace(/[^0-9]/g, '').slice(0, 3);
      setCardForm(prev => ({ ...prev, cvv: cleaned }));
    } else {
      setCardForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateCardForm = () => {
    const newErrors = {};
    const cleanCardNumber = cardForm.cardNumber.replace(/\s/g, '');
    
    if (!cleanCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanCardNumber.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!cardForm.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Cardholder name is required';
    }

    if (!cardForm.cardExpiry) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardForm.cardExpiry)) {
      newErrors.cardExpiry = 'Invalid format (MM/YY)';
    }

    if (!cardForm.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cardForm.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMpinSetup = () => {
    const newErrors = {};
    
    if (!mpinForm.mpin) {
      newErrors.mpin = 'MPIN is required';
    } else if (mpinForm.mpin.length !== 4) {
      newErrors.mpin = 'MPIN must be 4 digits';
    }

    if (!mpinForm.confirmMpin) {
      newErrors.confirmMpin = 'Please confirm MPIN';
    } else if (mpinForm.mpin !== mpinForm.confirmMpin) {
      newErrors.confirmMpin = 'MPINs do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMpinChange = () => {
    const newErrors = {};
    
    if (!mpinForm.currentMpin) {
      newErrors.currentMpin = 'Current MPIN is required';
    }

    if (!mpinForm.newMpin) {
      newErrors.newMpin = 'New MPIN is required';
    } else if (mpinForm.newMpin.length !== 4) {
      newErrors.newMpin = 'MPIN must be 4 digits';
    }

    if (!mpinForm.confirmNewMpin) {
      newErrors.confirmNewMpin = 'Please confirm new MPIN';
    } else if (mpinForm.newMpin !== mpinForm.confirmNewMpin) {
      newErrors.confirmNewMpin = 'MPINs do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    if (!validateCardForm()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await bookingAPI.setupPayment({
        cardNumber: cardForm.cardNumber.replace(/\s/g, ''),
        cardHolderName: cardForm.cardHolderName,
        cardExpiry: cardForm.cardExpiry,
        cvv: cardForm.cvv
      });

      setPaymentStatus(prev => ({
        ...prev,
        hasPaymentSetup: true,
        cardLastFour: response.paymentInfo.cardLastFour,
        cardBrand: response.paymentInfo.cardBrand,
        cardHolderName: response.paymentInfo.cardHolderName
      }));

      setCardForm({ cardNumber: '', cardHolderName: '', cardExpiry: '', cvv: '' });
      toast.success('Debit card linked successfully! 💳');
      setMessage({ type: 'success', text: 'Debit card linked successfully!' });

      // If MPIN not set, prompt to set it
      if (!paymentStatus.hasMpinSetup) {
        setTimeout(() => {
          setActiveTab('mpin');
          setMessage({ type: 'info', text: 'Now set up your 4-digit MPIN to secure your payments.' });
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to link card');
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to link card' });
    } finally {
      setLoading(false);
    }
  };

  const handleMpinSetup = async (e) => {
    e.preventDefault();
    if (!validateMpinSetup()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await bookingAPI.setupMpin(mpinForm.mpin);
      setPaymentStatus(prev => ({ ...prev, hasMpinSetup: true }));
      setMpinForm({ mpin: '', confirmMpin: '', currentMpin: '', newMpin: '', confirmNewMpin: '' });
      toast.success('MPIN set up successfully! You can now book rides securely. 🔐');
      setMessage({ type: 'success', text: 'MPIN set up successfully! You can now book rides securely.' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to set up MPIN');
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to set up MPIN' });
    } finally {
      setLoading(false);
    }
  };

  const handleMpinChangeSubmit = async (e) => {
    e.preventDefault();
    if (!validateMpinChange()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await bookingAPI.changeMpin(mpinForm.currentMpin, mpinForm.newMpin);
      setMpinForm({ mpin: '', confirmMpin: '', currentMpin: '', newMpin: '', confirmNewMpin: '' });
      toast.success('MPIN changed successfully! 🔐');
      setMessage({ type: 'success', text: 'MPIN changed successfully!' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change MPIN');
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change MPIN' });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingStatus) {
    return (
      <div className="payment-page">
        <div className="page-header">
          <h1>Payment Information</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading payment info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="page-header">
        <h1>Payment Information</h1>
        <p>Manage your debit card and payment MPIN</p>
      </div>

      {message.text && (
        <div className={`update-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Linked Card Display */}
      {paymentStatus.hasPaymentSetup && (
        <div className="linked-card-display" style={{
          background: 'linear-gradient(135deg, #1a1f36 0%, #2d3748 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <span style={{ fontSize: '14px', opacity: 0.8 }}>Linked Card</span>
              <span style={{ fontWeight: '600' }}>{paymentStatus.cardBrand || 'Card'}</span>
            </div>
            <div style={{ fontSize: '24px', letterSpacing: '3px', fontFamily: 'monospace', marginBottom: '20px' }}>
              •••• •••• •••• {paymentStatus.cardLastFour}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>CARDHOLDER</div>
                <div style={{ fontSize: '14px' }}>{paymentStatus.cardHolderName}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  background: paymentStatus.hasMpinSetup ? '#22c55e' : '#f59e0b',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {paymentStatus.hasMpinSetup ? '✓ MPIN Set' : '⚠ MPIN Required'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="payment-tabs" style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '0'
      }}>
        <button
          className={`tab-btn ${activeTab === 'card' ? 'active' : ''}`}
          onClick={() => { setActiveTab('card'); setErrors({}); setMessage({ type: '', text: '' }); }}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'card' ? '#4DA3FF' : 'transparent',
            color: activeTab === 'card' ? 'white' : '#6b7280',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          💳 Debit Card
        </button>
        <button
          className={`tab-btn ${activeTab === 'mpin' ? 'active' : ''}`}
          onClick={() => { setActiveTab('mpin'); setErrors({}); setMessage({ type: '', text: '' }); }}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'mpin' ? '#4DA3FF' : 'transparent',
            color: activeTab === 'mpin' ? 'white' : '#6b7280',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          🔐 MPIN
        </button>
      </div>

      {/* Card Tab */}
      {activeTab === 'card' && (
        <form className="form-container" onSubmit={handleCardSubmit}>
          <h3 style={{ marginBottom: '20px', color: '#374151' }}>
            {paymentStatus.hasPaymentSetup ? 'Update Debit Card' : 'Link Debit Card'}
          </h3>

          <div className="form-group">
            <label>Card Number *</label>
            <input
              type="text"
              className={`form-input ${errors.cardNumber ? 'input-error' : ''}`}
              value={cardForm.cardNumber}
              onChange={(e) => handleCardChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              disabled={loading}
              maxLength={19}
            />
            {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
          </div>

          <div className="form-group">
            <label>Cardholder Name *</label>
            <input
              type="text"
              className={`form-input ${errors.cardHolderName ? 'input-error' : ''}`}
              value={cardForm.cardHolderName}
              onChange={(e) => handleCardChange('cardHolderName', e.target.value.toUpperCase())}
              placeholder="JOHN DOE"
              disabled={loading}
            />
            {errors.cardHolderName && <span className="error-text">{errors.cardHolderName}</span>}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Expiry Date *</label>
              <input
                type="text"
                className={`form-input ${errors.cardExpiry ? 'input-error' : ''}`}
                value={cardForm.cardExpiry}
                onChange={(e) => handleCardChange('cardExpiry', e.target.value)}
                placeholder="MM/YY"
                disabled={loading}
                maxLength={5}
              />
              {errors.cardExpiry && <span className="error-text">{errors.cardExpiry}</span>}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>CVV *</label>
              <input
                type="password"
                className={`form-input ${errors.cvv ? 'input-error' : ''}`}
                value={cardForm.cvv}
                onChange={(e) => handleCardChange('cvv', e.target.value)}
                placeholder="•••"
                disabled={loading}
                maxLength={3}
              />
              {errors.cvv && <span className="error-text">{errors.cvv}</span>}
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Linking...' : paymentStatus.hasPaymentSetup ? 'Update Card' : 'Link Card'}
          </button>
        </form>
      )}

      {/* MPIN Tab */}
      {activeTab === 'mpin' && (
        <div className="form-container">
          {!paymentStatus.hasPaymentSetup ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              border: '1px solid #f59e0b'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
              <h3 style={{ color: '#92400e', marginBottom: '8px' }}>Link a Card First</h3>
              <p style={{ color: '#a16207' }}>You need to link a debit card before setting up your MPIN.</p>
              <button
                onClick={() => setActiveTab('card')}
                style={{
                  marginTop: '16px',
                  padding: '10px 24px',
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Link Debit Card
              </button>
            </div>
          ) : !paymentStatus.hasMpinSetup ? (
            // Setup MPIN Form
            <form onSubmit={handleMpinSetup}>
              <h3 style={{ marginBottom: '20px', color: '#374151' }}>Set Up MPIN</h3>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Create a 4-digit MPIN to authorize payments when booking rides.
              </p>

              <div className="form-group">
                <label>Enter MPIN (4 digits) *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showMpin.mpin ? "text" : "password"}
                    className={`form-input ${errors.mpin ? 'input-error' : ''}`}
                    value={mpinForm.mpin}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setMpinForm(prev => ({ ...prev, mpin: cleaned }));
                      if (errors.mpin) setErrors(prev => ({ ...prev, mpin: '' }));
                    }}
                    placeholder="••••"
                    disabled={loading}
                    maxLength={4}
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => setShowMpin(prev => ({ ...prev, mpin: !prev.mpin }))}
                  >
                    {showMpin.mpin ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.mpin && <span className="error-text">{errors.mpin}</span>}
              </div>

              <div className="form-group">
                <label>Confirm MPIN *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showMpin.confirm ? "text" : "password"}
                    className={`form-input ${errors.confirmMpin ? 'input-error' : ''}`}
                    value={mpinForm.confirmMpin}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setMpinForm(prev => ({ ...prev, confirmMpin: cleaned }));
                      if (errors.confirmMpin) setErrors(prev => ({ ...prev, confirmMpin: '' }));
                    }}
                    placeholder="••••"
                    disabled={loading}
                    maxLength={4}
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => setShowMpin(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showMpin.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.confirmMpin && <span className="error-text">{errors.confirmMpin}</span>}
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Setting up...' : 'Set Up MPIN'}
              </button>
            </form>
          ) : (
            // Change MPIN Form
            <form onSubmit={handleMpinChangeSubmit}>
              <h3 style={{ marginBottom: '20px', color: '#374151' }}>Change MPIN</h3>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Enter your current MPIN and choose a new 4-digit MPIN.
              </p>

              <div className="form-group">
                <label>Current MPIN *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showMpin.current ? "text" : "password"}
                    className={`form-input ${errors.currentMpin ? 'input-error' : ''}`}
                    value={mpinForm.currentMpin}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setMpinForm(prev => ({ ...prev, currentMpin: cleaned }));
                      if (errors.currentMpin) setErrors(prev => ({ ...prev, currentMpin: '' }));
                    }}
                    placeholder="••••"
                    disabled={loading}
                    maxLength={4}
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => setShowMpin(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showMpin.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.currentMpin && <span className="error-text">{errors.currentMpin}</span>}
              </div>

              <div className="form-group">
                <label>New MPIN *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showMpin.new ? "text" : "password"}
                    className={`form-input ${errors.newMpin ? 'input-error' : ''}`}
                    value={mpinForm.newMpin}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setMpinForm(prev => ({ ...prev, newMpin: cleaned }));
                      if (errors.newMpin) setErrors(prev => ({ ...prev, newMpin: '' }));
                    }}
                    placeholder="••••"
                    disabled={loading}
                    maxLength={4}
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => setShowMpin(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showMpin.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.newMpin && <span className="error-text">{errors.newMpin}</span>}
              </div>

              <div className="form-group">
                <label>Confirm New MPIN *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showMpin.confirmNew ? "text" : "password"}
                    className={`form-input ${errors.confirmNewMpin ? 'input-error' : ''}`}
                    value={mpinForm.confirmNewMpin}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      setMpinForm(prev => ({ ...prev, confirmNewMpin: cleaned }));
                      if (errors.confirmNewMpin) setErrors(prev => ({ ...prev, confirmNewMpin: '' }));
                    }}
                    placeholder="••••"
                    disabled={loading}
                    maxLength={4}
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => setShowMpin(prev => ({ ...prev, confirmNew: !prev.confirmNew }))}
                  >
                    {showMpin.confirmNew ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.confirmNewMpin && <span className="error-text">{errors.confirmNewMpin}</span>}
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Changing...' : 'Change MPIN'}
              </button>
            </form>
          )}
        </div>
      )}

      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '8px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <strong>🔒 Security Note:</strong> Your card details are stored securely. 
        Only the last 4 digits are shown for your reference. The MPIN will be required when booking rides.
      </div>
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

    if (!formData.price || formData.price.toString().trim() === '') {
      newErrors.price = 'Price per seat is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
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
      
      toast.success('Ride posted successfully! 🎉');
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
      toast.error(error.response?.data?.message || 'Failed to post ride. Please try again.');
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
  const { user, login, isSuspended, logout } = useAuth();
  
  const [activePage, setActivePage] = useState('rides');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRiderMode, setIsRiderMode] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [logoShake, setLogoShake] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [rides, setRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(false);
  
  // ✅ State for ride details modal
  const [selectedRide, setSelectedRide] = useState(null);
  const [showRideDetailsModal, setShowRideDetailsModal] = useState(false);
  
  // ✅ State for apply/book ride modal
  const [rideToBook, setRideToBook] = useState(null);
  const [showApplyRideModal, setShowApplyRideModal] = useState(false);
  
  // ✅ State for user's bookings (to check if user booked a ride)
  const [myBookings, setMyBookings] = useState([]);
  
  // ✅ State for ride history (rider mode)
  const [rideHistory, setRideHistory] = useState([]);
  const [loadingRideHistory, setLoadingRideHistory] = useState(false);
  
  // ✅ NEW: State for user booking history (user mode - completed rides)
  const [userBookingHistory, setUserBookingHistory] = useState([]);
  const [loadingUserHistory, setLoadingUserHistory] = useState(false);
  
  // ✅ NEW: State for rating modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [bookingToRate, setBookingToRate] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingReview, setRatingReview] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  
  // ✅ NEW: State for report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [bookingToReport, setBookingToReport] = useState(null);
  const [reportIssueType, setReportIssueType] = useState('');
  const [reportRemarks, setReportRemarks] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  
  // ✅ State for notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const notificationRef = useRef(null);
  
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
        if (destinationSearch.trim()) {
          filters.to = destinationSearch.trim();
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

  // ✅ NEW: Fetch ride history for rider mode
  const fetchRideHistory = async () => {
    setLoadingRideHistory(true);
    try {
      const response = await rideAPI.getMyRideHistory();
      console.log('✅ Ride history fetched:', response.count);
      setRideHistory(response.rides || []);
    } catch (error) {
      console.error('Error fetching ride history:', error);
      setRideHistory([]);
    } finally {
      setLoadingRideHistory(false);
    }
  };

  // ✅ NEW: Fetch user booking history (for user mode)
  const fetchUserBookingHistory = async () => {
    setLoadingUserHistory(true);
    try {
      const response = await bookingAPI.getMyRideHistory();
      console.log('✅ User booking history fetched:', response.count);
      setUserBookingHistory(response.bookings || []);
    } catch (error) {
      console.error('Error fetching user booking history:', error);
      setUserBookingHistory([]);
    } finally {
      setLoadingUserHistory(false);
    }
  };

  // ✅ NEW: Handle opening rating modal
  const handleOpenRatingModal = (booking) => {
    setBookingToRate(booking);
    setRatingValue(0);
    setRatingReview('');
    setShowRatingModal(true);
  };

  // ✅ NEW: Handle submitting rating
  const handleSubmitRating = async () => {
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      toast.warning('Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmittingRating(true);
    try {
      await bookingAPI.rateRider(bookingToRate.id, ratingValue, ratingReview || null);
      console.log('✅ Rating submitted successfully');
      
      // Update the local state to reflect the rating
      setUserBookingHistory(prev => 
        prev.map(b => 
          b.id === bookingToRate.id 
            ? { ...b, riderRating: ratingValue, riderReview: ratingReview, hasRated: true, ratedAt: new Date() }
            : b
        )
      );
      
      toast.success('Thank you for your rating! ⭐');
      setShowRatingModal(false);
      setBookingToRate(null);
      setRatingValue(0);
      setRatingReview('');
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  // ✅ NEW: Handle opening report modal
  const handleOpenReportModal = (booking) => {
    setBookingToReport(booking);
    setReportIssueType('');
    setReportRemarks('');
    setShowReportModal(true);
  };

  // ✅ NEW: Handle submitting report
  const handleSubmitReport = async () => {
    if (!reportIssueType) {
      toast.warning('Please select an issue type');
      return;
    }
    if (!reportRemarks || reportRemarks.length < 10) {
      toast.warning('Please provide a detailed description (at least 10 characters)');
      return;
    }

    setSubmittingReport(true);
    try {
      await reportAPI.submitReport(bookingToReport.id, reportIssueType, reportRemarks);
      console.log('✅ Report submitted successfully');
      
      // Update local state to show report was submitted
      setUserBookingHistory(prev => 
        prev.map(b => 
          b.id === bookingToReport.id 
            ? { ...b, hasReported: true }
            : b
        )
      );
      
      setShowReportModal(false);
      setBookingToReport(null);
      setReportIssueType('');
      setReportRemarks('');
      toast.success('Report submitted successfully. Our team will review it shortly.');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleDeleteRide = async (ride) => {
    try {
      await rideAPI.deleteRide(ride.id);
      console.log('✅ Ride cancelled successfully');
      toast.success('Ride cancelled successfully!');
      setRides(prevRides => prevRides.filter(item => item.id !== ride.id));
    } catch (error) {
      console.error('Error cancelling ride:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel ride');
    }
  };

  // ✅ Handle delete ride from history (soft delete)
  const handleDeleteFromRideHistory = async (rideId) => {
    if (!window.confirm('Are you sure you want to remove this ride from your history?')) {
      return;
    }
    try {
      await rideAPI.deleteRideFromHistory(rideId);
      console.log('✅ Ride removed from history');
      toast.success('Ride removed from history');
      setRideHistory(prev => prev.filter(ride => ride.id !== rideId));
    } catch (error) {
      console.error('Error removing ride from history:', error);
      toast.error(error.response?.data?.message || 'Failed to remove ride from history');
    }
  };

  // ✅ Handle view ride details
  const handleViewRideDetails = (rideData) => {
    // Check if user has booked this ride
    const userBooking = myBookings.find(
      b => b.ride?.id === rideData.id && b.bookingStatus === 'confirmed'
    );
    setSelectedRide({
      ...rideData,
      userBooking: userBooking || null
    });
    setShowRideDetailsModal(true);
  };

  const closeRideDetailsModal = () => {
    setShowRideDetailsModal(false);
    setSelectedRide(null);
  };

  // ✅ Handle book ride (open ApplyRideModal)
  const handleBookRide = (rideData) => {
    setRideToBook(rideData);
    setShowApplyRideModal(true);
  };

  const closeApplyRideModal = () => {
    setShowApplyRideModal(false);
    setRideToBook(null);
  };

  const handleBookingSuccess = async (response) => {
    console.log('✅ Booking successful:', response);
    // Refresh both bookings and rides immediately when a new booking is made
    // Using Promise.all for concurrent fetch - faster and ensures both complete
    try {
      await Promise.all([fetchMyBookings(), fetchRides()]);
      console.log('✅ Data refreshed after booking');
    } catch (error) {
      console.error('Error refreshing data after booking:', error);
    }
  };

  // ✅ Fetch user's bookings
  const fetchMyBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setMyBookings(response.bookings || []);
      console.log('✅ My bookings fetched:', response.count);
    } catch (error) {
      console.error('Error fetching my bookings:', error);
      setMyBookings([]);
    }
  };

  // ✅ Handle cancel booking
  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingAPI.cancelBooking(bookingId);
      console.log('✅ Booking cancelled successfully');
      toast.success('Booking cancelled successfully!');
      // Refresh bookings and rides concurrently
      await Promise.all([fetchMyBookings(), fetchRides()]);
      closeRideDetailsModal();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  useEffect(() => {
    fetchRides();
    fetchMyBookings();
  }, [isRiderMode, vehicleFilter, destinationSearch]);

  // ✅ NEW: Fetch ride history when navigating to history page in rider mode
  useEffect(() => {
    if (activePage === 'history' && isRiderMode) {
      fetchRideHistory();
    }
    // Fetch user booking history when in user mode
    if (activePage === 'history' && !isRiderMode) {
      fetchUserBookingHistory();
    }
  }, [activePage, isRiderMode]);

  // ✅ NEW: Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // ✅ Fetch notifications on mount and every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // ✅ Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // ✅ Delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationAPI.delete(notificationId);
      const deletedNotif = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // ✅ Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'verification_approved':
        return '✅';
      case 'verification_rejected':
        return '❌';
      case 'ride_booked':
        return '🚗';
      case 'ride_cancelled':
        return '🚫';
      case 'booking_cancelled':
        return '🚫';
      case 'verification_pending':
        return '⏳';
      default:
        return '🔔';
    }
  };

  // ✅ Format notification time
  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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
      toast.warning('You need to be verified as a rider to access rider mode. Please complete your verification process.');
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

      toast.success('Profile updated successfully!');
      setUpdateMessage('Profile updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
                <>
                  <div className="destination-search">
                    <input
                      type="text"
                      placeholder="Search by destination..."
                      value={destinationSearch}
                      onChange={(e) => setDestinationSearch(e.target.value)}
                      className="destination-search-input"
                    />
                    {destinationSearch && (
                      <button
                        className="clear-search-btn"
                        onClick={() => setDestinationSearch('')}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="vehicle-filters">
                    <button
                      className={`filter-btn ${vehicleFilter === 'bike' ? 'active' : ''}`}
                      onClick={() => setVehicleFilter(vehicleFilter === 'bike' ? 'all' : 'bike')}
                    >
                      <img src="/icons/bike%20logo.jpg" alt="Bike" style={{ width: '1.5rem', height: '1.5rem', flexShrink: 0 }} />
                      <span>Bikes</span>
                    </button>

                    <button
                      className={`filter-btn ${vehicleFilter === 'car' ? 'active' : ''}`}
                      onClick={() => setVehicleFilter(vehicleFilter === 'car' ? 'all' : 'car')}
                    >
                      <img src="/icons/car%20logo.jpg" alt="Car" style={{ width: '1.5rem', height: '1.5rem', flexShrink: 0 }} />
                      <span>Cars</span>
                    </button>
                  </div>
                </>
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
                        userId: ride.userId || ride.rider?.id, // Fallback to rider.id if userId not present
                        driverName: ride.rider?.username || 'Anonymous',
                        driverRating: ride.rider?.riderAverageRating || null,
                        driverTotalRatings: ride.rider?.totalRatingsReceived || 0,
                        driverPhone: ride.rider?.phone || '',
                        driverPhoto: ride.rider?.profilePicture || null,
                        driverTotalRides: ride.rider?.totalRides || 0,
                        from: ride.from,
                        to: ride.to,
                        date: ride.date,
                        time: ride.time,
                        price: ride.price || 0,
                        availableSeats: ride.availableSeats || 0,
                        bookedSeats: ride.bookedSeats || 0,
                        status: ride.status || 'active',
                        vehicleType: ride.vehicleType === 'bike' ? 'Bike' : 'Car',
                        isVerified: ride.rider?.isVerifiedRider || false,
                        pickupLocation: ride.pickupLocation,
                        vehicleNumber: ride.vehicleNumber,
                        vehiclePhoto: ride.vehiclePhoto,
                        description: ride.description
                      }}
                      onViewDetails={handleViewRideDetails}
                      onBookRide={!isRiderMode ? handleBookRide : undefined}
                    />
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
              <p>{isRiderMode ? 'View your past rides and bookings' : 'View your past bookings and trips'}</p>
            </div>
            
            {!isRiderMode ? (
              // ✅ User mode - Show completed/past bookings with rating option
              loadingUserHistory ? (
                <div className="loading-state">Loading your ride history...</div>
              ) : userBookingHistory.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3>No booking history yet</h3>
                  <p>Your completed bookings will appear here after the ride date passes</p>
                </div>
              ) : (
                <div className="user-booking-history-list">
                  {userBookingHistory.map(booking => (
                    <div key={booking.id} className="user-history-card">
                      <div className="user-history-header">
                        <div className="ride-route">
                          <span className="ride-from">{booking.ride?.from}</span>
                          <span className="ride-arrow">→</span>
                          <span className="ride-to">{booking.ride?.to}</span>
                        </div>
                        <div className="booking-ids">
                          <span className="booking-id">Booking: {booking.bookingId}</span>
                          <span className="ride-id">Ride: {booking.ride?.rideId}</span>
                        </div>
                      </div>
                      
                      <div className="user-history-content">
                        {/* Ride Details */}
                        <div className="history-section">
                          <h4>Ride Details</h4>
                          <div className="history-details-grid">
                            <div className="history-detail-row">
                              <span className="detail-label">Date:</span>
                              <span className="detail-value">{new Date(booking.ride?.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="history-detail-row">
                              <span className="detail-label">Time:</span>
                              <span className="detail-value">{booking.ride?.time}</span>
                            </div>
                            <div className="history-detail-row">
                              <span className="detail-label">Pickup:</span>
                              <span className="detail-value">{booking.ride?.pickupLocation}</span>
                            </div>
                            <div className="history-detail-row">
                              <span className="detail-label">Vehicle:</span>
                              <span className="detail-value">{booking.ride?.vehicleType === 'bike' ? '🏍️ Bike' : '🚗 Car'} - {booking.ride?.vehicleNumber}</span>
                            </div>
                          </div>
                        </div>

                        {/* Rider Details */}
                        <div className="history-section">
                          <h4>Rider Details</h4>
                          <div className="rider-info-card">
                            <div className="rider-avatar">
                              {booking.ride?.rider?.profilePicture ? (
                                <img 
                                  src={`http://localhost:5000${booking.ride.rider.profilePicture}`} 
                                  alt={booking.ride.rider.username}
                                />
                              ) : (
                                <span className="avatar-initials">{booking.ride?.rider?.username?.charAt(0).toUpperCase() || 'R'}</span>
                              )}
                              {booking.ride?.rider?.isVerifiedRider && (
                                <span className="verified-badge" title="Verified Rider">✓</span>
                              )}
                            </div>
                            <div className="rider-details">
                              <span className="rider-name">{booking.ride?.rider?.username || 'Unknown Rider'}</span>
                              <span className="rider-phone">{booking.ride?.rider?.phone || 'No phone'}</span>
                              <div className="rider-badges">
                                {booking.ride?.rider?.isVerifiedUser && <span className="badge verified-user">Verified User</span>}
                                {booking.ride?.rider?.isVerifiedRider && <span className="badge verified-rider">Verified Rider</span>}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="history-section">
                          <h4>Booking Details</h4>
                          <div className="history-details-grid">
                            <div className="history-detail-row">
                              <span className="detail-label">Seats Booked:</span>
                              <span className="detail-value">{booking.seatsBooked} seat(s)</span>
                            </div>
                            <div className="history-detail-row">
                              <span className="detail-label">Total Paid:</span>
                              <span className="detail-value amount">Rs. {booking.totalAmount}</span>
                            </div>
                            <div className="history-detail-row">
                              <span className="detail-label">Payment Method:</span>
                              <span className="detail-value">{booking.paymentMethod === 'debit_card' ? '💳 Debit Card' : booking.paymentMethod}</span>
                            </div>
                            <div className="history-detail-row">
                              <span className="detail-label">Transaction ID:</span>
                              <span className="detail-value transaction">{booking.transactionId}</span>
                            </div>
                            <div className="history-detail-row">
                              <span className="detail-label">Booked On:</span>
                              <span className="detail-value">{new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Rating Section */}
                        <div className="history-section rating-section">
                          <h4>Rate Your Ride</h4>
                          {booking.hasRated ? (
                            <div className="rating-display">
                              <div className="stars-display">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <span key={star} className={`star ${star <= booking.riderRating ? 'filled' : ''}`}>★</span>
                                ))}
                                <span className="rating-text">{booking.riderRating}/5</span>
                              </div>
                              {booking.riderReview && (
                                <p className="review-text">"{booking.riderReview}"</p>
                              )}
                              <span className="rated-at">Rated on {new Date(booking.ratedAt).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <div className="rating-prompt">
                              <p>How was your ride experience?</p>
                              <button 
                                className="btn-rate"
                                onClick={() => handleOpenRatingModal(booking)}
                              >
                                ⭐ Rate This Ride
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Report Rider Section */}
                        <div className="history-section report-section">
                          <h4>Report an Issue</h4>
                          {booking.hasReported ? (
                            <div className="report-submitted">
                              <span className="report-badge">⚠️ Report Submitted</span>
                              <p className="report-note">Your report is under review</p>
                            </div>
                          ) : (
                            <div className="report-prompt">
                              <p>Had a problem with this ride?</p>
                              <button 
                                className="btn-report"
                                onClick={() => handleOpenReportModal(booking)}
                              >
                                🚨 Report Rider
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : loadingRideHistory ? (
              <div className="loading-state">Loading ride history...</div>
            ) : rideHistory.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3>No ride history yet</h3>
                <p>Your past rides will appear here once they expire</p>
              </div>
            ) : (
              <div className="ride-history-list">
                {rideHistory.map(ride => (
                  <div key={ride.id} className="ride-history-card">
                    <div className="ride-history-header">
                      <div className="ride-route">
                        <span className="ride-from">{ride.from}</span>
                        <span className="ride-arrow">→</span>
                        <span className="ride-to">{ride.to}</span>
                      </div>
                      <div className="ride-history-actions">
                        <span className={`ride-status-badge ${ride.status}`}>
                          {ride.status === 'cancelled' ? 'Cancelled' : 
                           ride.status === 'completed' ? 'Completed' : 'Expired'}
                        </span>
                        <button 
                          className="delete-history-btn"
                          onClick={() => handleDeleteFromRideHistory(ride.id)}
                          title="Remove from history"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    
                    <div className="ride-history-details">
                      <div className="ride-info-row">
                        <span className="ride-info-label">Date:</span>
                        <span className="ride-info-value">{new Date(ride.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="ride-info-row">
                        <span className="ride-info-label">Time:</span>
                        <span className="ride-info-value">{ride.time}</span>
                      </div>
                      <div className="ride-info-row">
                        <span className="ride-info-label">Pickup Location:</span>
                        <span className="ride-info-value">{ride.pickupLocation}</span>
                      </div>
                      <div className="ride-info-row">
                        <span className="ride-info-label">Vehicle:</span>
                        <span className="ride-info-value">{ride.vehicleType === 'bike' ? '🏍️ Bike' : '🚗 Car'} - {ride.vehicleNumber}</span>
                      </div>
                      <div className="ride-info-row">
                        <span className="ride-info-label">Price:</span>
                        <span className="ride-info-value">Rs. {ride.price || 0} per seat</span>
                      </div>
                      <div className="ride-info-row">
                        <span className="ride-info-label">Seats:</span>
                        <span className="ride-info-value">{ride.bookedSeats || 0}/{ride.availableSeats} booked</span>
                      </div>
                    </div>
                    
                    <div className="ride-booking-section">
                      <h4>Booked By</h4>
                      {ride.bookedBy === 'None' || !ride.bookings || ride.bookings.length === 0 ? (
                        <div className="no-bookings">
                          <span className="no-booking-text">No one booked this ride</span>
                        </div>
                      ) : (
                        <div className="booking-list">
                          {ride.bookings.map(booking => (
                            <div key={booking.id} className="booking-item">
                              <div className="passenger-info">
                                <div className="passenger-avatar">
                                  {booking.passenger?.profilePicture ? (
                                    <img 
                                      src={`http://localhost:5000${booking.passenger.profilePicture}`} 
                                      alt={booking.passenger.username}
                                    />
                                  ) : (
                                    <span>{booking.passenger?.username?.charAt(0).toUpperCase() || 'U'}</span>
                                  )}
                                </div>
                                <div className="passenger-details">
                                  <span className="passenger-name">{booking.passenger?.username || 'Unknown'}</span>
                                  <span className="passenger-contact">
                                    <FiPhone className="phone-icon" />
                                    {booking.passenger?.phone || 'No phone'}
                                  </span>
                                </div>
                              </div>
                              <div className="booking-meta">
                                <span className="seats-booked">{booking.seatsBooked} seat(s)</span>
                                <span className="booking-amount">Rs. {booking.totalAmount}</span>
                                <span className={`payment-status ${booking.paymentStatus}`}>
                                  {booking.paymentStatus === 'completed' ? '✓ Paid' : booking.paymentStatus}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'add-issue':
        return <RaiseIssuePage />;

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

  // ✅ If user is suspended, show suspension notice and block all features
  if (isSuspended()) {
    return (
      <div className="dashboard-container">
        <div className="suspension-overlay">
          <div className="suspension-modal">
            <div className="suspension-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            </div>
            <h2>Account Suspended</h2>
            <p className="suspension-message">
              Your account has been suspended and you cannot access the application features.
            </p>
            {user?.suspensionReason && (
              <div className="suspension-reason">
                <strong>Reason:</strong>
                <p>{user.suspensionReason}</p>
              </div>
            )}
            {user?.suspendedAt && (
              <p className="suspension-date">
                Suspended on: {new Date(user.suspendedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
            <p className="suspension-contact">
              If you believe this is a mistake, please contact our support team at{' '}
              <a href="mailto:support@liftnepal.com">support@liftnepal.com</a>
            </p>
            <button className="suspension-logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {/* ✅ Notification Bell with Dropdown */}
            <div className="notification-wrapper" ref={notificationRef}>
              <button 
                className="notification-icon" 
                aria-label="Notifications"
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotificationDropdown && (
                <div className="notification-dropdown">
                  <div className="notification-dropdown-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        className="mark-all-read-btn"
                        onClick={handleMarkAllAsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="empty-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${!notification.isRead ? 'unread' : ''} ${notification.type}`}
                          onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                        >
                          <div className="notification-icon-type">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="notification-content">
                            <div className="notification-title">{notification.title}</div>
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-time">
                              {formatNotificationTime(notification.createdAt)}
                            </div>
                          </div>
                          <button 
                            className="notification-delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            aria-label="Delete notification"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
        currentUserId={user?.id}
        onCancelRide={(ride) => {
          if (window.confirm(`Are you sure you want to cancel this ride from ${ride.from} to ${ride.to}?`)) {
            handleDeleteRide(ride);
            closeRideDetailsModal();
          }
        }}
        onCancelBooking={(booking) => {
          if (window.confirm(`Are you sure you want to cancel your booking? A refund will be initiated.`)) {
            handleCancelBooking(booking.id);
          }
        }}
      />

      {/* ✅ Apply/Book Ride Modal */}
      <ApplyRideModal
        isOpen={showApplyRideModal}
        onClose={closeApplyRideModal}
        ride={rideToBook}
        onSuccess={handleBookingSuccess}
      />

      {/* ✅ Rating Modal */}
      {showRatingModal && bookingToRate && (
        <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
          <div className="modal-content rating-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rate Your Ride</h3>
              <button className="modal-close" onClick={() => setShowRatingModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="rating-ride-info">
                <p className="rating-route">
                  <strong>{bookingToRate.ride?.from}</strong> → <strong>{bookingToRate.ride?.to}</strong>
                </p>
                <p className="rating-rider">
                  Rider: <strong>{bookingToRate.ride?.rider?.username || 'Unknown'}</strong>
                </p>
                <p className="rating-date">
                  {new Date(bookingToRate.ride?.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
              
              <div className="rating-stars-input">
                <label>How was your experience?</label>
                <div className="stars-container">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= ratingValue ? 'selected' : ''}`}
                      onClick={() => setRatingValue(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="rating-label">
                  {ratingValue === 0 ? 'Select a rating' :
                   ratingValue === 1 ? 'Poor' :
                   ratingValue === 2 ? 'Fair' :
                   ratingValue === 3 ? 'Good' :
                   ratingValue === 4 ? 'Very Good' : 'Excellent'}
                </span>
              </div>
              
              <div className="rating-review-input">
                <label>Write a review (optional)</label>
                <textarea
                  value={ratingReview}
                  onChange={(e) => setRatingReview(e.target.value)}
                  placeholder="Share your experience with the rider..."
                  maxLength={500}
                  rows={4}
                />
                <small>{ratingReview.length}/500 characters</small>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setShowRatingModal(false)}
                disabled={submittingRating}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSubmitRating}
                disabled={ratingValue === 0 || submittingRating}
              >
                {submittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Report Modal */}
      {showReportModal && bookingToReport && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🚨 Report Rider</h3>
              <button className="modal-close" onClick={() => setShowReportModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="report-ride-info">
                <p className="report-route">
                  <strong>{bookingToReport.ride?.from}</strong> → <strong>{bookingToReport.ride?.to}</strong>
                </p>
                <p className="report-rider">
                  Rider: <strong>{bookingToReport.ride?.rider?.username || 'Unknown'}</strong>
                </p>
                <p className="report-date">
                  {new Date(bookingToReport.ride?.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
              
              <div className="report-issue-type">
                <label>Issue Type *</label>
                <select
                  value={reportIssueType}
                  onChange={(e) => setReportIssueType(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select an issue type</option>
                  <option value="safety">⚠️ Safety Concern</option>
                  <option value="behavior">😤 Inappropriate Behavior</option>
                  <option value="vehicle_condition">🚗 Vehicle Condition</option>
                  <option value="route_deviation">🗺️ Route Deviation</option>
                  <option value="overcharging">💰 Overcharging</option>
                  <option value="late_arrival">⏰ Late Arrival</option>
                  <option value="other">📋 Other</option>
                </select>
              </div>
              
              <div className="report-remarks-input">
                <label>Describe the Issue *</label>
                <textarea
                  value={reportRemarks}
                  onChange={(e) => setReportRemarks(e.target.value)}
                  placeholder="Please provide detailed information about the issue you experienced..."
                  maxLength={1000}
                  rows={5}
                />
                <small>{reportRemarks.length}/1000 characters (minimum 10 required)</small>
              </div>

              <div className="report-notice">
                <p>⚠️ Please note: Submitting false reports may result in account restrictions. All reports are reviewed by our team.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setShowReportModal(false)}
                disabled={submittingReport}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={handleSubmitReport}
                disabled={!reportIssueType || reportRemarks.length < 10 || submittingReport}
              >
                {submittingReport ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}

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

