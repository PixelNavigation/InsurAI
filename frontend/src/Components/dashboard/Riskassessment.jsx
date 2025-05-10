import React, { useEffect, useState } from 'react';
import './Riskassessment.css';

const Riskassessment = () => {
    const [riskScores, setRiskScores] = useState({ auto: 0, home: 0, life: 0, health: 0 });
    const [overall, setOverall] = useState(0);
    const [desc, setDesc] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/risk-scores', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.riskScores) {
                    setRiskScores(data.riskScores);
                    const vals = Object.values(data.riskScores);
                    const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
                    setOverall(avg);
                    setDesc(
                        avg >= 85 ? 'Very Good' :
                        avg >= 70 ? 'Good' :
                        avg >= 50 ? 'Average' :
                        avg > 0 ? 'Needs Improvement' : 'N/A'
                    );
                }
            });
    }, []);

    return (
        <div className="risk-section dashboard-card">
            <div className="card-header">
                <h3>Risk Assessment</h3>
            </div>
            <div className="card-divider"></div>
            <div className="card-content">
                <div className="risk-overview">
                    <div className="risk-card">
                        <div className="risk-title">Overall Risk Score</div>
                        <div className="risk-score-circle">
                            <div className="risk-score">{overall}</div>
                        </div>
                        <div className="risk-description">{desc}</div>
                    </div>
                    <div className="risk-factors">
                        <h3>Risk Factors by Category</h3>
                        <div className="risk-factor-bars">
                            <RiskFactor label="Auto Insurance" value={riskScores.auto} />
                            <RiskFactor label="Home Insurance" value={riskScores.home} />
                            <RiskFactor label="Life Insurance" value={riskScores.life} />
                            <RiskFactor label="Health Insurance" value={riskScores.health} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RiskFactor = ({ label, value }) => (
    <div className="risk-factor">
        <div className="factor-label">{label}</div>
        <div className="factor-bar-container">
            <div className="factor-bar" style={{ width: `${value}%` }} />
            <span className="factor-value">{value}</span>
        </div>
    </div>
);

export default Riskassessment;
