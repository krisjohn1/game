import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Award, Users, Globe, Zap, HeartHandshake } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <Link to="/" className="inline-flex items-center text-casino-gold hover:text-yellow-300 transition-colors font-bold text-sm tracking-widest">
        <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO LOBBY
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-casino-gold to-yellow-200 mb-4">
          ABOUT SCORPIO88
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          The world's most trusted premium online casino platform since 2024
        </p>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-2xl font-black text-white mb-4 tracking-wider flex items-center">
          <Globe className="w-6 h-6 mr-3 text-casino-gold" /> WHO WE ARE
        </h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          SCORPIO88 is a premier online gaming platform that delivers world-class casino entertainment to players worldwide. 
          Founded with a vision to create the most transparent, fair, and exciting gaming experience, we combine cutting-edge 
          technology with luxurious design to provide an unparalleled VIP experience.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Our platform is licensed and regulated by the Government of Curacao, ensuring the highest standards of security, 
          fairness, and responsible gaming practices. Every game on our platform uses certified Random Number Generators (RNG) 
          to guarantee fair outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center hover:-translate-y-1 transition-transform shadow-lg">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-casino-gold/20 flex items-center justify-center border border-casino-gold/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Shield className="w-7 h-7 text-casino-gold" />
          </div>
          <h3 className="text-white font-black tracking-wider mb-2">SECURE</h3>
          <p className="text-gray-400 text-sm">256-bit SSL encryption protects all transactions and personal data</p>
        </div>
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center hover:-translate-y-1 transition-transform shadow-lg">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center border border-neon-green/50 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            <Award className="w-7 h-7 text-neon-green" />
          </div>
          <h3 className="text-white font-black tracking-wider mb-2">LICENSED</h3>
          <p className="text-gray-400 text-sm">Fully licensed and regulated by the Government of Curacao</p>
        </div>
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center hover:-translate-y-1 transition-transform shadow-lg">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-neon-pink/20 flex items-center justify-center border border-neon-pink/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <Zap className="w-7 h-7 text-neon-pink" />
          </div>
          <h3 className="text-white font-black tracking-wider mb-2">INSTANT</h3>
          <p className="text-gray-400 text-sm">Lightning-fast deposits and withdrawals with multiple payment methods</p>
        </div>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-2xl font-black text-white mb-4 tracking-wider flex items-center">
          <HeartHandshake className="w-6 h-6 mr-3 text-casino-gold" /> OUR MISSION
        </h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          We believe gaming should be exciting, fair, and accessible to everyone. Our mission is to deliver:
        </p>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-casino-gold font-black mt-0.5">▸</span>
            <span><strong className="text-white">Provably Fair Games</strong> — Every outcome is verifiable and uses certified RNG technology</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-casino-gold font-black mt-0.5">▸</span>
            <span><strong className="text-white">24/7 VIP Support</strong> — Our dedicated support team is always available to assist you</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-casino-gold font-black mt-0.5">▸</span>
            <span><strong className="text-white">Responsible Gaming</strong> — We promote healthy gaming habits and provide tools for self-management</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-casino-gold font-black mt-0.5">▸</span>
            <span><strong className="text-white">Premium Experience</strong> — Luxury design and seamless gameplay across all devices</span>
          </li>
        </ul>
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <h2 className="text-2xl font-black text-white mb-4 tracking-wider flex items-center">
          <Users className="w-6 h-6 mr-3 text-casino-gold" /> CONTACT US
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Email</p>
            <p className="font-bold text-white">support@scorpio88.com</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Live Chat</p>
            <p className="font-bold text-white">Available 24/7</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Telegram</p>
            <p className="font-bold text-white">@scorpio88official</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">WhatsApp</p>
            <p className="font-bold text-white">+62 812-XXXX-XXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
}
