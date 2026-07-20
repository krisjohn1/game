import React, { useState } from 'react';
import { Rocket, History } from 'lucide-react';

export default function CrashGame({ user, setUser }) {
  const [bet, setBet] = useState(100);
  const [targetMultiplier, setTargetMultiplier] = useState(2.0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [liveMultiplier, setLiveMultiplier] = useState(1.0);
  const [isRunning, setIsRunning] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030';

  const handlePlay = async () => {
    if (bet <= 0 || targetMultiplier <= 1.0) return;
    setLoading(true);
    setResult(null);
    setIsRunning(true);
    setLiveMultiplier(1.0);

    try {
      const res = await fetch(`${API_URL}/api/game/crash/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bet, targetMultiplier })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Visual animation simulation before showing result
        const animDuration = Math.min(2000 + data.crashPoint * 200, 5000); // Max 5s anim
        let startTime = Date.now();
        
        const animate = () => {
          const now = Date.now();
          const elapsed = now - startTime;
          if (elapsed < animDuration) {
            const currentMult = 1.0 + (data.crashPoint - 1.0) * (elapsed / animDuration);
            setLiveMultiplier(currentMult);
            requestAnimationFrame(animate);
          } else {
            setLiveMultiplier(data.crashPoint);
            setResult(data);
            setIsRunning(false);
            setUser({ ...user, balance: data.newBalance });
            setHistory(prev => [data.crashPoint, ...prev].slice(0, 10));
            setLoading(false);
          }
        };
        requestAnimationFrame(animate);
      } else {
        alert(data.error);
        setLoading(false);
        setIsRunning(false);
      }
    } catch (err) {
      alert('Error connecting to server');
      setLoading(false);
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Play Panel */}
      <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Rocket className="mr-2 text-blue-400" /> Crash
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Bet Amount</label>
            <input 
              type="number" 
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={loading || isRunning}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-1">Target Auto-Cashout</label>
            <div className="relative">
              <input 
                type="number" 
                step="0.1"
                min="1.01"
                value={targetMultiplier}
                onChange={(e) => setTargetMultiplier(Number(e.target.value))}
                disabled={loading || isRunning}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="absolute right-4 top-3 text-gray-500 font-bold">x</span>
            </div>
          </div>

          <button 
            onClick={handlePlay} 
            disabled={loading || isRunning}
            className="w-full py-4 rounded-xl font-bold text-lg text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/25"
          >
            {isRunning ? 'FLYING...' : 'PLACE BET'}
          </button>
        </div>
      </div>

      {/* Game Display */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        {/* Graph Area */}
        <div className={`relative h-64 md:h-96 rounded-2xl border overflow-hidden flex items-center justify-center transition-all ${result ? (result.isWin ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10') : 'border-gray-700 bg-gray-800'}`}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="text-center z-10">
            <div className={`text-7xl font-black font-mono transition-colors ${result ? (result.isWin ? 'text-green-400' : 'text-red-500') : 'text-white'}`}>
              {liveMultiplier.toFixed(2)}x
            </div>
            {result && (
              <div className="mt-4 text-xl font-bold">
                {result.isWin ? (
                  <span className="text-green-400">You won {result.winAmount.toLocaleString()}!</span>
                ) : (
                  <span className="text-red-500">Crashed! You lost {bet}</span>
                )}
              </div>
            )}
          </div>
          
          {isRunning && (
            <div className="absolute bottom-10 left-10 text-blue-400 animate-bounce">
              <Rocket className="w-12 h-12 transform rotate-45" />
            </div>
          )}
        </div>

        {/* History */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-2 overflow-x-auto">
          <History className="text-gray-400 w-5 h-5 flex-shrink-0" />
          {history.map((h, i) => (
            <span key={i} className={`px-3 py-1 rounded-full text-sm font-bold flex-shrink-0 ${h >= 2.0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {h.toFixed(2)}x
            </span>
          ))}
          {history.length === 0 && <span className="text-gray-500 text-sm">No history yet</span>}
        </div>
      </div>
    </div>
  );
}
