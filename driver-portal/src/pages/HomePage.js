import React from 'react';
import ReferenceForm from '../components/Forms/ReferenceForm';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>Traffic Fine Information Portal</h1>
        <p>Enter your reference number and category ID to retrieve your fine details and proceed with payment.</p>
      </div>

      <ReferenceForm />

      <div className="info-section">
        <h3>How it works:</h3>
        <ol>
          <li>Enter your reference number and category ID</li>
          <li>Review your fine details</li>
          <li>Proceed to payment</li>
          <li>Receive confirmation</li>
        </ol>
      </div>
    </div>
  );
}

export default HomePage;
