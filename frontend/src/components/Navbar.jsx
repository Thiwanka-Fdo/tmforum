import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-primary text-white px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xl font-bold hover:text-gray-200 transition">
          TMF638 Dashboard
        </Link>
      </div>
    </nav>
  );
}
