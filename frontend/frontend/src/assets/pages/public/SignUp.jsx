// // import React, { useState } from 'react';
// // import '../../css/SignUp.css';
// // import { useNavigate } from 'react-router-dom';


// // const SignUp = () => {
// //   const [formData, setFormData] = useState({
// //     username: '',
// //     phone: '',
// //     email: '',
// //     password: '',
// //     confirmPassword: ''
// //   });

// //   const navigate = useNavigate();


// //   const [errors, setErrors] = useState({});
// //   const [showPassword, setShowPassword] = useState(false);

// //   const validateField = (name, value) => {
// //     let error = '';

// //     switch(name) {
// //       case 'username':
// //         if (!value.trim()) {
// //           error = 'Username is required';
// //         } else if (value.length > 30) {
// //           error = 'Username must be 30 characters or less';
// //         }
// //         break;

// //       case 'phone':
// //         const phoneRegex = /^(97|98)\d{8}$/;
// //         if (!value.trim()) {
// //           error = 'Phone number is required';
// //         } else if (!phoneRegex.test(value)) {
// //           error = 'Phone must start with 97 or 98 and be 10 digits';
// //         }
// //         break;

// //       case 'email':
// //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //         if (!value.trim()) {
// //           error = 'Email is required';
// //         } else if (!emailRegex.test(value)) {
// //           error = 'Please enter a valid email';
// //         }
// //         break;

// //       case 'password':
// //         if (!value) {
// //           error = 'Password is required';
// //         } else if (value.length < 8) {
// //           error = 'Password must be at least 8 characters';
// //         } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
// //           error = 'Password must include uppercase, lowercase, and number';
// //         }
// //         break;

// //       case 'confirmPassword':
// //         if (!value) {
// //           error = 'Please confirm your password';
// //         } else if (formData.password !== value) {
// //           error = 'Passwords do not match';
// //         }
// //         break;

// //       default:
// //         break;
// //     }

// //     return error;
// //   };

// //   const handleBlur = (e) => {
// //     const { name, value } = e.target;
// //     const error = validateField(name, value);
    
// //     if (error) {
// //       setErrors({
// //         ...errors,
// //         [name]: error
// //       });
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value
// //     });
    
// //     // Clear error when user starts typing
// //     if (errors[name]) {
// //       setErrors({
// //         ...errors,
// //         [name]: ''
// //       });
// //     }
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};

// //     // Username validation
// //     if (!formData.username.trim()) {
// //       newErrors.username = 'Username is required';
// //     } else if (formData.username.length > 30) {
// //       newErrors.username = 'Username must be 30 characters or less';
// //     }

// //     // Phone validation (Nepali numbers)
// //     const phoneRegex = /^(97|98)\d{8}$/;
// //     if (!formData.phone.trim()) {
// //       newErrors.phone = 'Phone number is required';
// //     } else if (!phoneRegex.test(formData.phone)) {
// //       newErrors.phone = 'Phone must start with 97 or 98 and be 10 digits';
// //     }

