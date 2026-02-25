

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../../css/ResetPassword.css';
import { passwordAPI } from "../../../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLogoShaking, setIsLogoShaking] = useState(false);

  const handleLogoClick = () => {
    setIsLogoShaking(true);
    setTimeout(() => setIsLogoShaking(false), 600);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one capital letter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
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
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await passwordAPI.resetPassword({
        token,
        newPassword: formData.newPassword
      });
      
      toast.success('Password reset successfully! Redirecting to login... ✅');
      setSuccessMessage(response.message);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error("Reset password error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        setApiError(error.response.data.message);
      } else if (error.message === "Network Error") {
        toast.error('Cannot connect to server');
        setApiError("Cannot connect to server. Please ensure backend is running.");
      } else {
        toast.error('Failed to reset password');
        setApiError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-left">
        <div className="reset-password-overlay"></div>
      </div>

      <div className="reset-password-right">
        <div className="logo-section">
          <img 
            src="/images/logo.png" 
            alt="Lift Nepal Logo" 
            className={`reset-password-logo ${isLogoShaking ? 'logo-shake' : ''}`}
            onClick={handleLogoClick}
          />
          <div className="logo-title-section">
            <h2 className="reset-password-title">Reset Your Password</h2>
            <p className="reset-password-subtitle">
              Create a new secure password for your account
            </p>
          </div>
        </div>

        <div className="form-wrapper">
          <div className="form-content">
            {successMessage && (
              <div className="success-message">
                ✅ {successMessage}
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  Redirecting to login...
                </p>
              </div>
            )}

            {apiError && (
              <div className="api-error-message">
                ❌ {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="reset-password-form">
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
                    placeholder="Enter new password (min 6 characters)"
                    disabled={loading || successMessage}
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || successMessage}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="error-text">{errors.newPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Re-enter your new password"
                    disabled={loading || successMessage}
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading || successMessage}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>

              <button 
                type="submit" 
                className="reset-submit-button"
                disabled={loading || successMessage}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <div className="back-to-login">
                <span className="back-link" onClick={handleBackToLogin}>
                  ← Back to Login
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;