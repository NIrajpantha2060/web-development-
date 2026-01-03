import React, { useState, useEffect } from 'react';
import '../../css/Welcome.css';

const WelcomePage = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 7500);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    console.log('Navigate to home page');
    // Add navigation logic here later
    // Example: navigate('/home');
  };

  return (
    <div className="welcome-container">
      {/* Background Image with Overlay */}
      <div className="welcome-background">
        <div className="welcome-overlay"></div>
      </div>

      {/* Content Container */}
      <div className="welcome-content">
        
        {/* Logo with Animation */}
        <div className="logo-container">
          <img 
            src="/images/logo.png" 
            alt="Lift Nepal Logo" 
            className="logo"
          />
        </div>

        {/* Welcome Text with Fade-in Animation */}
        <div className="text-container">
          <h1 className="welcome-title">Welcome to</h1>
          <h2 className="brand-name">Lift Nepal</h2>
          <p className="tagline">Share the ride, share the journey.</p>
        </div>

        {/* Get Started Button with Fade-in */}
        {showButton && (
          <button
            onClick={handleGetStarted}
            className="get-started-btn"
          >
            Get Started
            <span className="arrow">→</span>
          </button>
        )}

        {/* Floating Elements for Visual Interest */}
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
      </div>
    </div>
  );
};

export default WelcomePage;