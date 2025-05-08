import React from 'react';
import './ClaimDetails.css';

const ClaimDetails = ({ claim, goBack }) => {
  return (
    <div>
      <h2 className="section-title">
        Claim #{claim.id.toString().slice(-5)} Details
      </h2>
      
      <span className={`status-badge ${claim.status.toLowerCase()}`}>
        {claim.status}
      </span>
      
      <div className="claim-details">
        <div className="detail-group">
          <h4>Personal Information</h4>
          <div className="detail-item">
            <span className="detail-label">Full Name</span>
            <span className="detail-value">{claim.fullName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{claim.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{claim.phoneNumber}</span>
          </div>
        </div>
        
        <div className="detail-group">
          <h4>Address</h4>
          <div className="detail-item">
            <span className="detail-label">Street Address</span>
            <span className="detail-value">{claim.address}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">City, State, ZIP</span>
            <span className="detail-value">{claim.cityStateZip}</span>
          </div>
        </div>
        
        <div className="detail-group">
          <h4>Claim Information</h4>
          <div className="detail-item">
            <span className="detail-label">Submission Date</span>
            <span className="detail-value">{claim.submissionDate}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Claim Types</span>
            <span className="detail-value">
              {Object.entries(claim.claimTypes)
                .filter(([_, isSelected]) => isSelected)
                .map(([type]) => 
                  type.replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())
                )
                .join(', ') || 'General'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="detail-group" style={{ marginTop: '1.5rem' }}>
        <h4>Claim Details</h4>
        <div className="detail-item">
          <span className="detail-value">{claim.claimDetails}</span>
        </div>
      </div>
      
      {claim.note && (
        <div className="detail-group">
          <h4>Additional Notes</h4>
          <div className="detail-item">
            <span className="detail-value">{claim.note}</span>
          </div>
        </div>
      )}
      
      <button className="action-button" onClick={goBack}>
        Back to Claims
      </button>
    </div>
  );
};

export default ClaimDetails;