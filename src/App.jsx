import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Lobby from './pages/Lobby';
import SlotGame from './pages/SlotGame';
import CrashGame from './pages/CrashGame';
import DiceGame from './pages/DiceGame';
import AdminPanel from './pages/AdminPanel';
import AboutUs from './pages/AboutUs';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ResponsibleGaming from './pages/ResponsibleGaming';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

function App() {
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3030';
    if (token) {
      fetch(`${API_URL}/api/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUser(data);
        else localStorage.removeItem('token');
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen text-white flex flex-col font-sans">
      <Navbar user={user} onLoginClick={() => setAuthModalOpen(true)} onLogout={handleLogout} />
      
      <main className="container mx-auto p-4 pt-24 flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/slot" element={user ? <SlotGame user={user} setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/crash" element={user ? <CrashGame user={user} setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/dice" element={user ? <DiceGame user={user} setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/responsible-gaming" element={<ResponsibleGaming />} />
        </Routes>
      </main>

      {authModalOpen && (
        <AuthModal 
          onClose={() => setAuthModalOpen(false)} 
          onSuccess={(userData) => {
            setUser(userData);
            setAuthModalOpen(false);
          }} 
        />
      )}
    </div>
  );
}

export default App;
