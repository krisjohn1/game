import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
export default function TermsConditions() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <Link to="/" className="inline-flex items-center text-casino-gold hover:text-yellow-300 transition-colors font-bold text-sm tracking-widest">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('terms.backToLobby')}
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-casino-gold to-yellow-200 mb-4">
          {t('terms.title')}
        </h1>
        <p className="text-gray-400 text-lg">{t('terms.lastUpdated')}</p>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] space-y-8">
        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <Scale className="w-5 h-5 mr-2" /> {t('terms.generalTitle')}
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {t('terms.generalText')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <FileText className="w-5 h-5 mr-2" /> {t('terms.accountTitle')}
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('terms.account1')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('terms.account2')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('terms.account3')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('terms.account4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider">{t('terms.depositsTitle')}</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('terms.deposit1')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('terms.deposit2')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('terms.deposit3')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('terms.deposit4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider">{t('terms.gamingTitle')}</h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            {t('terms.gamingText')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider">{t('terms.bonusTitle')}</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('terms.bonus1')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('terms.bonus2')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('terms.bonus3')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider">{t('terms.liabilityTitle')}</h2>
          <p className="text-gray-300 leading-relaxed">
            {t('terms.liabilityText')}
          </p>
        </section>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          <p>{t('terms.questionsContact')}</p>
        </div>
      </div>
    </div>
  );
}
