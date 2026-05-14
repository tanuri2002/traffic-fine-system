import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentForm from '../components/Forms/PaymentForm';
import DetailsDisplay from '../components/Display/DetailsDisplay';
import './PaymentPage.css';

function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fineDetails = location.state?.fineDetails;

  const handlePaymentSubmit = async (paymentData) => {
    setLoading(true);
    try {
      // API call to process payment
      // navigate('/confirmation', { state: { transactionId: response.id } });
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h1>Payment Information</h1>

      <div className="payment-container">
        <div className="details-section">
          <h2>Fine Summary</h2>
          <DetailsDisplay fineDetails={fineDetails} />
        </div>

        <div className="form-section">
          <h2>Payment Details</h2>
          <PaymentForm onSubmit={handlePaymentSubmit} />
        </div>
      </div>

      {loading && <p className="loading">Processing payment...</p>}

      <button 
        className="btn-back" 
        onClick={() => navigate('/details')}
      >
        Back
      </button>
    </div>
  );
}

export default PaymentPage;
