import React from 'react';
import LoginForm from '../components/Forms/LoginForm';
import './LoginPage.css';

function LoginPage() {
  return (
    <div className="home-page">
      <section className="hero-section login-hero">
        <div className="hero-copy">
          <div className="hero-badge">Officer Portal</div>
          <h2>Sign In to Manage Traffic Fines</h2>
          <p>Enter your badge number and password to access your dashboard and create fines.</p>
        </div>

        <div className="hero-form-card">
          <div className="hero-form-header">
            <div className="hero-form-icon">⚿</div>
            <div>
              <h3>Officer Sign In</h3>
              <p>Enter your credentials to continue</p>
            </div>
          </div>
          <LoginForm />
          <p className="hero-form-note">Authorized personnel only.</p>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;