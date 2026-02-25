import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../css/ForgetPassword.css';
import { passwordAPI } from "../../../services/api";

const ForgetPassword = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLogoShaking, setIsLogoShaking] = useState(false);

  const handleLogoClick = () => {
    setIsLogoShaking(true);
    setTimeout(() => setIsLogoShaking(false), 600);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    
    if (errors.email) {
      setErrors({});
    }
    
    if (apiError) {
      setApiError('');
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
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
      const response = await passwordAPI.forgotPassword({ email });
      
      toast.success('Reset link sent! Check your email inbox. 📧');
      setSuccessMessage(response.message);
      setEmail(''); // Clear the form
      
    } catch (error) {
      console.error("Forgot password error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        setApiError(error.response.data.message);
      } else if (error.message === "Network Error") {
        toast.error('Cannot connect to server');
        setApiError("Cannot connect to server. Please ensure backend is running.");
      } else {
        toast.error('Failed to send reset email');
        setApiError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="forget-password-page">
      <div className="forget-password-left">
        <div className="forget-password-overlay"></div>
      </div>

      <div className="forget-password-right">
        <div className="logo-section">
          <img 
            src="/images/logo.png" 
            alt="Lift Nepal Logo" 
            className={`forget-password-logo ${isLogoShaking ? 'logo-shake' : ''}`}
            onClick={handleLogoClick}
          />
          <div className="logo-title-section">
            <h2 className="forget-password-title">Forgot Password?</h2>
            <p className="forget-password-subtitle">
              No worries! Enter your email and we'll send you reset instructions
            </p>
          </div>
        </div>

        <div className="form-wrapper">
          <div className="form-content">
            {successMessage && (
              <div className="success-message">
                ✅ {successMessage}
              </div>
            )}

            {apiError && (
              <div className="api-error-message">
                ❌ {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="forget-password-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your registered email"
                  disabled={loading}
                  autoFocus
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <button 
                type="submit" 
                className="reset-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgetPassword;