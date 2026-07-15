import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { authService } from '../../services/api';
import { validateBadgeNumber, validatePassword } from '../../utils/validation';

function LoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ badgeNumber: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const badgeErr = validateBadgeNumber(formData.badgeNumber);
    const passErr = validatePassword(formData.password);
    if (badgeErr || passErr) {
      setErrors({ badgeNumber: badgeErr, password: passErr });
      return;
    }
    setSubmitting(true);
    try {
      const resp = await authService.login(formData.badgeNumber, formData.password);
      const { token, officer } = resp.data;
      login(token, officer);
      toast.success(`Welcome, ${officer.name}`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid badge number or password';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="reference-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="badgeNumber">Badge Number</label>
        <input
          id="badgeNumber" name="badgeNumber" type="text"
          value={formData.badgeNumber} onChange={handleChange}
          placeholder="Enter your badge number"
          aria-invalid={!!errors.badgeNumber}
        />
        {errors.badgeNumber && <div className="input-error" role="alert">{errors.badgeNumber}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password" name="password" type="password"
          value={formData.password} onChange={handleChange}
          placeholder="Enter your password"
          aria-invalid={!!errors.password}
        />
        {errors.password && <div className="input-error" role="alert">{errors.password}</div>}
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

export default LoginForm;