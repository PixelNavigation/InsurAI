import React from 'react';
import './SubmitClaim.css';
import AIAssistant from '../dashboard/AIAssistant';

const SubmitClaim = ({ formData, handleChange, handleSubmit }) => {
  const aadhaar = localStorage.getItem('aadhaar');
  const [policies, setPolicies] = React.useState([]);
  const [selectedPolicyType, setSelectedPolicyType] = React.useState('');

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
    // Fetch active policies for the user
    fetch(`http://localhost:5000/api/policies?aadhaar=${aadhaar}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.policies) {
          setPolicies(data.policies);
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

  // Handle file input change
  const handleFileChange = (e) => {
    handleChange({ target: { name: 'requirementDocument', value: e.target.files[0] } });
  };

  // Update selectedPolicyType when policy changes
  const handlePolicyChange = (e) => {
    const selectedId = e.target.value;
    handleChange(e);
    const selected = policies.find((p) => String(p.PolicyID) === String(selectedId));
    setSelectedPolicyType(selected ? selected.Type : '');
  };

  return (
    <div style={{position: 'relative'}}>
      <h2 className="section-title">Submit New Claim</h2>
      <form className="claim-form" onSubmit={handleSubmit}>
        {/* Policy selection dropdown */}
        <div className="form-group">
          <label htmlFor="policy">Select Policy</label>
          <select
            id="policy"
            name="policy"
            value={formData.policy || ''}
            onChange={handlePolicyChange}
            required
          >
            <option value="" disabled>Select your policy</option>
            {policies.map((policy) => (
              policy && policy.PolicyID ? (
                <option key={String(policy.PolicyID)} value={policy.PolicyID}>
                  {policy.CompanyName} - {policy.Type} (#{policy.PolicyID})
                </option>
              ) : null
            ))}
          </select>
        </div>

        {/* Claim Type - only show the type for the selected policy */}
        {selectedPolicyType && (
          <div className="form-group">
            <label>Claim Type</label>
            <input
              type="text"
              name="claimType"
              value={selectedPolicyType}
              readOnly
              className="readonly-input"
            />
          </div>
        )}

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

        <div className="form-group">
          <label htmlFor="requirementDocument">Requirement Document</label>
          <input
            type="file"
            id="requirementDocument"
            name="requirementDocument"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Claim
        </button>
      </form>
      {/* Floating AI Assistant for fast typing */}
      <div style={{position: 'fixed', bottom: 32, right: 32, zIndex: 1000}}>
        <AIAssistant onSuggestion={(text) => {
          // Insert suggestion into claim details
          const textarea = document.getElementById('claimDetails');
          if (textarea) {
            const start = textarea.selectionStart || 0;
            const end = textarea.selectionEnd || 0;
            const value = textarea.value;
            const newValue = value.slice(0, start) + text + value.slice(end);
            textarea.value = newValue;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }} />
      </div>
    </div>
  );
};

export default SubmitClaim;