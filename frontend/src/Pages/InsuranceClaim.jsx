import React, { useState } from 'react';
import SubmitClaim from '../Components/InsuranceClaim/SubmitClaim';
import TrackStatus from '../Components/InsuranceClaim/TrackStatus';
import ClaimHistory from '../Components/InsuranceClaim/ClaimHistory';
import './InsuranceClaim.css';

const InsuranceClaim = () => {
  const initialForm = {
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    cityStateZip: '',
    claimDetails: '',
    claimTypes: {
      health: false,
      dental: false,
      vision: false,
      shortTermDisability: false,
      longTermDisability: false,
    },
    note: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [claims, setClaims] = useState([]);
  const [activeTab, setActiveTab] = useState('submit');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        claimTypes: {
          ...prev.claimTypes,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClaim = {
      id: Date.now(),
      ...formData,
      status: 'Pending',
      submissionDate: new Date().toLocaleString(),
    };
    setClaims((prev) => [newClaim, ...prev]);
    setFormData(initialForm);
    setActiveTab('track');
  };

  return (
    <div className='portal-container'>
      <div className='tabs'>
        <button 
          className={`tab-button ${activeTab === 'submit' ? 'active' : ''}`} 
          onClick={() => setActiveTab('submit')}
        >
          Submit Claim
        </button>
        <button 
          className={`tab-button ${activeTab === 'track' ? 'active' : ''}`} 
          onClick={() => setActiveTab('track')}
        >
          Track Status
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} 
          onClick={() => setActiveTab('history')}
        >
          Claim History
        </button>
      </div>
      <div className='tab-content'>
        {activeTab === 'submit' && (
          <SubmitClaim
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
        {activeTab === 'track' && (
          <TrackStatus claims={claims} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'history' && (
          <ClaimHistory claims={claims} setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
};

export default InsuranceClaim;