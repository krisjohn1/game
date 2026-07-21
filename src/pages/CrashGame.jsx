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

  const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3030';

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
    <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3 bg-casino-slate/80 backdrop-blur-md p-8 rounded-[30px] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"></div>
        
        <div>
          <h2 className="text-3xl font-black mb-8 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-blue-500 tracking-tight">
            <Rocket className="w-8 h-8 mr-3 text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" /> 
            SPACE CRASH
          </h2>
          
          <div className="space-y-6 mb-8">
            <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
              <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Bet Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-casino-gold font-bold">$</span>
                <input 
                  type="number" 
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  disabled={loading || isRunning}
                  className="w-full bg-transparent border-b-2 border-casino-gold/30 pl-8 py-2 text-2xl font-black text-white focus:border-casino-gold outline-none disabled:opacity-50 transition-colors font-mono"
                />
              </div>
            </div>
            
            <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
              <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Auto Cashout</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  min="1.01"
                  value={targetMultiplier}
                  onChange={(e) => setTargetMultiplier(Number(e.target.value))}
                  disabled={loading || isRunning}
                  className="w-full bg-transparent border-b-2 border-neon-cyan/30 py-2 text-2xl font-black text-white focus:border-neon-cyan outline-none disabled:opacity-50 transition-colors font-mono"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-neon-cyan font-black text-xl">x</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handlePlay} 
          disabled={loading || isRunning}
          className="w-full py-5 rounded-2xl font-black tracking-widest text-xl text-black bg-gradient-to-r from-neon-cyan via-blue-300 to-neon-cyan hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)]"
        >
          {isRunning ? 'FLYING...' : 'PLACE BET'}
        </button>
      </div>

      <div className="w-full md:w-2/3 flex flex-col gap-6">
        <div className={`relative h-64 md:h-[450px] rounded-[30px] border-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center transition-all duration-300 ${result ? (result.isWin ? 'border-neon-green bg-green-500/10' : 'border-red-500 bg-red-500/10') : 'border-white/10 bg-black'}`}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #00f3ff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="text-center z-10 p-8 rounded-3xl bg-black/40 backdrop-blur-sm border border-white/5">
            <div className={`text-8xl font-black font-mono transition-colors drop-shadow-xl ${result ? (result.isWin ? 'neon-text-green text-green-400' : 'text-red-500') : 'text-white'}`}>
              {liveMultiplier.toFixed(2)}x
            </div>
            {result && (
              <div className="mt-4 text-2xl font-black tracking-wider">
                {result.isWin ? (
                  <span className="text-neon-green">+{result.winAmount.toLocaleString()} WON</span>
                ) : (
                  <span className="text-red-500">CRASHED!</span>
                )}
              </div>
            )}
          </div>
          
          {isRunning && (
            <div className="absolute bottom-10 left-10 text-neon-cyan animate-float filter drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]">
              <Rocket className="w-16 h-16 transform rotate-45" />
            </div>
          )}
        </div>

        <div className="bg-black/50 backdrop-blur-md rounded-[20px] p-5 border border-white/5 flex items-center gap-3 overflow-x-auto shadow-lg">
          <History className="text-gray-400 w-6 h-6 flex-shrink-0" />
          {history.map((h, i) => (
            <span key={i} className={`px-4 py-1.5 rounded-full text-sm font-black tracking-wider flex-shrink-0 border ${h >= 2.0 ? 'bg-green-500/10 text-neon-green border-neon-green/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
              {h.toFixed(2)}x
            </span>
          ))}
          {history.length === 0 && <span className="text-gray-500 text-sm font-medium tracking-wide">Awaiting History...</span>}
        </div>
      </div>
    </div>
  );
}
