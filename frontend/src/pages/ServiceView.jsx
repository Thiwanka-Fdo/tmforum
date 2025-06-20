// src/pages/ServiceView.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ServiceView = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE}/service/${id}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch service:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!service) return <div className="text-center mt-10">Service not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{service.name}</h2>
      <p className="mb-2"><strong>Description:</strong> {service.description}</p>
      <p className="mb-2"><strong>State:</strong> {service.state}</p>
      <p className="mb-2"><strong>Service Date:</strong> {service.serviceDate}</p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Specification</h3>
      <ul className="list-disc list-inside">
        <li>ID: {service.serviceSpecification?.id}</li>
        <li>Name: {service.serviceSpecification?.name}</li>
        <li>Version: {service.serviceSpecification?.version}</li>
      </ul>

      {/* You can keep expanding this to include relationships, features, etc. */}
    </div>
  );
};

export default ServiceView;