// //     // Email validation
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!formData.email.trim()) {
// //       newErrors.email = 'Email is required';
// //     } else if (!emailRegex.test(formData.email)) {
// //       newErrors.email = 'Please enter a valid email';
// //     }

// //     // Password validation
// //     if (!formData.password) {
// //       newErrors.password = 'Password is required';
// //     } else if (formData.password.length < 8) {
// //       newErrors.password = 'Password must be at least 8 characters';
// //     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
// //       newErrors.password = 'Password must include uppercase, lowercase, and number';
// //     }

// //     // Confirm password validation
// //     if (!formData.confirmPassword) {
// //       newErrors.confirmPassword = 'Please confirm your password';
// //     } else if (formData.password !== formData.confirmPassword) {
// //       newErrors.confirmPassword = 'Passwords do not match';
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleKeyDown = (e, currentField) => {
// //     if (e.key === 'Enter') {
// //       e.preventDefault(); // Prevent form submission
      
// //       // Define field order
// //       const fieldOrder = ['username', 'phone', 'email', 'password', 'confirmPassword'];
// //       const currentIndex = fieldOrder.indexOf(currentField);
      
// //       // If not the last field, move to next
// //       if (currentIndex < fieldOrder.length - 1) {
// //         const nextField = fieldOrder[currentIndex + 1];
// //         document.getElementById(nextField)?.focus();
// //       } else {
// //         // On last field, trigger submit
// //         handleSubmit(e);
// //       }
// //     }
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
    
// //     if (validateForm()) {
// //       console.log('Form submitted:', formData);
// //       // Add your signup logic here
// //     }
// //   };

// //   const handleLogin = () => {
    
// //     navigate('/Login');
// //     // Add navigation to login page
// //   };

// //   return (
// //     <div className="signup-page">
// //       {/* Left Section - Image with Logo and Center Text */}
// //       <div className="signup-left">
// //         <div className="signup-overlay"></div>
        
// //         {/* Logo at top-left */}
// //         <div className="signup-logo-container">
// //           <img 
// //             src="/images/logo.png" 
// //             alt="Lift Nepal Logo" 
// //             className="signup-logo"
// //           />
// //         </div>

// //         {/* Center text on image */}
// //         <div className="signup-center-text">
// //           <h2 className="signup-center-title">SignUp to Lift Nepal</h2>
// //           <p className="signup-center-subtitle">Your trusted lift sharing platform</p>
// //         </div>
// //       </div>

// //       {/* Right Section - Signup Form */}
// //       <div className="signup-right">
// //         <div className="signup-form-container">
// //           <h2 className="signup-title">Create Account</h2>

// //           <form onSubmit={handleSubmit} className="signup-form">
// //             {/* Username Field */}
// //             <div className="form-group">
// //               <label htmlFor="username" className="form-label">Username</label>
// //               <input
// //                 type="text"
// //                 id="username"
// //                 name="username"
// //                 value={formData.username}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 onKeyDown={(e) => handleKeyDown(e, 'username')}
// //                 className={`form-input ${errors.username ? 'input-error' : ''}`}
// //                 placeholder="Enter your username"
// //                 maxLength="30"
// //               />
// //               {errors.username && <span className="error-text">{errors.username}</span>}
// //             </div>

// //             {/* Phone Field */}
// //             <div className="form-group">
// //               <label htmlFor="phone" className="form-label">Phone Number</label>
// //               <input
// //                 type="tel"
// //                 id="phone"
// //                 name="phone"
// //                 value={formData.phone}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 onKeyDown={(e) => handleKeyDown(e, 'phone')}
// //                 className={`form-input ${errors.phone ? 'input-error' : ''}`}
// //                 placeholder="97XXXXXXXX or 98XXXXXXXX"
// //                 maxLength="10"
// //               />
// //               {errors.phone && <span className="error-text">{errors.phone}</span>}
// //             </div>

// //             {/* Email Field */}
// //             <div className="form-group">
// //               <label htmlFor="email" className="form-label">Email</label>
// //               <input
// //                 type="email"
// //                 id="email"
// //                 name="email"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 onKeyDown={(e) => handleKeyDown(e, 'email')}
// //                 className={`form-input ${errors.email ? 'input-error' : ''}`}
// //                 placeholder="your.email@example.com"
// //               />
// //               {errors.email && <span className="error-text">{errors.email}</span>}
// //             </div>

// //             {/* Password Field */}
// //             <div className="form-group">
// //               <label htmlFor="password" className="form-label">Password</label>
// //               <input
// //                 type={showPassword ? "text" : "password"}
// //                 id="password"
// //                 name="password"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 onKeyDown={(e) => handleKeyDown(e, 'password')}
// //                 className={`form-input ${errors.password ? 'input-error' : ''}`}
// //                 placeholder="Enter strong password"
// //               />
// //               {errors.password && <span className="error-text">{errors.password}</span>}
// //             </div>

// //             {/* Confirm Password Field */}
// //             <div className="form-group">
// //               <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
// //               <input
// //                 type={showPassword ? "text" : "password"}
// //                 id="confirmPassword"
// //                 name="confirmPassword"
// //                 value={formData.confirmPassword}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 onKeyDown={(e) => handleKeyDown(e, 'confirmPassword')}
// //                 className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
// //                 placeholder="Re-enter your password"
// //               />
// //               {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
// //             </div>

// //             {/* Show Password Checkbox */}
// //             <div className="form-checkbox">
// //               <input
// //                 type="checkbox"
// //                 id="showPassword"
// //                 checked={showPassword}
// //                 onChange={() => setShowPassword(!showPassword)}
// //                 className="checkbox-input"
// //               />
// //               <label htmlFor="showPassword" className="checkbox-label">
// //                 Show password
// //               </label>
// //             </div>

// //             {/* Submit Button */}
// //             <button type="submit" className="signup-button">
// //               Sign Up
// //             </button>

// //             {/* Login Link */}
// //             <p className="login-text">
// //               Already have an account? 
// //               <span className="login-link" onClick={handleLogin}> Login</span>
// //             </p>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SignUp;



// import React, { useState } from 'react';
// import '../../css/SignUp.css';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from "../../../context/AuthContext";
// import { authAPI } from "../../../services/api";



// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     phone: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState('');

//   const validateField = (name, value) => {
//     let error = '';

//     switch(name) {
//       case 'username':
//         if (!value.trim()) {
//           error = 'Username is required';
//         } else if (value.length > 30) {
//           error = 'Username must be 30 characters or less';
//         }
//         break;

//       case 'phone':
//         const phoneRegex = /^(97|98)\d{8}$/;
//         if (!value.trim()) {
//           error = 'Phone number is required';
//         } else if (!phoneRegex.test(value)) {
//           error = 'Phone must start with 97 or 98 and be 10 digits';
//         }
//         break;

//       case 'email':
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!value.trim()) {
//           error = 'Email is required';
//         } else if (!emailRegex.test(value)) {
//           error = 'Please enter a valid email';
//         }
//         break;

//       case 'password':
//         if (!value) {
//           error = 'Password is required';
//         } else if (value.length < 8) {
//           error = 'Password must be at least 8 characters';
//         } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
//           error = 'Password must include uppercase, lowercase, and number';
//         }
//         break;

//       case 'confirmPassword':
//         if (!value) {
//           error = 'Please confirm your password';
//         } else if (formData.password !== value) {
//           error = 'Passwords do not match';
//         }
//         break;

//       default:
//         break;
//     }

//     return error;
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     const error = validateField(name, value);
    
//     if (error) {
//       setErrors({
//         ...errors,
//         [name]: error
//       });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ''
//       });
//     }
//     // Clear API error
//     if (apiError) {
//       setApiError('');
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     } else if (formData.username.length > 30) {
//       newErrors.username = 'Username must be 30 characters or less';
//     }

//     const phoneRegex = /^(97|98)\d{8}$/;
//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!phoneRegex.test(formData.phone)) {
//       newErrors.phone = 'Phone must start with 97 or 98 and be 10 digits';
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters';
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = 'Password must include uppercase, lowercase, and number';
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleKeyDown = (e, currentField) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
      
//       const fieldOrder = ['username', 'phone', 'email', 'password', 'confirmPassword'];
//       const currentIndex = fieldOrder.indexOf(currentField);
      
//       if (currentIndex < fieldOrder.length - 1) {
//         const nextField = fieldOrder[currentIndex + 1];
//         document.getElementById(nextField)?.focus();
//       } else {
//         handleSubmit(e);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setApiError('');

//     try {
//       // Send data to backend
//       const response = await authAPI.signup({
//         username: formData.username,
//         phone: formData.phone,
//         email: formData.email,
//         password: formData.password,
//       });

//       // Store token and user data
//       login(response.user, response.token);

//       // Show success message
//       alert('Signup successful! Welcome to Lift Nepal.');
      
      
//       // Redirect to dashboard
//        navigate('/dashboard');
      
//     } catch (error) {
//       console.error('Signup error:', error);
      
//       if (error.response?.data?.message) {
//         setApiError(error.response.data.message);
//       } else if (error.message === 'Network Error') {
//         setApiError('Cannot connect to server. Please ensure backend is running.');
//       } else {
//         setApiError('Signup failed. Please try again.');
//       }
      
//       setLoading(false);
//     }
//   };

//   const handleLogin = () => {
//     navigate('/Login');
//   };

//   return (
//     <div className="signup-page">
//       <div className="signup-left">
//         <div className="signup-overlay"></div>
        
//         <div className="signup-logo-container">
//           <img 
//             src="/images/logo.png" 
//             alt="Lift Nepal Logo" 
//             className="signup-logo"
//           />
//         </div>

//         <div className="signup-center-text">
//           <h2 className="signup-center-title">SignUp to Lift Nepal</h2>
//           <p className="signup-center-subtitle">Your trusted lift sharing platform</p>
//         </div>
//       </div>

//       <div className="signup-right">
//         <div className="signup-form-container">
//           <h2 className="signup-title">Create Account</h2>

//           {apiError && (
//             <div className="api-error-message" style={{
//               backgroundColor: '#fee',
//               color: '#c33',
//               padding: '12px',
//               borderRadius: '4px',
//               marginBottom: '16px',
//               border: '1px solid #fcc'
//             }}>
//               {apiError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="signup-form">
//             <div className="form-group">
//               <label htmlFor="username" className="form-label">Username</label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 onKeyDown={(e) => handleKeyDown(e, 'username')}
//                 className={`form-input ${errors.username ? 'input-error' : ''}`}
//                 placeholder="Enter your username"
//                 maxLength="30"
//                 disabled={loading}
//               />
//               {errors.username && <span className="error-text">{errors.username}</span>}
//             </div>

//             <div className="form-group">
//               <label htmlFor="phone" className="form-label">Phone Number</label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 onKeyDown={(e) => handleKeyDown(e, 'phone')}
//                 className={`form-input ${errors.phone ? 'input-error' : ''}`}
//                 placeholder="97XXXXXXXX or 98XXXXXXXX"
//                 maxLength="10"
//                 disabled={loading}
//               />
//               {errors.phone && <span className="error-text">{errors.phone}</span>}
//             </div>

//             <div className="form-group">
//               <label htmlFor="email" className="form-label">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 onKeyDown={(e) => handleKeyDown(e, 'email')}
//                 className={`form-input ${errors.email ? 'input-error' : ''}`}
//                 placeholder="your.email@example.com"
//                 disabled={loading}
//               />
//               {errors.email && <span className="error-text">{errors.email}</span>}
//             </div>

//             <div className="form-group">
//               <label htmlFor="password" className="form-label">Password</label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 onKeyDown={(e) => handleKeyDown(e, 'password')}
//                 className={`form-input ${errors.password ? 'input-error' : ''}`}
//                 placeholder="Enter strong password"
//                 disabled={loading}
//               />
//               {errors.password && <span className="error-text">{errors.password}</span>}
//             </div>

//             <div className="form-group">
//               <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 onKeyDown={(e) => handleKeyDown(e, 'confirmPassword')}
//                 className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
//                 placeholder="Re-enter your password"
//                 disabled={loading}
//               />
//               {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
//             </div>

//             <div className="form-checkbox">
//               <input
//                 type="checkbox"
//                 id="showPassword"
//                 checked={showPassword}
//                 onChange={() => setShowPassword(!showPassword)}
//                 className="checkbox-input"
//                 disabled={loading}
//               />
//               <label htmlFor="showPassword" className="checkbox-label">
//                 Show password
//               </label>
//             </div>

//             <button 
//               type="submit" 
//               className="signup-button"
//               disabled={loading}
//             >
//               {loading ? 'Signing up...' : 'Sign Up'}
//             </button>

//             <p className="login-text">
//               Already have an account? 
//               <span className="login-link" onClick={handleLogin}> Login</span>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;


import React, { useState } from 'react';
import '../../css/SignUp.css';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // ✅ Eye icons
import { useAuth } from "../../../context/AuthContext";
import { authAPI } from "../../../services/api";


const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // ✅ Separate state for confirm password
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateField = (name, value) => {
    let error = '';

    switch(name) {
      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.length > 30) {
          error = 'Username must be 30 characters or less';
        }
        break;

      case 'phone':
        const phoneRegex = /^(97|98)\d{8}$/;
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!phoneRegex.test(value)) {
          error = 'Phone must start with 97 or 98 and be 10 digits';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!emailRegex.test(value)) {
          error = 'Please enter a valid email';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must include uppercase, lowercase, and number';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (formData.password !== value) {
          error = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (error) {
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    // Clear API error
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username must be 30 characters or less';
    }

    const phoneRegex = /^(97|98)\d{8}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone must start with 97 or 98 and be 10 digits';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKeyDown = (e, currentField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const fieldOrder = ['username', 'phone', 'email', 'password', 'confirmPassword'];
      const currentIndex = fieldOrder.indexOf(currentField);
      
      if (currentIndex < fieldOrder.length - 1) {
        const nextField = fieldOrder[currentIndex + 1];
        document.getElementById(nextField)?.focus();
      } else {
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
      // Send data to backend
      const response = await authAPI.signup({
        username: formData.username,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      // Store token and user data
      login(response.user, response.token);

      // Show success message
      alert('Signup successful! Welcome to Lift Nepal.');
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.message === 'Network Error') {
        setApiError('Cannot connect to server. Please ensure backend is running.');
      } else {
        setApiError('Signup failed. Please try again.');
      }
      
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/Login');
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <div className="signup-overlay"></div>
        
        <div className="signup-logo-container">
          <img 
            src="/images/logo.png" 
            alt="Lift Nepal Logo" 
            className="signup-logo"
          />
        </div>

        <div className="signup-center-text">
          <h2 className="signup-center-title">SignUp to Lift Nepal</h2>
          <p className="signup-center-subtitle">Your trusted lift sharing platform</p>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-form-container">
          <h2 className="signup-title">Create Account</h2>

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

          <form onSubmit={handleSubmit} className="signup-form" noValidate>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, 'username')}
                className={`form-input ${errors.username ? 'input-error' : ''}`}
                placeholder="Enter your username"
                maxLength="30"
                disabled={loading}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, 'phone')}
                className={`form-input ${errors.phone ? 'input-error' : ''}`}
                placeholder="97XXXXXXXX or 98XXXXXXXX"
                maxLength="10"
                disabled={loading}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, 'email')}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="your.email@example.com"
                disabled={loading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
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
                  onBlur={handleBlur}
                  onKeyDown={(e) => handleKeyDown(e, 'password')}
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter strong password"
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
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => handleKeyDown(e, 'confirmPassword')}
                  className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Re-enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit" 
              className="signup-button"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            <p className="login-text">
              Already have an account? 
              <span className="login-link" onClick={handleLogin}> Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;