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

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030';
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
    <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Dices className="mr-2 text-purple-400" /> Dice Roll
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Bet Amount</label>
            <input 
              type="number" 
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={loading}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setCondition('under')}
              className={`flex-1 flex justify-center items-center py-2 rounded-lg border transition-all ${condition === 'under' ? 'bg-purple-600 border-purple-500' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}
            >
              <ArrowDown className="w-4 h-4 mr-1" /> Roll Under
            </button>
            <button
              onClick={() => setCondition('over')}
              className={`flex-1 flex justify-center items-center py-2 rounded-lg border transition-all ${condition === 'over' ? 'bg-purple-600 border-purple-500' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}
            >
              <ArrowUp className="w-4 h-4 mr-1" /> Roll Over
            </button>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Win Chance</span>
              <span className="text-white font-bold">{chance}%</span>
            </div>
            <input 
              type="range" 
              min="1" max="98"
              value={chance}
              onChange={(e) => setChance(Number(e.target.value))}
              disabled={loading}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Target: {condition === 'under' ? `< ${targetNumber}` : `> ${targetNumber}`}</span>
              <span>Multiplier: {multiplier}x</span>
            </div>
          </div>

          <button 
            onClick={handlePlay} 
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? 'ROLLING...' : 'ROLL DICE'}
          </button>
        </div>
      </div>

      <div className="w-full md:w-2/3 flex flex-col justify-center items-center bg-gray-800 rounded-2xl border border-gray-700 p-8 min-h-[300px]">
        {result ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Result Roll</div>
            <div className={`text-8xl font-black font-mono mb-4 ${result.isWin ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
              {result.roll.toFixed(2)}
            </div>
            
            <div className="text-xl font-bold">
              {result.isWin ? (
                <div className="text-green-400 bg-green-400/10 px-6 py-2 rounded-full inline-block">
                  You Won {result.winAmount.toLocaleString()}!
                </div>
              ) : (
                <div className="text-red-500 bg-red-500/10 px-6 py-2 rounded-full inline-block">
                  You Lost {bet}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center opacity-30">
            <Dices className="w-32 h-32 mx-auto mb-4" />
            <p className="text-xl font-bold">Place a bet to roll</p>
          </div>
        )}
      </div>
    </div>
  );
}
