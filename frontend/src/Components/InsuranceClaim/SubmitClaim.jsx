import React from 'react';
import './SubmitClaim.css';

const SubmitClaim = ({ formData, handleChange, handleSubmit }) => {
  const aadhaar = localStorage.getItem('aadhaar');
  // Autofill user data from localStorage if available
  React.useEffect(() => {
    if (!aadhaar) return;
    // Fetch user data from backend
    fetch(`http://localhost:5000/api/user?aadhaar=${aadhaar}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          handleChange({ target: { name: 'fullName', value: data.user.name || '' } });
          handleChange({ target: { name: 'email', value: data.user.email || '' } });
          // Add more fields if your backend provides them
        }
      });
    const name = localStorage.getItem('name') || '';
    const email = localStorage.getItem('email') || '';
    const phone = localStorage.getItem('phoneNumber') || '';
    const address = localStorage.getItem('address') || '';
    const cityStateZip = localStorage.getItem('cityStateZip') || '';
    if (name || email || phone || address || cityStateZip) {
      handleChange({
        target: { name: 'fullName', value: name }
      });
      handleChange({
        target: { name: 'email', value: email }
      });
      handleChange({
        target: { name: 'phoneNumber', value: phone }
      });
      handleChange({
        target: { name: 'address', value: address }
      });
      handleChange({
        target: { name: 'cityStateZip', value: cityStateZip }
      });
    }
  }, [aadhaar]);

  return (
    <div>
      <h2 className="section-title">Submit New Claim</h2>
      <form className="claim-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Street Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cityStateZip">City, State, ZIP</label>
          <input
            type="text"
            id="cityStateZip"
            name="cityStateZip"
            value={formData.cityStateZip}
            onChange={handleChange}
            required
          />
        </div>

        <div className="claim-types-container">
          <div className="claim-types-title">Claim Type</div>
          <div className="checkbox-grid">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="health"
                name="health"
                checked={formData.claimTypes.health}
                onChange={handleChange}
              />
              <label htmlFor="health">Health</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="dental"
                name="dental"
                checked={formData.claimTypes.dental}
                onChange={handleChange}
              />
              <label htmlFor="dental">Dental</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="vision"
                name="vision"
                checked={formData.claimTypes.vision}
                onChange={handleChange}
              />
              <label htmlFor="vision">Vision</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="shortTermDisability"
                name="shortTermDisability"
                checked={formData.claimTypes.shortTermDisability}
                onChange={handleChange}
              />
              <label htmlFor="shortTermDisability">Short Term Disability</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="longTermDisability"
                name="longTermDisability"
                checked={formData.claimTypes.longTermDisability}
                onChange={handleChange}
              />
              <label htmlFor="longTermDisability">Long Term Disability</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="claimDetails">Claim Details</label>
          <textarea
            id="claimDetails"
            name="claimDetails"
            value={formData.claimDetails}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="note">Additional Notes</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="submit-button">
          Submit Claim
        </button>
      </form>
    </div>
  );
};

export default SubmitClaim;