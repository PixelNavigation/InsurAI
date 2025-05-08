import React from "react";
import "./home.css";
import Toolbox from "../Components/toolbox";
import Footer from "../Components/footer";
const home = () => {
  return (
    <div className="home">
      <section className="banner">
        <div className="banner-heading">
          <h1>Having</h1>
          <h1>trouble making</h1>
          <h1><span className="S1">insurance decisions</span> and <span className="S2">claims</span>?</h1>
        </div>
        <div className="banner-subheading">
          <p>Use AI and automated claim system to spot</p>
          <p>coverage gaps and simplify complex claim process</p>
        </div>
        <button className="banner-buttons">Try InsureAI for free <span className="Arrow">→</span></button>
      </section>

      <section className="features">
        <div className="feature-item">
          <h3>Personalized Insurance recommendations
          </h3>
          <p>Get AI-backed recommendations to match your needs and profile.</p>
        </div>
        <div className="feature-item">
          <h3>✉ Claims automation</h3>
          <p>Expedite application submissions through streamlined processes.</p>
        </div>
        <div className="feature-item">
          <h3>Fraud detection and prevention</h3>
          <p>Our digital screening system helps reduce fraudulent claims early.</p>
        </div>
      </section>

      <section className="promo">
        <div className="promo-content">
          <h2>Secure Your Future</h2>
          <p>
            Take control of your financial security today. Customized insurance
            plans and peace of mind start your journey forward.
          </p>
          <button>Join Us Now</button>
        </div>
      </section>
      <Toolbox />
      <Footer />
    </div>
  );
}

export default home