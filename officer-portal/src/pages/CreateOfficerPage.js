import React, { useState } from 'react';
import CreateOfficerForm from '../components/Forms/CreateOfficerForm';
import './CreateOfficerPage.css';

function CreateOfficerPage() {
  const [created, setCreated] = useState(null);

  return (
    <div className="create-officer-page">
      <div className="create-officer-card">
        <h1>Create Officer (dev)</h1>
        <p>This page is for creating test officers when `REACT_APP_MOCK_AUTH=true`.</p>

        <CreateOfficerForm onCreated={setCreated} />

        {created && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f8ff', borderRadius: 8 }}>Created: <strong>{created.badgeNumber}</strong></div>
        )}
      </div>
    </div>
  );
}

export default CreateOfficerPage;
