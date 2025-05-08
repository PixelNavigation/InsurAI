import React from "react";
import "./home.css";
import Features from "./Features";
const home = () => {
  return (
    <div className="app">
      <section className="banner">
        <h1>Having</h1>
        <h1>trouble making</h1>
        <h1>insurance decisions and claims?</h1>
        <p>Use AI and automated claim system to spot</p>
        <p>coverage gaps, simplify complex claim process</p>
        <div className="hero-buttons">
          <button>Join Us Now</button>
        </div>
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
        <Features />
      </section>


      <footer className="footer">
        <div className="footer-top">
          <div className="brand">InsureSmart</div>
          <input type="email" placeholder="Subscribe to our newsletter" />
          <button>Subscribe</button>
        </div>
        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <p>Pricing</p>
          </div>
          <div>
            <h4>Resources</h4>
            <p>Blog</p>
            <p>Guides</p>
          </div>
          <div>
            <h4>Company</h4>
            <p>About</p>
            <p>Contact</p>
          </div>
          <div>
            <h4>Policies</h4>
            <p>Terms</p>
            <p>Privacy</p>
          </div>
        </div>
        <div className="socials">
          <span>Follow us:</span>
          <a href="#">Fb</a> <a href="#">X</a> <a href="#">Insta</a>
        </div>
      </footer>
    </div>
  );
}

export default home