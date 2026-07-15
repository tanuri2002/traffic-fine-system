import React, { useState } from 'react';
import CreateFineForm from '../components/Forms/CreateFineForm';

function CreateFinePage() {
  const [created, setCreated] = useState(null);

  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>Create Fine</h1>
      <CreateFineForm onCreated={setCreated} />
      {created && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f8ff', borderRadius: '8px' }}>
          <p>Fine created: <strong>{created.fineId || created.id}</strong></p>
        </div>
      )}
    </div>
  );
}

export default CreateFinePage;