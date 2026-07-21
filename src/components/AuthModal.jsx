import React, { useState } from 'react';
import { X, Lock, User, Crown } from 'lucide-react';

export default function AuthModal({ onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3030';
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        onSuccess(data.user);
      } else {
        setIsLogin(true); // switch to login on success register
        setError('Registration successful! Please login.');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-black/60 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.2)] border border-casino-gold/30 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-casino-gold to-transparent"></div>
        
        <div className="flex justify-between items-center p-8 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-casino-gold/20 flex items-center justify-center border border-casino-gold/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              <Crown className="w-5 h-5 text-casino-gold" />
            </div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wider">
              {isLogin ? 'VIP LOGIN' : 'JOIN VIP'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-casino-gold transition-colors hover:rotate-90 duration-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          {error && (
            <div className={`p-4 rounded-xl text-sm font-bold border ${error.includes('successful') ? 'bg-green-500/10 text-neon-green border-neon-green/30 shadow-[0_0_10px_rgba(57,255,20,0.2)]' : 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]'} animate-in slide-in-from-top-2`}>
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500 group-focus-within:text-casino-gold transition-colors" />
                </div>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-casino-gold/50 focus:border-casino-gold/50 transition-all font-medium text-lg"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-casino-gold transition-colors" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-casino-gold/50 focus:border-casino-gold/50 transition-all font-medium text-lg"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-8 bg-gradient-to-r from-casino-gold via-yellow-200 to-casino-gold bg-[length:200%_auto] hover:animate-[spin-slow_2s_linear_infinite] rounded-xl font-black text-black tracking-widest text-lg shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? 'PROCESSING...' : (isLogin ? 'ENTER CASINO' : 'CREATE ACCOUNT')}
          </button>

          <div className="text-center mt-6">
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(''); setUsername(''); setPassword(''); }}
              className="text-gray-400 hover:text-white font-medium text-sm transition-colors border-b border-transparent hover:border-casino-gold pb-0.5"
            >
              {isLogin ? "Don't have an account? Register Now" : "Already a VIP? Login Here"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
