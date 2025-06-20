import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ServiceForm.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ServiceForm({ editingService }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    state: 'active',
    '@type': 'Service',
    serviceSpecification: { id: '1212', name: '', version: '1.0.0', '@type': 'ServiceSpecificationRef', '@referredType': 'ServiceSpecification' },
    feature: [],
    serviceCharacteristic: [],
    serviceRelationship: [],
    relatedParty: [],
    place: [],
    note: [],
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, action: '', message: '' });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (editingService && id) {
      const fetchService = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/service/${id}`);
          if (!response.ok) throw new Error('Failed to fetch service');
          const data = await response.json();
          setFormData({
            name: data.name || '',
            description: data.description || '',
            state: data.state || 'active',
            '@type': data['@type'] || 'Service',
            serviceSpecification: data.serviceSpecification || { id: '1212', name: '', version: '1.0.0', '@type': 'ServiceSpecificationRef', '@referredType': 'ServiceSpecification' },
            feature: data.feature || [],
            serviceCharacteristic: data.serviceCharacteristic || [],
            serviceRelationship: data.serviceRelationship || [],
            relatedParty: data.relatedParty || [],
            place: data.place || [],
            note: data.note || [],
          });
        } catch (err) {
          alert(`Error: ${err.message}`);
        }
      };
      fetchService();
    }
  }, [editingService, id]);

  const handleChange = (e, section, index, field) => {
    const { name, value } = e.target;
    if (section) {
      const updatedSection = [...formData[section]];
      if (field) {
        updatedSection[index] = { ...updatedSection[index], [field]: value };
      } else if (name.includes('.')) {
        const [parent, child] = name.split('.');
        updatedSection[index] = { ...updatedSection[index], [parent]: { ...updatedSection[index][parent], [child]: value } };
      } else {
        updatedSection[index] = { ...updatedSection[index], [name]: value };
      }
      setFormData({ ...formData, [section]: updatedSection });
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addItem = (section, defaultItem) => {
    setFormData({ ...formData, [section]: [...formData[section], defaultItem] });
  };

  const removeItem = (section, index) => {
    setFormData({ ...formData, [section]: formData[section].filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData['@type'] || !formData.serviceSpecification.id || !formData.state) {
      alert('Please fill in all required fields: Type, Specification ID, State');
      return;
    }
    setModal({
      isOpen: true,
      action: 'submit',
      message: editingService ? 'Are you sure you want to update this service?' : 'Are you sure you want to create this service?',
    });
  };

  const confirmSubmit = async () => {
    setLoading(true);
    setModal({ isOpen: false, action: '', message: '' });
    try {
      const url = editingService ? `${API_BASE_URL}/service/${id}` : `${API_BASE_URL}/service`;
      const method = editingService ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`Failed to ${editingService ? 'update' : 'create'} service`);
      navigate(editingService ? `/service/${id}` : '/');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-form">
      <h2>{editingService ? 'Edit Service' : 'Create Service'}</h2>
      <div className="form-container">
        <div className="form-group">
          <label>Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>State *</label>
          <select name="state" value={formData.state} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
        <div className="form-group">
          <label>Type *</label>
          <input type="text" name="@type" value={formData['@type']} onChange={handleChange} required />
        </div>
        <div className="section">
          <h3>Service Specification</h3>
          <div className="form-group">
            <label>Specification ID *</label>
            <input
              type="text"
              name="serviceSpecification.id"
              value={formData.serviceSpecification.id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Specification Name</label>
            <input
              type="text"
              name="serviceSpecification.name"
              value={formData.serviceSpecification.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Version</label>
            <input
              type="text"
              name="serviceSpecification.version"
              value={formData.serviceSpecification.version}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="section">
          <h3>Features</h3>
          {formData.feature.map((feat, index) => (
            <div key={index} className="subsection">
              <div className="form-group">
                <label>Feature ID</label>
                <input
                  type="text"
                  name="id"
                  value={feat.id || ''}
                  onChange={(e) => handleChange(e, 'feature', index)}
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={feat.name || ''}
                  onChange={(e) => handleChange(e, 'feature', index)}
                />
              </div>
              <div className="form-group">
                <label>Enabled</label>
                <input
                  type="checkbox"
                  name="isEnabled"
                  checked={feat.isEnabled || false}
                  onChange={(e) => handleChange({ target: { name: 'isEnabled', value: e.target.checked } }, 'feature', index)}
                />
              </div>
              <div className="form-group">
                <label>Characteristic Name</label>
                <input
                  type="text"
                  name="featureCharacteritic.0.name"
                  value={feat.featureCharacteritic?.[0]?.name || ''}
                  onChange={(e) => handleChange(e, 'feature', index)}
                />
              </div>
              <div className="form-group">
                <label>Characteristic Value</label>
                <input
                  type="text"
                  name="featureCharacteritic.0.value"
                  value={feat.featureCharacteritic?.[0]?.value || ''}
                  onChange={(e) => handleChange(e, 'feature', index)}
                />
              </div>
              <button className="remove-btn" onClick={() => removeItem('feature', index)}>Remove Feature</button>
            </div>
          ))}
          <button
            className="add-btn"
            onClick={() => addItem('feature', { id: '', name: '', isEnabled: false, featureCharacteritic: [{ id: '', name: '', value: '', valueType: 'boolean', '@type': 'BooleanCharacteristic' }], '@type': 'Feature' })}
          >
            Add Feature
          </button>
        </div>

        <div className="section">
          <h3>Service Characteristics</h3>
          {formData.serviceCharacteristic.map((char, index) => (
            <div key={index} className="subsection">
              <div className="form-group">
                <label>ID</label>
                <input
                  type="text"
                  name="id"
                  value={char.id || ''}
                  onChange={(e) => handleChange(e, 'serviceCharacteristic', index)}
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={char.name || ''}
                  onChange={(e) => handleChange(e, 'serviceCharacteristic', index)}
                />
              </div>
              <div className="form-group">
                <label>Value (JSON)</label>
                <textarea
                  name="value"
                  value={typeof char.value === 'object' ? JSON.stringify(char.value, null, 2) : char.value}
                  onChange={(e) => {
                    try {
                      handleChange({ target: { name: 'value', value: JSON.parse(e.target.value || '{}') } }, 'serviceCharacteristic', index);
                    } catch {
                      alert('Invalid JSON format');
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label>Value Type</label>
                <input
                  type="text"
                  name="valueType"
                  value={char.valueType || ''}
                  onChange={(e) => handleChange(e, 'serviceCharacteristic', index)}
                />
              </div>
              <button className="remove-btn" onClick={() => removeItem('serviceCharacteristic', index)}>Remove Characteristic</button>
            </div>
          ))}
          <button
            className="add-btn"
            onClick={() => addItem('serviceCharacteristic', { id: '', name: '', value: {}, valueType: 'object', '@type': 'ObjectCharacteristic' })}
          >
            Add Characteristic
          </button>
        </div>

        <div className="section">
          <h3>Service Relationships</h3>
          {formData.serviceRelationship.map((rel, index) => (
            <div key={index} className="subsection">
              <div className="form-group">
                <label>Relationship Type</label>
                <input
                  type="text"
                  name="relationshipType"
                  value={rel.relationshipType || ''}
                  onChange={(e) => handleChange(e, 'serviceRelationship', index)}
                />
              </div>
              <div className="form-group">
                <label>Service ID</label>
                <input
                  type="text"
                  name="service.id"
                  value={rel.service?.id || ''}
                  onChange={(e) => handleChange(e, 'serviceRelationship', index)}
                />
              </div>
              <button className="remove-btn" onClick={() => removeItem('serviceRelationship', index)}>Remove Relationship</button>
            </div>
          ))}
          <button
            className="add-btn"
            onClick={() => addItem('serviceRelationship', { relationshipType: '', service: { id: '', '@type': 'ServiceRef', '@referredType': 'Service' }, '@type': 'ServiceRelationship' })}
          >
            Add Relationship
          </button>
        </div>

        <div className="section">
          <h3>Related Parties</h3>
          {formData.relatedParty.map((party, index) => (
            <div key={index} className="subsection">
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  value={party.role || ''}
                  onChange={(e) => handleChange(e, 'relatedParty', index)}
                />
              </div>
              <div className="form-group">
                <label>Party Name</label>
                <input
                  type="text"
                  name="partyOrPartyRole.name"
                  value={party.partyOrPartyRole?.name || ''}
                  onChange={(e) => handleChange(e, 'relatedParty', index)}
                />
              </div>
              <div className="form-group">
                <label>Party ID</label>
                <input
                  type="text"
                  name="partyOrPartyRole.id"
                  value={party.partyOrPartyRole?.id || ''}
                  onChange={(e) => handleChange(e, 'relatedParty', index)}
                />
              </div>
              <button className="remove-btn" onClick={() => removeItem('relatedParty', index)}>Remove Party</button>
            </div>
          ))}
          <button
            className="add-btn"
            onClick={() => addItem('relatedParty', { role: '', partyOrPartyRole: { id: '', name: '', '@type': 'PartyRef', '@referredType': 'Individual' }, '@type': 'RelatedPartyRefOrPartyRoleRef' })}
          >
            Add Party
          </button>
        </div>

        <div className="section">
          <h3>Places</h3>
          {formData.place.map((place, index) => (
            <div key={index} className="subsection">
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  value={place.role || ''}
                  onChange={(e) => handleChange(e, 'place', index)}
                />
              </div>
              <div className="form-group">
                <label>Place Name</label>
                <input
                  type="text"
                  name="place.name"
                  value={place.place?.name || ''}
                  onChange={(e) => handleChange(e, 'place', index)}
                />
              </div>
              <div className="form-group">
                <label>Place ID</label>
                <input
                  type="text"
                  name="place.id"
                  value={place.place?.id || ''}
                  onChange={(e) => handleChange(e, 'place', index)}
                />
              </div>
              <button className="remove-btn" onClick={() => removeItem('place', index)}>Remove Place</button>
            </div>
          ))}
          <button
            className="add-btn"
            onClick={() => addItem('place', { role: '', place: { id: '', name: '', '@type': 'GeoJsonPoint', '@referredType': 'GeoJsonLineString' }, '@type': 'RelatedPlaceRefOrValue' })}
          >
            Add Place
          </button>
        </div>

        <div className="section">
          <h3>Notes</h3>
          {formData.note.map((note, index) => (
            <div key={index} className="subsection">
              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  name="author"
                  value={note.author || ''}
                  onChange={(e) => handleChange(e, 'note', index)}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={note.date ? new Date(note.date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleChange(e, 'note', index)}
                />
              </div>
              <div className="form-group">
                <label>Text</label>
                <textarea
                  name="text"
                  value={note.text || ''}
                  onChange={(e) => handleChange(e, 'note', index)}
                />
              </div>
              <button className="remove-btn" onClick={() => removeItem('note', index)}>Remove Note</button>
            </div>
          ))}
          <button
            className="add-btn"
            onClick={() => addItem('note', { id: '', author: '', date: '', text: '', '@type': 'Note' })}
          >
            Add Note
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : (editingService ? 'Update' : 'Create')}
          </button>
          <button type="button" onClick={() => navigate(editingService ? `/service/${id}` : '/')}>
            Cancel
          </button>
        </div>
      </div>

      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingService ? 'Confirm Update' : 'Confirm Creation'}</h3>
            <p>{modal.message}</p>
            <div className="modal-buttons">
              <button className="confirm" onClick={confirmSubmit}>Confirm</button>
              <button className="cancel" onClick={() => setModal({ isOpen: false, action: '', message: '' })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceForm;