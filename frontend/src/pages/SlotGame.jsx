import React, { useState } from 'react';
import { Cherry, Sparkles, Play } from 'lucide-react';

export default function SlotGame({ user, setUser }) {
  const [bet, setBet] = useState(100);
  const [loading, setLoading] = useState(false);
  const [grid, setGrid] = useState(Array(49).fill('❓'));
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);

  const handleSpin = async () => {
    if (bet <= 0 || loading || animating) return;
    if ((user.free_spins || 0) <= 0 && user.balance < bet) return alert("Insufficient balance");
    
    setLoading(true);
    setResult(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030';
    try {
      const res = await fetch(`${API_URL}/api/game/slot/spin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ betAmount: bet })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        playAnimationSequence(data);
      } else {
        alert(data.error);
        setLoading(false);
      }
    } catch (err) {
      alert('Error connecting to server');
      setLoading(false);
    }
  };

  const playAnimationSequence = async (data) => {
    setAnimating(true);
    
    for (let i = 0; i < data.sequence.length; i++) {
      const step = data.sequence[i];
      setGrid(step.grid);
      
      // Flash winning clusters if any
      if (step.clusters.length > 0) {
        await new Promise(r => setTimeout(r, 600)); 
      }
      // Delay before next tumble
      await new Promise(r => setTimeout(r, 400));
    }

    setResult(data);
    setUser({ 
      ...user, 
      balance: data.newBalance, 
      free_spins: data.freeSpinsRemaining,
      free_spin_total_win: (data.freeSpinsRemaining > 0 && !data.freeSpinsFinished) ? (user.free_spin_total_win || 0) + data.totalWinAmount : 0
    });
    setAnimating(false);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-500">
            <Cherry className="mr-2 text-pink-400" /> Sweet Bonanza
          </h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Bet Amount</label>
              <input 
                type="number" 
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                disabled={loading || animating || (user.free_spins > 0)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none disabled:opacity-50"
              />
            </div>
            
            {user.free_spins > 0 && (
              <div className="bg-pink-500/20 border border-pink-500/50 rounded-lg p-4 animate-pulse">
                <div className="flex items-center text-pink-400 font-bold mb-1">
                  <Sparkles className="w-4 h-4 mr-2" />
                  FREE SPINS ACTIVE
                </div>
                <div className="text-white">Remaining: {user.free_spins}</div>
                <div className="text-yellow-400 text-sm mt-1">Total Free Spin Win: {user.free_spin_total_win?.toLocaleString() || 0}</div>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleSpin} 
          disabled={loading || animating}
          className="w-full py-4 flex items-center justify-center rounded-xl font-bold text-lg text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition-all shadow-lg"
        >
          {loading || animating ? 'SPINNING...' : (user.free_spins > 0 ? 'FREE SPIN' : 'SPIN')}
          {!(loading || animating) && <Play className="w-5 h-5 ml-2 fill-current" />}
        </button>

        {result && !animating && (
          <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {result.totalWinAmount > 0 ? (
              <div className="bg-green-500/20 text-green-400 p-4 rounded-xl border border-green-500/50">
                <div className="font-bold text-lg mb-1">WINNER!</div>
                <div className="text-2xl font-black">{result.totalWinAmount.toLocaleString()}</div>
                <div className="text-sm opacity-80 mt-1">{result.totalMultiplier}x Multiplier</div>
              </div>
            ) : (
              <div className="text-gray-500 font-medium">Better luck next time!</div>
            )}
            
            {result.freeSpinsAwarded > 0 && (
              <div className="mt-2 text-pink-400 font-bold flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-1" /> +{result.freeSpinsAwarded} Free Spins Won!
              </div>
            )}
            {result.freeSpinsFinished && (
              <div className="mt-2 text-yellow-400 font-bold bg-yellow-400/20 p-2 rounded-lg border border-yellow-400/50">
                Free Spins Finished! Total Win: {result.finalFsTotalWin.toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full md:w-2/3 bg-gray-900 rounded-2xl p-4 md:p-8 border-4 border-gray-800 shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[400px]">
        {/* Background deco */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #ec4899 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2 relative z-10 w-full max-w-lg mx-auto">
          {grid.map((symbol, index) => (
            <div 
              key={index} 
              className={`aspect-square flex items-center justify-center text-2xl md:text-4xl bg-gray-800 rounded-lg shadow-inner border border-gray-700 transition-all duration-300 ${symbol === '🌟' ? 'animate-pulse drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]' : ''}`}
            >
              <div className={animating ? "animate-bounce" : ""}>{symbol}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
