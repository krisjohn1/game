import React, { useState, useEffect } from 'react';
import { Settings, Users, Save, Shield } from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030';

  const fetchAdminData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      
      const [usersRes, settingsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/users`, { headers }),
        fetch(`${API_URL}/api/admin/settings`, { headers })
      ]);
      
      if (usersRes.ok) setUsers(await usersRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
    } catch (err) {
      alert('Failed to load admin data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateSetting = async (key, value) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ key, value })
      });
      if (res.ok) {
        setSettings({ ...settings, [key]: value });
        alert('Setting saved!');
      } else {
        alert('Failed to save setting');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const handleUpdateRTP = async (userId, rtp) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/rtp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rtp })
      });
      if (res.ok) {
        alert('User RTP updated!');
        fetchAdminData();
      } else {
        alert('Failed to update RTP');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  if (loading) return <div className="text-center p-12">Loading Admin Panel...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex items-center text-3xl font-bold mb-8">
        <Shield className="w-8 h-8 mr-3 text-red-500" />
        Admin Control Panel
      </div>

      {/* Global Settings */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-200">
          <Settings className="w-5 h-5 mr-2" /> Global Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
            <label className="block text-gray-400 text-sm mb-2">Global Slot RTP (%)</label>
            <div className="flex gap-2">
              <input 
                type="number"
                value={settings['slot_rtp'] || 25}
                onChange={(e) => setSettings({...settings, 'slot_rtp': e.target.value})}
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg p-2 text-white outline-none focus:border-purple-500"
              />
              <button 
                onClick={() => handleUpdateSetting('slot_rtp', settings['slot_rtp'])}
                className="bg-purple-600 hover:bg-purple-500 px-4 rounded-lg flex items-center text-sm font-bold transition-colors"
              >
                <Save className="w-4 h-4 mr-1" /> Save
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Applies to all users unless they have a specific RTP override.</p>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-200">
          <Users className="w-5 h-5 mr-2" /> User Management
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 text-gray-400 text-sm">
                <th className="p-4 rounded-tl-xl">ID</th>
                <th className="p-4">Username</th>
                <th className="p-4">Role</th>
                <th className="p-4">Balance</th>
                <th className="p-4 rounded-tr-xl w-64">Custom RTP Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-750 transition-colors">
                  <td className="p-4 text-gray-400">#{u.id}</td>
                  <td className="p-4 font-bold text-white">{u.username}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-yellow-400">{u.balance.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        placeholder="Default"
                        defaultValue={u.rtp === null ? '' : u.rtp}
                        onBlur={(e) => {
                          if (e.target.value !== String(u.rtp === null ? '' : u.rtp)) {
                            handleUpdateRTP(u.id, e.target.value);
                          }
                        }}
                        className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none focus:border-purple-500 text-sm"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
