import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import logo from '../assets/logo.png';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const dropdownRef = useRef(null);
  const lastScrollY = useRef(0);

  // Scroll logic to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowNavbar(false); // Scrolling down
      } else {
        setShowNavbar(true); // Scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`navbar ${showNavbar ? 'visible' : 'hidden'}`}>
      <div className='logo-container'>
        <Link to="/">
          <img src={logo} alt="logo" className='logo' />
          <span className='logo-text'>InsureAI</span>
        </Link>
      </div>
      <div className='right-section'>
        <ul>
          {isAuthenticated && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/insurance-claim">Insurance Claim</Link></li>
            </>
          )}
        </ul>

        {isAuthenticated ? (
          <div className="account-container" ref={dropdownRef}>
            <button className="account-button" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="account-initials">AI</div>
            </button>
            {showDropdown && (
              <div className="account-dropdown">
                <div className="dropdown-item" onClick={() => navigate('/profile')}>Profile</div>
                <div className="dropdown-item" onClick={() => { onLogout(); navigate('/'); }}>Logout</div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className='login-button' onClick={() => navigate('/login')}>Login</button>
            <button className='signup-button' onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
