import { useEffect, useState } from 'react';
import axios from 'axios';
import './quickstat.css';

const icons = {
  policies: "📋",
  claims: "📝",
  reject: "🚫",
  payment: "💵"
};

const quickstat = () => {
  const aadhaar = localStorage.getItem('aadhaar');
  const [policyData, setPolicyData] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [nextPayment, setNextPayment] = useState('');

  useEffect(() => {
    if (!aadhaar) return;
    axios.get(`http://localhost:5000/api/policies?aadhaar=${aadhaar}`)
      .then(res => {
        setPolicyData(res.data.policies || []);
        // Find the next renewal date for active policies
        const activePolicies = (res.data.policies || []).filter(p => p.Status === 'Active');
        if (activePolicies.length > 0) {
          // Find the soonest renewal date
          const next = activePolicies.reduce((min, p) => {
            return new Date(p.RenewalDate) < new Date(min.RenewalDate) ? p : min;
          }, activePolicies[0]);
          setNextPayment(next.RenewalDate);
        } else {
          setNextPayment('N/A');
        }
      })
      .catch(() => setPolicyData([]));
    axios.get(`http://localhost:5000/api/claims?aadhaar=${aadhaar}`)
      .then(res => setClaimData(res.data.claims || []))
      .catch(() => setClaimData([]));
  }, [aadhaar]);

  return (
    <div className="quick-stats">
        <div className="stat-card active-policies">
          <div className="stat-icon">{icons.policies}</div>
          <div className="stat-title">Active Policies</div>
          <div className="stat-value">{policyData.filter(p => p.Status === "Active").length}</div>
          <div className="stat-comparison stat-up">{/* TODO: Add comparison logic if needed */}</div>
        </div>
        <div className="stat-card pending-claims">
          <div className="stat-icon">{icons.claims}</div>
          <div className="stat-title">Pending Claims</div>
          <div className="stat-value">{claimData.filter(c => c.status === "Processing").length}</div>
          <div className="stat-comparison">{/* TODO: Add comparison logic if needed */}</div>
        </div>
        <div className="stat-card rejected-claims">
          <div className="stat-icon">{icons.reject}</div>
          <div className="stat-title">Rejected Claims</div>
          <div className="stat-value">{claimData.filter(c => c.status === "Rejected").length}</div>
          <div className="stat-comparison stat-down">{/* You can add comparison logic here if needed */}</div>
        </div>
        <div className="stat-card payment-due">
          <div className="stat-icon">{icons.payment}</div>
          <div className="stat-title">Next Payment</div>
          <div className="stat-value">{nextPayment}</div>
          <div className="stat-amount">{/* TODO: Calculate total payment if needed */}</div>
        </div>
      </div>
  )
}

export default quickstat;