import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/service/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch service details');
        return res.json();
      })
      .then(data => {
        setService(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="loading">Loading service details...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!service) return <p>No service found.</p>;

  return (
    <section className="service-details">
      <h2>Service: {service.name || service.id}</h2>

      <table className="details-table">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{service.id}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{service.description || 'N/A'}</td>
          </tr>
          <tr>
            <th>State</th>
            <td>{service.state}</td>
          </tr>
          <tr>
            <th>Service Date</th>
            <td>{new Date(service.serviceDate).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Service Specification</th>
            <td>{service.serviceSpecification?.name || 'N/A'}</td>
          </tr>
        </tbody>
      </table>

      {service.feature && service.feature.length > 0 && (
        <>
          <h3>Features</h3>
          <ul className="feature-list">
            {service.feature.map((feat, idx) => (
              <li key={idx}>
                <strong>{feat.name}</strong> - Enabled: {feat.isEnabled ? '✅' : '❌'}
              </li>
            ))}
          </ul>
        </>
      )}

      <Link to="/" className="back-link">← Back to Dashboard</Link>
    </section>
  );
}
