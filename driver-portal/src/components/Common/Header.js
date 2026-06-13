import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import sriLankaEmblem from '../../images/sri-lanka-emblem-logo.png';
import sriLankaPolice from '../../images/Sri_Lanka_Police_logo.png';

function Header() {
  return (
    <header className="header home-nav">
      <div className="home-brand">
        <img className="home-brand-logo" src={sriLankaEmblem} alt="Sri Lanka emblem" />
        <img className="home-brand-logo" src={sriLankaPolice} alt="Sri Lanka Police" />
        <div className="home-brand-text">
          <h1>Traffic Fine Portal</h1>
          <p>Traffic Fine Management System</p>
        </div>
      </div>

      <nav className="home-nav-links" aria-label="Primary navigation">
        <Link to="/">Home</Link>
        <Link to="/details">Check Fine</Link>
        <Link to="/payment">Payment</Link>
        <Link to="/#faq">FAQ</Link>
        <a href="#contact">Contact Us</a>
      </nav>
    </header>
  );
}

export default Header;
