import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReferenceForm.css';
import AppContext from '../../context/AppContext';
import { toast } from 'react-toastify';
import { validateReferenceNumber, validateCategoryId } from '../../utils/validation';
import { fineService } from '../../services/api';

function ReferenceForm() {
  const { setFineData, setLoading, setError } = useContext(AppContext);
  const [formData, setFormData] = useState({ referenceNumber: '', categoryId: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const resp = await fineService.getCategories(); // adjust to your actual API method
        setCategories(resp?.data || []);
      } catch (err) {
        toast.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

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
      const resp = await fineService.getFineDetails(formData.referenceNumber, formData.categoryId);
      if (resp?.data) {
        const raw = resp.data;
        const mapped = {
          id: raw.id,
          referenceNumber: raw.reference_number || raw.referenceNumber,
          categoryId: raw.category_id || raw.categoryId,
          officerId: raw.officer_id || raw.officerId,
          driverLicenseNo: raw.driver_license_no || raw.driverLicenseNo,
          driverName: raw.driver_name || raw.driverName,
          vehicleNumber: raw.vehicle_no || raw.vehicleNumber,
          status: raw.status,
          paidAt: raw.paid_at || raw.paidAt,
          paymentChannel: raw.payment_channel || raw.paymentChannel,
          createdAt: raw.created_at || raw.createdAt,
          date: raw.created_at ? new Date(raw.created_at).toLocaleDateString() : '',
          offense: raw.category_name || raw.offense,
          amount: raw.amount,
          officerName: raw.officer_name,
          officerPhone: raw.officer_phone
        };
        setFineData(mapped);
        sessionStorage.setItem('fineData', JSON.stringify(mapped));
        toast.success('Fine details loaded');
        navigate('/payment', { state: { fineDetails: mapped } });
      } else {
        const errorMsg = resp?.error || 'Fine not found';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch fine details';
      setError(msg);
      toast.error(msg);
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
        <label htmlFor="categoryId">Category</label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          aria-invalid={!!validationErrors.categoryId}
        >
          <option value="" disabled>Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.title}</option>
          ))}
        </select>
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