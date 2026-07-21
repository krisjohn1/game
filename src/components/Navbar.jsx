import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coins, LogOut, Settings, UserCircle, LogIn, Wallet, Globe, Volume2, VolumeX } from 'lucide-react';
import WalletModal from './WalletModal';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ user, onLoginClick, onLogout }) {
  const [showWallet, setShowWallet] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef(null);
  const { lang, changeLang, t } = useLanguage();

  useEffect(() => {
    if (audioRef.current) {
      if (soundEnabled) {
        audioRef.current.play().catch(e => {
            console.log("Auto-play blocked");
            setSoundEnabled(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [soundEnabled]);

  return (
    <>
      <audio ref={audioRef} loop src="https://assets.mixkit.co/active_storage/sfx/135/135-preview.mp3" preload="auto" />
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
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-xs md:text-sm font-bold"
            >
              <Globe className="w-4 h-4 text-casino-gold" />
              <span className="hidden md:inline">{lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
              <span className="inline md:hidden">{lang === 'id' ? '🇮🇩' : '🇬🇧'}</span>
            </button>
            
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={() => { changeLang('id'); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors ${lang === 'id' ? 'text-casino-gold bg-casino-gold/10' : 'text-gray-300'}`}
                  >
                    <span className="text-lg">🇮🇩</span>
                    <span className="font-bold text-sm">Bahasa Indonesia</span>
                    {lang === 'id' && <span className="ml-auto text-casino-gold">✓</span>}
                  </button>
                  <button 
                    onClick={() => { changeLang('en'); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors ${lang === 'en' ? 'text-casino-gold bg-casino-gold/10' : 'text-gray-300'}`}
                  >
                    <span className="text-lg">🇬🇧</span>
                    <span className="font-bold text-sm">English</span>
                    {lang === 'en' && <span className="ml-auto text-casino-gold">✓</span>}
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center justify-center p-2 md:p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all group relative"
            title={soundEnabled ? t('nav.soundOff') : t('nav.soundOn')}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-casino-gold" />
            ) : (
              <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
            )}
            <span className="absolute -bottom-10 right-0 bg-black/90 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap border border-white/10 pointer-events-none transition-opacity duration-200">
                {soundEnabled ? t('nav.soundOff') : t('nav.soundOn')}
            </span>
          </button>

          {user ? (
            <>
              <button 
                onClick={() => setShowWallet(true)}
                className="group relative px-3 py-1.5 md:px-5 md:py-2 font-black tracking-widest text-black rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center shadow-[0_0_15px_rgba(251,191,36,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-casino-gold via-yellow-200 to-casino-gold bg-[length:200%_auto] animate-[spin-slow_2s_linear_infinite] group-hover:animate-none"></div>
                <div className="relative flex items-center text-xs md:text-base">
                  <Wallet className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">{t('nav.deposit')}</span>
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
                <span className="hidden md:inline">{t('nav.login')} / {t('nav.register')}</span>
                <span className="inline md:hidden">{t('nav.login')}</span>
              </div>
            </button>
          )}
        </div>
      </nav>

      {showWallet && <WalletModal user={user} onClose={() => setShowWallet(false)} />}
    </>
  );
}
