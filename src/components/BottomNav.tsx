import React from 'react';
import { LayoutDashboard, Users, Coins, Receipt, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

interface BottomNavProps {
  onOpenSidebar: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenSidebar }) => {
  const { currentTab, setCurrentTab, membersWithDuesCount } = useApp();

  const primaryTabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'members', label: 'সদস্য', icon: Users },
    { id: 'contributions', label: 'চাঁদা', icon: Coins },
    { id: 'expenses', label: 'খরচ', icon: Receipt },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {primaryTabs.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-50' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700 stroke-[2.5]' : 'text-slate-500'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Menu Drawer trigger */}
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 relative transition"
        >
          <div className="p-1 rounded-lg relative">
            <Menu className="w-5 h-5 text-slate-500" />
            {membersWithDuesCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">সব মেনু</span>
        </button>
      </div>
    </nav>
  );
};
