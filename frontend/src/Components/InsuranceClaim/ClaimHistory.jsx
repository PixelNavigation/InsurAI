import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ClaimHistory.css';

const ClaimHistory = ({ setActiveTab }) => {
  const [claims, setClaims] = useState([]);
  const aadhaar = localStorage.getItem('aadhaar');

  useEffect(() => {
    if (!aadhaar) return;
    axios.get(`http://localhost:5000/api/claims?aadhaar=${aadhaar}`)
      .then(res => setClaims(res.data.claims || []))
      .catch(() => setClaims([]));
  }, [aadhaar]);

  if (claims.length === 0) {
    return (
      <div className="empty-state">
        <h2 className="section-title">Claim History</h2>
        <p>You don't have any claims history yet.</p>
        <button 
          className="action-button"
          onClick={() => setActiveTab('submit')}
        >
          Submit a Claim
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">Claim History</h2>
      <table className="claim-table">
        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Date Filed</th>
            <th>Type</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Policy</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.clmID || claim.id}>
              <td>{claim.clmID || claim.id}</td>
              <td>{claim.FiledDate || claim.date || claim.submissionDate}</td>
              <td>{claim.Type || claim.type}</td>
              <td><span className={`status-badge ${claim.status && claim.status.toLowerCase()}`}>{claim.status}</span></td>
              <td>{claim.Amount || claim.amount}</td>
              <td>{claim.PolicyID}</td>
              <td>{claim.CompanyName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimHistory;