import "./dashboard.css";
import Footer from '../Components/footer'
import QuickStat from "../Components/dashboard/quickstat";
import PolicySummary from "../Components/dashboard/policySummary"
import Sidebar from "../Components/dashboard/sidebar";
import Riskassessment from "../Components/dashboard/Riskassessment";
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
  const [loadingComplain, setLoadingComplain] = useState(false);
  const [claimReasons, setClaimReasons] = useState({}); // { [claimId]: { reason, problemDescription } }

  useEffect(() => {
    if (!aadhaar) return;
    axios.get(`http://localhost:5000/api/claims?aadhaar=${aadhaar}`)
      .then(res => setClaimData(res.data.claims || []))
      .catch(() => setClaimData([]));
  }, [aadhaar]);

  // Prefetch AI reason/problemDescription for all rejected claims after claimData loads
  useEffect(() => {
    if (!claimData || claimData.length === 0) return;
    claimData.forEach(async (claim) => {
      const claimId = claim.id || claim.clmID;
      const isRejected = claim.status && claim.status.toLowerCase() === 'rejected';
      if (!isRejected) return;
      const cached = claimReasons[claimId];
      if (cached && typeof cached.reason === 'string' && cached.reason.length > 0 && typeof cached.problemDescription === 'string') return;
      let reason = claim.reason || claim.rejectionReason || '';
      let problemDescription = '';
      if (!reason) {
        try {
          const res = await axios.post("http://localhost:5000/api/ai-assistant", {
            message: `Give only a realistic and detailed reason for rejection of this insurance claim, without any extra explanation or formatting. Only output the reason. Claim details: ${JSON.stringify(claim)}`
          });
          reason = res.data.reply || 'Not specified';
        } catch {
          reason = 'Not specified';
        }
      }
      try {
        const descRes = await axios.post("http://localhost:5000/api/ai-assistant", {
          message: `Write a detailed, user-perspective explanation of the main problem with this insurance claim, as if you are the claimant explaining your own situation and why you believe the claim should not have been rejected. Use first-person language and make it sound personal. Claim details: ${JSON.stringify(claim)}`
        });
        problemDescription = descRes.data.reply || '';
      } catch {
        problemDescription = '';
      }
      setClaimReasons(prev => ({ ...prev, [claimId]: { reason, problemDescription } }));
    });
  }, [claimData]);

  // Fetch AI reason/problemDescription when a rejected claim is selected and not already cached
  useEffect(() => {
    if (!selectedClaim) return;
    const claimId = selectedClaim.id || selectedClaim.clmID;
    const isRejected = selectedClaim.status && selectedClaim.status.toLowerCase() === 'rejected';
    if (!isRejected) return;
    // Only fetch if not already cached (both reason and problemDescription must be present)
    const cached = claimReasons[claimId];
    if (cached && typeof cached.reason === 'string' && cached.reason.length > 0 && typeof cached.problemDescription === 'string') return;
    (async () => {
      let reason = selectedClaim.reason || selectedClaim.rejectionReason || '';
      let problemDescription = '';
      if (!reason) {
        try {
          const res = await axios.post("http://localhost:5000/api/ai-assistant", {
            message: `Give only a realistic and detailed reason for rejection of this insurance claim, without any extra explanation or formatting. Only output the reason. Claim details: ${JSON.stringify(selectedClaim)}`
          });
          reason = res.data.reply || 'Not specified';
        } catch {
          reason = 'Not specified';
        }
      }
      try {
        const descRes = await axios.post("http://localhost:5000/api/ai-assistant", {
          message: `Write a detailed, user-perspective explanation of the main problem with this insurance claim, as if you are the claimant explaining your own situation and why you believe the claim should not have been rejected. Use first-person language and make it sound personal. Claim details: ${JSON.stringify(selectedClaim)}`
        });
        problemDescription = descRes.data.reply || '';
      } catch {
        problemDescription = '';
      }
      setClaimReasons(prev => ({ ...prev, [claimId]: { reason, problemDescription } }));
    })();
  }, [selectedClaim, claimReasons]);
  
  // --- Risk Score State and Fetch ---
  const [riskScores, setRiskScores] = useState({ auto: 0, home: 0, life: 0, health: 0 });
  const [loadingRiskScores, setLoadingRiskScores] = useState(true);

  useEffect(() => {
    async function fetchRiskScores() {
      setLoadingRiskScores(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/risk-scores?aadhaar=${aadhaar}`);
        const data = res.data && res.data.riskScores ? res.data.riskScores : {};
        setRiskScores({
          auto: data.auto ?? 0,
          home: data.home ?? 0,
          life: data.life ?? 0,
          health: data.health ?? 0
        });
      } catch {
        setRiskScores({ auto: 0, home: 0, life: 0, health: 0 });
      }
      setLoadingRiskScores(false);
    }
    if (aadhaar) fetchRiskScores();
  }, [aadhaar]);

  // Dynamic recommendations based on riskScores using AI
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    async function fetchAIRecommendations() {
      setLoadingRecommendations(true);
      try {
        const res = await axios.post("http://localhost:5000/api/ai-assistant", {
          message: `Given the following insurance risk scores for a user: Auto: ${riskScores.auto}, Home: ${riskScores.home}, Life: ${riskScores.life}, Health: ${riskScores.health}, provide 3-5 actionable, specific, and personalized recommendations to help the user improve their lowest scoring categories. For each recommendation, give a title, a short impact (like '+3 points'), and a 1-2 sentence description. Return the result as a JSON array of objects with keys: title, impact, description.`
        });
        let aiRecs = [];
        try {
          // Try to parse JSON, but also handle if the AI returns a string with code block markers
          let reply = res.data.reply;
          if (typeof reply === 'string') {
            // Remove markdown code block markers if present
            reply = reply.trim().replace(/^```json[\r\n]+|```$/g, '').replace(/^```[\r\n]+|```$/g, '');
          }
          aiRecs = JSON.parse(reply);
        } catch {
          // fallback: try to extract recommendations from plain text
          aiRecs = [{ title: 'Check AI response', impact: '', description: res.data.reply }];
        }
        setRecommendations(aiRecs);
      } catch (e) {
        setRecommendations([{ title: 'Could not fetch AI recommendations', impact: '', description: 'Please try again later.' }]);
      }
      setLoadingRecommendations(false);
    }
    fetchAIRecommendations();
  }, [riskScores]);

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
                      const claimId = claim.id || claim.clmID;
                      const isRejected = claim.status && claim.status.toLowerCase() === 'rejected';
                      const type = claim.type || claim.Type;
                      // Use static reason from claim object or cached AI reason
                      const cached = claimReasons[claimId] || {};
                      const rejectionReason = isRejected ? (claim.reason || claim.rejectionReason || cached.reason || 'Not specified') : '';
                      const handleComplain = async () => {
                        setLoadingComplain(true);
                        let reason = rejectionReason;
                        let problemDescription = cached.problemDescription;
                        // If not cached, wait for useEffect to fetch and cache
                        if (!reason || problemDescription === undefined) {
                          // Wait for useEffect to finish
                          for (let i = 0; i < 10; i++) {
                            await new Promise(res => setTimeout(res, 300));
                            const updated = claimReasons[claimId] || {};
                            reason = updated.reason || reason;
                            problemDescription = updated.problemDescription;
                            if (reason && problemDescription !== undefined) break;
                          }
                        }
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
                          proofSection = '\n\nProof Images:';
                          proofImages.forEach((url, i) => {
                            proofSection += `\nImage ${i+1}: ${url}`;
                          });
                          proofSection += '\n\n(If images are not attached automatically, please download and attach them manually to this email.)';
                        }
                        const mail = `Subject: Complaint to Insurance Ombudsman\n\nDear Sir/Madam,\n\nI would like to file a complaint regarding the rejection of my insurance claim.\n\nClaim Details:\n- Claim ID: ${claim.id || claim.clmID}\n- Policy: ${claim.PolicyID} (${claim.CompanyName})\n- Type: ${type}\n- Date Filed: ${claim.date || claim.FiledDate}\n- Amount: ${claim.amount || claim.Amount}\n- Status: ${claim.status}\n\nReason for Rejection (as provided):\n${reason}\n\nDetailed Problem Description (as per my perspective):\n${problemDescription ? problemDescription : '[No detailed description available. Please add your explanation here.]'}\n${proofSection}\n\nThank you.\n\nSincerely,\n[Your Name]`;
                        await navigator.clipboard.writeText(mail);
                        await new Promise(res => setTimeout(res, 150));
                        const subject = encodeURIComponent("Complaint to Insurance Ombudsman");
                        const body = encodeURIComponent(mail.replace(/^Subject: [^\n]+\n/, ""));
                        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=oio.ahmedabad@cioins.co.in&su=${subject}&body=${body}`;
                        const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
                        setLoadingComplain(false);
                      };
                      return (
                        <div key={claim.id || claim.clmID} className="claim-item">
                          <div className="claim-header">
                            <div className="claim-id">
                              <span className="claim-tag id-tag">ID: {claim.id || claim.clmID}</span>
                              <span className="claim-tag policy-tag">Policy: {claim.PolicyID}</span>
                              <span className="claim-tag company-tag">
                                {claim.CompanyName}
                                {isRejected && (
                                  <span className="claim-tag reason-tag" style={{ background: '#ffeaea', color: '#b71c1c', marginLeft: 8 }}>
                                    Reason: {rejectionReason}
                                  </span>
                                )}
                              </span>
                            </div>
                            <span className={`claim-status status-badge ${claim.status.toLowerCase()}`}>{claim.status}</span>
                          </div>
                          <div className="claim-details">
                            <span className="claim-tag type-tag">Type: {type}</span>
                            <span className="claim-tag date-tag">Filed: {claim.date || claim.FiledDate}</span>
                            <span className="claim-tag amount-tag">Amount: ₹{claim.amount || claim.Amount}</span>
                          </div>
                          {isRejected && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <button className="secondary-button" onClick={() => { setSelectedClaim(claim); setModalOpen(true); }}>
                                View Details
                              </button>
                              <button className="secondary-button" onClick={handleComplain} disabled={loadingComplain}>
                                {loadingComplain ? 'AI is personalizing your complaint...' : 'Complain in Council for Insurance Ombudsmen'}
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
    
            {loadingRiskScores ? (
              <div className="dashboard-card" style={{padding: '2rem', textAlign: 'center'}}>Loading risk assessment...</div>
            ) : (
              <Riskassessment riskScores={riskScores} />
            )}
            
            <div className="risk-recommendations dashboard-card">
              <div className="card-header">
                <h3>Recommendations to Improve Your Score</h3>
              </div>
              <div className="card-content">
                {loadingRecommendations ? (
                  <div style={{padding: '1rem'}}>Loading AI recommendations...</div>
                ) : (
                  <div className="recommendations-list">
                    {Array.isArray(recommendations) && recommendations.length > 0 ? (
                      recommendations.map((rec, idx) => (
                        <div className="recommendation-item" key={idx}>
                          <div className="recommendation-header">
                            <div className="recommendation-title">{rec.title}</div>
                            {rec.impact && <div className="recommendation-impact">{rec.impact}</div>}
                          </div>
                          <div className="recommendation-description">{rec.description}</div>
                        </div>
                      ))
                    ) : (
                      <div>No recommendations available.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
      <Footer />
      {modalOpen && selectedClaim && (
        <Modal claim={selectedClaim} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default dashboard;