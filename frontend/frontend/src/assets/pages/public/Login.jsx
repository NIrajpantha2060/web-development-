import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../../css/Login.css';
import { useAuth } from "../../../context/AuthContext";
import { authAPI } from "../../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLogoShaking, setIsLogoShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKeyDown = (e, currentField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (currentField === 'email') {
        document.getElementById('password')?.focus();
      } else if (currentField === 'password') {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      console.log('🔐 Login successful, updating context...');

      // ✅ CRITICAL FIX: Wait for login to complete before navigating
      await login(response.user, response.token);

      console.log('✅ Context updated, now navigating...');

      toast.success(`Welcome back, ${response.user.username}!`);

      // ✅ FIXED: Navigation now happens AFTER context is updated
      if (response.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        setApiError(error.response.data.message);
      } else if (error.message === "Network Error") {
        toast.error('Cannot connect to server');
        setApiError("Cannot connect to server. Please ensure backend is running.");
      } else {
        toast.error('Login failed. Please try again.');
        setApiError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/forget-password');
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-overlay"></div>
      </div>

      <div className="login-right">
        <div className="logo-section">
          <img 
            src="/images/logo.png" 
            alt="Lift Nepal Logo" 
            className={`login-logo ${isLogoShaking ? 'logo-shake' : ''}`}
            onClick={handleLogoClick}
          />
          <div className="logo-title-section">
            <h2 className="login-title">Login to Lift Nepal</h2>
            <p className="login-subtitle">Welcome back! Please login to continue</p>
          </div>
        </div>

        <div className="form-wrapper">
          <div className="form-content">
            {apiError && (
              <div className="api-error-message" style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px',
                border: '1px solid #fcc'
              }}>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 'email')}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 'password')}
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="password-options">
                <div className="forgot-password-link" onClick={handleForgotPassword}>
                  Forgot Password?
                </div>
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <p className="signup-text">
                Don't have an account?{' '}
                <span className="signup-link" onClick={handleSignUp}>
                  Sign up
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;