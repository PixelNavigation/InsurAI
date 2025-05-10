import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modal.css";

const claimTypeAssets = {
  Health: {
    bill: "/src/assets/Health/Bill.png",
    prescription: "/src/assets/Health/Doctorprescription.JPG",
    fir: null
  },
  Auto: {
    bill: "/src/assets/auto_bill.jpg",
    prescription: null,
    fir: "/src/assets/auto_fir.jpg"
  },
  Home: {
    bill: "/src/assets/home_bill.jpg",
    prescription: null,
    fir: "/src/assets/home_fir.jpg"
  },
  Life: {
    bill: "/src/assets/life_bill.jpg",
    prescription: "/src/assets/life_prescription.jpg",
    fir: null
  }
};

const Modal = ({ claim, onClose }) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [descLoading, setDescLoading] = useState(false);

  useEffect(() => {
    if (claim.status && claim.status.toLowerCase() === "rejected") {
      setLoading(true);
      axios.post("http://localhost:5000/api/ai-assistant", {
        message: `Give only a realistic and detailed reason for rejection of this insurance claim, without any extra explanation or formatting. Only output the reason. Claim details: ${JSON.stringify(claim)}`
      })
        .then(res => setRejectionReason(res.data.reply || "Not specified"))
        .catch(() => setRejectionReason("Not specified"))
        .finally(() => setLoading(false));

      setDescLoading(true);
      axios.post("http://localhost:5000/api/ai-assistant", {
        message: `Okay, let's break down why your health insurance claim (Claim ID: ${claim.id || claim.clmID}, Policy ID: ${claim.PolicyID}) was rejected. Please explain in a friendly, conversational, and empathetic way, as if you are a human insurance expert talking to the claimant. Use simple language and avoid jargon. Claim details: ${JSON.stringify(claim)}`
      })
        .then(res => setProblemDescription(res.data.reply || "Not specified"))
        .catch(() => setProblemDescription("Not specified"))
        .finally(() => setDescLoading(false));
    } else {
      setProblemDescription("");
    }
  }, [claim]);

  const renderImage = (label, url) =>
    url ? (
      <div className="modal-image-section">
        <div className="modal-image-label">{label}</div>
        <img src={url} alt={label} className="modal-image" />
      </div>
    ) : null;

  const type = claim.type || claim.Type;
  const assets = claimTypeAssets[type] || {};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Claim Details</h2>
        <div className="modal-section">
          <strong>Claim ID:</strong> {claim.id || claim.clmID}
        </div>
        <div className="modal-section">
          <strong>Policy:</strong> {claim.PolicyID} ({claim.CompanyName})
        </div>
        <div className="modal-section">
          <strong>Type:</strong> {type}
        </div>
        <div className="modal-section">
          <strong>Date Filed:</strong> {claim.date || claim.FiledDate}
        </div>
        <div className="modal-section">
          <strong>Amount:</strong> {claim.amount || claim.Amount}
        </div>
        <div className="modal-section">
          <strong>Status:</strong> {claim.status}
        </div>
        <div className="modal-section">
          <strong>Reason for Rejection:</strong> {loading ? "Loading..." : (rejectionReason || "Not specified")}
        </div>
        {claim.status && claim.status.toLowerCase() === 'rejected' && (
          <div className="modal-section">
            <strong>Detailed Problem Description:</strong> {descLoading ? "Loading..." : (problemDescription || "Not specified")}
          </div>
        )}
        {renderImage("Bill Image", assets.bill)}
        {renderImage("FIR Image", assets.fir)}
        {renderImage("Doctor Prescription", assets.prescription)}
        {claim.status && claim.status.toLowerCase() === 'rejected' && false && (
          <button className="secondary-button" style={{marginTop: 16}} onClick={() => {

          }}>
            Complain in Council for Insurance Ombudsmen
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
