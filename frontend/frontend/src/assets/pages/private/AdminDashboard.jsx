import React from "react";
import { useAuth } from "../../../context/AuthContext";
import '../../css/Dashboard.css';
import '../../css/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Lift Nepal – Admin Panel</h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="admin-info">
        <h2>Welcome, {user?.username}</h2>
        <p>Role: {user?.role}</p>
      </div>

      <div className="admin-cards">
        <div className="admin-card">👤 Manage Users</div>
        <div className="admin-card">🚗 Manage Rides</div>
        <div className="admin-card">📄 Reports</div>
        <div className="admin-card">⚙️ Settings</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
