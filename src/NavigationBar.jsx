import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import './Navbar.css';

const NavigationBar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav style={{ padding : '20px' }} className="navbar">
      <div className="navbar-logo">Job Finder</div>

      {/* For larger screens, navigation links */}
      <div className="navbar-links">
        <a href="/">Home</a>
        <a href="#jobs">Jobs</a>
        <a href="#post">Post a Job</a>
        <a href="#cv">Create a CV</a>
        <a href="#about">About Us</a>
      </div>

      {/* User Dropdown */}
      <div className="user-dropdown">
        <button className="dropdown-btn" onClick={toggleDropdown}>
          Zhyar <i className={`fas fa-chevron-down ${dropdownOpen ? 'rotate' : ''}`}></i>
        </button>
        <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
          <a href="#profile"><i class="fa-solid fa-user me-2"></i> Your Profile</a>
          <a href="#saves"><i class="fa-solid fa-bookmark me-2"></i> Your Saves</a>
          <a href="#logout"><i class="fa-solid fa-right-from-bracket me-2"></i> Logout</a>
        </div>
      </div>

      {/* Hamburger menu for smaller screens */}
      <GiHamburgerMenu
        className="hamburger-icon"
        onClick={toggleSidebar}
        size={35}
      />

      {/* Sidebar for mobile */}
      <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
        <div style={{marginRight : '20px'}} className="sidebar-header">
          <span></span>
          <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
        </div>
        <a href="#home">
          <i className="fa-solid fa-house me-2"></i> Home
        </a>
        <a href="#jobs">
          <i className="fas fa-briefcase me-2"></i> Jobs
        </a>
        <a href="#post">
          <i className="fa-solid fa-plus me-2"></i> Post a Job
        </a>
        <a href="#cv">
          <i className="fas fa-file-alt me-2"></i> Create a CV
        </a>
        <a href="#about">
          <i className="fas fa-info-circle me-2"></i> About Us
        </a>
      </div>
    </nav>
  );
};

export default NavigationBar;
