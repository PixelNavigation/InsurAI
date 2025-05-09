import React, { useState } from "react";
import "./dashboard.css";
import Footer from '../Components/footer'

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

const dashboard = () => {
  // Sample data (would come from API in a real application)
  const userData = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "JS",
    plan: "Premium Plan",
    nextPayment: "May 15, 2025"
  };
  
  const policyData = [
    { id: "POL-12345", type: "Auto Insurance", status: "Active", premium: "$125/month", renewalDate: "Jun 30, 2025" },
    { id: "POL-23456", type: "Home Insurance", status: "Active", premium: "$210/month", renewalDate: "Aug 15, 2025" },
    { id: "POL-34567", type: "Life Insurance", status: "Active", premium: "$95/month", renewalDate: "Dec 01, 2025" }
  ];
  
  const claimData = [
    { id: "CLM-78901", type: "Auto Accident", status: "Processing", amount: "$2,450", date: "Apr 25, 2025" },
    { id: "CLM-89012", type: "Water Damage", status: "Approved", amount: "$5,800", date: "Mar 10, 2025" }
  ];
  
  const notifications = [
    { id: 1, message: "Premium payment processed successfully", date: "May 2, 2025", isRead: false },
    { id: 2, message: "Claim #CLM-78901 has been updated", date: "Apr 30, 2025", isRead: false },
    { id: 3, message: "Your policy document is ready for review", date: "Apr 28, 2025", isRead: true }
  ];
  
  const riskScores = {
    auto: 85,
    home: 92,
    life: 78,
    health: 89
  };
  
  const recommendedActions = [
    { id: 1, title: "Update Home Security", description: "Installing smart security devices could reduce your premium by up to 15%", priority: "high" },
    { id: 2, title: "Review Auto Coverage", description: "Your current coverage may be inadequate based on your vehicle's value", priority: "medium" },
    { id: 3, title: "Health Check-up Reminder", description: "Regular check-ups can maintain your favorable health rating", priority: "low" }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">My Insurance Dashboard</div>
        <div className="dashboard-user-info">
        </div>
      </div>
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
          <div className="stat-value">87%</div>
          <div className="stat-comparison stat-up">+3% from last assessment</div>
        </div>
        
        <div className="stat-card payment-due">
          <div className="stat-icon">{icons.payment}</div>
          <div className="stat-title">Next Payment</div>
          <div className="stat-value">{userData.nextPayment}</div>
          <div className="stat-amount">$430 total</div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-sections">
          <div className="main-sections">
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
                            <button className="icon-button">Edit</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="dashboard-card recent-claims">
              <div className="card-header">
                <h3>Recent Claims</h3>
                <button className="action-button">File New Claim</button>
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
            
            {/* Risk Assessment Section - merged into overview */}
            <div className="risk-section dashboard-card">
              <div className="card-header">
                <h3>Risk Assessment</h3>
                <button className="secondary-button">Update Information</button>
              </div>
              
              <div className="card-content">
                <div className="risk-overview">
                  <div className="risk-card">
                    <div className="risk-title">Overall Risk Score</div>
                    <div className="risk-score-circle">
                      <div className="risk-score">86</div>
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
              </div>
            </div>
            
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
          
          <div className="sidebar-sections">
            <div className="dashboard-card notifications">
              <div className="card-header">
                <h3>Notifications</h3>
                <button className="text-button">Mark all as read</button>
              </div>
              <div className="card-content">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  >
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-date">{notification.date}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dashboard-card quick-actions">
              <div className="card-header">
                <h3>Quick Actions</h3>
              </div>
              <div className="card-content action-buttons-grid">
                <button className="quick-action-button">
                  <span className="action-icon">{icons.payment}</span>
                  Make Payment
                </button>
                <button className="quick-action-button">
                  <span className="action-icon">{icons.claims}</span>
                  File Claim
                </button>
                <button className="quick-action-button">
                  <span className="action-icon">{icons.risk}</span>
                  Risk Analysis
                </button>
                <button className="quick-action-button">
                  <span className="action-icon">{icons.support}</span>
                  Contact Support
                </button>
              </div>
            </div>
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
      <Footer />
    </div>
  );
};

export default dashboard;