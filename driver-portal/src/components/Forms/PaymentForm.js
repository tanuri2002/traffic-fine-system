import React, { useState, useContext } from 'react';
import './PaymentForm.css';
import AppContext from '../../context/AppContext';
import { validateCardNumber, validateExpiryDate, validateCVV } from '../../utils/validation';

function PaymentForm({ onSubmit }) {
  const { setPaymentData, setLoading, setError } = useContext(AppContext);
  const [formData, setFormData] = useState({ cardName: '', cardNumber: '', expiryDate: '', cvv: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cardErr = validateCardNumber(formData.cardNumber);
    const expErr = validateExpiryDate(formData.expiryDate);
    const cvvErr = validateCVV(formData.cvv);
    const newErrors = {};
    if (cardErr) newErrors.cardNumber = cardErr;
    if (expErr) newErrors.expiryDate = expErr;
    if (cvvErr) newErrors.cvv = cvvErr;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setError(null);
    try {
      const paymentPayload = { ...formData };
      setPaymentData(paymentPayload);
      if (onSubmit) {
        await onSubmit(paymentPayload);
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="cardName">Cardholder Name</label>
        <input
          type="text"
          id="cardName"
          name="cardName"
          value={formData.cardName}
          onChange={handleChange}
          placeholder="Enter cardholder name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cardNumber">Card Number</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="Enter card number"
          maxLength="19"
          aria-invalid={!!errors.cardNumber}
        />
        {errors.cardNumber && <div className="input-error" role="alert">{errors.cardNumber}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            required
            aria-invalid={!!errors.expiryDate}
          />
          {errors.expiryDate && <div className="input-error" role="alert">{errors.expiryDate}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="CVV"
            maxLength="4"
            required
            aria-invalid={!!errors.cvv}
          />
          {errors.cvv && <div className="input-error" role="alert">{errors.cvv}</div>}
        </div>
      </div>

      <button type="submit" className="btn-primary">
        Submit Payment
      </button>
    </form>
  );
}

export default PaymentForm;
