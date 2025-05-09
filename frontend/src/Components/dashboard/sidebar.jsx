import './sidebar.css';

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

const sidebar = () => {
    const notifications = [
    { id: 1, message: "Premium payment processed successfully", date: "May 2, 2025", isRead: false },
    { id: 2, message: "Claim #CLM-78901 has been updated", date: "Apr 30, 2025", isRead: false },
    { id: 3, message: "Your policy document is ready for review", date: "Apr 28, 2025", isRead: true }
  ];
  return (
    <div className="sidebar-sections">
    {/* Notifications Card */}
    <div className="dashboard-card notifications">
        <div className="card-header">
            <h3>Notifications</h3>
            <button className="text-button">Mark all as read</button>
        </div>
        <div className="card-content">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`notification-item${!notification.isRead ? ' unread' : ''}`}
                >
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-date">{notification.date}</div>
                </div>
            ))}
        </div>
    </div>

    {/* Quick Actions Card */}
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

    {/* Premium Savings Card */}
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
  )
}

export default sidebar