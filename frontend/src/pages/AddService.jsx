import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AddService() {
  const navigate = useNavigate();

  // Main fields
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [state, setState] = useState('active');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().slice(0, 10));

  // serviceSpecification (simple object)
  const [specId, setSpecId] = useState('');
  const [specName, setSpecName] = useState('');
  const [specVersion, setSpecVersion] = useState('');

  // For simplicity, we will allow one feature (array) with one characteristic
  const [featureName, setFeatureName] = useState('');
  const [featureIsEnabled, setFeatureIsEnabled] = useState(true);
  const [featureCharacteristicName, setFeatureCharacteristicName] = useState('');
  const [featureCharacteristicValue, setFeatureCharacteristicValue] = useState('');

  // error and loading states
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Compose the service object based on your schema
    const servicePayload = {
      id: id || String(Date.now()),
      '@type': 'Service',
      name,
      description,
      state,
      serviceDate: new Date(serviceDate).toISOString(),
      serviceSpecification: {
        id: specId || 'spec-001',
        name: specName,
        version: specVersion,
        '@type': 'ServiceSpecification',
        '@referredType': 'ServiceSpecification',
      },
      feature: featureName
        ? [{
            id: 'feature-001',
            '@type': 'Feature',
            name: featureName,
            isEnabled: featureIsEnabled,
            featureCharacteritic: featureCharacteristicName
              ? [{
                  id: 'feature-char-001',
                  name: featureCharacteristicName,
                  value: featureCharacteristicValue,
                  valueType: typeof featureCharacteristicValue,
                  '@type': 'FeatureCharacteristic',
                }]
              : [],
          }]
        : [],
      serviceCharacteristic: [],
      serviceRelationship: [],
      relatedParty: [],
      place: [],
      note: [],
    };

    try {
      const res = await fetch(`${API_BASE}/service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicePayload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add service');
      }
      alert('Service added successfully!');
      navigate('/'); // redirect to dashboard or home
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="add-service">
      <h2>Add New Service</h2>
      <form onSubmit={handleSubmit} className="service-form">
        <fieldset>
          <legend>Main Info</legend>
          <label>
            ID (optional): <input type="text" value={id} onChange={e => setId(e.target.value)} />
          </label>
          <label>
            Name*: <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </label>
          <label>
            Description: <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
          </label>
          <label>
            State: 
            <select value={state} onChange={e => setState(e.target.value)}>
              <option value="active">Active</option>
              <option value="planned">Planned</option>
              <option value="terminated">Terminated</option>
            </select>
          </label>
          <label>
            Service Date: <input type="date" value={serviceDate} onChange={e => setServiceDate(e.target.value)} />
          </label>
        </fieldset>

        <fieldset>
          <legend>Service Specification</legend>
          <label>
            Spec ID: <input type="text" value={specId} onChange={e => setSpecId(e.target.value)} />
          </label>
          <label>
            Spec Name: <input type="text" value={specName} onChange={e => setSpecName(e.target.value)} />
          </label>
          <label>
            Spec Version: <input type="text" value={specVersion} onChange={e => setSpecVersion(e.target.value)} />
          </label>
        </fieldset>

        <fieldset>
          <legend>Feature (optional)</legend>
          <label>
            Feature Name: <input type="text" value={featureName} onChange={e => setFeatureName(e.target.value)} />
          </label>
          <label>
            Enabled: 
            <input
              type="checkbox"
              checked={featureIsEnabled}
              onChange={e => setFeatureIsEnabled(e.target.checked)}
            />
          </label>
          <label>
            Feature Characteristic Name: <input
              type="text"
              value={featureCharacteristicName}
              onChange={e => setFeatureCharacteristicName(e.target.value)}
            />
          </label>
          <label>
            Feature Characteristic Value: <input
              type="text"
              value={featureCharacteristicValue}
              onChange={e => setFeatureCharacteristicValue(e.target.value)}
            />
          </label>
        </fieldset>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Service'}
        </button>
      </form>
    </section>
  );
}
