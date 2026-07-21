import React, { useState } from 'react';
import { Dices, ArrowDown, ArrowUp } from 'lucide-react';

export default function DiceGame({ user, setUser }) {
  const [bet, setBet] = useState(100);
  const [chance, setChance] = useState(50);
  const [condition, setCondition] = useState('under'); // 'under' or 'over'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const targetNumber = condition === 'under' ? chance : (100 - chance);
  const multiplier = (99 / chance).toFixed(2);

  const handlePlay = async () => {
    if (bet <= 0 || chance < 1 || chance > 98) return;
    setLoading(true);
    setResult(null);

    const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3030';
    try {
      const res = await fetch(`${API_URL}/api/game/dice/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bet, chance, condition })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setResult(data);
        setUser({ ...user, balance: data.newBalance });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error connecting to server');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3 bg-casino-slate/80 backdrop-blur-md p-8 rounded-[30px] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        
        <div>
          <h2 className="text-3xl font-black mb-8 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 tracking-tight">
            <Dices className="w-8 h-8 mr-3 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" /> 
            CYBER DICE
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
                  disabled={loading}
                  className="w-full bg-transparent border-b-2 border-casino-gold/30 pl-8 py-2 text-2xl font-black text-white focus:border-casino-gold outline-none disabled:opacity-50 transition-colors font-mono"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setCondition('under')}
                className={`flex-1 flex justify-center items-center py-4 rounded-2xl border-2 transition-all font-black tracking-wider ${condition === 'under' ? 'bg-purple-600 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white' : 'bg-black/40 border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'}`}
              >
                <ArrowDown className="w-5 h-5 mr-1" /> ROLL UNDER
              </button>
              <button
                onClick={() => setCondition('over')}
                className={`flex-1 flex justify-center items-center py-4 rounded-2xl border-2 transition-all font-black tracking-wider ${condition === 'over' ? 'bg-purple-600 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white' : 'bg-black/40 border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'}`}
              >
                <ArrowUp className="w-5 h-5 mr-1" /> ROLL OVER
              </button>
            </div>

            <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">Win Chance</span>
                <span className="text-3xl font-black text-purple-400 font-mono">{chance}%</span>
              </div>
              
              <input 
                type="range" 
                min="1" max="98"
                value={chance}
                onChange={(e) => setChance(Number(e.target.value))}
                disabled={loading}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              
              <div className="flex justify-between text-sm text-gray-400 mt-4 font-bold tracking-wide">
                <span className="bg-white/5 px-3 py-1 rounded-lg">Target: {condition === 'under' ? `< ${targetNumber}` : `> ${targetNumber}`}</span>
                <span className="bg-white/5 px-3 py-1 rounded-lg text-casino-gold">Payout: {multiplier}x</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handlePlay} 
          disabled={loading}
          className="w-full py-5 rounded-2xl font-black tracking-widest text-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-400/50"
        >
          {loading ? 'ROLLING...' : 'ROLL DICE'}
        </button>
      </div>

      <div className="w-full md:w-2/3 flex flex-col justify-center items-center bg-black rounded-[30px] border border-white/10 p-8 min-h-[500px] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #a855f7 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
        
        {result ? (
          <div className="text-center animate-in zoom-in duration-300 z-10 p-10 bg-black/60 backdrop-blur-md rounded-[30px] border border-white/10 shadow-2xl min-w-[300px]">
            <div className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-4">Roll Result</div>
            <div className={`text-9xl font-black font-mono mb-6 tracking-tighter ${result.isWin ? 'neon-text-green text-green-400' : 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
              {result.roll.toFixed(2)}
            </div>
            
            <div className="text-2xl font-black tracking-wider">
              {result.isWin ? (
                <div className="text-neon-green">
                  +{result.winAmount.toLocaleString()} WON
                </div>
              ) : (
                <div className="text-red-500">
                  CRASHED
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center opacity-20 z-10 animate-float">
            <Dices className="w-48 h-48 mx-auto mb-6 text-purple-500" />
            <p className="text-2xl font-black tracking-widest">AWAITING ROLL...</p>
          </div>
        )}
      </div>
    </div>
  );
}
