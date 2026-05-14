import React, { useState } from 'react';
import './ReferenceForm.css';

function ReferenceForm() {
  const [formData, setFormData] = useState({
    referenceNumber: '',
    categoryId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form className="reference-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="referenceNumber">Reference Number</label>
        <input
          type="text"
          id="referenceNumber"
          name="referenceNumber"
          value={formData.referenceNumber}
          onChange={handleChange}
          placeholder="Enter your reference number"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoryId">Category ID</label>
        <input
          type="text"
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          placeholder="Enter category ID"
          required
        />
      </div>

      <button type="submit" className="btn-primary">
        Find Details
      </button>
    </form>
  );
}

export default ReferenceForm;
