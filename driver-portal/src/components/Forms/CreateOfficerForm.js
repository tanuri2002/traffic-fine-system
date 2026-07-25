import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { authService } from '../../services/api';

function CreateOfficerForm({ onCreated }) {
    const [form, setForm] = useState({ badgeNumber: '', name: '', phone: '', district: '', password: '', role: 'officer' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const validate = () => {
        const errs = {};
        if (!form.badgeNumber) errs.badgeNumber = 'Badge number is required.';
        if (!form.name) errs.name = 'Name is required.';
        if (!form.password) errs.password = 'Password is required.';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) return;
        setSubmitting(true);
        try {
            const resp = await authService.createOfficer(form);
            toast.success('Officer created');
            setForm({ badgeNumber: '', name: '', phone: '', district: '', password: '', role: 'officer' });
            onCreated?.(resp.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create officer');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="reference-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
                <label htmlFor="badgeNumber">Badge Number</label>
                <input id="badgeNumber" name="badgeNumber" value={form.badgeNumber} onChange={handleChange} placeholder="Badge number" />
                {errors.badgeNumber && <div className="input-error" role="alert">{errors.badgeNumber}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
                {errors.name && <div className="input-error" role="alert">{errors.name}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
            </div>

            <div className="form-group">
                <label htmlFor="district">District</label>
                <input id="district" name="district" value={form.district} onChange={handleChange} placeholder="District" />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
                {errors.password && <div className="input-error" role="alert">{errors.password}</div>}
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Officer'}
                </button>
            </div>
        </form>
    );
}

export default CreateOfficerForm; 