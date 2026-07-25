import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import AuthContext from '../../context/AuthContext';
import sriLankaEmblem from '../../images/sri-lanka-emblem-logo.png';
import sriLankaPolice from '../../images/Sri_Lanka_Police_logo.png';

function Header() {
  const { officer, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signin';
  const portalName = (isAuthenticated || isAuthPage) ? 'Officer Portal' : 'Driver Portal';

  return (
    <header className="header home-nav">
      <div className="home-brand">
        <img className="home-brand-logo" src={sriLankaEmblem} alt="Sri Lanka emblem" />
        <img className="home-brand-logo" src={sriLankaPolice} alt="Sri Lanka Police" />
        <div className="home-brand-text">
          <h1>{portalName}</h1>
          <p>Traffic Fine Management System</p>
        </div>
      </div>

      <nav className="home-nav-links" aria-label="Primary navigation">
        {isAuthenticated ? (
          <>
            <Link to="/create-fine">Create Fine</Link>
            <span className="officer-info">{officer?.name} ({officer?.badgeNumber})</span>
            <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          !isAuthPage && <Link to="/login">Sign In</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;

