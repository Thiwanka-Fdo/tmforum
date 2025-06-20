// Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold mb-4">Service Dashboard</h1>
      <nav>
        <Link to="/" className="block py-2 hover:bg-gray-700 px-2 rounded">Dashboard</Link>
      </nav>
    </div>
  );
}
