import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReferenceForm.css';
import AppContext from '../../context/AppContext';
import { validateReferenceNumber, validateCategoryId } from '../../utils/validation';
import { fineService } from '../../services/api';

function ReferenceForm() {
  const { setFineData, setLoading, setError } = useContext(AppContext);
  const [formData, setFormData] = useState({ referenceNumber: '', categoryId: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const refErr = validateReferenceNumber(formData.referenceNumber);
    const catErr = validateCategoryId(formData.categoryId);
    const errors = {};
    if (refErr) errors.referenceNumber = refErr;
    if (catErr) errors.categoryId = catErr;
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError(null);
    try {
      // Try to fetch real data; if backend not available this may fail.
      const resp = await fineService.getFineDetails(formData.referenceNumber, formData.categoryId);
      if (resp?.data) {
        setFineData(resp.data);
        navigate('/details', { state: { fineDetails: resp.data } });
      } else if (resp?.error) {
        setError(resp.error);
      } else {
        // fallback: set minimal data so user can continue
        const fallback = { referenceNumber: formData.referenceNumber, status: 'unpaid', amount: 0 };
        setFineData(fallback);
        navigate('/details', { state: { fineDetails: fallback } });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch fine details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="reference-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="referenceNumber">Reference Number</label>
        <input
          type="text"
          id="referenceNumber"
          name="referenceNumber"
          value={formData.referenceNumber}
          onChange={handleChange}
          placeholder="Enter your reference number"
          aria-invalid={!!validationErrors.referenceNumber}
        />
        {validationErrors.referenceNumber && (
          <div className="input-error" role="alert">{validationErrors.referenceNumber}</div>
        )}
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
          aria-invalid={!!validationErrors.categoryId}
        />
        {validationErrors.categoryId && (
          <div className="input-error" role="alert">{validationErrors.categoryId}</div>
        )}
      </div>

      <button type="submit" className="btn-primary">
        Find Details
      </button>
    </form>
  );
}

export default ReferenceForm;
