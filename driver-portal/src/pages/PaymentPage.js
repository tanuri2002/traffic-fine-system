import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentForm from '../components/Forms/PaymentForm';
import DetailsDisplay from '../components/Display/DetailsDisplay';
import AppContext from '../context/AppContext';
import { paymentService } from '../services/api';
import './PaymentPage.css';

function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [fineDetails, setFineDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { fineData, setPaymentData } = useContext(AppContext);

  useEffect(() => {
    const stateFineDetails = location.state?.fineDetails;
    const storedFineDetails = sessionStorage.getItem('fineData');
    const resolvedFineDetails =
      stateFineDetails ||
      fineData ||
      (storedFineDetails ? JSON.parse(storedFineDetails) : null);

    if (resolvedFineDetails) {
      setFineDetails(resolvedFineDetails);
    }
  }, [fineData, location.state]);

  const handlePaymentSubmit = async (paymentData) => {
    setLoading(true);
    try {
      const response = await paymentService.processPayment({
        ...paymentData,
        referenceNumber: fineDetails?.referenceNumber,
        amount: fineDetails?.amount,
      });

      const responseData = response?.data || {};
      const receiptNumber = responseData.receiptNumber || responseData.transactionId || responseData.id || `RCPT-${Date.now()}`;

      setPaymentData({
        ...paymentData,
        receiptNumber,
        transactionId: responseData.transactionId || receiptNumber,
      });

      sessionStorage.setItem(
        'paymentData',
        JSON.stringify({
          ...paymentData,
          receiptNumber,
          transactionId: responseData.transactionId || receiptNumber,
        })
      );

      navigate('/confirmation', {
        state: {
          receiptNumber,
          transactionId: responseData.transactionId || receiptNumber,
          amount: fineDetails?.amount,
        },
      });
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
        onClick={() => navigate('/details', { state: { fineDetails } })}
      >
        Back
      </button>
    </div>
  );
}

export default PaymentPage;
