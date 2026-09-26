import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Key, UserCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { users, login, currentUser } = useApp();

  const [phoneOrId, setPhoneOrId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrId.trim() || !pin.trim()) {
      setError('মোবাইল নম্বর ও পিন দিন');
      return;
    }
    const success = login(phoneOrId.trim(), pin.trim());
    if (success) {
      onClose();
    } else {
      setError('ভুল মোবাইল নম্বর অথবা গোপন পিন!');
    }
  };

  const handleQuickRoleSelect = (userPhone: string, userPin: string) => {
    const success = login(userPhone, userPin);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">হিসাবের নিরাপত্তা ও লগইন</h3>
              <p className="text-xs text-slate-500">অনুমোদিত রোল নির্বাচন করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        {/* Quick Role Selection for One-Click Testing */}
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            দ্রুত লগইন করুন (এক ক্লিকে প্রবেশ):
          </p>
          <div className="space-y-1.5">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickRoleSelect(u.phone, u.pin)}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition hover:scale-[1.01] ${
                  u.id === currentUser.id
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {u.name}
                    {u.id === currentUser.id && (
                      <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                        বর্তমান
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    রোল: {u.role === 'admin' ? 'এডমিন (সম্পূর্ণ ক্ষমতা)' : u.role === 'accountant' ? 'হিসাবরক্ষক (যোগ/সম্পাদনা)' : 'দর্শক (শুধুমাত্র দেখা)'} • পিন: {u.pin}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Manual Login Form */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            অথবা মোবাইল ও পিন টাইপ করুন:
          </p>
          <form onSubmit={handleFormLogin} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">মোবাইল নম্বর</label>
              <input
                type="text"
                value={phoneOrId}
                onChange={(e) => setPhoneOrId(e.target.value)}
                placeholder="01711000001"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">গোপন ৪ সংখ্যার পিন</label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="যেমন: 1234"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-md shadow-emerald-800/20 active:scale-95"
              >
                লগইন নিশ্চিত করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
