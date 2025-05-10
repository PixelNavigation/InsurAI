import "./dashboard.css";
import Footer from '../Components/footer'
import QuickStat from "../Components/dashboard/quickstat";
import PolicySummary from "../Components/dashboard/policySummary"
import Sidebar from "../Components/dashboard/sidebar";
import Riskassessment from "../Components/dashboard/Riskassessment";
import AIAssistant from "../Components/dashboard/AIAssistant";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from "../Components/dashboard/Modal";
import "../Components/dashboard/Modal.css";

const dashboard = () => {
  const aadhaar = localStorage.getItem('aadhaar');

  const [claimData, setClaimData] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
                <button className="action-button"><Link to="/insurance-claim">File New Claim</Link></button>
              </div>
              <div className="card-content">
                {claimData.length > 0 ? (
                  <div className="claims-list">
                    {claimData.map(claim => {
                      const isRejected = claim.status && claim.status.toLowerCase() === 'rejected';
                      const handleComplain = async () => {
                        let rejectionReason = '';
                        try {
                          const res = await axios.post("http://localhost:5000/api/ai-assistant", {
                            message: `Give only a realistic and detailed reason for rejection of this insurance claim, without any extra explanation or formatting. Only output the reason. Claim details: ${JSON.stringify(claim)}`
                          });
                          rejectionReason = res.data.reply || 'Not specified';
                        } catch {
                          rejectionReason = 'Not specified';
                        }
                        const type = claim.type || claim.Type;
                        let proofImages = [];
                        if (type === 'Health') {
                          proofImages.push(window.location.origin + '/src/assets/Health/Bill.png');
                          proofImages.push(window.location.origin + '/src/assets/Health/Doctorprescription.JPG');
                        } else if (type === 'Auto') {
                          proofImages.push(window.location.origin + '/src/assets/auto_bill.jpg');
                          proofImages.push(window.location.origin + '/src/assets/auto_fir.jpg');
                        } else if (type === 'Home') {
                          proofImages.push(window.location.origin + '/src/assets/home_bill.jpg');
                          proofImages.push(window.location.origin + '/src/assets/home_fir.jpg');
                        } else if (type === 'Life') {
                          proofImages.push(window.location.origin + '/src/assets/life_bill.jpg');
                          proofImages.push(window.location.origin + '/src/assets/life_prescription.jpg');
                        }
                        let proofSection = '';
                        if (proofImages.length > 0) {
                          proofSection = '\n\nProof Images (copy and paste these links in your browser if needed):\n' + proofImages.map((url, i) => `Image ${i+1}: ${url}`).join('\n');
                        }
                        const mail = `Subject: Complaint to Insurance Ombudsman\n\nDear Sir/Madam,\n\nI would like to file a complaint regarding the rejection of my insurance claim.\n\nClaim Details:\n- Claim ID: ${claim.id || claim.clmID}\n- Policy: ${claim.PolicyID} (${claim.CompanyName})\n- Type: ${type}\n- Date Filed: ${claim.date || claim.FiledDate}\n- Amount: ${claim.amount || claim.Amount}\n- Status: ${claim.status}\n\nReason for Rejection (as provided):\n${rejectionReason}\n\nI request your intervention to review this claim.\n${proofSection}\n\nThank you.\n\nSincerely,\n[Your Name]`;
                        await navigator.clipboard.writeText(mail);
                        const subject = encodeURIComponent("Complaint to Insurance Ombudsman");
                        const body = encodeURIComponent(mail.replace(/^Subject: [^\n]+\n/, ""));
                        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=oio.ahmedabad@cioins.co.in&su=${subject}&body=${body}`, '_blank');
                      };
                      return (
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
                          {isRejected && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <button className="secondary-button" onClick={() => { setSelectedClaim(claim); setModalOpen(true); }}>
                                View Details
                              </button>
                              <button className="secondary-button" onClick={handleComplain}>
                                Complain in Council for Insurance Ombudsmen
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
      <AIAssistant />
      {modalOpen && selectedClaim && (
        <Modal claim={selectedClaim} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default dashboard;