import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dices, Rocket, Cherry, Flame, Trophy, Megaphone, MonitorPlay, ShieldCheck, Zap, Coins, ChevronRight } from 'lucide-react';

export default function Lobby() {
  const [jackpot, setJackpot] = useState(15849203.45);

  // Simulate live jackpot increment
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + (Math.random() * 100));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const games = [
    {
      id: 'slot',
      name: 'NEON SLOTS',
      path: '/slot',
      image: '/images/slot.png',
      color: 'from-neon-pink to-purple-600',
      shadow: 'shadow-[0_0_30px_rgba(255,0,255,0.3)]',
      border: 'border-neon-pink/50',
      provider: 'Pragmatic Play',
      hot: true
    },
    {
      id: 'crash',
      name: 'SPACE CRASH',
      path: '/crash',
      image: '/images/crash.png',
      color: 'from-neon-cyan to-blue-600',
      shadow: 'shadow-[0_0_30px_rgba(0,243,255,0.3)]',
      border: 'border-neon-cyan/50',
      provider: 'Spribe',
      hot: true
    },
    {
      id: 'dice',
      name: 'CYBER DICE',
      path: '/dice',
      image: '/images/dice.png',
      color: 'from-purple-500 to-indigo-600',
      shadow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      border: 'border-purple-500/50',
      provider: 'Evolution Gaming',
      hot: false
    },
    // Adding dummy games for real-world feel
    {
      id: 'dummy1',
      name: 'GATES OF OLYMPUS',
      path: '/slot',
      image: '/images/slot.png',
      color: 'from-yellow-400 to-orange-500',
      shadow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]',
      border: 'border-yellow-400/50',
      provider: 'Pragmatic Play',
      hot: true
    },
    {
      id: 'dummy2',
      name: 'MAHJONG WAYS 2',
      path: '/slot',
      image: '/images/dice.png',
      color: 'from-red-500 to-rose-700',
      shadow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]',
      border: 'border-red-500/50',
      provider: 'PG Soft',
      hot: true
    },
    {
      id: 'dummy3',
      name: 'CRAZY TIME',
      path: '/dice',
      image: '/images/crash.png',
      color: 'from-purple-400 to-pink-500',
      shadow: 'shadow-[0_0_30px_rgba(192,132,252,0.3)]',
      border: 'border-purple-400/50',
      provider: 'Evolution Gaming',
      hot: false
    }
  ];

  const categories = [
    { name: 'HOT GAMES', icon: <Flame className="w-5 h-5 text-red-500" /> },
    { name: 'SLOTS', icon: <Cherry className="w-5 h-5 text-neon-pink" /> },
    { name: 'LIVE CASINO', icon: <MonitorPlay className="w-5 h-5 text-blue-400" /> },
    { name: 'SPORTS', icon: <Trophy className="w-5 h-5 text-casino-gold" /> },
    { name: 'PROMOTIONS', icon: <Megaphone className="w-5 h-5 text-green-400" /> }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen pb-20">
      
      {/* 1. HERO BANNER CAROUSEL */}
      <div className="w-full h-[250px] md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden relative mt-4 shadow-[0_0_40px_rgba(251,191,36,0.15)] border border-white/10 group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 flex items-center px-6 md:px-20">
          <div className="max-w-2xl">
            <div className="inline-block px-3 py-1 md:px-4 md:py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 font-bold tracking-widest text-[10px] md:text-sm mb-2 md:mb-4 flex items-center w-max animate-pulse">
              <Zap className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              HOT PROMO
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-white mb-2 md:mb-4 leading-tight">
              WELCOME BONUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-casino-gold to-yellow-200">100%</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-xl mb-4 md:mb-8 max-w-lg hidden sm:block">
              Double your first deposit instantly. Experience the most trusted VIP Casino Lounge today!
            </p>
            <button className="px-6 py-2 md:px-8 md:py-4 bg-gradient-to-r from-casino-gold via-yellow-300 to-casino-gold rounded-lg md:rounded-xl text-black font-black tracking-widest text-sm md:text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(251,191,36,0.5)]">
              CLAIM NOW
            </button>
          </div>
        </div>
        {/* Placeholder for dynamic banner image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000"></div>
      </div>

      {/* 2. RUNNING TEXT (MARQUEE) */}
      <div className="w-full bg-black/50 border-y border-white/10 py-2 md:py-3 mt-4 md:mt-8 flex items-center overflow-hidden relative">
        <div className="flex items-center px-2 md:px-4 bg-black z-20 border-r border-white/10">
          <Megaphone className="w-4 h-4 md:w-5 md:h-5 text-casino-gold mr-1 md:mr-2 animate-bounce" />
          <span className="font-bold text-casino-gold whitespace-nowrap uppercase tracking-widest text-[10px] md:text-sm">Latest</span>
        </div>
        <div className="flex-1 overflow-hidden relative flex">
          <div className="animate-marquee whitespace-nowrap flex items-center text-xs md:text-sm font-medium text-gray-300">
            <span className="mx-4 md:mx-8">🌟 Congratulations to <span className="text-neon-green font-bold">Budi***</span> won <span className="text-white font-bold">$12,500</span> on NEON SLOTS!</span>
            <span className="mx-4 md:mx-8">🔥 NEW GAME: Space Crash is now LIVE! Play now and win up to 10,000x your bet.</span>
            <span className="mx-4 md:mx-8">💰 <span className="text-neon-pink font-bold">Alex***</span> just cashed out <span className="text-white font-bold">$45,000</span> on CYBER DICE!</span>
            <span className="mx-4 md:mx-8">🎁 Weekend Reload Bonus 50% is active until Sunday!</span>
          </div>
        </div>
      </div>

      {/* 3. LIVE JACKPOT TICKER */}
      <div className="w-full mt-6 md:mt-10 mb-6 flex justify-center">
        <div className="bg-gradient-to-b from-yellow-900/40 to-black p-[2px] rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.3)] mx-4 w-full md:w-auto">
          <div className="bg-black/90 px-4 py-4 md:px-10 md:py-6 rounded-2xl border border-casino-gold/20 flex flex-col items-center">
            <span className="text-casino-gold text-[10px] md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase mb-2 flex items-center text-center">
              <Trophy className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Global Progressive Jackpot
            </span>
            <span className="text-3xl sm:text-5xl md:text-7xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-casino-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] tracking-wider">
              ${jackpot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 4. CATEGORY MENU */}
      <div className="w-full flex overflow-x-auto gap-4 py-4 mb-8 hide-scrollbar">
        {categories.map((cat, i) => (
          <button key={i} className="flex-shrink-0 flex items-center bg-gray-900/80 backdrop-blur border border-white/5 hover:border-casino-gold/50 px-6 py-4 rounded-xl transition-all hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(251,191,36,0.15)] group">
            <div className="group-hover:scale-110 transition-transform">{cat.icon}</div>
            <span className="ml-3 font-bold text-gray-300 group-hover:text-white tracking-widest text-sm">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 5. GAMES GRID */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-black flex items-center text-white">
          <Flame className="text-red-500 mr-2 w-6 h-6" /> HOT GAMES
        </h2>
        <button className="text-sm font-bold text-gray-400 hover:text-casino-gold flex items-center">
          VIEW ALL <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 w-full mb-20">
        {games.map(game => (
          <Link 
            key={game.id} 
            to={game.path}
            className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:scale-[1.03] hover:z-10 ${game.shadow} hover:${game.border}`}
          >
            {game.hot && (
              <div className="absolute top-2 left-2 z-20 bg-red-600 px-2 py-1 rounded text-[10px] font-black tracking-wider shadow-lg flex items-center">
                <Flame className="w-3 h-3 mr-1" /> HOT
              </div>
            )}
            <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur rounded-full p-1 border border-white/10 text-[10px] text-gray-300 px-2 font-bold">
              {game.provider}
            </div>

            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${game.image})` }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
            
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <h3 className="text-lg md:text-xl font-black text-white leading-tight tracking-tight drop-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {game.name}
              </h3>

              <div className={`mt-3 overflow-hidden rounded-lg h-10 relative w-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${game.color} animate-pulse-glow`}></div>
                <div className="absolute inset-[1px] bg-black rounded-[7px] flex items-center justify-center">
                  <span className={`font-bold tracking-widest text-sm text-transparent bg-clip-text bg-gradient-to-r ${game.color}`}>
                    PLAY
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 6. REALISTIC FOOTER */}
      <footer className="w-full bg-black/80 border-t border-white/10 pt-10 md:pt-16 pb-8 mt-10 rounded-t-[30px] md:rounded-t-[40px] px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4 md:mb-6 group">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-casino-gold/50 shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center justify-center bg-black">
                <img src="/images/logo.png" alt="Scorpio88 Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg md:text-xl font-black tracking-wider text-white">
                SCORPIO<span className="text-casino-gold">88</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
              The world's most trusted premium online casino. Experience fair play, instant withdrawals, and 24/7 VIP customer support.
            </p>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
              <span className="text-gray-300 font-bold text-xs md:text-sm">100% Secure & Verified</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <h4 className="text-white font-bold mb-4 md:mb-6 tracking-widest uppercase text-sm md:text-base">Information</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-casino-gold cursor-pointer transition-colors">About Us</Link></li>
              <li><Link to="/terms" className="hover:text-casino-gold cursor-pointer transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-casino-gold cursor-pointer transition-colors">Privacy Policy</Link></li>
              <li><Link to="/responsible-gaming" className="hover:text-casino-gold cursor-pointer transition-colors">Responsible Gaming</Link></li>
            </ul>
          </div>
          
          <div className="mt-4 md:mt-0">
            <h4 className="text-white font-bold mb-4 md:mb-6 tracking-widest uppercase text-sm md:text-base">Providers</h4>
            <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm text-gray-500 font-bold">
              <span>Pragmatic Play</span>
              <span>PG Soft</span>
              <span>Evolution</span>
              <span>Spribe</span>
              <span>Microgaming</span>
              <span>Habanero</span>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <h4 className="text-white font-bold mb-4 md:mb-6 tracking-widest uppercase text-sm md:text-base">Payment Methods</h4>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white/5 border border-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded flex items-center justify-center font-black text-blue-500 italic text-[10px] md:text-xs">BCA</div>
              <div className="bg-white/5 border border-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded flex items-center justify-center font-black text-yellow-500 italic text-[10px] md:text-xs">MANDIRI</div>
              <div className="bg-white/5 border border-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded flex items-center justify-center font-black text-orange-500 italic text-[10px] md:text-xs">BNI</div>
              <div className="bg-white/5 border border-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded flex items-center justify-center font-black text-blue-400 italic text-[10px] md:text-xs">BRI</div>
              <div className="bg-white/5 border border-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded flex items-center justify-center font-black text-green-400 text-[10px] md:text-xs">USDT</div>
              <div className="bg-white/5 border border-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded flex items-center justify-center font-black text-orange-400 text-[10px] md:text-xs">BITCOIN</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-6 md:pt-8 text-center text-[10px] md:text-xs text-gray-600 font-medium">
          <p>© 2026 SCORPIO88 CASINO. All rights reserved.</p>
          <p className="mt-1 md:mt-2">Licensed and regulated by the Government of Curacao.</p>
        </div>
      </footer>

    </div>
  );
}
