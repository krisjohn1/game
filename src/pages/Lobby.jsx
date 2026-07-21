import React from 'react';
import { Link } from 'react-router-dom';
import { Dices, Rocket, Cherry } from 'lucide-react';

export default function Lobby() {
  const games = [
    {
      id: 'slot',
      name: 'NEON SLOTS',
      path: '/slot',
      image: '/images/slot.png',
      color: 'from-neon-pink to-purple-600',
      shadow: 'shadow-[0_0_30px_rgba(255,0,255,0.3)]',
      border: 'border-neon-pink/50',
      description: 'Spin the reels of fortune.'
    },
    {
      id: 'crash',
      name: 'SPACE CRASH',
      path: '/crash',
      image: '/images/crash.png',
      color: 'from-neon-cyan to-blue-600',
      shadow: 'shadow-[0_0_30px_rgba(0,243,255,0.3)]',
      border: 'border-neon-cyan/50',
      description: 'Ride the multiplier rocket.'
    },
    {
      id: 'dice',
      name: 'CYBER DICE',
      path: '/dice',
      image: '/images/dice.png',
      color: 'from-purple-500 to-indigo-600',
      shadow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      border: 'border-purple-500/50',
      description: 'Roll the glowing cubes.'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] pt-10">
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 blur-[100px] bg-casino-gold/20 -z-10 rounded-full"></div>
        <h1 className="text-6xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-100 to-casino-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
          VIP CASINO LOUNGE
        </h1>
        <p className="text-gray-300 text-xl font-light tracking-wide uppercase">Experience The Next Generation of Betting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl px-6">
        {games.map(game => (
          <Link 
            key={game.id} 
            to={game.path}
            className={`group relative h-96 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 hover:scale-105 hover:z-10 ${game.shadow} hover:${game.border}`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${game.image})` }}
            />
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-casino-dark via-casino-dark/80 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h3 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {game.name}
              </h3>
              <p className="text-gray-300 font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                {game.description}
              </p>

              <div className={`mt-6 overflow-hidden rounded-xl h-12 relative w-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${game.color} animate-pulse-glow`}></div>
                <div className="absolute inset-[2px] bg-casino-dark rounded-[10px] flex items-center justify-center">
                  <span className={`font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${game.color}`}>
                    PLAY NOW
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
