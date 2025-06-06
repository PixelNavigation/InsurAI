import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/Navbar';
import Login from './Components/auth/Login';
import Signup from './Components/auth/Signup';
import Home from './Pages/home';
import Dashboard from './Pages/dashboard';
import InsuranceClaim from './Pages/InsuranceClaim';
import AIAssistant from './Components/dashboard/AIAssistant';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('aadhaar')
  );

  const handleLogin = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', userData);
      const { aadhaar } = response.data;
      console.log("Login successful:", response.data);
      localStorage.setItem('aadhaar', aadhaar);
      setIsAuthenticated(true);

      return { success: true, aadhaar };
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const handleSignup = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/signup', userData);
      const { aadhaar } = response.data;
      localStorage.setItem('aadhaar', aadhaar);
      setIsAuthenticated(true);
      console.log("Signup successful:", response.data);
      return { success: true, aadhaar };
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout');
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      localStorage.removeItem('aadhaar');
      setIsAuthenticated(false);
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      {isAuthenticated && <AIAssistant />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/insurance-claim" 
          element={
            <ProtectedRoute>
              <InsuranceClaim />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
