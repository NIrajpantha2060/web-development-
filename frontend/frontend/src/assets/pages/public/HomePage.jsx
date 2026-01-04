


// // version 2
// import React, { useState, useEffect } from 'react';
// import '../../css/Home.css';

// const HomePage = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [openFaqIndex, setOpenFaqIndex] = useState(null);
//   const [logoShake, setLogoShake] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const toggleFaq = (index) => {
//     setOpenFaqIndex(openFaqIndex === index ? null : index);
//   };

//   const handleLogoClick = (e) => {
//     e.preventDefault();
//     setLogoShake(true);
//     setTimeout(() => setLogoShake(false), 500);
//   };

//   const scrollToSection = (sectionId) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//       setIsMobileMenuOpen(false);
//     }
//   };

//   const handleLogin = () => {
//     console.log('Navigate to Login');
//     // Add navigation logic: navigate('/login');
//   };

//   const handleSignUp = () => {
//     console.log('Navigate to Sign Up');
//     // Add navigation logic: navigate('/signup');
//   };

//   const faqs = [
//     {
//       question: "How do I verify my account?",
//       answer: "Upload your citizenship document in your profile. If you want to become a driver, you also need to upload your driving license. Our team will review and verify your documents."
//     },
//     {
//       question: "Is Lift Nepal safe?",
//       answer: "Yes! All users must verify their identity with citizenship documents. Drivers need driving licenses. We also have a feedback and reporting system to keep our community safe."
//     },
//     {
//       question: "How much does it cost?",
//       answer: "Drivers set a fair cost-sharing amount based on distance and fuel. It's much cheaper than hiring a taxi because you're sharing travel costs, not paying for a commercial service."
//     },
//     {
//       question: "How do I pay?",
//       answer: "You can pay using your Master Card or Debit Card. We also accept Cash on Delivery if you prefer to pay the driver directly."
//     },
//     {
//       question: "Can I be both a driver and passenger?",
//       answer: "Yes! After completing verification, you can switch between user mode and driver mode anytime from your dashboard."
//     },
//     {
//       question: "How do I book a ride?",
//       answer: "Search for rides going to your destination, check the driver's profile and ratings, then send a booking request. The driver will accept or decline your request."
//     },
//     {
//       question: "What if I need to cancel my ride?",
//       answer: "You can cancel your booking from your ride history. Please inform the driver as soon as possible so they can offer the seat to someone else."
//     }
//   ];

//   return (
//     <div className="home-page">
//       {/* Navigation Bar */}
//       <nav className="home-navbar">
//         <div className="nav-container">
//           {/* Logo */}
//           <a href="#" className={`nav-logo ${logoShake ? 'shake' : ''}`} onClick={handleLogoClick}>
//             <img src="/images/logo.png" alt="Lift Nepal Logo" className="nav-logo-img" />
//             <span className="nav-brand">Lift Nepal</span>
//           </a>

//           {/* Desktop Navigation Links */}
//           <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
//             <li>
//               <a className="nav-link" onClick={() => scrollToSection('home')}>
//                 Home
//               </a>
//             </li>
//             <li>
//               <a className="nav-link" onClick={() => scrollToSection('about')}>
//                 About Us
//               </a>
//             </li>
//             <li>
//               <a className="nav-link" onClick={() => scrollToSection('help')}>
//                 Need Help
//               </a>
//             </li>
//           </ul>

//           {/* Profile Dropdown (Desktop Only) */}
//           <div className="profile-dropdown">
//             <button className="profile-icon-btn" onClick={toggleDropdown}>
//               <svg className="profile-icon" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
//               </svg>
//             </button>

