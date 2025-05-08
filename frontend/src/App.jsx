import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/home';
import Dashboard from './Pages/dashboard';
import Navbar from './Components/Navbar';
import InsuranceRecommendation from './Pages/InsuranceRecommendation';
import InsuranceClaim from './Pages/InsuranceClaim';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/insurance-recommendation" element={<InsuranceRecommendation />} />
          <Route path="/insurance-claim" element={<InsuranceClaim />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;