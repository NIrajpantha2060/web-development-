// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import '../../css/Login.css';

// // const Login = () => {
// //   const navigate = useNavigate();
// //   const [formData, setFormData] = useState({
// //     username: '',
// //     password: ''
// //   });
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [errors, setErrors] = useState({});
// //   const [isLogoShaking, setIsLogoShaking] = useState(false);

// //   const handleLogoClick = () => {
// //     setIsLogoShaking(true);
// //     setTimeout(() => setIsLogoShaking(false), 600);
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value
// //     });
    
// //     if (errors[name]) {
// //       setErrors({
// //         ...errors,
// //         [name]: ''
// //       });
// //     }
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};

// //     if (!formData.username.trim()) {
// //       newErrors.username = 'Username is required';
// //     }

// //     if (!formData.password) {
// //       newErrors.password = 'Password is required';
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleKeyDown = (e, currentField) => {
// //     if (e.key === 'Enter') {
// //       e.preventDefault();
      
// //       if (currentField === 'username') {
// //         document.getElementById('password')?.focus();
// //       } else if (currentField === 'password') {
// //         handleSubmit(e);
// //       }
// //     }
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
    
// //     if (validateForm()) {
// //       console.log('Login submitted:', formData);
// //       // Add your login logic here
// //     }
// //   };

// //   const handleSignUp = () => {
// //     navigate('/signup');
// //   };

// //   return (
// //     <div className="login-page">
// //       {/* Left Section - Image (60%) */}
// //       <div className="login-left">
// //         <div className="login-overlay"></div>
// //       </div>

// //       {/* Right Section - Login Form (40%) */}
// //       <div className="login-right">
// //         {/* Logo Section */}
// //         <div className="logo-section">
// //           <img 
// //             src="/images/logo.png" 
// //             alt="Lift Nepal Logo" 
// //             className={`login-logo ${isLogoShaking ? 'logo-shake' : ''}`}
// //             onClick={handleLogoClick}
// //           />
// //         </div>

// //         {/* Form Wrapper */}
// //         <div className="form-wrapper">
// //           <div className="form-content">
// //             <h2 className="login-title">Login to Lift Nepal</h2>
// //             <p className="login-subtitle">Welcome back! Please login to continue</p>

// //             <form onSubmit={handleSubmit} className="login-form">
// //               {/* Username Field */}
// //               <div className="form-group">
// //                 <label htmlFor="username" className="form-label">Username</label>
// //                 <input
// //                   type="text"
// //                   id="username"
// //                   name="username"
// //                   value={formData.username}
// //                   onChange={handleChange}
// //                   onKeyDown={(e) => handleKeyDown(e, 'username')}
// //                   className={`form-input ${errors.username ? 'input-error' : ''}`}
// //                   placeholder="Enter your username"
// //                 />
// //                 {errors.username && (
// //                   <span className="error-text">{errors.username}</span>
// //                 )}
// //               </div>

// //               {/* Password Field */}
// //               <div className="form-group">
// //                 <label htmlFor="password" className="form-label">Password</label>
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   id="password"
// //                   name="password"
// //                   value={formData.password}
// //                   onChange={handleChange}
// //                   onKeyDown={(e) => handleKeyDown(e, 'password')}
// //                   className={`form-input ${errors.password ? 'input-error' : ''}`}
// //                   placeholder="Enter your password"
// //                 />
// //                 {errors.password && (
// //                   <span className="error-text">{errors.password}</span>
// //                 )}
// //               </div>

// //               {/* Show Password Checkbox */}
// //               <div className="form-checkbox">
// //                 <input
// //                   type="checkbox"
// //                   id="showPassword"
// //                   checked={showPassword}
// //                   onChange={() => setShowPassword(!showPassword)}
// //                   className="checkbox-input"
// //                 />
// //                 <label htmlFor="showPassword" className="checkbox-label">
// //                   Show password
// //                 </label>
// //               </div>

// //               {/* Login Button */}
// //               <button type="submit" className="login-button">
// //                 Login
// //               </button>

// //               {/* Sign Up Link */}
// //               <p className="signup-text">
// //                 Don't have an account?{' '}
// //                 <span className="signup-link" onClick={handleSignUp}>
// //                   Sign up
// //                 </span>
// //               </p>
// //             </form>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../../css/Login.css';


// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isLogoShaking, setIsLogoShaking] = useState(false);

//   const handleLogoClick = () => {
//     setIsLogoShaking(true);
//     setTimeout(() => setIsLogoShaking(false), 600);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ''
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleKeyDown = (e, currentField) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
      
//       if (currentField === 'email') {
//         document.getElementById('password')?.focus();
//       } else if (currentField === 'password') {
//         handleSubmit(e);
//       }
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       console.log('Login submitted:', formData);
//       // Add your login logic here
//     }
//   };

//   const handleSignUp = () => {
//     navigate('/signup');
//   };

//   const handleForgotPassword = () => {
//     // Add your forgot password logic here
//     console.log('Forgot password clicked');
//   };

//   return (
//     <div className="login-page">
//       {/* Left Section - Image (60%) */}
//       <div className="login-left">
//         <div className="login-overlay"></div>
//       </div>

//       {/* Right Section - Login Form (40%) */}
//       <div className="login-right">
//         {/* Logo Section with Title beside it */}
//         <div className="logo-section">
//           <img 
//             src="/images/logo.png" 
//             alt="Lift Nepal Logo" 
//             className={`login-logo ${isLogoShaking ? 'logo-shake' : ''}`}
//             onClick={handleLogoClick}
//           />
//           <div className="logo-title-section">
//             <h2 className="login-title">Login to Lift Nepal</h2>
//             <p className="login-subtitle">Welcome back! Please login to continue</p>
//           </div>
//         </div>

//         {/* Form Wrapper */}
//         <div className="form-wrapper">
//           <div className="form-content">
//             <form onSubmit={handleSubmit} className="login-form">
//               {/* Email Field */}
//               <div className="form-group">
//                 <label htmlFor="email" className="form-label">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   onKeyDown={(e) => handleKeyDown(e, 'email')}
//                   className={`form-input ${errors.email ? 'input-error' : ''}`}
//                   placeholder="Enter your email"
//                 />
//                 {errors.email && (
//                   <span className="error-text">{errors.email}</span>
//                 )}
//               </div>

//               {/* Password Field */}
//               <div className="form-group">
//                 <label htmlFor="password" className="form-label">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   onKeyDown={(e) => handleKeyDown(e, 'password')}
//                   className={`form-input ${errors.password ? 'input-error' : ''}`}
//                   placeholder="Enter your password"
//                 />
//                 {errors.password && (
//                   <span className="error-text">{errors.password}</span>
//                 )}
//               </div>

//               {/* Show Password & Forgot Password - Same Row */}
//               <div className="password-options">
//                 <div className="form-checkbox">
//                   <input
//                     type="checkbox"
//                     id="showPassword"
//                     checked={showPassword}
//                     onChange={() => setShowPassword(!showPassword)}
//                     className="checkbox-input"
//                   />
//                   <label htmlFor="showPassword" className="checkbox-label">
//                     Show password
//                   </label>
//                 </div>
                
//                 <span className="forgot-password-link" onClick={handleForgotPassword}>
//                   Forgot Password?
//                 </span>
//               </div>

//               {/* Login Button */}
//               <button type="submit" className="login-button">
//                 Login
//               </button>

//               {/* Sign Up Link */}
//               <p className="signup-text">
//                 Don't have an account?{' '}
//                 <span className="signup-link" onClick={handleSignUp}>
//                   Sign up
//                 </span>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Login.css';
import { useAuth } from "../../../context/AuthContext"; // ✅

import { authAPI } from "../../../services/api"; // ✅


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
      // Call backend login API
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      // Store token and user data using AuthContext
      login(response.user, response.token);

      // Show success message
      alert(`Welcome back, ${response.user.username}!`);
      
      
      // Redirect to dashboard
       navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.message === 'Network Error') {
        setApiError('Cannot connect to server. Please ensure backend is running.');
      } else {
        setApiError('Login failed. Please try again.');
      }
      
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    alert('Forgot password feature coming soon!');
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

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
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
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="password-options">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="checkbox-input"
                    disabled={loading}
                  />
                  <label htmlFor="showPassword" className="checkbox-label">
                    Show password
                  </label>
                </div>
                
                <span className="forgot-password-link" onClick={handleForgotPassword}>
                  Forgot Password?
                </span>
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