//             {isDropdownOpen && (
//               <div className="dropdown-menu">
//                 <button className="dropdown-item" onClick={handleLogin}>
//                   Login
//                 </button>
//                 <button className="dropdown-item" onClick={handleSignUp}>
//                   Sign Up
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
//             {isMobileMenuOpen ? '✕' : '☰'}
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section id="home" className="hero-section">
//         <div className="hero-overlay"></div>
//         <div className="hero-content">
//           <h1 className="hero-title">Welcome to Lift Nepal</h1>
//           <p className="hero-tagline">Share the ride, share the journey.</p>
//           <p className="hero-description">
//             Find drivers traveling your way and share rides. Save money by sharing costs instead of paying full taxi prices. Travel together across Nepal safely and affordably.
//           </p>
//         </div>
//       </section>

//       {/* Problem and Solution Section */}
//       <section className="problem-solution-section">
//         <div className="comparison-container">
//           {/* Problem Side */}
//           <div className="problem-side">
//             <img 
//               src="/images/single driver.png" 
//               alt="Sad driver traveling alone" 
//               className="comparison-image"
//             />
//             <h3 className="comparison-title">The Problem</h3>
//             <p className="comparison-text">
//               Drivers travel long distances alone, paying full fuel costs. Passengers struggle to find affordable transport. Money and seats go to waste every day.
//             </p>
//           </div>

//           {/* Solution Side */}
//           <div className="solution-side">
//             <img 
//               src="/images/driver passenger laughing.jpg" 
//               alt="Happy driver and passenger sharing ride" 
//               className="comparison-image"
//             />
//             <h3 className="comparison-title">Our Solution</h3>
//             <p className="comparison-text">
//               Share your ride! Drivers fill empty seats and passengers find cheap travel. Everyone saves money and makes the journey more enjoyable together.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="features-section">
//         <h2 className="section-title">Why Choose Lift Nepal?</h2>
//         <p className="section-subtitle">
//           Easy, safe, and affordable ride sharing made for Nepal.
//         </p>

//         <div className="features-grid">
//           {/* Feature 1 */}
//           <div className="feature-card">
//             <div className="feature-icon">🚗</div>
//             <h3 className="feature-title">Share Long Distance Rides</h3>
//             <p className="feature-description">
//               Drivers post their travel plans. Passengers find rides going their way and book seats easily.
//             </p>
//           </div>

//           {/* Feature 2 */}
//           <div className="feature-card">
//             <div className="feature-icon">💰</div>
//             <h3 className="feature-title">Save Money</h3>
//             <p className="feature-description">
//               Share travel costs instead of paying full taxi prices. Good for your wallet and good for the environment.
//             </p>
//           </div>

//           {/* Feature 3 */}
//           <div className="feature-card">
//             <div className="feature-icon">✅</div>
//             <h3 className="feature-title">Verified Users</h3>
//             <p className="feature-description">
//               All users verify their identity with citizenship documents. Drivers must show driving licenses before offering rides.
//             </p>
//           </div>

//           {/* Feature 4 */}
//           <div className="feature-card">
//             <div className="feature-icon">🔄</div>
//             <h3 className="feature-title">Be Driver or Passenger</h3>
//             <p className="feature-description">
//               Switch between modes anytime. Book rides when you travel, offer rides when you drive. One app for both.
//             </p>
//           </div>

//           {/* Feature 5 */}
//           <div className="feature-card">
//             <div className="feature-icon">🛡️</div>
//             <h3 className="feature-title">Safe Community</h3>
//             <p className="feature-description">
//               Rate your rides and give feedback. Report problems if they happen. We keep our community safe and trustworthy.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" className="about-section">
//         <div className="about-container">
//           <h2 className="section-title">About Lift Nepal</h2>
          
//           <div className="about-content">
//             <h3>Our Mission</h3>
//             <p>
//               Many people in Nepal drive long distances with empty seats. At the same time, other people need affordable rides. Lift Nepal connects these people together.
//             </p>

//             <h3>The Problem We Solve</h3>
//             <p>Traditional transport options have problems:</p>
//             <ul>
//               <li>Taxis are too expensive for long trips</li>
//               <li>Public buses are not always available</li>
//               <li>Private cars travel with empty seats</li>
//               <li>Students and regular travelers pay too much</li>
//             </ul>

