import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import AuthContext from '../../context/AuthContext';
import sriLankaEmblem from '../../images/sri-lanka-emblem-logo.png';
import sriLankaPolice from '../../images/Sri_Lanka_Police_logo.png';

function Header() {
  const { officer, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header home-nav">
      <div className="home-brand">
        <img className="home-brand-logo" src={sriLankaEmblem} alt="Sri Lanka emblem" />
        <img className="home-brand-logo" src={sriLankaPolice} alt="Sri Lanka Police" />
        <div className="home-brand-text">
          <h1>Officer Portal</h1>
          <p>Traffic Fine Management System</p>
        </div>
      </div>

      {isAuthenticated && (
        <nav className="home-nav-links" aria-label="Primary navigation">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/create-fine">Create Fine</Link>
          <span>{officer?.name} ({officer?.badgeNumber})</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </nav>
      )}
    </header>
  );
}

export default Header;