import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, Lock, Server, Trash2, UserCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <Link to="/" className="inline-flex items-center text-casino-gold hover:text-yellow-300 transition-colors font-bold text-sm tracking-widest">
        <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO LOBBY
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-casino-gold to-yellow-200 mb-4">
          PRIVACY POLICY
        </h1>
        <p className="text-gray-400 text-lg">Last updated: July 2026</p>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] space-y-8">
        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <Eye className="w-5 h-5 mr-2" /> INFORMATION WE COLLECT
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            At SCORPIO88, your privacy is our priority. We collect the following information:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">Account Data:</strong> Username, email address, and encrypted password.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">Transaction Data:</strong> Deposit and withdrawal records.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">Activity Data:</strong> Game history, betting patterns, and session logs.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">Device Data:</strong> IP address, browser type, and device information.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <Lock className="w-5 h-5 mr-2" /> HOW WE PROTECT YOUR DATA
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> All data is encrypted using industry-standard 256-bit SSL encryption.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> Passwords are hashed using bcrypt and never stored in plain text.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> Regular security audits and penetration testing are conducted.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> Access to personal data is restricted to authorized personnel only.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <Server className="w-5 h-5 mr-2" /> HOW WE USE YOUR DATA
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> To provide and maintain our gaming services.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> To process your transactions and manage your account.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> To detect and prevent fraud or unauthorized access.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> To comply with legal and regulatory requirements.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> To send important service notifications and promotional offers (opt-out available).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <UserCheck className="w-5 h-5 mr-2" /> YOUR RIGHTS
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">Access:</strong> You can request a copy of your personal data at any time.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">Correction:</strong> You can request corrections to inaccurate data.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">Deletion:</strong> You can request deletion of your account and personal data.</li>
            <li className="flex items-start gap-2"><span className="text-casino-gold font-black">▸</span> <strong className="text-white">Opt-out:</strong> You can unsubscribe from promotional communications at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-casino-gold mb-3 tracking-wider flex items-center">
            <Trash2 className="w-5 h-5 mr-2" /> DATA RETENTION
          </h2>
          <p className="text-gray-300 leading-relaxed">
            We retain your personal data for as long as your account is active or as needed to provide services. 
            If you request account deletion, all personal data will be permanently removed within 30 days, 
            except where retention is required by law.
          </p>
        </section>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          <p>For privacy-related inquiries, contact our Data Protection Officer at privacy@scorpio88.com</p>
        </div>
      </div>
    </div>
  );
}
