import React from 'react'

const policySummary = () => {
    const policyData = [
    { id: "POL-12345", type: "Auto Insurance", status: "Active", premium: "$125/month", renewalDate: "Jun 30, 2025" },
    { id: "POL-23456", type: "Home Insurance", status: "Active", premium: "$210/month", renewalDate: "Aug 15, 2025" },
    { id: "POL-34567", type: "Life Insurance", status: "Active", premium: "$95/month", renewalDate: "Dec 01, 2025" }
  ];

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
  )
}

export default policySummary