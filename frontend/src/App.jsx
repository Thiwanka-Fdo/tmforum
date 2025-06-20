import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ServiceDetails from './pages/ServiceDetails';
import AddService from './pages/AddService';

export default function App() {
  return (
    <div className="app-container">
      <header>
        <h1>🌐 Service Inventory Dashboard</h1>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/add-service" element={<AddService />} />
        </Routes>
      </main>

      <footer>
        <p>© 2025 TMF Forum Demo</p>
      </footer>
    </div>
  );
}
