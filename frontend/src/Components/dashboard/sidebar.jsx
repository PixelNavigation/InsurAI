import './sidebar.css';

const sidebar = () => {
    const notifications = [
    { id: 1, message: "Premium payment processed successfully", date: "May 2, 2025", isRead: false },
    { id: 2, message: "Claim #CLM-78901 has been updated", date: "Apr 30, 2025", isRead: false },
    { id: 3, message: "Your policy document is ready for review", date: "Apr 28, 2025", isRead: true }
  ];
  return (
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
                        className={`notification-item${!notification.isRead ? ' unread' : ''}`}
                    >
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-date">{notification.date}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default sidebar