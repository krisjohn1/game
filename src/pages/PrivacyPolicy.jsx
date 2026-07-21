import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, Lock, Server, Trash2, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <Link to="/" className="inline-flex items-center text-casino-gold hover:text-yellow-300 transition-colors font-bold text-sm tracking-widest">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('privacyPage.backToLobby')}
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-casino-gold to-yellow-200 mb-4">
          {t('privacyPage.title')}
        </h1>
        <p className="text-gray-400 text-lg">{t('privacyPage.lastUpdated')}</p>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] space-y-8">
        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <Eye className="w-5 h-5 mr-2" /> {t('privacyPage.collectTitle')}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            {t('privacyPage.collectIntro')}
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">{t('privacyPage.accountData')}</strong> {t('privacyPage.accountDataDesc')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">{t('privacyPage.transactionData')}</strong> {t('privacyPage.transactionDataDesc')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">{t('privacyPage.activityData')}</strong> {t('privacyPage.activityDataDesc')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">{t('privacyPage.deviceData')}</strong> {t('privacyPage.deviceDataDesc')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <Lock className="w-5 h-5 mr-2" /> {t('privacyPage.protectTitle')}
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('privacyPage.protect1')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('privacyPage.protect2')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('privacyPage.protect3')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('privacyPage.protect4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <Server className="w-5 h-5 mr-2" /> {t('privacyPage.useTitle')}
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('privacyPage.use1')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('privacyPage.use2')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('privacyPage.use3')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('privacyPage.use4')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> {t('privacyPage.use5')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <UserCheck className="w-5 h-5 mr-2" /> {t('privacyPage.rightsTitle')}
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">{t('privacyPage.access')}</strong> {t('privacyPage.accessDesc')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">{t('privacyPage.correction')}</strong> {t('privacyPage.correctionDesc')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">{t('privacyPage.deletion')}</strong> {t('privacyPage.deletionDesc')}</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">{t('privacyPage.optOut')}</strong> {t('privacyPage.optOutDesc')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <Trash2 className="w-5 h-5 mr-2" /> {t('privacyPage.retentionTitle')}
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {t('privacyPage.retentionText')}
          </p>
        </section>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          <p>{t('privacyPage.contactDpo')}</p>
        </div>
      </div>
    </div>
  );
}
