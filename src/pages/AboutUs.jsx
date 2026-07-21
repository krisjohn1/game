import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Award, Users, Globe, Zap, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
export default function AboutUs() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <Link to="/" className="inline-flex items-center text-casino-gold hover:text-yellow-300 transition-colors font-bold text-sm tracking-widest">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('about.backToLobby')}
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-casino-gold to-yellow-200 mb-4">
          {t('about.title')}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {t('about.subtitle')}
        </p>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-2xl font-black text-white mb-4 tracking-wider flex items-center">
          <Globe className="w-6 h-6 mr-3 text-casino-gold" /> {t('about.whoWeAre')}
        </h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          {t('about.whoWeAreP1')}
        </p>
        <p className="text-gray-300 leading-relaxed">
          {t('about.whoWeAreP2')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center hover:-translate-y-1 transition-transform shadow-lg">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-casino-gold/20 flex items-center justify-center border border-casino-gold/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Shield className="w-7 h-7 text-casino-gold" />
          </div>
          <h3 className="text-white font-black tracking-wider mb-2">{t('about.secure')}</h3>
          <p className="text-gray-400 text-sm">{t('about.secureDesc')}</p>
        </div>
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center hover:-translate-y-1 transition-transform shadow-lg">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center border border-neon-green/50 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            <Award className="w-7 h-7 text-neon-green" />
          </div>
          <h3 className="text-white font-black tracking-wider mb-2">{t('about.licensed')}</h3>
          <p className="text-gray-400 text-sm">{t('about.licensedDesc')}</p>
        </div>
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center hover:-translate-y-1 transition-transform shadow-lg">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-neon-pink/20 flex items-center justify-center border border-neon-pink/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <Zap className="w-7 h-7 text-neon-pink" />
          </div>
          <h3 className="text-white font-black tracking-wider mb-2">{t('about.instant')}</h3>
          <p className="text-gray-400 text-sm">{t('about.instantDesc')}</p>
        </div>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-2xl font-black text-white mb-4 tracking-wider flex items-center">
          <HeartHandshake className="w-6 h-6 mr-3 text-casino-gold" /> {t('about.ourMission')}
        </h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          {t('about.missionIntro')}
        </p>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-casino-gold font-black mt-0.5">▸</span>
            <span><strong className="text-white">{t('about.fairGames')}</strong> — {t('about.fairGamesDesc')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-casino-gold font-black mt-0.5">▸</span>
            <span><strong className="text-white">{t('about.vipSupport')}</strong> — {t('about.vipSupportDesc')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-casino-gold font-black mt-0.5">▸</span>
            <span><strong className="text-white">{t('about.responsibleGaming')}</strong> — {t('about.responsibleGamingDesc')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-casino-gold font-black mt-0.5">▸</span>
            <span><strong className="text-white">{t('about.premiumExp')}</strong> — {t('about.premiumExpDesc')}</span>
          </li>
        </ul>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-2xl font-black text-white mb-4 tracking-wider flex items-center">
          <Users className="w-6 h-6 mr-3 text-casino-gold" /> {t('about.contactUs')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{t('about.emailLabel')}</p>
            <p className="font-bold text-white">support@scorpio88.com</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{t('about.liveChat')}</p>
            <p className="font-bold text-white">{t('about.available247')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{t('about.telegram')}</p>
            <p className="font-bold text-white">@scorpio88official</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{t('about.whatsapp')}</p>
            <p className="font-bold text-white">+62 812-XXXX-XXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
}
