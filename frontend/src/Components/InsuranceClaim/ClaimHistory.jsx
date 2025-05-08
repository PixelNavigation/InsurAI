import React from 'react';
import './ClaimHistory.css';

const ClaimHistory = ({ claims, setActiveTab }) => {
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
            <th>Date Submitted</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id}>
              <td>#{claim.id.toString().slice(-5)}</td>
              <td>{claim.submissionDate}</td>
              <td>
                {Object.entries(claim.claimTypes)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([type]) => 
                    type.replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())
                  )
                  .join(', ') || 'General'}
              </td>
              <td>
                <span className={`status-badge ${claim.status.toLowerCase()}`}>
                  {claim.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimHistory;