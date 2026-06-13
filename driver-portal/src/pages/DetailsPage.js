import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DetailsDisplay from '../components/Display/DetailsDisplay';
import AppContext from '../context/AppContext';
import './DetailsPage.css';

function DetailsPage() {
  const [fineDetails, setFineDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { fineData, setFineData } = useContext(AppContext);

  useEffect(() => {
    const stateFineDetails = location.state?.fineDetails;
    const storedFineDetails = sessionStorage.getItem('fineData');

    const resolvedFineDetails =
      stateFineDetails ||
      fineData ||
      (storedFineDetails ? JSON.parse(storedFineDetails) : null);

    if (resolvedFineDetails) {
      setFineDetails(resolvedFineDetails);
      setFineData(resolvedFineDetails);
      sessionStorage.setItem('fineData', JSON.stringify(resolvedFineDetails));
    }

    setLoading(false);
  }, [fineData, location.state, setFineData]);

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
