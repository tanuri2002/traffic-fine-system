import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { fineService } from '../../services/api';

function CreateFineForm({ onCreated }) {
  const [formData, setFormData] = useState({
    referenceNumber: '',
    categoryCode: '',
    driverLicenseNo: '',
    driverName: '',
    vehicleNo: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.referenceNumber || !formData.referenceNumber.trim()) {
      errs.referenceNumber = 'Reference number is required.';
    }
    if (!formData.categoryCode || !formData.categoryCode.trim()) {
      errs.categoryCode = 'Category type is required.';
    }
    if (!formData.driverLicenseNo || !formData.driverLicenseNo.trim()) {
      errs.driverLicenseNo = 'Driver license number is required.';
    }
    if (!formData.driverName || !formData.driverName.trim()) {
      errs.driverName = 'Driver name is required.';
    }
    if (!formData.vehicleNo || !formData.vehicleNo.trim()) {
      errs.vehicleNo = 'Vehicle number is required.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      const resp = await fineService.createFine(formData);
      toast.success('Fine created successfully');
      setFormData({
        referenceNumber: '',
        categoryCode: '',
        driverLicenseNo: '',
        driverName: '',
        vehicleNo: '',
      });
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
        <label htmlFor="referenceNumber">Reference Number</label>
        <input
          id="referenceNumber" name="referenceNumber" type="text"
          value={formData.referenceNumber} onChange={handleChange}
          placeholder="e.g. REF001"
          aria-invalid={!!errors.referenceNumber}
        />
        {errors.referenceNumber && <div className="input-error" role="alert">{errors.referenceNumber}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="categoryCode">Category Type</label>
        <input
          id="categoryCode" name="categoryCode" type="text"
          value={formData.categoryCode} onChange={handleChange}
          placeholder="e.g. SPD-001"
          aria-invalid={!!errors.categoryCode}
        />
        {errors.categoryCode && <div className="input-error" role="alert">{errors.categoryCode}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="driverLicenseNo">Driver License No.</label>
        <input
          id="driverLicenseNo" name="driverLicenseNo" type="text"
          value={formData.driverLicenseNo} onChange={handleChange}
          placeholder="e.g. DL-1234567"
          aria-invalid={!!errors.driverLicenseNo}
        />
        {errors.driverLicenseNo && <div className="input-error" role="alert">{errors.driverLicenseNo}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="driverName">Driver Name</label>
        <input
          id="driverName" name="driverName" type="text"
          value={formData.driverName} onChange={handleChange}
          placeholder="e.g. Nimal Perera"
          aria-invalid={!!errors.driverName}
        />
        {errors.driverName && <div className="input-error" role="alert">{errors.driverName}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="vehicleNo">Vehicle Number</label>
        <input
          id="vehicleNo" name="vehicleNo" type="text"
          value={formData.vehicleNo} onChange={handleChange}
          placeholder="e.g. CABC-1234"
          aria-invalid={!!errors.vehicleNo}
        />
        {errors.vehicleNo && <div className="input-error" role="alert">{errors.vehicleNo}</div>}
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Fine'}
      </button>
    </form>
  );
}

export default CreateFineForm;

