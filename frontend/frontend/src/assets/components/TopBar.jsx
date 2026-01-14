import { useState } from 'react';
import ProfileDropdown from './ProfileDropdown';
import '../css/TopBar.css';

const TopBar = ({ toggleSidebar, currentUser }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'New ride available from Kathmandu to Pokhara', time: '2 hours ago' },
    { id: 2, message: 'Your ride request has been accepted', time: '5 hours ago' },
    { id: 3, message: 'License verification completed', time: '1 day ago' }
  ]);

  return (
    <div className="topbar">
      <button className="menu-toggle" onClick={toggleSidebar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="topbar-right">
        <div className="notification-container">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="close-btn">×</button>
              </div>
              <div className="notification-list">
                {notifications.map(notif => (
                  <div key={notif.id} className="notification-item">
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ProfileDropdown currentUser={currentUser} />
      </div>
    </div>
  );
};

export default TopBar;