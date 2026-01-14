import { useState } from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar';
import '../css/DashboardLayout.css';

const DashboardLayout = ({ children, currentUser }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      <SideBar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        isLicenseVerified={currentUser?.isLicenseVerified || false}
      />
      <div className="dashboard-main">
        <TopBar 
          toggleSidebar={toggleSidebar}
          currentUser={currentUser}
        />
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;