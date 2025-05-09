import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import logo from '../assets/logo.png';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleSignupClick = () => {
    navigate('/signup');
  };
  
  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className='navbar'>
      <div className='logo-container'>
        <Link to="/">
          <img src={logo} alt="logo" className='logo' />
          <span className='logo-text'>InsureAI</span>
        </Link>
      </div>
      <div className='right-section'>
        <ul>
          {!isAuthenticated && <li><Link to="/">Home</Link></li>}
          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/insurance-recommendation">Insurance Recommendation</Link></li>
              <li><Link to="/insurance-claim">Insurance Claim</Link></li>
            </>
          ) : (
            <li><Link to="/">Services</Link></li>
          )}
        </ul>
        
        {isAuthenticated ? (
          <div className="account-container" ref={dropdownRef}>
            <button className="account-button" onClick={toggleDropdown}>
              <div className="account-initials">AI</div>
            </button>
            {showDropdown && (
              <div className="account-dropdown">
                <div className="dropdown-item" onClick={handleProfileClick}>
                  Profile
                </div>
                <div className="dropdown-item" onClick={handleLogoutClick}>
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className='login-button' onClick={handleLoginClick}>Login</button>
            <button className='signup-button' onClick={handleSignupClick}>Sign Up</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;