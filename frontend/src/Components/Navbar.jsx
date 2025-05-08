import React from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
import logo from '../assets/logo.png'

const Navbar = () => {
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
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/insurance-recommendation">Insurance Recommendation</Link></li>
            <li><Link to="/insurance-claim">Insurance Claim</Link></li>
        </ul>
      <button className='login-button'>Login</button>
      <button className='signup-button'>Sign Up</button>
        </div>
    </div>
  )
}

export default Navbar
