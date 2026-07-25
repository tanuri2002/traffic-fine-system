import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { fineService } from '../services/api';
import './DashboardPage.css';

function DashboardPage() {
  const { officer } = useContext(AuthContext);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchFines = async () => {
      try {
        const resp = await fineService.getMyFines();
        if (active) {
          setFines(resp?.data || []);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || err.message || 'Failed to load fines');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchFines();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {officer?.name}</h1>
          <p className="officer-details">
            Badge: <strong>{officer?.badgeNumber}</strong> | District: <strong>{officer?.district}</strong> | Role: <strong>{officer?.role}</strong>
          </p>
        </div>
        <Link to="/create-fine" className="btn-primary">
          Create New Fine
        </Link>
      </div>

      <div className="fines-section">
        <h2>Fines Issued by You</h2>

        {loading && (
          <div className="loading-spinner">
            Loading fines list...
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && fines.length === 0 && (
          <div className="empty-state">
            <p>You have not issued any traffic fines yet.</p>
            <Link to="/create-fine" className="btn-secondary">
              Issue Your First Fine
            </Link>
          </div>
        )}

        {!loading && !error && fines.length > 0 && (
          <div className="fines-table-wrapper">
            <table className="fines-table">
              <thead>
                <tr>
                  <th>Ref Number</th>
                  <th>Vehicle Number</th>
                  <th>Driver Name</th>
                  <th>Offense</th>
                  <th>Status</th>
                  <th>Date Issued</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((fine) => (
                  <tr key={fine.id || fine.referenceNumber}>
                    <td><strong>{fine.referenceNumber}</strong></td>
                    <td>{fine.vehicleNo}</td>
                    <td>{fine.driverName}</td>
                    <td>
                      {fine.category ? (
                        <span>{fine.category.title} ({fine.category.code})</span>
                      ) : (
                        <span>{fine.categoryCode || 'N/A'}</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${(fine.status || 'UNPAID').toLowerCase()}`}>
                        {fine.status || 'UNPAID'}
                      </span>
                    </td>
                    <td>
                      {fine.createdAt ? new Date(fine.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;