//             <h3>How We're Different</h3>
//             <p>
//               We're not a taxi service. Lift Nepal helps people share rides they're already taking. Drivers share their empty seats, passengers share the costs. It's affordable, friendly, and good for everyone.
//             </p>

//             <p>
//               We verify all users to keep everyone safe. You can track your ride history, give ratings, and report any problems. We're building Nepal's most trusted ride sharing community.
//             </p>

//             {/* Developer Information */}
//             <div className="developer-info">
//               <img 
//                 src="/images/logo.png" 
//                 alt="Developer" 
//                 className="developer-image"
//               />
//               <div className="developer-details">
//                 <h3>Developed by</h3>
//                 <p className="developer-name">Mr. Niraj</p>
//                 <p className="developer-location">Butwal, Nepal</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Help Section with FAQ */}
//       <section id="help" className="help-section">
//         <div className="about-container">
//           <h2 className="section-title">Need Help?</h2>
//           <p className="section-subtitle">
//             Find answers to common questions below.
//           </p>
          
//           <div className="faq-container">
//             {faqs.map((faq, index) => (
//               <div key={index} className="faq-item">
//                 <button 
//                   className="faq-question"
//                   onClick={() => toggleFaq(index)}
//                 >
//                   <span>{faq.question}</span>
//                   <span className={`faq-arrow ${openFaqIndex === index ? 'open' : ''}`}>
//                     ▼
//                   </span>
//                 </button>
//                 <div className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}>
//                   <div className="faq-answer-content">
//                     {faq.answer}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="home-footer">
//         <div className="footer-content">
//           <h2 className="footer-brand">Lift Nepal</h2>
//           <p className="footer-tagline">Share the ride, share the journey.</p>
//           <p className="footer-text">© 2025 Lift Nepal. Building Nepal's trusted ride sharing community.</p>
          
//           <div className="footer-contact">
//             <h3 className="footer-contact-title">Contact the Developer</h3>
//             <a href="mailto:nirajpantha2060@gmail.com" className="footer-email">
//               nirajpantha2060@gmail.com
//             </a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;


// version 3

// import React, { useState } from 'react';
// import '../../css/Home.css';


// const HomePage = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [openFaqIndex, setOpenFaqIndex] = useState(null);
//   const [logoShake, setLogoShake] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const toggleFaq = (index) => {
//     setOpenFaqIndex(openFaqIndex === index ? null : index);
//   };

//   const handleLogoClick = (e) => {
//     e.preventDefault();
//     setLogoShake(true);
//     setTimeout(() => setLogoShake(false), 500);
//   };

//   const scrollToSection = (sectionId) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//       setIsMobileMenuOpen(false);
//     }
//   };

//   const handleLogin = () => {
//     console.log('Navigate to Login');
//     // Add navigation logic: navigate('/login');
//   };

//   const handleSignUp = () => {
//     console.log('Navigate to Sign Up');
//     // Add navigation logic: navigate('/signup');
//   };

//   const faqs = [
//     {
//       question: "How do I verify my account?",
//       answer: "Upload your citizenship document in your profile. If you want to become a driver, you also need to upload your driving license. Our team will review and verify your documents."
//     },
//     {
//       question: "Is Lift Nepal safe?",
//       answer: "Yes! All users must verify their identity with citizenship documents. Drivers need driving licenses. We also have a feedback and reporting system to keep our community safe."
//     },
//     {
//       question: "How much does it cost?",
//       answer: "Drivers set a fair cost-sharing amount based on distance and fuel. It's much cheaper than hiring a taxi because you're sharing travel costs, not paying for a commercial service."
//     },
//     {
//       question: "How do I pay?",
//       answer: "You can pay using your Master Card or Debit Card. We also accept Cash on Delivery if you prefer to pay the driver directly."
//     },
//     {
//       question: "Can I be both a driver and passenger?",
//       answer: "Yes! After completing verification, you can switch between user mode and driver mode anytime from your dashboard."
//     },
//     {
//       question: "How do I book a ride?",
//       answer: "Search for rides going to your destination, check the driver's profile and ratings, then send a booking request. The driver will accept or decline your request."
//     },
//     {
//       question: "What if I need to cancel my ride?",
//       answer: "You can cancel your booking from your ride history. Please inform the driver as soon as possible so they can offer the seat to someone else."
//     }
//   ];

