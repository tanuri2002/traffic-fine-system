import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DetailsDisplay from '../components/Display/DetailsDisplay';
import './DetailsPage.css';

function DetailsPage() {
  const [fineDetails, setFineDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load fine details from location state or session storage
    // This will be implemented with actual API calls
  }, []);

  const handleProceedToPayment = () => {
    navigate('/payment', { state: { fineDetails } });
  };

  return (
    <div className="details-page">
      <h1>Fine Details</h1>
      
      {loading && <p className="loading">Loading fine details...</p>}
      
      {fineDetails && (
        <>
          <DetailsDisplay fineDetails={fineDetails} />
          <div className="button-group">
            <button 
              className="btn-primary" 
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => navigate('/')}
            >
              Back
            </button>
          </div>
        </>
      )}

      {!loading && !fineDetails && (
        <p className="no-data">No fine details found. Please go back and search again.</p>
      )}
    </div>
  );
}

export default DetailsPage;
