import React from 'react'
import './footer.css'
const footer = () => {
  return (
    <div><footer className="footer">
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
  </footer></div>
  )
}

export default footer