import React, { useState } from "react";
import "./InsuranceRecommendation.css";

const InsuranceCard = ({ icon, title, description, benefits,}) => {
  const [count, setCount] = useState(1);

  return (
    <div className="insurance-card">
      <div className="insurance-icon">{icon}</div>
      <h2 className="insurance-title">{title}</h2>
      <p className="insurance-description">{description}</p>
      <ul className="insurance-benefits">
        {benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>
    </div>
  );
};

const InsuranceRecommendation = () => {
  const insurancePlans = [
    {
      icon: "\uD83C\uDFE5", // 🏥 Health symbol
      title: "Comprehensive Health Insurance",
      description: "Best for full medical coverage including preventive care.",
      benefits: ["Hospitalization", "Dental & Vision", "Emergency Coverage"],
    },
    {
      icon: "\uD83D\uDE97", // 🚗 Car symbol
      title: "Auto Insurance Premium",
      description: "Ideal for frequent drivers needing full protection.",
      benefits: ["Collision Coverage", "Roadside Assistance", "Theft Protection"],
    },
    {
      icon: "\uD83C\uDFE0", // 🏠 Home symbol
      title: "Homeowners Insurance",
      description: "Safeguard your property and valuables.",
      benefits: ["Fire Protection", "Liability Coverage", "Disaster Recovery"],
    },
    {
      icon: "\uD83D\uDCBC", // 💼 Business symbol
      title: "Business Liability Insurance",
      description: "Ideal for entrepreneurs ensuring business stability.",
      benefits: ["Legal Protection", "Employee Coverage", "Risk Management"],
    },
  ];

  return (
    <div className="insurance-contain">
      <h1 className="insurance-head">Recommended Insurance Plans</h1>
      <div className="insurance-list">
        {insurancePlans.map((plan, index) => (
          <InsuranceCard key={index} {...plan} />
        ))}
      </div>
    </div>
  );
};

export default InsuranceRecommendation;
