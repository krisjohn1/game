import React, { useState } from 'react';
import { X, Wallet, CreditCard, Bitcoin, CheckCircle2 } from 'lucide-react';

export default function WalletModal({ onClose, user }) {
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState('qris');
  const [step, setStep] = useState(1);

  const methods = [
    { id: 'qris', name: 'QRIS', icon: <CreditCard className="w-6 h-6 text-blue-400" /> },
    { id: 'bank', name: 'Bank Transfer', icon: <Wallet className="w-6 h-6 text-green-400" /> },
    { id: 'crypto', name: 'Crypto (USDT)', icon: <Bitcoin className="w-6 h-6 text-yellow-500" /> }
  ];

  const handleDeposit = () => {
    setStep(2);
    setTimeout(() => {
      setStep(3); // success simulation
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.15)] border border-gray-700 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-casino-gold via-yellow-200 to-casino-gold"></div>
        
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-black text-white flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-casino-gold" />
            CASHIER
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-sm">Current Balance</span>
                <span className="text-xl font-mono font-black text-casino-gold">${user?.balance?.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Select Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {methods.map(m => (
                    <button 
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === m.id ? 'border-casino-gold bg-casino-gold/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
                    >
                      {m.icon}
                      <span className="mt-2 text-xs font-bold text-gray-300">{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Deposit Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl pl-8 py-3 text-2xl font-black text-white focus:border-casino-gold outline-none transition-colors font-mono"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[50, 100, 500, 1000].map(val => (
                    <button 
                      key={val}
                      onClick={() => setAmount(val)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-1.5 rounded-lg text-sm font-bold border border-gray-700 transition-colors"
                    >
                      +${val}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleDeposit}
                className="w-full py-4 rounded-xl font-black tracking-widest text-lg text-black bg-gradient-to-r from-casino-gold via-yellow-300 to-casino-gold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              >
                DEPOSIT NOW
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-casino-gold rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-white mb-2">Processing Payment...</h3>
              <p className="text-gray-400 text-center text-sm">Please complete the payment in your {methods.find(m=>m.id===method)?.name} app.</p>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-wide">PAYMENT RECEIVED</h3>
              <p className="text-gray-400 text-center text-sm mb-6">Your balance will be updated automatically in the real version.</p>
              <button 
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                RETURN TO LOBBY
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
