import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

export default function BigWinCelebration({ amount, onClose }) {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    // Generate random falling coins
    const newCoins = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw',
      animationDuration: (Math.random() * 2 + 2) + 's',
      animationDelay: (Math.random() * 1) + 's',
      size: Math.random() * 20 + 20 + 'px'
    }));
    setCoins(newCoins);

    // Play big win sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed', e));

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
      audio.pause();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-500"></div>
      
      {/* Falling Coins */}
      {coins.map(coin => (
        <div 
          key={coin.id}
          className="absolute top-[-10vh] rounded-full bg-yellow-400 border-2 border-yellow-200 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-[fall_linear_forwards]"
          style={{
            left: coin.left,
            width: coin.size,
            height: coin.size,
            animationDuration: coin.animationDuration,
            animationDelay: coin.animationDelay
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center animate-in zoom-in slide-in-from-bottom-10 duration-700 spring">
        <div className="relative">
          <div className="absolute inset-0 blur-[100px] bg-casino-gold/50 rounded-full animate-pulse-glow"></div>
          <Trophy className="w-48 h-48 text-casino-gold drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] mb-4 animate-bounce" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-300 to-yellow-600 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] tracking-tighter mb-4 animate-[pulse_1s_ease-in-out_infinite]">
          BIG WIN!
        </h1>
        
        <div className="bg-black/60 backdrop-blur-md px-10 py-4 rounded-3xl border-2 border-casino-gold shadow-[0_0_30px_rgba(251,191,36,0.5)]">
          <span className="text-4xl md:text-5xl font-black font-mono text-white tracking-widest">
            +${amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </span>
        </div>
      </div>
      
      {/* Custom keyframes injected inline for the fall animation */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
