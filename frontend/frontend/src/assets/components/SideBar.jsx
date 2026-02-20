import '../css/SideBar.css';

const SideBar = ({ isOpen, toggleSidebar, isLicenseVerified, activePage, onNavigate }) => {
  const handleNavClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/images/logo.png" alt="Lift Nepal" className="sidebar-logo" />
          <h2 className="sidebar-title">Lift Nepal</h2>
        </div>
        
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activePage === 'available-rides' ? 'active' : ''}`}
            onClick={() => handleNavClick('available-rides')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <span>Available Rides</span>
          </div>

          <div 
            className={`nav-item ${activePage === 'reservations' ? 'active' : ''}`}
            onClick={() => handleNavClick('reservations')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>My Reservations</span>
          </div>

          <div 
            className={`nav-item ${activePage === 'add-issue' ? 'active' : ''}`}
            onClick={() => handleNavClick('add-issue')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Add Issue</span>
          </div>

          {isLicenseVerified && (
            <div 
              className={`nav-item ${activePage === 'add-ride' ? 'active' : ''}`}
              onClick={() => handleNavClick('add-ride')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Ride</span>
            </div>
          )}

          {/* ✅ Update Vehicle Info - Only for verified riders */}
          {isLicenseVerified && (
            <div 
              className={`nav-item ${activePage === 'update-vehicle-info' ? 'active' : ''}`}
              onClick={() => handleNavClick('update-vehicle-info')}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <span>Vehicle Info</span>
            </div>
          )}
        </nav>
      </div>
      
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default SideBar;