//   return (
//     <div className="home-page">
//       {/* Navigation Bar */}
//       <nav className="home-navbar">
//         <div className="nav-container">
//           {/* Logo */}
//           <a href="#" className={`nav-logo ${logoShake ? 'shake' : ''}`} onClick={handleLogoClick}>
//             <img src="/images/logo.png" alt="Lift Nepal Logo" className="nav-logo-img" />
//             <span className="nav-brand">Lift Nepal</span>
//           </a>

//           {/* Desktop Navigation Links */}
//           <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
//             <li>
//               <a className="nav-link" onClick={() => scrollToSection('home')}>
//                 Home
//               </a>
//             </li>
//             <li>
//               <a className="nav-link" onClick={() => scrollToSection('about')}>
//                 About Us
//               </a>
//             </li>
//             <li>
//               <a className="nav-link" onClick={() => scrollToSection('help')}>
//                 Need Help
//               </a>
//             </li>
//           </ul>

//           {/* Profile Dropdown (Desktop Only) */}
//           <div className="profile-dropdown">
//             <button className="profile-icon-btn" onClick={toggleDropdown}>
//               <svg className="profile-icon" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
//               </svg>
//             </button>

//             {isDropdownOpen && (
//               <div className="dropdown-menu">
//                 <button className="dropdown-item" onClick={handleLogin}>
//                   Login
//                 </button>
//                 <button className="dropdown-item" onClick={handleSignUp}>
//                   Sign Up
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
//             {isMobileMenuOpen ? '✕' : '☰'}
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section id="home" className="hero-section">
//         <div className="hero-overlay"></div>
//         <div className="hero-content">
//           <h1 className="hero-title">Welcome to Lift Nepal</h1>
//           <p className="hero-tagline">Share the ride, share the journey.</p>
//           <p className="hero-description">
//             Find drivers traveling your way and share rides. Save money by sharing costs instead of paying full taxi prices. Travel together across Nepal safely and affordably.
//           </p>
//         </div>
//       </section>

//       {/* Problem and Solution Section */}
//       <section className="problem-solution-section">
//         <div className="comparison-container">
//           {/* Problem Side */}
//           <div className="problem-side">
//             <img 
//               src="/images/single driver.png" 
//               alt="Sad driver traveling alone" 
//               className="comparison-image"
//             />
//             <h3 className="comparison-title">The Problem</h3>
//             <p className="comparison-text">
//               Drivers travel long distances alone, paying full fuel costs. Passengers struggle to find affordable transport. Money and seats go to waste every day.
//             </p>
//           </div>

//           {/* Solution Side */}
//           <div className="solution-side">
//             <img 
//               src="/images/driver passenger laughing.jpg" 
//               alt="Happy driver and passenger sharing ride" 
//               className="comparison-image"
//             />
//             <h3 className="comparison-title">Our Solution</h3>
//             <p className="comparison-text">
//               Share your ride! Drivers fill empty seats and passengers find cheap travel. Everyone saves money and makes the journey more enjoyable together.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="features-section">
//         <h2 className="section-title">Why Choose Lift Nepal?</h2>
//         <p className="section-subtitle">
//           Easy, safe, and affordable ride sharing made for Nepal.
//         </p>

//         <div className="features-grid">
//           {/* Feature 1 */}
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src="/icons/carpool-icon-3.png" alt="Carpool" className="feature-icon-img" />
//             </div>
//             <h3 className="feature-title">Share Long Distance Rides</h3>
//             <p className="feature-description">
//               Drivers post their travel plans. Passengers find rides going their way and book seats easily.
//             </p>
//           </div>

