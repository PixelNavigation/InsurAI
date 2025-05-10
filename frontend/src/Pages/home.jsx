import "./home.css";
import Toolbox from "../Components/toolbox";
import Footer from "../Components/footer";
const home = () => {
  return (
    <div className="home">
      <section className="banner">
        <div className="banner-heading">
          <h1>Having trouble in</h1>
          <h1><span className="S1">claiming</span> and <span className="S2">managing insurance</span>?</h1>
        </div>
        <div className="banner-subheading">
          <p>Use AI and automated system to help</p>
          <p>users reclaim their rejected claims and manage risk</p>
        </div>
        <a href="/login" className="banner-buttons">Try InsureAI for free <span className="Arrow">→</span></a>
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
          <button><a href="/signup">Join Us Now</a></button>
        </div>
      </section>
      <Toolbox />
      <Footer />
    </div>
  );
}

export default home