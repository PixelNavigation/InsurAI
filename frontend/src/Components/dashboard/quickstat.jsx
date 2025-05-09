import './quickstat.css';

const icons = {
  policies: "📋",
  claims: "📝",
  coverage: "🛡️",
  payment: "💵"
};

const quickStat = () => {

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

  return (

    
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
  )
}

export default quickStat