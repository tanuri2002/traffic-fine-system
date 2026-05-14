import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ConfirmationPage.css';

function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const transactionId = location.state?.transactionId;

  useEffect(() => {
    if (!transactionId) {
      navigate('/');
    }
  }, [transactionId, navigate]);

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        <h1>Payment Successful</h1>
        <p className="message">Your payment has been processed successfully.</p>

        <div className="confirmation-details">
          <div className="detail-item">
            <label>Transaction ID:</label>
            <span>{transactionId}</span>
          </div>
          <div className="detail-item">
            <label>Date & Time:</label>
            <span>{new Date().toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <label>Status:</label>
            <span className="status-badge">CONFIRMED</span>
          </div>
        </div>

        <p className="receipt-note">A receipt has been sent to your email address.</p>

        <div className="button-group">
          <button 
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
          <button 
            className="btn-secondary"
            onClick={() => window.print()}
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
