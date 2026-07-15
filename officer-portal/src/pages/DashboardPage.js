import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function DashboardPage() {
  const { officer } = useContext(AuthContext);
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {officer?.name}</h1>
      <p>Badge: {officer?.badgeNumber} | District: {officer?.district} | Role: {officer?.role}</p>
      <Link to="/create-fine" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
        Create New Fine
      </Link>
    </div>
  );
}

export default DashboardPage;