import React from 'react';
import CreateOfficerForm from '../components/Forms/CreateOfficerForm';
import './LoginPage.css';

function CreateOfficerPage() {
    return (
        <div className="home-page">
            <section className="hero-section signup-hero">
                <div className="hero-copy">
                    <div className="hero-badge">Officer Portal</div>
                    <h2>Create Your Officer Account</h2>
                    <p>Register with your badge details to get access to the officer dashboard and start managing traffic fines.</p>
                </div>

                <div className="hero-form-card">
                    <div className="hero-form-header">
                        <div className="hero-form-icon">⚿</div>
                        <div>
                            <h3>Officer Sign Up</h3>
                            <p>Fill in your details to create an account</p>
                        </div>
                    </div>
                    <CreateOfficerForm />
                    <p className="hero-form-note">Authorized personnel only.</p>
                </div>
            </section>
        </div>
    );
}

export default CreateOfficerPage;