//           {/* Feature 2 */}
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src="/icons/save money icon.png" alt="Save Money" className="feature-icon-img" />
//             </div>
//             <h3 className="feature-title">Save Money</h3>
//             <p className="feature-description">
//               Share travel costs instead of paying full taxi prices. Good for your wallet and good for the environment.
//             </p>
//           </div>

//           {/* Feature 3 */}
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src="/icons/verified icon.jpg" alt="Verified" className="feature-icon-img" />
//             </div>
//             <h3 className="feature-title">Verified Users</h3>
//             <p className="feature-description">
//               All users verify their identity with citizenship documents. Drivers must show driving licenses before offering rides.
//             </p>
//           </div>

//           {/* Feature 4 */}
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src="/icons/swap icon.svg" alt="Switch" className="feature-icon-img" />
//             </div>
//             <h3 className="feature-title">Be Driver or Passenger</h3>
//             <p className="feature-description">
//               Switch between modes anytime. Book rides when you travel, offer rides when you drive. One app for both.
//             </p>
//           </div>

//           {/* Feature 5 */}
//           <div className="feature-card">
//             <div className="feature-icon">
//               <img src="/icons/safe icon.jpg" alt="Safe" className="feature-icon-img" />
//             </div>
//             <h3 className="feature-title">Safe Community</h3>
//             <p className="feature-description">
//               Rate your rides and give feedback. Report problems if they happen. We keep our community safe and trustworthy.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" className="about-section">
//         <div className="about-container">
//           <h2 className="section-title">About Lift Nepal</h2>
          
//           <div className="about-content">
//             <h3>Our Mission</h3>
//             <p>
//               Many people in Nepal drive long distances with empty seats. At the same time, other people need affordable rides. Lift Nepal connects these people together.
//             </p>

//             <h3>The Problem We Solve</h3>
//             <p>Traditional transport options have problems:</p>
//             <ul>
//               <li>Taxis are too expensive for long trips</li>
//               <li>Public buses are not always available</li>
//               <li>Private cars travel with empty seats</li>
//               <li>Students and regular travelers pay too much</li>
//             </ul>

//             <h3>How We're Different</h3>
//             <p>
//               We're not a taxi service. Lift Nepal helps people share rides they're already taking. Drivers share their empty seats, passengers share the costs. It's affordable, friendly, and good for everyone.
//             </p>

//             <p>
//               We verify all users to keep everyone safe. You can track your ride history, give ratings, and report any problems. We're building Nepal's most trusted ride sharing community.
//             </p>

//             {/* Developer Information */}
//             <div className="developer-info">
//               <img 
//                 src="/images/logo.png" 
//                 alt="Developer" 
//                 className="developer-image"
//               />
//               <div className="developer-details">
//                 <h3>Developed by</h3>
//                 <p className="developer-name">Mr. Niraj</p>
//                 <p className="developer-location">Butwal, Nepal</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Help Section with FAQ */}
//       <section id="help" className="help-section">
//         <div className="about-container">
//           <h2 className="section-title">Need Help?</h2>
//           <p className="section-subtitle">
//             Find answers to common questions below.
//           </p>
          
//           <div className="faq-container">
//             {faqs.map((faq, index) => (
//               <div key={index} className="faq-item">
//                 <button 
//                   className="faq-question"
//                   onClick={() => toggleFaq(index)}
//                 >
//                   <span>{faq.question}</span>
//                   <span className={`faq-arrow ${openFaqIndex === index ? 'open' : ''}`}>
//                     ▼
//                   </span>
//                 </button>
//                 <div className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}>
//                   <div className="faq-answer-content">
//                     {faq.answer}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="home-footer">
//         <div className="footer-content">
//           <h2 className="footer-brand">Lift Nepal</h2>
//           <p className="footer-tagline">Share the ride, share the journey.</p>
//           <p className="footer-text">© 2025 Lift Nepal. Building Nepal's trusted ride sharing community.</p>
          
