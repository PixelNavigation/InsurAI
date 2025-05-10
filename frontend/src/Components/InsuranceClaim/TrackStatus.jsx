import React, { useEffect, useState } from 'react';
import ClaimDetails from './ClaimDetails';
import axios from 'axios';
import './TrackStatus.css';
import { addDays, format } from 'date-fns';

const TrackStatus = ({ setActiveTab }) => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
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
        <h2 className="section-title">Track Your Claims</h2>
        <p>You don't have any claims yet.</p>
        <button 
          className="action-button"
          onClick={() => setActiveTab('submit')}
        >
          Submit a Claim
        </button>
      </div>
    );
  }

  if (selectedClaim) {
    return (
      <ClaimDetails 
        claim={selectedClaim} 
        goBack={() => setSelectedClaim(null)} 
      />
    );
  }

  // Only show processing claims
  const processingClaims = claims.filter(claim => claim.status && claim.status.toLowerCase() === 'processing');

  return (
    <div>
      <h2 className="section-title">Track Your Claims</h2>
      <ul className="claim-list">
        {processingClaims.map((claim) => {
          // Calculate approx settlement date (15 days from FiledDate)
          let filedDateStr = claim.FiledDate || claim.date || claim.submissionDate;
          let approxDate = '';
          if (filedDateStr) {
            let filedDate = new Date(filedDateStr);
            if (!isNaN(filedDate)) {
              approxDate = format(addDays(filedDate, 15), 'yyyy-MM-dd');
            }
          }
          return (
            <li key={claim.clmID || claim.id} className="claim-card">
              <div className="claim-header">
                <h3>Claim #{(claim.clmID || claim.id || '').toString().slice(-5)}</h3>
                <span className={`status-badge ${claim.status.toLowerCase()}`}>
                  {claim.status}
                </span>
              </div>
              <div className="claim-body">
                <p><strong>Date Filed:</strong> {filedDateStr}</p>
                <p><strong>Company:</strong> {claim.CompanyName}</p>
                <p><strong>Type:</strong> {claim.Type || claim.type}</p>
                <p><strong>Approx. Settlement By:</strong> {approxDate || 'N/A'}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TrackStatus;