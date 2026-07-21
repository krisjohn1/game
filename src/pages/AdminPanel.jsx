import React, { useState, useEffect } from 'react';
import { Settings, Users, Save, Shield, TrendingUp, Activity, DollarSign, Crown, Coins } from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3030';

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
      console.error('Failed to load admin data', err);
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

  if (loading) return <div className="text-center p-12 text-casino-gold animate-pulse">Loading VIP Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-casino-gold to-yellow-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
        <Crown className="w-10 h-10 mr-4 text-casino-gold drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
        VIP CASINO DASHBOARD
      </div>

      {/* Fake Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border-l-4 border-l-neon-green border-y border-r border-white/5 shadow-[0_0_20px_rgba(57,255,20,0.1)] hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Today's Revenue</span>
            <DollarSign className="w-5 h-5 text-neon-green" />
          </div>
          <div className="text-3xl font-black font-mono text-white">$142,590.00</div>
          <div className="text-xs text-neon-green font-bold mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +12.5% from yesterday
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border-l-4 border-l-neon-pink border-y border-r border-white/5 shadow-[0_0_20px_rgba(236,72,153,0.1)] hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Active Players</span>
            <Users className="w-5 h-5 text-neon-pink" />
          </div>
          <div className="text-3xl font-black font-mono text-white">1,204</div>
          <div className="text-xs text-neon-pink font-bold mt-2 flex items-center">
            <Activity className="w-3 h-3 mr-1" /> 45 currently in-game
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border-l-4 border-l-casino-gold border-y border-r border-white/5 shadow-[0_0_20px_rgba(251,191,36,0.1)] hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Bets</span>
            <Coins className="w-5 h-5 text-casino-gold" />
          </div>
          <div className="text-3xl font-black font-mono text-white">45,892</div>
          <div className="text-xs text-casino-gold font-bold mt-2">In the last 24 hours</div>
        </div>

        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border-l-4 border-l-purple-500 border-y border-r border-white/5 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">House Edge</span>
            <Shield className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-black font-mono text-white">4.2%</div>
          <div className="text-xs text-purple-400 font-bold mt-2">Optimal profit margin</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Global Settings */}
        <div className="lg:col-span-1 bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-black mb-6 flex items-center text-white tracking-widest">
            <Settings className="w-6 h-6 mr-3 text-casino-gold" /> ALGORITHMS
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-900/50 p-5 rounded-2xl border border-white/5">
              <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Global Slot RTP (%)</label>
              <div className="relative flex items-center">
                <input 
                  type="number"
                  value={settings['slot_rtp'] || 25}
                  onChange={(e) => setSettings({...settings, 'slot_rtp': e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xl font-black text-white focus:border-casino-gold outline-none transition-colors font-mono"
                />
                <button 
                  onClick={() => handleUpdateSetting('slot_rtp', settings['slot_rtp'])}
                  className="absolute right-2 bg-gradient-to-r from-casino-gold to-yellow-400 hover:from-yellow-400 hover:to-casino-gold text-black px-4 py-1.5 rounded-lg text-sm font-black tracking-widest transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                >
                  APPLY
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 font-medium">Controls how often players hit the jackpot. Lower = more house profit.</p>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="lg:col-span-2 bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-black mb-6 flex items-center text-white tracking-widest">
            <Users className="w-6 h-6 mr-3 text-casino-gold" /> PLAYER DATABASE
          </h2>
          
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full min-w-[500px] text-left border-collapse bg-gray-900/30">
              <thead>
                <tr className="bg-black/50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <th className="p-4 border-b border-white/5">Player</th>
                  <th className="p-4 border-b border-white/5">Role</th>
                  <th className="p-4 border-b border-white/5 text-right">Balance</th>
                  <th className="p-4 border-b border-white/5">Target RTP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-white tracking-wide">{u.username}</div>
                      <div className="text-xs text-gray-500 font-mono">ID: #{u.id}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${u.role === 'admin' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-casino-gold font-bold text-right text-lg">
                      ${u.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </td>
                    <td className="p-4">
                      <div className="relative max-w-[120px]">
                        <input 
                          type="number"
                          placeholder="Global"
                          defaultValue={u.rtp === null ? '' : u.rtp}
                          onBlur={(e) => {
                            if (e.target.value !== String(u.rtp === null ? '' : u.rtp)) {
                              handleUpdateRTP(u.id, e.target.value);
                            }
                          }}
                          className="w-full bg-black border border-white/10 rounded-lg p-2 text-white font-mono text-sm outline-none focus:border-casino-gold transition-colors"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-500 font-bold tracking-widest">NO PLAYERS FOUND</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
