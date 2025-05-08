import React from "react";
import "./about.css";

const about = () => {
  return (
    <section className="about-section">
      <div className="about-intro card">
        <h2>About <span className="highlight">InsureSmart</span></h2>
        <p>
          InsureSmart is redefining how people understand and manage insurance. Using advanced AI,
          we provide insights that make insurance clear, accessible, and actionable. Whether you're
          securing your future or protecting assets, InsureSmart is here to simplify insurance for you.
        </p>
      </div>

      <div className="about-cards card">
        <div className="info-card">
          <h3>Our Vision</h3>
          <p>
            We envision a future where insurance is straightforward and transparent. We aim to empower
            everyone to optimize coverage and secure financial peace of mind.
          </p>
        </div>

        <div className="info-card">
          <h3>Our Mission</h3>
          <p>
            We simplify insurance with AI-driven insights, helping you make informed decisions with clarity
            and confidence. Our goal is to remove complexities so you can focus on what matters.
          </p>
        </div>

        <div className="info-card">
          <h3>Our Values</h3>
          <p><strong>Transparency:</strong> Clear communication and honesty are at our core.</p>
          <p><strong>Innovation:</strong> We continuously improve to serve you better.</p>
          <p><strong>Customer Focus:</strong> User needs guide our services.</p>
          <p><strong>Integrity:</strong> We uphold ethical standards in all we do.</p>
        </div>
      </div>
    </section>
  );
};

export default about;