import './Riskassessment.css';

const Riskassessment = ({ riskScores }) => (
    <div className="risk-section dashboard-card">
        <div className="card-header">
            <h3>Risk Assessment</h3>
        </div>

        <div className="card-divider"></div>

        <div className="card-content">
            <div className="risk-overview">
                {/* Overall Risk Score Card */}
                <div className="risk-card">
                    <div className="risk-title">Overall Risk Score</div>
                    <div className="risk-score-circle">
                        <div className="risk-score">86</div>
                    </div>
                    <div className="risk-description">Very Good</div>
                </div>

                {/* Risk Factors Section */}
                <div className="risk-factors">
                    <h3>Risk Factors by Category</h3>
                    <div className="risk-factor-bars">
                        {/* Auto Insurance Risk Factor */}
                        <RiskFactor
                            label="Auto Insurance"
                            value={riskScores.auto}
                        />
                        {/* Home Insurance Risk Factor */}
                        <RiskFactor
                            label="Home Insurance"
                            value={riskScores.home}
                        />
                        {/* Life Insurance Risk Factor */}
                        <RiskFactor
                            label="Life Insurance"
                            value={riskScores.life}
                        />
                        {/* Health Insurance Risk Factor */}
                        <RiskFactor
                            label="Health Insurance"
                            value={riskScores.health}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const RiskFactor = ({ label, value }) => (
    <div className="risk-factor">
        <div className="factor-label">{label}</div>
        <div className="factor-bar-container">
            <div
                className="factor-bar"
                style={{ width: `${value}%` }}
            />
            <span className="factor-value">{value}</span>
        </div>
    </div>
);

export default Riskassessment;
