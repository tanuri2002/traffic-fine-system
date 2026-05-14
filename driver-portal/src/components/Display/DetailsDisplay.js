import React from 'react';
import './DetailsDisplay.css';

function DetailsDisplay({ fineDetails }) {
  if (!fineDetails) {
    return <div className="details-display">No fine details to display</div>;
  }

  return (
    <div className="details-display">
      <h2>Fine Details</h2>
      <div className="details-card">
        <div className="detail-row">
          <label>Reference Number:</label>
          <span>{fineDetails.referenceNumber}</span>
        </div>
        <div className="detail-row">
          <label>Driver Name:</label>
          <span>{fineDetails.driverName}</span>
        </div>
        <div className="detail-row">
          <label>Vehicle Number:</label>
          <span>{fineDetails.vehicleNumber}</span>
        </div>
        <div className="detail-row">
          <label>Violation Type:</label>
          <span>{fineDetails.violationType}</span>
        </div>
        <div className="detail-row">
          <label>Fine Amount:</label>
          <span className="amount">${fineDetails.amount}</span>
        </div>
        <div className="detail-row">
          <label>Date of Violation:</label>
          <span>{fineDetails.violationDate}</span>
        </div>
        <div className="detail-row">
          <label>Status:</label>
          <span className={`status ${fineDetails.status}`}>{fineDetails.status}</span>
        </div>
      </div>
    </div>
  );
}

export default DetailsDisplay;
