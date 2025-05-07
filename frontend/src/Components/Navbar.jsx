import React from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
import logo from '../assets/logo.png'

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='logo-container'>
            <img src={logo} alt="logo" className='logo' />
            <span className='logo-text'>InsureSmart</span>
        </div>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/insurance-recommendation">Insurance Recommendation</Link></li>
            <li><Link to="/insurance-claim">Insurance Claim</Link></li>
        </ul>
    </div>
  )
}

export default Navbar
