import React, { useState } from 'react';
import {
  Menu,
  Shield,
  UserCheck,
  Download,
  Share2,
  Calendar,
  Wallet,
  Users,
  LogOut,
  Smartphone,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toBanglaCurrency, formatBanglaDate, getTodayDateString } from '../utils/bangla';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallModal } from './InstallModal';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { settings, currentUser, currentBalance, openModal, users, switchUser } = useApp();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'এডমিন', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'accountant':
        return { label: 'হিসাবরক্ষক', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      default:
        return { label: 'দর্শক', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
  };

  const badge = getRoleBadge(currentUser.role);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowInstallModal(true);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
          {/* Left: Mobile hamburger & App Name */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleSidebar}
              aria-label="মেনু খুলুন"
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition"
            >
              <Menu className="w-5 h-5 text-emerald-800" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/20 text-lg">
                <span className="font-['Hind_Siliguri']">পা</span>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  {settings.org_name}
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block truncate max-w-[280px]">
                  {settings.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Live Balance preview on desktop */}
          <div className="hidden md:flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/80 rounded-full px-3.5 py-1 text-xs">
            <Wallet className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-slate-600 font-medium">বর্তমান ব্যালেন্স:</span>
            <span className="font-bold text-emerald-800 text-sm">{toBanglaCurrency(currentBalance)}</span>
          </div>

          {/* Right: Date, PWA Install button & User Role Switcher */}
          <div className="flex items-center gap-2">
            {/* Always Visible Install Button for Mobile & Desktop */}
            <button
              onClick={handleInstallClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition shadow-xs active:scale-95 ${
                isInstalled
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-900/10 animate-pulse-subtle'
              }`}
              title="মোবাইল বা কম্পিউটারে অ্যাপ ইনস্টল ও APK ডাউনলোড করুন"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isInstalled ? 'ইনস্টল / APK তথ্য' : 'ইনস্টল / APK'}</span>
            </button>

            {/* User Role Pill & Quick Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition text-xs font-medium border border-slate-200"
              >
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="hidden sm:inline font-medium max-w-[120px] truncate text-slate-800">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showUserDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
                  onClick={() => setShowUserDropdown(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">বর্তমান প্রোফাইল</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.phone}</p>
                  </div>

                  <div className="py-1">
                    <p className="px-3.5 py-1 text-[11px] font-semibold text-slate-400">রোল পরিবর্তন করুন:</p>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => switchUser(u.id)}
                        className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                          u.id === currentUser.id ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {u.role === 'admin' ? 'এডমিন' : u.role === 'accountant' ? 'হিসাবরক্ষক' : 'দর্শক'}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => openModal('login')}
                      className="w-full text-left px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 font-medium flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      পিন/পাসওয়ার্ড দিয়ে নতুন লগইন
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Comprehensive Install & Usage Modal */}
      <InstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </>
  );
};
