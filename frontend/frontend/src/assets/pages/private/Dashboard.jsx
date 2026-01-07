import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../css/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img 
          src="/images/logo.png" 
          alt="Lift Nepal Logo" 
          className="dashboard-logo"
        />
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1 className="welcome-title">
            Welcome back, {user?.username || 'User'}! 🎉
          </h1>
          <p className="welcome-subtitle">
            You're successfully logged into Lift Nepal
          </p>
        </div>

        <div className="user-info-card">
          <h2>Your Profile</h2>
          <div className="info-row">
            <span className="info-label">Username:</span>
            <span className="info-value">{user?.username}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          {user?.phone && (
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{user?.phone}</span>
            </div>
          )}
        </div>

        <div className="dashboard-actions">
          <button className="action-button primary">Find a Ride</button>
          <button className="action-button secondary">Offer a Ride</button>
          <button className="action-button secondary">View History</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;