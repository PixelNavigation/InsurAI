import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import logo from '../assets/logo.png';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleSignupClick = () => {
    navigate('/signup');
  };
  
  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };
  
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
          <li><Link to="/">Home</Link></li>
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
          <button className='logout-button' onClick={handleLogoutClick}>Logout</button>
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