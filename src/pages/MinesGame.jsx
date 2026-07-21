import React, { useState, useEffect } from 'react';
import { Gem, Bomb, Target, DollarSign } from 'lucide-react';
import BigWinCelebration from '../components/BigWinCelebration';
import { useLanguage } from '../context/LanguageContext';

export default function MinesGame({ user, setUser }) {
  const [bet, setBet] = useState(100);
  const [minesCount, setMinesCount] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [grid, setGrid] = useState(Array(25).fill({ revealed: false, isMine: false }));
  const [gemsRevealed, setGemsRevealed] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [showBigWin, setShowBigWin] = useState(false);
  const [bigWinAmount, setBigWinAmount] = useState(0);
  const { t } = useLanguage();

  const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3');
  const bombSound = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');
  const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3');

  const calculateMultiplier = (mines, gems) => {
    if (gems === 0) return 1.0;
    let p = 1.0;
    for (let i = 0; i < gems; i++) {
      p = p * (25 - mines - i) / (25 - i);
    }
    return (0.99 / p);
  };

  const currentMultiplier = calculateMultiplier(minesCount, gemsRevealed).toFixed(2);
  const nextMultiplier = calculateMultiplier(minesCount, gemsRevealed + 1).toFixed(2);
  const currentWin = (bet * currentMultiplier).toFixed(2);

  const startGame = async () => {
    if (bet <= 0 || minesCount < 1 || minesCount > 24) return;
    if (!user || user.balance < bet) {
        alert(t('games.insufficientBalance'));
        return;
    }

    setLoading(true);
    
    // Call backend to deduct bet
    const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3030';
    try {
      const res = await fetch(`${API_URL}/api/game/mines/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bet: bet, winAmount: 0 }) // deduct bet initially
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setUser({ ...user, balance: data.newBalance });
        
        // Setup Grid
        let newGrid = Array(25).fill({ revealed: false, isMine: false });
        let minePositions = new Set();
        while(minePositions.size < minesCount) {
            minePositions.add(Math.floor(Math.random() * 25));
        }
        
        newGrid = newGrid.map((cell, index) => ({
            revealed: false,
            isMine: minePositions.has(index)
        }));

        setGrid(newGrid);
        setGemsRevealed(0);
        setPlaying(true);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error connecting to server');
    }
    setLoading(false);
  };

  const handleTileClick = (index) => {
    if (!playing || grid[index].revealed) return;

    const cell = grid[index];
    const newGrid = [...grid];
    newGrid[index] = { ...cell, revealed: true };
    setGrid(newGrid);

    if (cell.isMine) {
        // Game Over
        bombSound.play().catch(e => console.log(e));
        
        // Reveal all mines
        const revealedGrid = grid.map(c => c.isMine ? { ...c, revealed: true } : c);
        setGrid(revealedGrid);
        setPlaying(false);
    } else {
        // Safe Gem
        clickSound.play().catch(e => console.log(e));
        const newGemsCount = gemsRevealed + 1;
        setGemsRevealed(newGemsCount);

        // Check if player revealed all possible gems
        if (newGemsCount === 25 - minesCount) {
            handleCashout(newGemsCount);
        }
    }
  };

  const handleCashout = async (finalGems = gemsRevealed) => {
      if (!playing || finalGems === 0) return;
      setLoading(true);
      
      const finalMultiplier = calculateMultiplier(minesCount, finalGems);
      const winAmount = Math.floor(bet * finalMultiplier);

      const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3030';
      try {
        const res = await fetch(`${API_URL}/api/game/mines/result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ bet: 0, winAmount: winAmount }) // only adding win amount
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          setUser({ ...user, balance: data.newBalance });
          winSound.play().catch(e=>console.log(e));
          
          if (winAmount >= bet * 5) {
            setBigWinAmount(winAmount);
            setShowBigWin(true);
          }
          
          // Reveal the rest
          const revealedGrid = grid.map(c => ({ ...c, revealed: true }));
          setGrid(revealedGrid);
          setPlaying(false);
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
      
      {/* Controls Sidebar */}
      <div className="w-full md:w-1/3 bg-casino-slate/80 backdrop-blur-md p-8 rounded-[30px] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        
        <div>
          <h2 className="text-3xl font-black mb-8 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight uppercase">
            <Target className="w-8 h-8 mr-3 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" /> 
            {t('mines.title')}
          </h2>
          
          <div className="space-y-6 mb-8">
            <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
              <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">{t('games.betAmount')}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-casino-gold font-bold">$</span>
                <input 
                  type="number" 
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  disabled={playing || loading}
                  className="w-full bg-transparent border-b-2 border-casino-gold/30 pl-8 py-2 text-2xl font-black text-white focus:border-casino-gold outline-none disabled:opacity-50 transition-colors font-mono"
                />
              </div>
            </div>
            
            <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">{t('mines.minesCount')}</span>
                <span className="text-3xl font-black text-red-500 font-mono">{minesCount}</span>
              </div>
              
              <input 
                type="range" 
                min="1" max="24"
                value={minesCount}
                onChange={(e) => setMinesCount(Number(e.target.value))}
                disabled={playing || loading}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-50"
              />
            </div>

            {playing && (
                <div className="bg-cyan-900/20 p-5 rounded-2xl border border-cyan-500/30">
                    <div className="flex justify-between text-sm font-bold tracking-widest uppercase mb-2 text-gray-400">
                        <span>{t('mines.nextMultiplier')}</span>
                        <span className="text-cyan-400">{nextMultiplier}x</span>
                    </div>
                    <div className="text-4xl font-black font-mono text-casino-gold drop-shadow-lg text-center mt-4">
                        ${currentWin}
                    </div>
                </div>
            )}

          </div>
        </div>

        {!playing ? (
            <button 
                onClick={startGame} 
                disabled={loading}
                className="w-full py-5 rounded-2xl font-black tracking-widest text-xl text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] border border-cyan-400/50"
            >
                {loading ? t('mines.playing') : t('mines.play')}
            </button>
        ) : (
            <button 
                onClick={() => handleCashout()} 
                disabled={loading || gemsRevealed === 0}
                className="w-full py-5 rounded-2xl font-black tracking-widest text-xl text-black bg-gradient-to-r from-casino-gold to-yellow-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] border border-yellow-400/50"
            >
                {t('mines.cashout')}
            </button>
        )}
      </div>

      {/* Game Grid Area */}
      <div className="w-full md:w-2/3 flex flex-col justify-center items-center bg-black rounded-[20px] md:rounded-[30px] border border-white/10 p-4 md:p-8 min-h-[400px] md:min-h-[500px] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #06b6d4 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="grid grid-cols-5 gap-2 md:gap-4 z-10 w-full max-w-md mx-auto aspect-square">
            {grid.map((cell, index) => (
                <button
                    key={index}
                    onClick={() => handleTileClick(index)}
                    disabled={!playing || cell.revealed}
                    className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg border-b-4 
                        ${!cell.revealed 
                            ? 'bg-gray-800 border-gray-900 hover:bg-gray-700 hover:-translate-y-1 cursor-pointer' 
                            : 'bg-black/50 border-transparent shadow-inner translate-y-1 cursor-default'}`}
                >
                    {cell.revealed && (
                        <div className="animate-in zoom-in duration-200">
                            {cell.isMine ? (
                                <Bomb className="w-8 h-8 md:w-12 md:h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                            ) : (
                                <Gem className="w-8 h-8 md:w-12 md:h-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                            )}
                        </div>
                    )}
                </button>
            ))}
        </div>

        {!playing && gemsRevealed > 0 && !grid.some(c => c.isMine && c.revealed) && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-in zoom-in duration-300 z-20 p-6 md:p-10 bg-black/80 backdrop-blur-md rounded-[30px] border border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.3)] pointer-events-none">
                <div className="text-cyan-400 font-bold uppercase tracking-widest mb-2">{t('mines.youWon')}</div>
                <div className="text-5xl md:text-6xl font-black font-mono text-casino-gold mb-2">${currentWin}</div>
                <div className="text-gray-400 font-bold">{currentMultiplier}x Multiplier</div>
            </div>
        )}
        
        {!playing && grid.some(c => c.isMine && c.revealed) && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-in zoom-in duration-300 z-20 p-6 md:p-10 bg-black/80 backdrop-blur-md rounded-[30px] border border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)] pointer-events-none">
                <div className="text-3xl md:text-4xl font-black text-red-500 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">{t('mines.hitMine')}</div>
            </div>
        )}

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
