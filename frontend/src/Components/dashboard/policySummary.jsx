import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './policySummary.css';

const PolicySummary = ({ aadhaar }) => {
  const [policyData, setPolicyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!aadhaar) {
      console.error("AADHAAR number is required");
      return;
    }
    axios.get(`http://localhost:5000/api/policies?aadhaar=${aadhaar}`)
      .then(res => {
        setPolicyData(res.data.policies || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [aadhaar]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-card policy-summary">
      <div className="card-header">
        <h3>Policy Summary</h3>
        <button className="action-button">Update Policy</button>
      </div>
      <div className="card-content">
        <table className="policy-table">
          <thead>
            <tr>
              <th>Policy ID</th>
              <th>Company Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Premium</th>
              <th>Renewal Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policyData.map(policy => (
              <tr key={policy.PolicyID}>
                <td>{policy.PolicyID}</td>
                <td>{policy.CompanyName}</td>
                <td>{policy.Type}</td>
                <td>
                  <span className={`status-badge ${policy.Status.toLowerCase()}`}>
                    {policy.Status}
                  </span>
                </td>
                <td>{policy.Premium}</td>
                <td>{policy.RenewalDate}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-button">View</button>
                    <button className="icon-button">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PolicySummary;