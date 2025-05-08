import React, { useState } from 'react';
import ClaimDetails from './ClaimDetails';
import './TrackStatus.css';

const TrackStatus = ({ claims, setActiveTab }) => {
  const [selectedClaim, setSelectedClaim] = useState(null);

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

  return (
    <div>
      <h2 className="section-title">Track Your Claims</h2>
      <ul className="claim-list">
        {claims.map((claim) => (
          <li key={claim.id} className="claim-card">
            <div className="claim-header">
              <h3>Claim #{claim.id.toString().slice(-5)}</h3>
              <span className={`status-badge ${claim.status.toLowerCase()}`}>
                {claim.status}
              </span>
            </div>
            <div className="claim-body">
              <p><strong>Date Submitted:</strong> {claim.submissionDate}</p>
              <p>
                <strong>Type:</strong>{' '}
                {Object.entries(claim.claimTypes)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([type]) => 
                    type.replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())
                  )
                  .join(', ') || 'General'}
              </p>
              <button 
                className="action-button"
                onClick={() => setSelectedClaim(claim)}
              >
                View Details
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackStatus;