import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './Pages/home';
import Dashboard from './Pages/Dashboard';
import InsuranceRecommendation from './Pages/InsuranceRecommendation';
import InsuranceClaim from './Pages/InsuranceClaim';
  

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', userData);
      console.log("Login successful:", response.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const handleSignup = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/signup', userData);
      console.log("Signup successful:", response.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout');
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error.message);
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
          path="/insurance-recommendation" 
          element={
            <ProtectedRoute>
              <InsuranceRecommendation />
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
