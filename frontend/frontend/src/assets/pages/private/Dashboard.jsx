


import { useState } from 'react';
import RideCard from '../../components/RideCard';
import ProfileDropdown from '../../components/ProfileDropdown';
import '../../css/Dashboard.css';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('rides');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRiderMode, setIsRiderMode] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [logoShake, setLogoShake] = useState(false);
  
  const currentUser = {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    username: 'rajesh_kumar',
    isVerified: false,
    hasVehicle: false,
    avatar: null
  };

  const mockRides = [
    {
      id: 1,
      driverName: 'Suman Shrestha',
      driverRating: 4.8,
      from: 'Kathmandu',
      to: 'Pokhara',
      date: '2026-01-22',
      time: '08:00 AM',
      price: 1500,
      availableSeats: 3,
      vehicleType: 'Sedan',
      isVerified: true
    },
    {
      id: 2,
      driverName: 'Prakash Thapa',
      driverRating: 4.6,
      from: 'Lalitpur',
      to: 'Chitwan',
      date: '2026-01-23',
      time: '09:30 AM',
      price: 1200,
      availableSeats: 2,
      vehicleType: 'SUV',
      isVerified: true
    },
    {
      id: 3,
      driverName: 'Maya Gurung',
      driverRating: 4.9,
      from: 'Bhaktapur',
      to: 'Nagarkot',
      date: '2026-01-24',
      time: '06:00 AM',
      price: 800,
      availableSeats: 4,
      vehicleType: 'Hatchback',
      isVerified: true
    }
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleModeDropdown = () => {
    setIsModeDropdownOpen(!isModeDropdownOpen);
  };

  const switchMode = () => {
    setIsRiderMode(!isRiderMode);
    setIsModeDropdownOpen(false);
    setActivePage('rides');
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setLogoShake(true);
    setTimeout(() => setLogoShake(false), 500);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'rides':
        return (
          <div className="rides-page">
            <div className="page-header">
              <h1>{isRiderMode ? 'Your Posted Rides' : 'Available Rides'}</h1>
              <p>{isRiderMode ? 'Manage your offered rides' : 'Find your perfect ride'}</p>
            </div>
            {isRiderMode ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3>No rides posted yet</h3>
                <p>Start offering rides to fellow travelers</p>
              </div>
            ) : (
              <div className="rides-grid">
                {mockRides.map(ride => (
                  <RideCard key={ride.id} ride={ride} />
                ))}
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="history-page">
            <div className="page-header">
              <h1>Your Rides History</h1>
              <p>View your past bookings and trips</p>
            </div>
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>No ride history yet</h3>
              <p>Your completed rides will appear here</p>
            </div>
          </div>
        );

      case 'add-issue':
        return (
          <div className="add-issue-page">
            <div className="page-header">
              <h1>Raise an Issue</h1>
              <p>Report any problems you're facing</p>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label>Issue Type</label>
                <select className="form-input">
                  <option>Select issue type</option>
                  <option>Payment Issue</option>
                  <option>Driver/Rider Behavior</option>
                  <option>Ride Cancellation</option>
                  <option>Vehicle Condition</option>
                  <option>Technical Problem</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" className="form-input" placeholder="Brief description" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" rows="6" placeholder="Describe your issue..."></textarea>
              </div>
              <button className="btn-submit">Submit Issue</button>
            </div>
          </div>
        );

      case 'add-ride':
        return (
          <div className="add-ride-page">
            <div className="page-header">
              <h1>Add New Ride</h1>
              <p>Offer a ride to fellow travelers</p>
            </div>
            <div className="form-container">
              <div className="form-row">
                <div className="form-group">
                  <label>From</label>
                  <input type="text" className="form-input" placeholder="Starting location" />
                </div>
                <div className="form-group">
                  <label>To</label>
                  <input type="text" className="form-input" placeholder="Destination" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" className="form-input" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price per Seat (NPR)</label>
                  <input type="number" className="form-input" placeholder="500" />
                </div>
                <div className="form-group">
                  <label>Available Seats</label>
                  <input type="number" className="form-input" placeholder="3" />
                </div>
              </div>
              <div className="form-group">
                <label>Vehicle Type</label>
                <select className="form-input">
                  <option>Select vehicle type</option>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Hatchback</option>
                  <option>Van</option>
                </select>
              </div>
              <button className="btn-submit">Publish Ride</button>
            </div>
          </div>
        );

      case 'vehicle-profile':
        return (
          <div className="vehicle-profile-page">
            <div className="page-header">
              <h1>Vehicle Profile</h1>
              <p>Upload and manage your vehicle information</p>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label>Vehicle Number</label>
                <input type="text" className="form-input" placeholder="BA 1 KHA 1234" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Brand</label>
                  <input type="text" className="form-input" placeholder="Toyota" />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input type="text" className="form-input" placeholder="Corolla" />
                </div>
              </div>
              <div className="form-group">
                <label>Upload Vehicle Photos</label>
                <input type="file" className="form-input" accept="image/*" multiple />
              </div>
              <button className="btn-submit">Save Vehicle Profile</button>
            </div>
          </div>
        );

      case 'your-info':
        return (
          <div className="profile-page">
            <div className="page-header">
              <h1>Your Information</h1>
              <p>View and update your personal details</p>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-input" defaultValue={currentUser.name} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-input" defaultValue={currentUser.email} disabled />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-input" defaultValue={currentUser.username} disabled />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" className="form-input" placeholder="+977 9841234567" />
              </div>
              <button className="btn-submit">Update Information</button>
            </div>
          </div>
        );

      case 'upload-profile':
        return (
          <div className="upload-profile-page">
            <div className="page-header">
              <h1>Upload Profile</h1>
              <p>Add your profile picture</p>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label>Upload New Photo</label>
                <input type="file" className="form-input" accept="image/*" />
              </div>
              <button className="btn-submit">Upload Photo</button>
            </div>
          </div>
        );

      case 'verify-yourself':
        return (
          <div className="verify-page">
            <div className="page-header">
              <h1>Verify Yourself</h1>
              <p>Upload your identity documents</p>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label>Document Type</label>
                <select className="form-input">
                  <option>Citizenship</option>
                  <option>Driving License</option>
                  <option>Passport</option>
                </select>
              </div>
              <div className="form-group">
                <label>Document Number</label>
                <input type="text" className="form-input" />
              </div>
              <div className="form-group">
                <label>Upload Document</label>
                <input type="file" className="form-input" accept="image/*" />
              </div>
              <button className="btn-submit">Submit</button>
            </div>
          </div>
        );

      case 'payment-info':
        return (
          <div className="payment-page">
            <div className="page-header">
              <h1>Payment Information</h1>
              <p>Manage your payment methods</p>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label>Payment Method</label>
                <select className="form-input">
                  <option>eSewa</option>
                  <option>Khalti</option>
                  <option>Bank Account</option>
                </select>
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input type="text" className="form-input" />
              </div>
              <button className="btn-submit">Save</button>
            </div>
          </div>
        );

      case 'update-documents':
        return (
          <div className="documents-page">
            <div className="page-header">
              <h1>Update Documents</h1>
              <p>Upload and update your documents</p>
            </div>
            <div className="form-container">
              <div className="form-group">
                <label>Driving License</label>
                <input type="file" className="form-input" accept="image/*" />
              </div>
              <button className="btn-submit">Update</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar - Matching Home Page */}
      <header className="top-navbar">
        <div className="navbar-container">
          <div 
            className={`navbar-left ${logoShake ? 'shake' : ''}`} 
            onClick={handleLogoClick}
          >
            <img src="/images/logo.png" alt="Lift Nepal" className="navbar-logo" />
            <span className="navbar-brand">Lift Nepal</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="navbar-menu">
            <button 
              className={`nav-link ${activePage === 'rides' ? 'active' : ''}`}
              onClick={() => handleNavigation('rides')}
            >
              Rides
            </button>
            <button 
              className={`nav-link ${activePage === 'history' ? 'active' : ''}`}
              onClick={() => handleNavigation('history')}
            >
              Your Rides History
            </button>
            <button 
              className={`nav-link ${activePage === 'add-issue' ? 'active' : ''}`}
              onClick={() => handleNavigation('add-issue')}
            >
              Raise Issue
            </button>
            {isRiderMode && (
              <button 
                className={`nav-link ${activePage === 'add-ride' ? 'active' : ''}`}
                onClick={() => handleNavigation('add-ride')}
              >
                Add Ride
              </button>
            )}
          </nav>

          <div className="navbar-right">
            <ProfileDropdown 
              currentUser={currentUser} 
              onNavigate={handleNavigation}
              isRiderMode={isRiderMode}
            />

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <button 
            className={`mobile-nav-link ${activePage === 'rides' ? 'active' : ''}`}
            onClick={() => handleNavigation('rides')}
          >
            Rides
          </button>
          <button 
            className={`mobile-nav-link ${activePage === 'history' ? 'active' : ''}`}
            onClick={() => handleNavigation('history')}
          >
            Your Rides History
          </button>
          <button 
            className={`mobile-nav-link ${activePage === 'add-issue' ? 'active' : ''}`}
            onClick={() => handleNavigation('add-issue')}
          >
            Raise Issue
          </button>
          {isRiderMode && (
            <button 
              className={`mobile-nav-link ${activePage === 'add-ride' ? 'active' : ''}`}
              onClick={() => handleNavigation('add-ride')}
            >
              Add Ride
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="dashboard-main-content">
        {renderContent()}
      </main>

      {/* Mode Toggle - Bottom Left Corner */}
      <div className="mode-toggle-container">
        <button className="mode-toggle-trigger" onClick={toggleModeDropdown}>
          <svg className="mode-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {isRiderMode ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            )}
          </svg>
          <span>{isRiderMode ? 'Rider Mode' : 'User Mode'}</span>
          <svg className={`mode-toggle-arrow ${isModeDropdownOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isModeDropdownOpen && (
          <div className="mode-toggle-dropdown">
            <button className="mode-option" onClick={switchMode}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {isRiderMode ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                )}
              </svg>
              <span>{isRiderMode ? 'User Mode' : 'Rider Mode'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;