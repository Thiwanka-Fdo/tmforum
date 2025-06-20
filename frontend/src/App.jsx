import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ServiceList from './pages/ServiceList';
import ServiceDetail from './pages/ServiceDetail';
import ServiceForm from './pages/ServiceForm';
import './App.css';

function App() {
  const [editingService, setEditingService] = useState(null);
  const [serviceStats, setServiceStats] = useState({ total: 0, active: 0, inactive: 0, terminated: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/service`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        const stats = {
          total: data.length,
          active: data.filter(s => s.state === 'active').length,
          inactive: data.filter(s => s.state === 'inactive').length,
          terminated: data.filter(s => s.state === 'terminated').length,
        };
        setServiceStats(stats);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="app-container">
      <Navbar serviceStats={serviceStats} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-content">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} serviceStats={serviceStats} />
        <div className={`content ${sidebarOpen ? 'shifted' : ''}`}>
          <Routes>
            <Route path="/" element={<ServiceList />} />
            <Route path="/service/:id" element={<ServiceDetail setEditingService={setEditingService} />} />
            <Route path="/create" element={<ServiceForm editingService={null} />} />
            <Route path="/edit/:id" element={<ServiceForm editingService={editingService} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;