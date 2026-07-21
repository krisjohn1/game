import React, { useState, useEffect } from 'react';
import { Cherry, Sparkles, Play } from 'lucide-react';
import BigWinCelebration from '../components/BigWinCelebration';

export default function SlotGame({ user, setUser }) {
  const [bet, setBet] = useState(100);
  const [loading, setLoading] = useState(false);
  const [grid, setGrid] = useState(Array(49).fill('❓'));
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [showBigWin, setShowBigWin] = useState(false);
  const [bigWinAmount, setBigWinAmount] = useState(0);

  const spinSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');

  const handleSpin = async () => {
    if (bet <= 0 || loading || animating) return;
    if ((user.free_spins || 0) <= 0 && user.balance < bet) return alert("Insufficient balance");
    
    setLoading(true);
    setResult(null);
    spinSound.play().catch(e => console.log(e));

    const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3030';
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
        const clusterSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
        clusterSound.play().catch(e => console.log(e));
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

    if (data.totalWinAmount >= bet * 5) {
      setBigWinAmount(data.totalWinAmount);
      setShowBigWin(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3 bg-casino-slate/80 backdrop-blur-md p-8 rounded-[30px] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-pink to-transparent"></div>
        
        <div>
          <h2 className="text-3xl font-black mb-8 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-neon-pink to-purple-500 tracking-tight">
            <Cherry className="w-8 h-8 mr-3 text-neon-pink drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]" /> 
            NEON SLOTS
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
                  disabled={loading || animating || (user.free_spins > 0)}
                  className="w-full bg-transparent border-b-2 border-casino-gold/30 pl-8 py-2 text-2xl font-black text-white focus:border-casino-gold outline-none disabled:opacity-50 transition-colors font-mono"
                />
              </div>
            </div>
            
            {user.free_spins > 0 && (
              <div className="bg-gradient-to-br from-neon-pink/20 to-purple-500/10 border border-neon-pink/40 rounded-2xl p-5 animate-pulse-glow">
                <div className="flex items-center text-neon-pink font-black tracking-wider mb-2">
                  <Sparkles className="w-5 h-5 mr-2" />
                  FREE SPINS ACTIVE
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-white font-medium">Left: <span className="text-2xl font-black">{user.free_spins}</span></div>
                  <div className="text-casino-gold font-mono font-bold">Win: ${user.free_spin_total_win?.toLocaleString() || 0}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleSpin} 
          disabled={loading || animating}
          className="w-full py-5 flex items-center justify-center rounded-2xl font-black tracking-widest text-xl text-black bg-gradient-to-r from-casino-gold via-yellow-200 to-casino-gold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)]"
        >
          {loading || animating ? 'SPINNING...' : (user.free_spins > 0 ? 'FREE SPIN' : 'SPIN')}
          {!(loading || animating) && <Play className="w-6 h-6 ml-3 fill-current" />}
        </button>

        {result && !animating && (
          <div className="mt-8 text-center animate-in zoom-in duration-300">
            {result.totalWinAmount > 0 ? (
              <div className="bg-green-500/10 p-5 rounded-2xl border border-neon-green/30 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                <div className="font-black tracking-widest text-neon-green mb-1">MEGA WIN</div>
                <div className="text-4xl font-black neon-text-green text-green-400 font-mono">${result.totalWinAmount.toLocaleString()}</div>
                <div className="text-sm text-green-200 mt-2 font-bold">{result.totalMultiplier}x Multiplier Hit</div>
              </div>
            ) : (
              <div className="text-gray-500 font-medium bg-black/30 py-3 rounded-xl">Try again!</div>
            )}
            
            {result.freeSpinsAwarded > 0 && (
              <div className="mt-3 text-neon-pink font-black flex items-center justify-center animate-bounce">
                <Sparkles className="w-5 h-5 mr-2" /> +{result.freeSpinsAwarded} Free Spins!
              </div>
            )}
            {result.freeSpinsFinished && (
              <div className="mt-3 text-casino-gold font-black bg-casino-gold/10 p-3 rounded-xl border border-casino-gold/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                FS Finished! Total Win: ${result.finalFsTotalWin.toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full md:w-2/3 bg-black rounded-[20px] md:rounded-[30px] p-4 md:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden flex items-center justify-center min-h-[350px] md:min-h-[500px]">
        {/* Luxury Machine Border Inner */}
        <div className="absolute inset-2 border-2 border-casino-gold/20 rounded-[14px] md:rounded-[22px] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #ec4899 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2 relative z-10 w-full max-w-2xl mx-auto p-2 md:p-4 bg-gray-900/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/5 shadow-inner">
          {grid.map((symbol, index) => (
            <div 
              key={index} 
              className={`aspect-square flex items-center justify-center text-xl sm:text-3xl md:text-5xl bg-black rounded-md md:rounded-xl shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] border border-white/10 transition-all duration-300 ${symbol === '🌟' ? 'animate-pulse drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] border-neon-pink/50' : ''}`}
            >
              <div className={animating ? "animate-bounce" : ""}>{symbol}</div>
            </div>
          ))}
        </div>
      </div>

      {showBigWin && (
        <BigWinCelebration 
          amount={bigWinAmount} 
          onClose={() => setShowBigWin(false)} 
        />
      )}
    </div>
  );
}
