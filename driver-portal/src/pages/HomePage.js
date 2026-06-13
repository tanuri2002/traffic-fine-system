import React from 'react';
import { Link } from 'react-router-dom';
import ReferenceForm from '../components/Forms/ReferenceForm';
import './HomePage.css';
import sriLankaEmblem from '../images/sri-lanka-emblem-logo.png';
import sriLankaPolice from '../images/Sri_Lanka_Police_logo.png';

function HomePage() {
  return (
    <div className="home-page">
      <header className="home-nav">
        <div className="home-brand">
          <img className="home-brand-logo home-brand-logo-emblem" src={sriLankaEmblem} alt="Sri Lanka emblem" />
          <img className="home-brand-logo home-brand-logo-police" src={sriLankaPolice} alt="Sri Lanka Police" />
          <div className="home-brand-text">
            <h1>Traffic Fine Portal</h1>
            <p>Traffic Fine Management System</p>
          </div>
        </div>

        <nav className="home-nav-links" aria-label="Primary navigation">
          <Link to="/" className="active">Home</Link>
          <Link to="/details">Check Fine</Link>
          <Link to="/payment">Payment</Link>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact Us</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <div className="hero-badge">Driver Portal</div>
          <h2>Check and Pay Traffic Fines Online</h2>
          <p>Quickly search your traffic violations and make secure online payments from one place.</p>
          <div className="hero-actions">
            <Link to="/details" className="hero-button hero-button-primary">Check Fine</Link>
            <a href="#how-it-works" className="hero-button hero-button-secondary">Learn More</a>
          </div>
        </div>

        <div className="hero-form-card">
          <div className="hero-form-header">
            <div className="hero-form-icon">⌕</div>
            <div>
              <h3>Check Your Fine</h3>
              <p>Enter your details to find fine information</p>
            </div>
          </div>
          <ReferenceForm />
          <p className="hero-form-note">Your information is safe and secure.</p>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="section-heading">
          <h3>How It Works</h3>
          <span className="section-underline" />
        </div>

        <div className="steps-grid">
          <article className="step-card">
            <div className="step-icon step-icon-blue">1</div>
            <h4>Enter Details</h4>
            <p>Enter your reference number and category ID.</p>
          </article>

          <article className="step-card">
            <div className="step-icon step-icon-green">2</div>
            <h4>View Fine Information</h4>
            <p>Review your traffic fine details and violation info.</p>
          </article>

          <article className="step-card">
            <div className="step-icon step-icon-orange">3</div>
            <h4>Make Payment</h4>
            <p>Proceed to secure online payment.</p>
          </article>

          <article className="step-card">
            <div className="step-icon step-icon-green">4</div>
            <h4>Receive Confirmation</h4>
            <p>Receive payment confirmation and receipt instantly.</p>
          </article>
        </div>
      </section>

      <section className="home-bottom-grid">
        <div className="why-panel" id="faq">
          <div className="section-heading compact">
            <h3>Why Use This Portal?</h3>
            <span className="section-underline" />
          </div>

          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon blue">⚡</span>
              <div>
                <h4>Fast Processing</h4>
                <p>Get your fine details within seconds.</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon green">🔒</span>
              <div>
                <h4>Secure Payments</h4>
                <p>100% secure and trusted payment gateway.</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon purple">📱</span>
              <div>
                <h4>Mobile Friendly</h4>
                <p>Access the portal anytime, anywhere on any device.</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon orange">✉</span>
              <div>
                <h4>Instant Confirmation</h4>
                <p>Receive payment receipt instantly via email.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-panel">
          <div className="stats-grid">
            <div className="stat-item">
              <strong>25,000+</strong>
              <span>Fines Paid Successfully</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <strong>150,000+</strong>
              <span>Registered Users</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <strong>99%</strong>
              <span>Successful Payments</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <strong>24/7</strong>
              <span>Service Availability</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer" id="contact">
        <div className="home-footer-container">
          <div className="home-footer-brand">
            <img className="home-footer-logo" src={sriLankaEmblem} alt="Sri Lanka emblem" />
            <div>
              <h3>Sri Lanka Police</h3>
              <p>Traffic Fine Management System</p>
            </div>
          </div>

          <div className="home-footer-contact">
            <h4>Contact Details</h4>
            <p>Police Headquarters, Colombo 01, Sri Lanka</p>
            <p>Hotline: 119</p>
            <p>Traffic Division: +94 11 243 3333</p>
            <p>Email: info@police.lk</p>
          </div>

          <div className="home-footer-contact">
            <h4>Quick Links</h4>
            <p>Check fines by reference number</p>
            <p>Online payment and confirmation</p>
            <p>24/7 driver support</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
