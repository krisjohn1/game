import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldAlert, HeartPulse, AlertTriangle, HelpCircle, Ban } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
export default function ResponsibleGaming() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <Link to="/" className="inline-flex items-center text-casino-gold hover:text-yellow-300 transition-colors font-bold text-sm tracking-widest">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('responsible.backToLobby')}
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-casino-gold to-yellow-200 mb-4">
          {t('responsible.title')}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {t('responsible.subtitle')}
        </p>
      </div>

      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-black text-red-400 mb-2 tracking-wider">{t('responsible.importantNotice')}</h2>
            <p className="text-gray-300 leading-relaxed">
              {t('responsible.importantText')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-casino-gold/20 flex items-center justify-center border border-casino-gold/50">
              <Clock className="w-6 h-6 text-casino-gold" />
            </div>
            <h3 className="text-white font-black tracking-wider">{t('responsible.timeLimits')}</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('responsible.timeLimitsDesc')}
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center border border-neon-green/50">
              <ShieldAlert className="w-6 h-6 text-neon-green" />
            </div>
            <h3 className="text-white font-black tracking-wider">{t('responsible.depositLimits')}</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('responsible.depositLimitsDesc')}
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-neon-pink/20 flex items-center justify-center border border-neon-pink/50">
              <Ban className="w-6 h-6 text-neon-pink" />
            </div>
            <h3 className="text-white font-black tracking-wider">{t('responsible.selfExclusion')}</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('responsible.selfExclusionDesc')}
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
              <HeartPulse className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-black tracking-wider">{t('responsible.realityCheck')}</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {t('responsible.realityCheckDesc')}
          </p>
        </div>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-2xl font-black text-casino-gold mb-4 tracking-wider flex items-center">
          <HelpCircle className="w-6 h-6 mr-3" /> {t('responsible.signsTitle')}
        </h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2"><span className="text-red-500 font-black">✕</span> {t('responsible.sign1')}</li>
          <li className="flex items-start gap-2"><span className="text-red-500 font-black">✕</span> {t('responsible.sign2')}</li>
          <li className="flex items-start gap-2"><span className="text-red-500 font-black">✕</span> {t('responsible.sign3')}</li>
          <li className="flex items-start gap-2"><span className="text-red-500 font-black">✕</span> {t('responsible.sign4')}</li>
          <li className="flex items-start gap-2"><span className="text-red-500 font-black">✕</span> {t('responsible.sign5')}</li>
          <li className="flex items-start gap-2"><span className="text-red-500 font-black">✕</span> {t('responsible.sign6')}</li>
        </ul>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-2xl font-black text-white mb-4 tracking-wider">{t('responsible.needHelp')}</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          {t('responsible.needHelpText')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-casino-gold font-black text-sm tracking-widest mb-1">GAMBLERS ANONYMOUS</p>
            <p className="text-gray-400 text-sm">www.gamblersanonymous.org</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-casino-gold font-black text-sm tracking-widest mb-1">GAMBLING THERAPY</p>
            <p className="text-gray-400 text-sm">www.gamblingtherapy.org</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-casino-gold font-black text-sm tracking-widest mb-1">SCORPIO88 SUPPORT</p>
            <p className="text-gray-400 text-sm">support@scorpio88.com (24/7)</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-casino-gold font-black text-sm tracking-widest mb-1">BEGAMBLEAWARE</p>
            <p className="text-gray-400 text-sm">www.begambleaware.org</p>
          </div>
        </div>
      </div>
    </div>
  );
}
