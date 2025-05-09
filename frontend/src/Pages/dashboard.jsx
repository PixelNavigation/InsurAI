import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Footer from '../Components/footer';
import axios from 'axios';
import UpdatePolicy from '../Components/update'

// Dashboard Icons (using unicode characters as placeholders)
const icons = {
  policies: "📋",
  claims: "📝",
  coverage: "🛡️",
  payment: "💵",
  notification: "🔔",
  settings: "⚙️",
  support: "📞",
  risk: "📊",
  savings: "💰"
};

const Dashboard = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
    plan: "",
    nextPayment: ""
  });

  const navigate = useNavigate();

  // Update Policy navigation handler
  const handleUpdatePolicy = () => {
    navigate('/update-policy');
  };

  // Edit specific policy handler
  const handleEditPolicy = (policyId) => {
    navigate(`/update-policy/${policyId}`);
  };

  const [policyData, setPolicyData] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [riskScores, setRiskScores] = useState({
    auto: 0,
    home: 0,
    life: 0,
    health: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get current user from local storage
  const getCurrentUser = () => {
    const userEmail = localStorage.getItem('userEmail');
    return userEmail;
  };

  // Fetch all user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEmail = getCurrentUser();
        if (!userEmail) {
          // Redirect to login if no user is found
          // window.location.href = '/login';
          return;
        }
        
        setIsLoading(true);
        
        // Fetch policies for the current user
        const policiesResponse = await axios.get(`http://localhost:5000/api/policies/${userEmail}`);
        setPolicyData(policiesResponse.data.map(policy => ({
          id: `POL-${policy.id}`,
          type: policy.type,
          status: policy.status,
          premium: `$${policy.premium}/month`,
          renewalDate: new Date(policy.renewal_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        })));
        
        // Fetch user profile data
        const userResponse = await axios.get(`http://localhost:5000/api/user/${userEmail}`);
        const user = userResponse.data;
        
        setUserData({
          name: user.name,
          email: user.email,
          avatar: user.name.split(' ').map(n => n[0]).join(''),
          plan: user.plan || "Premium Plan",
          nextPayment: user.next_payment || "May 15, 2025"
        });
        
        // Fetch claims data
        const claimsResponse = await axios.get(`http://localhost:5000/api/claims/${userEmail}`);
        setClaimData(claimsResponse.data);
        
        // Fetch notifications
        const notificationsResponse = await axios.get(`http://localhost:5000/api/notifications/${userEmail}`);
        setNotifications(notificationsResponse.data);
        
        // Fetch risk scores
        const riskResponse = await axios.get(`http://localhost:5000/api/risk/${userEmail}`);
        setRiskScores(riskResponse.data);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      const userEmail = getCurrentUser();
      await axios.put(`http://localhost:5000/api/notifications/mark-all-read/${userEmail}`);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({
          ...notification,
          isRead: true
        }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };
  
  // Function to file a new claim
  const handleFileNewClaim = () => {
    // Redirect to claim filing page
    // window.location.href = '/file-claim';
    console.log("Navigating to file new claim page");
  };

  // Calculate total monthly premium
  const calculateTotalPremium = () => {
    return policyData.reduce((total, policy) => {
      const premiumValue = parseFloat(policy.premium.replace('$', '').replace('/month', ''));
      return total + premiumValue;
    }, 0);
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">My Insurance Dashboard</div>
        <div className="dashboard-user-info">
          <div className="user-avatar">{userData.avatar}</div>
          <div className="user-details">
            <div className="user-name">{userData.name}</div>
            <div className="user-email">{userData.email}</div>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card active-policies">
          <div className="stat-icon">{icons.policies}</div>
          <div className="stat-title">Active Policies</div>
          <div className="stat-value">{policyData.filter(p => p.status === "Active").length}</div>
          <div className="stat-comparison stat-up">+1 from last month</div>
        </div>
        
        <div className="stat-card pending-claims">
          <div className="stat-icon">{icons.claims}</div>
          <div className="stat-title">Pending Claims</div>
          <div className="stat-value">{claimData.filter(c => c.status === "Processing").length}</div>
          <div className="stat-comparison">No change</div>
        </div>
        
        <div className="stat-card coverage-health">
          <div className="stat-icon">{icons.coverage}</div>
          <div className="stat-title">Coverage Health</div>
          <div className="stat-value">
            {Object.values(riskScores).reduce((sum, score) => sum + score, 0) / Object.values(riskScores).length}%
          </div>
          <div className="stat-comparison stat-up">+3% from last assessment</div>
        </div>
        
        <div className="stat-card payment-due">
          <div className="stat-icon">{icons.payment}</div>
          <div className="stat-title">Next Payment</div>
          <div className="stat-value">{userData.nextPayment}</div>
          <div className="stat-amount">${calculateTotalPremium()} total</div>
        </div>
      </div>
      
      {/* Dashboard Content - Scrollable Single Page */}
      <div className="dashboard-content">
        <div className="dashboard-sections">
          {/* Left Column - Main Content */}
          <div className="main-sections">
            {/* Policy Summary */}
            <div className="dashboard-card policy-summary">
              <div className="card-header">
                <h3>Policy Summary</h3>
                <button className="action-button" onClick={handleUpdatePolicy}>Update Policy</button>
              </div>
              <div className="card-content">
                {policyData.length > 0 ? (
                  <table className="policy-table">
                    <thead>
                      <tr>
                        <th>Policy ID</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Premium</th>
                        <th>Renewal Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policyData.map(policy => (
                        <tr key={policy.id}>
                          <td>{policy.id}</td>
                          <td>{policy.type}</td>
                          <td>
                            <span className={`status-badge ${policy.status.toLowerCase()}`}>
                              {policy.status}
                            </span>
                          </td>
                          <td>{policy.premium}</td>
                          <td>{policy.renewalDate}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="icon-button">View</button>
                              <button className="icon-button" onClick={() => handleEditPolicy(policy.id)}>Edit</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">No active policies found</div>
                )}
              </div>
            </div>
            
            {/* Recent Claims */}
            <div className="dashboard-card recent-claims">
              <div className="card-header">
                <h3>Recent Claims</h3>
                <button className="action-button" onClick={handleFileNewClaim}>File New Claim</button>
              </div>
              <div className="card-content">
                {claimData.length > 0 ? (
                  <div className="claims-list">
                    {claimData.map(claim => (
                      <div key={claim.id} className="claim-item">
                        <div className="claim-header">
                          <div className="claim-id">{claim.id}</div>
                          <div className={`claim-status ${claim.status.toLowerCase()}`}>
                            {claim.status}
                          </div>
                        </div>
                        <div className="claim-details">
                          <div className="claim-type">{claim.type}</div>
                          <div className="claim-date">Filed on: {claim.date}</div>
                          <div className="claim-amount">Amount: {claim.amount}</div>
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
            
            {/* Risk Assessment Section */}
            <div className="dashboard-card risk-assessment">
              <div className="card-header">
                <h3>Risk Assessment</h3>
                <button className="secondary-button">Update Information</button>
              </div>
              <div className="card-content">
                <div className="risk-overview">
                  <div className="risk-card">
                    <div className="risk-title">Overall Risk Score</div>
                    <div className="risk-score-circle">
                      <div className="risk-score">
                        {Math.round(Object.values(riskScores).reduce((sum, score) => sum + score, 0) / Object.values(riskScores).length)}
                      </div>
                    </div>
                    <div className="risk-description">Very Good</div>
                  </div>
                  
                  <div className="risk-factors">
                    <h3>Risk Factors by Category</h3>
                    <div className="risk-factor-bars">
                      <div className="risk-factor">
                        <div className="factor-label">Auto Insurance</div>
                        <div className="factor-bar-container">
                          <div 
                            className="factor-bar" 
                            style={{ width: `${riskScores.auto}%` }}
                          ></div>
                          <span className="factor-value">{riskScores.auto}</span>
                        </div>
                      </div>
                      
                      <div className="risk-factor">
                        <div className="factor-label">Home Insurance</div>
                        <div className="factor-bar-container">
                          <div 
                            className="factor-bar" 
                            style={{ width: `${riskScores.home}%` }}
                          ></div>
                          <span className="factor-value">{riskScores.home}</span>
                        </div>
                      </div>
                      
                      <div className="risk-factor">
                        <div className="factor-label">Life Insurance</div>
                        <div className="factor-bar-container">
                          <div 
                            className="factor-bar" 
                            style={{ width: `${riskScores.life}%` }}
                          ></div>
                          <span className="factor-value">{riskScores.life}</span>
                        </div>
                      </div>
                      
                      <div className="risk-factor">
                        <div className="factor-label">Health Insurance</div>
                        <div className="factor-bar-container">
                          <div 
                            className="factor-bar" 
                            style={{ width: `${riskScores.health}%` }}
                          ></div>
                          <span className="factor-value">{riskScores.health}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="risk-recommendations">
                  <h3>Recommendations to Improve Your Score</h3>
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
          </div>
            
          {/* Right Column - Sidebar */}
          <div className="sidebar-sections">
            {/* Notifications */}
            <div className="dashboard-card notifications">
              <div className="card-header">
                <h3>Notifications</h3>
                <button className="text-button" onClick={markAllNotificationsAsRead}>Mark all as read</button>
              </div>
              <div className="card-content">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                    >
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-date">{notification.date}</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No notifications</div>
                )}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="dashboard-card quick-actions">
              <div className="card-header">
                <h3>Quick Actions</h3>
              </div>
              <div className="card-content action-buttons-grid">
                <button className="quick-action-button">
                  <span className="action-icon">{icons.payment}</span>
                  Make Payment
                </button>
                <button className="quick-action-button" onClick={handleFileNewClaim}>
                  <span className="action-icon">{icons.claims}</span>
                  File Claim
                </button>
                <button className="quick-action-button">
                  <span className="action-icon">{icons.settings}</span>
                  Update Info
                </button>
                <button className="quick-action-button">
                  <span className="action-icon">{icons.support}</span>
                  Contact Support
                </button>
              </div>
            </div>
            
            {/* Premium Savings */}
            <div className="dashboard-card premium-savings">
              <div className="card-header">
                <h3>Premium Savings</h3>
              </div>
              <div className="savings-content">
                <div className="savings-icon">{icons.savings}</div>
                <div className="savings-title">Potential Savings</div>
                <div className="savings-amount">$320/year</div>
                <div className="savings-description">
                  Bundle your home and auto insurance to save up to 15%
                </div>
                <button className="primary-button">View Options</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;