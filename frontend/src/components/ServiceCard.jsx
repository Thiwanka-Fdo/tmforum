import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <Link to={`/service/${service.id}`}>
      <div className="bg-white hover:bg-blue-50 transition p-4 shadow-lg rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold">{service.name}</h2>
        <p className="text-sm text-gray-500">{service.description}</p>
        <div className="mt-2 text-xs text-blue-600">{service.state}</div>
      </div>
    </Link>
  );
}