//           <div className="footer-contact">
//             <h3 className="footer-contact-title">Contact the Developer</h3>
//             <a href="mailto:nirajpantha2060@gmail.com" className="footer-email">
//               nirajpantha2060@gmail.com
//             </a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;


// another page 

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Home.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [logoShake, setLogoShake] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setLogoShake(true);
    setTimeout(() => setLogoShake(false), 500);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogin = () => {
    console.log('Navigate to Login');
    // Add navigation logic: navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const faqs = [
    {
      question: "How do I verify my account?",
      answer: "Upload your citizenship document in your profile. If you want to become a driver, you also need to upload your driving license. Our team will review and verify your documents."
    },
    {
      question: "Is Lift Nepal safe?",
      answer: "Yes! All users must verify their identity with citizenship documents. Drivers need driving licenses. We also have a feedback and reporting system to keep our community safe."
    },
    {
      question: "How much does it cost?",
      answer: "Drivers set a fair cost-sharing amount based on distance and fuel. It's much cheaper than hiring a taxi because you're sharing travel costs, not paying for a commercial service."
    },
    {
      question: "How do I pay?",
      answer: "You can pay using your Master Card or Debit Card. We also accept Cash on Delivery if you prefer to pay the driver directly."
    },
    {
      question: "Can I be both a driver and passenger?",
      answer: "Yes! After completing verification, you can switch between user mode and driver mode anytime from your dashboard."
    },
    {
      question: "How do I book a ride?",
      answer: "Search for rides going to your destination, check the driver's profile and ratings, then send a booking request. The driver will accept or decline your request."
    },
    {
      question: "What if I need to cancel my ride?",
      answer: "You can cancel your booking from your ride history. Please inform the driver as soon as possible so they can offer the seat to someone else."
    }
  ];

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="home-navbar">
        <div className="nav-container">
          {/* Logo */}
          <a href="#" className={`nav-logo ${logoShake ? 'shake' : ''}`} onClick={handleLogoClick}>
            <img src="/images/logo.png" alt="Lift Nepal Logo" className="nav-logo-img" />
            <span className="nav-brand">Lift Nepal</span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <li>
              <a className="nav-link" onClick={() => scrollToSection('home')}>
                Home
              </a>
            </li>
            <li>
              <a className="nav-link" onClick={() => scrollToSection('about')}>
                About Us
              </a>
            </li>
            <li>
              <a className="nav-link" onClick={() => scrollToSection('help')}>
                Need Help
              </a>
            </li>
          </ul>

          {/* Profile Dropdown (Desktop Only) */}
          <div className="profile-dropdown">
            <button className="profile-icon-btn" onClick={toggleDropdown}>
              <svg className="profile-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleLogin}>
                  Login
                </button>
                <button className="dropdown-item" onClick={handleSignUp}>
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Lift Nepal</h1>
          <p className="hero-tagline">Share the ride, share the journey.</p>
          <p className="hero-description">
            Find drivers traveling your way and share rides. Save money by sharing costs instead of paying full taxi prices. Travel together across Nepal safely and affordably.
          </p>
        </div>
      </section>

      {/* Problem and Solution Section */}
      <section className="problem-solution-section">
        <div className="comparison-container">
          {/* Problem Side */}
          <div className="problem-side">
            <img 
              src="/images/single driver.png" 
              alt="Sad driver traveling alone" 
              className="comparison-image"
            />
            <h3 className="comparison-title">The Problem</h3>
            <p className="comparison-text">
              Drivers travel long distances alone, paying full fuel costs. Passengers struggle to find affordable transport. Money and seats go to waste every day.
            </p>
          </div>

          {/* Solution Side */}
          <div className="solution-side">
            <img 
              src="/images/driver passenger laughing.jpg" 
              alt="Happy driver and passenger sharing ride" 
              className="comparison-image"
            />
            <h3 className="comparison-title">Our Solution</h3>
            <p className="comparison-text">
              Share your ride! Drivers fill empty seats and passengers find cheap travel. Everyone saves money and makes the journey more enjoyable together.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Lift Nepal?</h2>
        <p className="section-subtitle">
          Easy, safe, and affordable ride sharing made for Nepal.
        </p>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/carpool-icon-3.png" alt="Carpool" className="feature-icon-img" />
            </div>
            <h3 className="feature-title">Share Long Distance Rides</h3>
            <p className="feature-description">
              Drivers post their travel plans. Passengers find rides going their way and book seats easily.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/save money icon.png" alt="Save Money" className="feature-icon-img" />
            </div>
            <h3 className="feature-title">Save Money</h3>
            <p className="feature-description">
              Share travel costs instead of paying full taxi prices. Good for your wallet and good for the environment.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/verified icon.jpg" alt="Verified" className="feature-icon-img" />
            </div>
            <h3 className="feature-title">Verified Users</h3>
            <p className="feature-description">
              All users verify their identity with citizenship documents. Drivers must show driving licenses before offering rides.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/swap icon.svg" alt="Switch" className="feature-icon-img" />
            </div>
            <h3 className="feature-title">Be Driver or Passenger</h3>
            <p className="feature-description">
              Switch between modes anytime. Book rides when you travel, offer rides when you drive. One app for both.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/safe icon.jpg" alt="Safe" className="feature-icon-img" />
            </div>
            <h3 className="feature-title">Safe Community</h3>
            <p className="feature-description">
              Rate your rides and give feedback. Report problems if they happen. We keep our community safe and trustworthy.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <h2 className="section-title">About Lift Nepal</h2>
          
          <div className="about-content">
            <h3>Our Mission</h3>
            <p>
              Many people in Nepal drive long distances with empty seats. At the same time, other people need affordable rides. Lift Nepal connects these people together.
            </p>

            <h3>The Problem We Solve</h3>
            <p>Traditional transport options have problems:</p>
            <ul>
              <li>Taxis are too expensive for long trips</li>
              <li>Public buses are not always available</li>
              <li>Private cars travel with empty seats</li>
              <li>Students and regular travelers pay too much</li>
            </ul>

            <h3>How We're Different</h3>
            <p>
              We're not a taxi service. Lift Nepal helps people share rides they're already taking. Drivers share their empty seats, passengers share the costs. It's affordable, friendly, and good for everyone.
            </p>

            <p>
              We verify all users to keep everyone safe. You can track your ride history, give ratings, and report any problems. We're building Nepal's most trusted ride sharing community.
            </p>

            {/* Developer Information */}
            <div className="developer-info">
              <img 
                src="/images/logo.png" 
                alt="Developer" 
                className="developer-image"
              />
              <div className="developer-details">
                <h3>Developed by</h3>
                <p className="developer-name">Mr. Niraj</p>
                <p className="developer-location">Butwal, Nepal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section with FAQ */}
      <section id="help" className="help-section">
        <div className="about-container">
          <h2 className="section-title">Need Help?</h2>
          <p className="section-subtitle">
            Find answers to common questions below.
          </p>
          
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <span className={`faq-arrow ${openFaqIndex === index ? 'open' : ''}`}>
                    ▼
                  </span>
                </button>
                <div className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}>
                  <div className="faq-answer-content">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <h2 className="footer-brand">Lift Nepal</h2>
          <p className="footer-tagline">Share the ride, share the journey.</p>
          <p className="footer-text">© 2025 Lift Nepal. Building Nepal's trusted ride sharing community.</p>
          
          <div className="footer-contact">
            <h3 className="footer-contact-title">Contact the Developer</h3>
            <a href="mailto:nirajpantha2060@gmail.com" className="footer-email">
              nirajpantha2060@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;