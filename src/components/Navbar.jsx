import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coins, LogOut, Settings, UserCircle, LogIn, Wallet } from 'lucide-react';
import WalletModal from './WalletModal';

export default function Navbar({ user, onLoginClick, onLogout }) {
  const [showWallet, setShowWallet] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 glass-panel z-50 flex items-center justify-between px-4 md:px-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-casino-gold/50 shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-pulse-glow flex items-center justify-center bg-black">
            <img src="/images/logo.png" alt="Scorpio88 Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-wider text-white group-hover:text-casino-gold transition-colors duration-300">
            SCORPIO<span className="text-casino-gold">88</span>
          </span>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-6">
          {user ? (
            <>
              <button 
                onClick={() => setShowWallet(true)}
                className="group relative px-3 py-1.5 md:px-5 md:py-2 font-black tracking-widest text-black rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center shadow-[0_0_15px_rgba(251,191,36,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-casino-gold via-yellow-200 to-casino-gold bg-[length:200%_auto] animate-[spin-slow_2s_linear_infinite] group-hover:animate-none"></div>
                <div className="relative flex items-center text-xs md:text-base">
                  <Wallet className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">DEPOSIT</span>
                </div>
              </button>

              <div className="flex items-center bg-black/60 rounded-full pl-1.5 pr-3 md:pl-2 md:pr-6 py-1 md:py-1.5 border border-casino-gold/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                <div className="bg-casino-gold/20 p-1 md:p-1.5 rounded-full mr-2 md:mr-3">
                  <Coins className="w-4 h-4 md:w-5 md:h-5 text-casino-gold" />
                </div>
                <span className="font-mono text-casino-gold font-bold text-sm md:text-lg neon-text-gold tracking-wider">
                  ${user.balance?.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})}
                </span>
              </div>
              
              <div className="hidden md:flex items-center text-gray-200 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <UserCircle className="w-5 h-5 mr-2 text-casino-gold" />
                <span className="font-medium tracking-wide">{user.username}</span>
              </div>

              {user.role === 'admin' && (
                <Link to="/admin" className="p-2 text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300">
                  <Settings className="w-5 h-5 md:w-6 md:h-6" />
                </Link>
              )}

              <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-300">
                <LogOut className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          ) : (
            <button 
              onClick={onLoginClick}
              className="group relative px-4 py-2 md:px-6 md:py-2.5 font-bold text-black rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 text-xs md:text-base"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-casino-gold via-yellow-200 to-casino-gold bg-[length:200%_auto] animate-[spin-slow_2s_linear_infinite] group-hover:animate-none"></div>
              <div className="relative flex items-center">
                <LogIn className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="hidden md:inline">LOGIN / REGISTER</span>
                <span className="inline md:hidden">LOGIN</span>
              </div>
            </button>
          )}
        </div>
      </nav>

      {showWallet && <WalletModal user={user} onClose={() => setShowWallet(false)} />}
    </>
  );
}
