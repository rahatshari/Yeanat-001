import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Coins,
  AlertCircle,
  TrendingUp,
  Receipt,
  Scale,
  CalendarDays,
  UserCheck,
  FileSpreadsheet,
  Database,
  Settings,
  X,
  PlusCircle,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import { toBanglaNumber, toBanglaCurrency } from '../utils/bangla';
import { InstallModal } from './InstallModal';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentTab, setCurrentTab, membersWithDuesCount, currentBalance, openModal, canEdit } =
    useApp();
  const { isInstallable, install } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'members', label: 'সদস্য ব্যবস্থাপনা', icon: Users },
    { id: 'contributions', label: 'চাঁদা জমা', icon: Coins },
    {
      id: 'dues',
      label: 'বকেয়া চাঁদা',
      icon: AlertCircle,
      badge: membersWithDuesCount > 0 ? toBanglaNumber(membersWithDuesCount) : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'income', label: 'অন্যান্য আয়', icon: TrendingUp },
    { id: 'expenses', label: 'খরচ ব্যবস্থাপনা', icon: Receipt },
    { id: 'income_expense_report', label: 'আয়-ব্যয় রিপোর্ট', icon: Scale },
    { id: 'monthly_report', label: 'মাসিক রিপোর্ট', icon: CalendarDays },
    { id: 'member_report', label: 'সদস্য রিপোর্ট', icon: UserCheck },
    { id: 'all_reports', label: 'সকল রিপোর্ট', icon: FileSpreadsheet },
    { id: 'backup', label: 'ব্যাকআপ ও রিস্টোর', icon: Database },
    { id: 'settings', label: 'সেটিংস', icon: Settings },
  ];

  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    onClose();
  };

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
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white font-black shadow-md shadow-emerald-800/30 text-xl">
              <span>পা</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">পাঠামারা ইয়ানত</h2>
              <p className="text-[11px] text-emerald-700 font-semibold">সংরক্ষণ ও আর্থিক হিসাব</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance card in sidebar */}
        <div className="p-3 mx-3 my-2.5 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-900 text-white shadow-sm">
          <div className="flex items-center justify-between text-[11px] text-emerald-200">
            <span>সংগঠনের মোট স্থিতি</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-xl font-bold mt-0.5 tracking-tight text-white font-['Hind_Siliguri']">
            {toBanglaCurrency(currentBalance)}
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-200/80 pt-1 border-t border-emerald-700/60">
            <span>ক্যাশ ইন হ্যান্ড</span>
            <span>১০০% নিরাপদ হিসাব</span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5 scrollbar-thin">
          <p className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            প্রধান মেনু
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs border border-emerald-200/60'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-xs ${
                      item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Install App Button in Sidebar */}
        <div className="px-3 py-2 border-t border-slate-100">
          <button
            onClick={handleInstallClick}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-semibold transition border border-slate-200"
          >
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>অ্যাপ ইনস্টল ও APK ডাউনলোড</span>
          </button>
        </div>

        {/* Quick Action Button at bottom */}
        {canEdit && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => {
                openModal('collect_fee');
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs font-bold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>দ্রুত চাঁদা জমা নিন</span>
            </button>
          </div>
        )}
      </aside>

      {/* Install Modal */}
      <InstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </>
  );
};
