import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, LogOut, Settings, UserCircle, LogIn } from 'lucide-react';

export default function Navbar({ user, onLoginClick, onLogout }) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 glass-panel z-50 flex items-center justify-between px-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <Link to="/" className="flex items-center space-x-2 group">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-casino-gold to-yellow-200 flex items-center justify-center animate-pulse-glow">
          <span className="text-black font-extrabold text-xl">L</span>
        </div>
        <span className="text-2xl font-black tracking-wider text-white group-hover:text-casino-gold transition-colors duration-300">
          LUCKY<span className="text-casino-gold">STAR</span>
        </span>
      </Link>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <div className="flex items-center bg-black/60 rounded-full pl-2 pr-6 py-1.5 border border-casino-gold/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
              <div className="bg-casino-gold/20 p-1.5 rounded-full mr-3">
                <Coins className="w-5 h-5 text-casino-gold" />
              </div>
              <span className="font-mono text-casino-gold font-bold text-lg neon-text-gold tracking-wider">
                ${user.balance?.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </span>
            </div>
            
            <div className="flex items-center text-gray-200 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <UserCircle className="w-5 h-5 mr-2 text-casino-gold" />
              <span className="font-medium tracking-wide">{user.username}</span>
            </div>

            {user.role === 'admin' && (
              <Link to="/admin" className="p-2 text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300">
                <Settings className="w-6 h-6" />
              </Link>
            )}

            <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-300">
              <LogOut className="w-6 h-6" />
            </button>
          </>
        ) : (
          <button 
            onClick={onLoginClick}
            className="group relative px-6 py-2.5 font-bold text-black rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-casino-gold via-yellow-200 to-casino-gold bg-[length:200%_auto] animate-[spin-slow_2s_linear_infinite] group-hover:animate-none"></div>
            <div className="relative flex items-center">
              <LogIn className="w-5 h-5 mr-2" />
              LOGIN / REGISTER
            </div>
          </button>
        )}
      </div>
    </nav>
  );
}
