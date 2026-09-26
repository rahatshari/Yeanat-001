/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { MemberList } from './components/Members/MemberList';
import { MemberDetailModal } from './components/Members/MemberDetailModal';
import { MemberFormModal } from './components/Members/MemberFormModal';
import { ContributionList } from './components/Contributions/ContributionList';
import { ContributionFormModal } from './components/Contributions/ContributionFormModal';
import { DueContributionsView } from './components/Dues/DueContributionsView';
import { IncomeList } from './components/Income/IncomeList';
import { IncomeFormModal } from './components/Income/IncomeFormModal';
import { ExpenseList } from './components/Expenses/ExpenseList';
import { ExpenseFormModal } from './components/Expenses/ExpenseFormModal';
import { IncomeExpenseReport } from './components/Reports/IncomeExpenseReport';
import { MonthlyReport } from './components/Reports/MonthlyReport';
import { MemberReport } from './components/Reports/MemberReport';
import { AllReportsHub } from './components/Reports/AllReportsHub';
import { BackupRestore } from './components/Backup/BackupRestore';
import { SettingsView } from './components/Settings/SettingsView';
import { LoginModal } from './components/Auth/LoginModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentTab,
    selectedMemberId,
    setSelectedMemberId,
    activeModal,
    editingItem,
    closeModal,
    toast,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Hind_Siliguri',sans-serif] text-slate-900">
      {/* Top Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Responsive Desktop Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-72 p-3 sm:p-6 max-w-full overflow-x-hidden">
          {currentTab === 'dashboard' && <Dashboard />}
          {currentTab === 'members' && <MemberList />}
          {currentTab === 'contributions' && <ContributionList />}
          {currentTab === 'dues' && <DueContributionsView />}
          {currentTab === 'income' && <IncomeList />}
          {currentTab === 'expenses' && <ExpenseList />}
          {currentTab === 'income_expense_report' && <IncomeExpenseReport />}
          {currentTab === 'monthly_report' && <MonthlyReport />}
          {currentTab === 'member_report' && <MemberReport />}
          {currentTab === 'all_reports' && <AllReportsHub />}
          {currentTab === 'backup' && <BackupRestore />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenSidebar={() => setSidebarOpen(true)} />

      {/* Global Modals */}
      {selectedMemberId && (
        <MemberDetailModal
          memberId={selectedMemberId}
          onClose={() => setSelectedMemberId(null)}
        />
      )}

      {(activeModal === 'add_member' || activeModal === 'edit_member') && (
        <MemberFormModal
          memberToEdit={activeModal === 'edit_member' ? editingItem : null}
          onClose={closeModal}
        />
      )}

      {(activeModal === 'collect_fee' || activeModal === 'edit_contribution') && (
        <ContributionFormModal
          initialData={editingItem}
          onClose={closeModal}
        />
      )}

      {(activeModal === 'add_income' || activeModal === 'edit_income') && (
        <IncomeFormModal
          incomeToEdit={activeModal === 'edit_income' ? editingItem : null}
          onClose={closeModal}
        />
      )}

      {(activeModal === 'add_expense' || activeModal === 'edit_expense') && (
        <ExpenseFormModal
          expenseToEdit={activeModal === 'edit_expense' ? editingItem : null}
          onClose={closeModal}
        />
      )}

      {activeModal === 'login' && <LoginModal onClose={closeModal} />}

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-16 lg:bottom-6 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-700'
                : toast.type === 'info'
                ? 'bg-slate-900/95 text-white border-slate-700'
                : 'bg-emerald-900/95 text-white border-emerald-700'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-slate-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
