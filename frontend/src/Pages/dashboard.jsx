import "./dashboard.css";
import Footer from '../Components/footer'
import QuickStat from "../Components/dashboard/quickstat";
import PolicySummary from "../Components/dashboard/policySummary"
import Sidebar from "../Components/dashboard/sidebar";
import Riskassessment from "../Components/dashboard/Riskassessment";
import { useState, useEffect } from 'react';
import axios from 'axios';

const dashboard = () => {
  const aadhaar = localStorage.getItem('aadhaar');

  const [claimData, setClaimData] = useState([]);

  useEffect(() => {
    if (!aadhaar) return;
    axios.get(`http://localhost:5000/api/claims?aadhaar=${aadhaar}`)
      .then(res => setClaimData(res.data.claims || []))
      .catch(() => setClaimData([]));
  }, [aadhaar]);
  
  const riskScores = {
    auto: 85,
    home: 92,
    life: 78,
    health: 89
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">My Insurance Dashboard</div>
        <div className="dashboard-user-info">
        </div>
      </div>
      
      <QuickStat />
      
      <div className="dashboard-content">
        <div className="dashboard-sections">
          <div className="main-sections">
            
            <PolicySummary aadhaar={aadhaar} />
            
            <div className="dashboard-card recent-claims">
              <div className="card-header">
                <h3>Recent Claims</h3>
                <button className="action-button">File New Claim</button>
              </div>
              <div className="card-content">
                {claimData.length > 0 ? (
                  <div className="claims-list">
                    {claimData.map(claim => (
                      <div key={claim.id || claim.clmID} className="claim-item">
                        <div className="claim-header">
                          <div className="claim-id">
                            {claim.id || claim.clmID} <span className="claim-policy">(Policy: {claim.PolicyID}, {claim.CompanyName})</span>
                          </div>
                          <div className={`claim-status ${claim.status.toLowerCase()}`}>
                            {claim.status}
                          </div>
                        </div>
                        <div className="claim-details">
                          <div className="claim-type">{claim.type || claim.Type}</div>
                          <div className="claim-date">Filed on: {claim.date || claim.FiledDate}</div>
                          <div className="claim-amount">Amount: {claim.amount || claim.Amount}</div>
                        </div>
                        <button className="secondary-button">View Details</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">No recent claims</div>
                )}
              </div>
            </div>
    
            <Riskassessment riskScores={riskScores} />
            
            <div className="risk-recommendations dashboard-card">
              <div className="card-header">
                <h3>Recommendations to Improve Your Score</h3>
              </div>
              <div className="card-content">
                <div className="recommendations-list">
                  <div className="recommendation-item">
                    <div className="recommendation-header">
                      <div className="recommendation-title">Install Smart Home Security</div>
                      <div className="recommendation-impact">+5 points</div>
                    </div>
                    <div className="recommendation-description">
                      Adding a modern security system can reduce your home insurance risk.
                    </div>
                  </div>
                  
                  <div className="recommendation-item">
                    <div className="recommendation-header">
                      <div className="recommendation-title">Defensive Driving Course</div>
                      <div className="recommendation-impact">+3 points</div>
                    </div>
                    <div className="recommendation-description">
                      Complete a certified defensive driving course to improve your auto risk profile.
                    </div>
                  </div>
                  
                  <div className="recommendation-item">
                    <div className="recommendation-header">
                      <div className="recommendation-title">Annual Health Checkup</div>
                      <div className="recommendation-impact">+4 points</div>
                    </div>
                    <div className="recommendation-description">
                      Regular health checkups can maintain or improve your health insurance rating.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default dashboard;