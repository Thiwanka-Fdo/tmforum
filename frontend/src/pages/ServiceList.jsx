import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ServiceList.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, serviceId: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/service`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/service/${deleteModal.serviceId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      setServices(services.filter(s => s.id !== deleteModal.serviceId));
      setDeleteModal({ isOpen: false, serviceId: null });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="service-list">
      <h2>Service List</h2>
      <div className="service-grid">
        {services.length === 0 ? (
          <p>No services found</p>
        ) : (
          services.map(service => (
            <div key={service.id} className="service-card">
              <h3>{service.name || service.id}</h3>
              <p><strong>State:</strong> {service.state}</p>
              <p><strong>Type:</strong> {service['@type']}</p>
              <div className="buttons">
                <Link to={`/service/${service.id}`} className="view-btn">View</Link>
                <button
                  className="delete-btn"
                  onClick={() => setDeleteModal({ isOpen: true, serviceId: service.id })}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this service?</p>
            <div className="modal-buttons">
              <button className="destructive" onClick={handleDelete}>Delete</button>
              <button className="cancel" onClick={() => setDeleteModal({ isOpen: false, serviceId: null })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceList;