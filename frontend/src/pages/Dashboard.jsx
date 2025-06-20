import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For new service form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchServices = () => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/service`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch services');
        return res.json();
      })
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    fetch(`${API_BASE}/service/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete service');
        fetchServices();
      })
      .catch(err => alert(err.message));
  };

  const handleAddService = (e) => {
    e.preventDefault();
    setFormError(null);
    if (!newName.trim()) {
      setFormError('Name is required');
      return;
    }

    setFormLoading(true);
    fetch(`${API_BASE}/service`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newName.trim(),
        description: newDescription.trim(),
        state: 'active',  // default state
        serviceDate: new Date().toISOString(),
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add service');
        return res.json();
      })
      .then(() => {
        setNewName('');
        setNewDescription('');
        setShowAddForm(false);
        setFormLoading(false);
        fetchServices();
      })
      .catch(err => {
        setFormError(err.message);
        setFormLoading(false);
      });
  };

  if (loading) return <p className="loading">Loading services...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <section className="dashboard">
      <h2>Available Services</h2>

      {!showAddForm && (
        <button className="btn-add" onClick={() => setShowAddForm(true)}>
          ➕ Add New Service
        </button>
      )}

      {showAddForm && (
        <form className="add-service-form" onSubmit={handleAddService}>
          <div>
            <label>
              Name*:{' '}
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
                disabled={formLoading}
              />
            </label>
          </div>
          <div>
            <label>
              Description:{' '}
              <input
                type="text"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                disabled={formLoading}
              />
            </label>
          </div>
          {formError && <p className="error">{formError}</p>}
          <div className="form-buttons">
            <button type="submit" disabled={formLoading}>Add Service</button>
            <button type="button" disabled={formLoading} onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <ul className="service-list">
          {services.map(service => (
            <li key={service.id} className="service-item">
              <Link to={`/service/${service.id}`} className="service-link">
                <div className="service-name">{service.name || service.id}</div>
                <div className={`service-state state-${service.state.toLowerCase()}`}>
                  {service.state}
                </div>
              </Link>
              <button
                className="btn-delete"
                onClick={() => handleDelete(service.id)}
                title="Delete this service"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
