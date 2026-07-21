import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <Link to="/" className="inline-flex items-center text-casino-gold hover:text-yellow-300 transition-colors font-bold text-sm tracking-widest">
        <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO LOBBY
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-casino-gold to-yellow-200 mb-4">
          TERMS & CONDITIONS
        </h1>
        <p className="text-gray-400 text-lg">Last updated: July 2026</p>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] space-y-8">
        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <Scale className="w-5 h-5 mr-2" /> 1. GENERAL TERMS
          </h2>
          <p className="text-gray-300 leading-relaxed">
            By accessing and using the SCORPIO88 platform, you agree to be bound by these Terms and Conditions. 
            These terms apply to all visitors, users, and others who access or use the service. You must be at least 
            18 years of age (or the legal age for gambling in your jurisdiction) to use this platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <FileText className="w-5 h-5 mr-2" /> 2. ACCOUNT REGISTRATION
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> Each user may only create one account on the platform.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> You are responsible for maintaining the security of your account credentials.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> All information provided must be accurate and up to date.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> SCORPIO88 reserves the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider">3. DEPOSITS & WITHDRAWALS</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> Minimum deposit amount: IDR 10,000 / $1 USDT.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> Minimum withdrawal amount: IDR 50,000 / $5 USDT.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> Withdrawals are processed within 1-24 hours depending on the payment method.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> SCORPIO88 may request identity verification before processing withdrawals.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider">4. GAMING RULES</h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            All games on the SCORPIO88 platform use certified Random Number Generators (RNG) to ensure fair outcomes. 
            Any attempt to manipulate game results, exploit bugs, or use automated software is strictly prohibited 
            and will result in immediate account termination and forfeiture of balance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider">5. BONUSES & PROMOTIONS</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> All bonuses are subject to wagering requirements before withdrawal.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> SCORPIO88 reserves the right to modify or cancel promotions at any time.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> Bonus abuse or multi-account exploitation will result in account suspension.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider">6. LIMITATION OF LIABILITY</h2>
          <p className="text-gray-300 leading-relaxed">
            SCORPIO88 shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting 
            from your use of the platform. We are not responsible for any losses incurred during gameplay as gambling involves 
            inherent risk.
          </p>
        </section>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          <p>For questions about these terms, contact us at support@scorpio88.com</p>
        </div>
      </div>
    </div>
  );
}
