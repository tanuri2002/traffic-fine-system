import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './DashboardPage.css';

function DashboardPage() {
  const { officer } = useContext(AuthContext);

  const dashboardCards = [
    {
      label: 'Badge Number',
      value: officer?.badgeNumber || 'Not available',
    },
    {
      label: 'District',
      value: officer?.district || 'Not available',
    },
    {
      label: 'Role',
      value: officer?.role || 'Not available',
    },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero card-surface">
        <div className="dashboard-hero-copy">
          <span className="dashboard-kicker">Officer Portal</span>
          <h1>Welcome, {officer?.name || 'Officer'}</h1>
          <p>
            Quick access to fine creation and your active officer details. Everything you need for the current shift is
            kept in one place.
          </p>

          <div className="dashboard-hero-actions">
            <Link to="/create-fine" className="btn-primary dashboard-cta">
              Create New Fine
            </Link>
          </div>
        </div>
      </section>

      <section id="quick-overview" className="dashboard-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">Profile summary</span>
            <h2>Officer details</h2>
          </div>
          <p>Current officer information shown for quick reference.</p>
        </div>

        <div className="dashboard-grid">
          {dashboardCards.map((card) => (
            <article key={card.label} className="info-card">
              <span className="info-label">{card.label}</span>
              <strong className="info-value">{card.value}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;