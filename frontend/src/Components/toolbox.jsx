import React, { useState } from "react";
import "./toolbox.css";

const toolboxItems = [
  {
    id: "dashboard",
    title: "Streamlined Claims",
    icon: "📎",
    features: [
      "Step-by-step guidance",
      "Faster approval rates",
      "Real-time claim status updates",
      "Reduced paperwork and delays"
    ],
    description: "Experience a hassle-free claims process from start to finish."
  },
  {
    id: "insights",
    title: "AI-Powered Insights",
    icon: "📅",
    features: [
      "Personalized recommendations",
      "Cost-saving opportunities",
      "Coverage gap analysis",
      "Smart policy comparisons"
    ],
    description: "Harness the power of AI to optimize your insurance coverage."
  },
  {
    id: "chat",
    title: "Interactive Policy Chat",
    icon: "💬",
    features: [
      "Real-time policy guidance",
      "Easy-to-understand explanations",
      "24/7 availability",
      "Personalized recommendations"
    ],
    description: "Get instant answers to your insurance questions, anytime."
  },
  {
    id: "alerts",
    title: "Proactive Alerts",
    icon: "🔔",
    features: [
      "Renewal reminders",
      "Policy change alerts",
      "Savings opportunity notifications",
      "Important deadline reminders"
    ],
    description: "Stay ahead with timely notifications about your insurance."
  }
];

const Toolbox = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const activeItem = toolboxItems.find((item) => item.id === activeTab);

  return (
    <div className="toolbox">
      <h2>
        Your Insurance <span className="highlight">Toolbox</span>
      </h2>
      <div className="toolbox-tabs">
        {toolboxItems.map((item) => (
          <button
            key={item.id}
            className={`toolbox-nav-button ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="icon">{item.icon}</span> {item.title}
          </button>
        ))}
      </div>
      <div className="toolbox-content">
        <div className="toolbox-text">
          <h3>{activeItem.title}</h3>
          <p>{activeItem.description}</p>
          <ul>
            {activeItem.features.map((feature, idx) => (
              <li key={idx}>
                <span>✅</span> {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="toolbox-image">
          <img 
            src={`/api/placeholder/400/300?text=${activeItem.title}`} 
            alt={activeItem.title} 
          />
        </div>
      </div>
    </div>
  );
};

export default Toolbox;