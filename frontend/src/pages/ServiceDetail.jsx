import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ServiceDetail.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ServiceDetail({ setEditingService }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/service/${id}`);
        if (!response.ok) throw new Error('Failed to fetch service');
        const data = await response.json();
        setService(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/service/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      navigate('/');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeleteModal({ isOpen: false });
    }
  };

  const renderNestedObject = (obj) => {
    if (!obj || typeof obj !== 'object') return String(obj ?? 'N/A');
    return (
      <ul className="nested-list">
        {Object.entries(obj)
          .filter(([key]) => key !== 'href' && key !== '@schemaLocation')
          .map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong>{' '}
              {typeof value === 'object' ? renderNestedObject(value) : String(value ?? 'N/A')}
            </li>
          ))}
      </ul>
    );
  };

  if (loading) return <div className="service-detail">Loading...</div>;
  if (error) return <div className="service-detail error">{error}</div>;
  if (!service) return <div className="service-detail">No service found</div>;

  return (
    <div className="service-detail">
      <div className="header">
        <h2>{service.name || service.id}</h2>
        <div className="actions">
          <button
            onClick={() => {
              setEditingService({ id: service.id });
              navigate(`/edit/${service.id}`);
            }}
          >
            Edit
          </button>
          <button onClick={() => setDeleteModal({ isOpen: true })}>Delete</button>
          <button onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
      <div className="details">
        <p><strong>ID:</strong> {service.id}</p>
        <p><strong>Type:</strong> {service['@type']}</p>
        <p><strong>Name:</strong> {service.name || 'N/A'}</p>
        <p><strong>Description:</strong> {service.description || 'N/A'}</p>
        <p><strong>State:</strong> {service.state}</p>
        <p><strong>Service Date:</strong> {service.serviceDate ? new Date(service.serviceDate).toLocaleString() : 'N/A'}</p>
        <div className="section">
          <h3>Service Specification</h3>
          <p><strong>ID:</strong> {service.serviceSpecification?.id || 'N/A'}</p>
          <p><strong>Name:</strong> {service.serviceSpecification?.name || 'N/A'}</p>
          <p><strong>Version:</strong> {service.serviceSpecification?.version || 'N/A'}</p>
          <p><strong>Type:</strong> {service.serviceSpecification?.['@type'] || 'N/A'}</p>
          <p><strong>Referred Type:</strong> {service.serviceSpecification?.['@referredType'] || 'N/A'}</p>
        </div>
        <div className="section">
          <h3>Features</h3>
          {service.feature?.length > 0 ? (
            service.feature.map((feat, index) => (
              <div key={feat.id || index} className="subsection">
                <p><strong>ID:</strong> {feat.id || 'N/A'}</p>
                <p><strong>Name:</strong> {feat.name || 'N/A'}</p>
                <p><strong>Enabled:</strong> {feat.isEnabled ? 'Yes' : 'No'}</p>
                <p><strong>Type:</strong> {feat['@type'] || 'N/A'}</p>
                {feat.featureCharacteritic?.length > 0 && (
                  <div>
                    <strong>Characteristics:</strong>
                    {feat.featureCharacteritic.map((char, charIndex) => (
                      <div key={char.id || charIndex} className="nested-section">
                        <p><strong>ID:</strong> {char.id || 'N/A'}</p>
                        <p><strong>Name:</strong> {char.name || 'N/A'}</p>
                        <p><strong>Value:</strong> {String(char.value ?? 'N/A')}</p>
                        <p><strong>Value Type:</strong> {char.valueType || 'N/A'}</p>
                        <p><strong>Type:</strong> {char['@type'] || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No features available</p>
          )}
        </div>
        <div className="section">
          <h3>Service Characteristics</h3>
          {service.serviceCharacteristic?.length > 0 ? (
            service.serviceCharacteristic.map((char, index) => (
              <div key={char.id || index} className="subsection">
                <p><strong>ID:</strong> {char.id || 'N/A'}</p>
                <p><strong>Name:</strong> {char.name || 'N/A'}</p>
                <p><strong>Value:</strong> {renderNestedObject(char.value)}</p>
                <p><strong>Value Type:</strong> {char.valueType || 'N/A'}</p>
                <p><strong>Type:</strong> {char['@type'] || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>No characteristics available</p>
          )}
        </div>
        <div className="section">
          <h3>Service Relationships</h3>
          {service.serviceRelationship?.length > 0 ? (
            service.serviceRelationship.map((rel, index) => (
              <div key={rel.id || index} className="subsection">
                <p><strong>Relationship Type:</strong> {rel.relationshipType || 'N/A'}</p>
                <p><strong>Service ID:</strong> {rel.service?.id || 'N/A'}</p>
                <p><strong>Service Name:</strong> {rel.service?.name || 'N/A'}</p>
                <p><strong>Type:</strong> {rel['@type'] || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>No relationships available</p>
          )}
        </div>
        <div className="section">
          <h3>Related Parties</h3>
          {service.relatedParty?.length > 0 ? (
            service.relatedParty.map((party, index) => (
              <div key={party.id || index} className="subsection">
                <p><strong>Role:</strong> {party.role || 'N/A'}</p>
                <p><strong>Party ID:</strong> {party.partyOrPartyRole?.id || 'N/A'}</p>
                <p><strong>Party Name:</strong> {party.partyOrPartyRole?.name || 'N/A'}</p>
                <p><strong>Type:</strong> {party['@type'] || 'N/A'}</p>
                <p><strong>Referred Type:</strong> {party.partyOrPartyRole?.['@referredType'] || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>No related parties available</p>
          )}
        </div>
        <div className="section">
          <h3>Places</h3>
          {service.place?.length > 0 ? (
            service.place.map((place, index) => (
              <div key={place.id || index} className="subsection">
                <p><strong>Role:</strong> {place.role || 'N/A'}</p>
                <p><strong>Place ID:</strong> {place.place?.id || 'N/A'}</p>
                <p><strong>Place Name:</strong> {place.place?.name || 'N/A'}</p>
                <p><strong>Type:</strong> {place['@type'] || 'N/A'}</p>
                <p><strong>Referred Type:</strong> {place.place?.['@referredType'] || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>No places available</p>
          )}
        </div>
        <div className="section">
          <h3>Notes</h3>
          {service.note?.length > 0 ? (
            service.note.map((note, index) => (
              <div key={note.id || index} className="subsection">
                <p><strong>ID:</strong> {note.id || 'N/A'}</p>
                <p><strong>Author:</strong> {note.author || 'N/A'}</p>
                <p><strong>Date:</strong> {note.date ? new Date(note.date).toLocaleString() : 'N/A'}</p>
                <p><strong>Text:</strong> {note.text || 'N/A'}</p>
                <p><strong>Type:</strong> {note['@type'] || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>No notes available</p>
          )}
        </div>
      </div>

      {deleteModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this service?</p>
            <div className="modal-buttons">
              <button className="destructive" onClick={handleDelete}>Delete</button>
              <button className="cancel" onClick={() => setDeleteModal({ isOpen: false })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceDetail;