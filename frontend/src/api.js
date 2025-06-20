const BASE_URL = import.meta.env.VITE_API_BASE;

export const fetchServices = async () => {
  const res = await fetch(`${BASE_URL}/service`);
  return await res.json();
};

export const fetchServiceById = async (id) => {
  const res = await fetch(`${BASE_URL}/service/${id}`);
  return await res.json();
};

export const createService = async (service) => {
  const res = await fetch(`${BASE_URL}/service`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(service),
  });
  return await res.json();
};
