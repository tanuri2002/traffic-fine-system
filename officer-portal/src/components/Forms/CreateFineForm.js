import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { fineService } from '../../services/api';
import { validateVehicleRefId, validateCategoryId } from '../../utils/validation';

function CreateFineForm({ onCreated }) {
  const [formData, setFormData] = useState({ vehicleRefId: '', categoryId: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const refErr = validateVehicleRefId(formData.vehicleRefId);
    const catErr = validateCategoryId(formData.categoryId);
    if (refErr || catErr) {
      setErrors({ vehicleRefId: refErr, categoryId: catErr });
      return;
    }
    setSubmitting(true);
    try {
      const resp = await fineService.createFine(formData);
      toast.success('Fine created successfully');
      setFormData({ vehicleRefId: '', categoryId: '' });
      onCreated?.(resp.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create fine');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="reference-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="vehicleRefId">Vehicle Reference ID</label>
        <input
          id="vehicleRefId" name="vehicleRefId" type="text"
          value={formData.vehicleRefId} onChange={handleChange}
          placeholder="Enter vehicle reference ID"
          aria-invalid={!!errors.vehicleRefId}
        />
        {errors.vehicleRefId && <div className="input-error" role="alert">{errors.vehicleRefId}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="categoryId">Category ID</label>
        <input
          id="categoryId" name="categoryId" type="text"
          value={formData.categoryId} onChange={handleChange}
          placeholder="Enter category ID"
          aria-invalid={!!errors.categoryId}
        />
        {errors.categoryId && <div className="input-error" role="alert">{errors.categoryId}</div>}
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Fine'}
      </button>
    </form>
  );
}

export default CreateFineForm;