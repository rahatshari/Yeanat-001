import React, { useState } from 'react';
import {
  Users,
  Coins,
  TrendingUp,
  Receipt,
  Wallet,
  AlertCircle,
  PlusCircle,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  toBanglaNumber,
  toBanglaCurrency,
  BANGLA_MONTHS,
  getCurrentMonth,
  getCurrentYear,
  formatBanglaDate,
  PAYMENT_METHODS,
} from '../utils/bangla';

export const Dashboard: React.FC = () => {
  const {
    totalMembersCount,
    activeMembersCount,
    thisMonthContributions,
    allTimeContributions,
    allTimeOtherIncome,
    totalIncome,
    allTimeExpenses,
    thisMonthExpenses,
    currentBalance,
    membersWithDuesCount,
    totalDuesAmount,
    contributions,
    incomeList,
    expenses,
    membersMap,
    setCurrentTab,
    openModal,
    setSelectedMemberId,
    canEdit,
  } = useApp();

  const currentMonthNum = getCurrentMonth();
  const currentYearNum = getCurrentYear();
  const currentMonthName = BANGLA_MONTHS[currentMonthNum];

  const [transactionFilter, setTransactionFilter] = useState<'all' | 'contribution' | 'income' | 'expense'>('all');

  // Combine recent transactions from contributions, income, and expenses
  const recentTransactions = React.useMemo(() => {
    const list: {
      id: string;
      type: 'contribution' | 'income' | 'expense';
      title: string;
      subtitle: string;
      amount: number;
      date: string;
      rawDate: string;
      refId?: string;
    }[] = [];

    contributions.forEach((c) => {
      const member = membersMap.get(c.member_id);
      list.push({
        id: `cnt-${c.id}`,
        type: 'contribution',
        title: member ? `${member.name} (${member.member_id})` : 'সদস্যের চাঁদা',
        subtitle: `${BANGLA_MONTHS[c.month]} ${toBanglaNumber(c.year)} মাসের চাঁদা • ${PAYMENT_METHODS[c.payment_method]}`,
        amount: c.amount,
        date: formatBanglaDate(c.payment_date),
        rawDate: c.payment_date,
        refId: c.member_id,
      });
    });

    incomeList.forEach((inc) => {
      list.push({
        id: `inc-${inc.id}`,
        type: 'income',
        title: inc.source ? `${inc.source} (অনুদান/দান)` : inc.category,
        subtitle: `${inc.category} • ${inc.note || 'সাধারণ আয়'}`,
        amount: inc.amount,
        date: formatBanglaDate(inc.date),
        rawDate: inc.date,
      });
    });

    expenses.forEach((exp) => {
      list.push({
        id: `exp-${exp.id}`,
        type: 'expense',
        title: exp.description,
        subtitle: `${exp.category} • প্রাপক: ${exp.recipient}`,
        amount: exp.amount,
        date: formatBanglaDate(exp.date),
        rawDate: exp.date,
      });
    });

    // Sort descending by date
    list.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

    if (transactionFilter === 'all') return list.slice(0, 10);
    return list.filter((item) => item.type === transactionFilter).slice(0, 10);
  }, [contributions, incomeList, expenses, membersMap, transactionFilter]);

  return (
    <div className="space-y-5 pb-10">
      {/* Hero / Balance Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-7 shadow-xl shadow-emerald-950/20">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-emerald-200 text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>সংগঠনের সার্বিক আর্থিক স্থিতি ({toBanglaNumber(currentYearNum)})</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-['Hind_Siliguri'] text-white">
                {toBanglaCurrency(currentBalance)}
              </h2>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 font-medium">
              হাতে থাকা বর্তমান ব্যালেন্স = সর্বমোট আয় ({toBanglaCurrency(totalIncome)}) - সর্বমোট খরচ ({toBanglaCurrency(allTimeExpenses)})
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setCurrentTab('income_expense_report')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>আয়-ব্যয় রিপোর্ট</span>
            </button>
            <button
              onClick={() => setCurrentTab('dues')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4 text-slate-950" />
              <span>বকেয়া ({toBanglaNumber(membersWithDuesCount)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons (User Requirement 21) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            দ্রুত কার্যক্রম (Quick Actions)
          </h3>
          <span className="text-[11px] text-slate-400 hidden sm:inline">এক ক্লিকে হিসাব সংরক্ষণ</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {/* Add Member */}
          <button
            onClick={() => openModal('add_member')}
            disabled={!canEdit}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 active:scale-95 transition group text-center disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800 group-hover:text-emerald-800">
              ➕ সদস্য যোগ করুন
            </span>
          </button>

          {/* Collect Fee */}
          <button
            onClick={() => openModal('collect_fee')}
            disabled={!canEdit}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 active:scale-95 transition group text-center disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
              <Coins className="w-5 h-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800 group-hover:text-teal-800">
              💰 চাঁদা জমা
            </span>
          </button>

          {/* Add Income */}
          <button
            onClick={() => openModal('add_income')}
            disabled={!canEdit}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 active:scale-95 transition group text-center disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800 group-hover:text-sky-800">
              💵 আয় যোগ করুন
            </span>
          </button>

          {/* Add Expense */}
          <button
            onClick={() => openModal('add_expense')}
            disabled={!canEdit}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 active:scale-95 transition group text-center disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800 group-hover:text-rose-800">
              💸 খরচ যোগ করুন
            </span>
          </button>

          {/* View Reports */}
          <button
            onClick={() => setCurrentTab('all_reports')}
            className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200 hover:border-purple-300 active:scale-95 transition group text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <span className="mt-2 text-xs font-bold text-slate-800 group-hover:text-purple-800">
              📊 রিপোর্ট দেখুন
            </span>
          </button>
        </div>
      </div>

      {/* Main KPI Cards Grid (Requirement 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Members */}
        <div
          onClick={() => setCurrentTab('members')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">মোট সদস্য সংখ্যা</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 font-['Hind_Siliguri']">
            {toBanglaNumber(totalMembersCount)} জন
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>সক্রিয়: {toBanglaNumber(activeMembersCount)} জন</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
              তালিকা <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* This Month's Fee Collection */}
        <div
          onClick={() => setCurrentTab('contributions')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{currentMonthName} মাসে মোট চাঁদা জমা</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-teal-800 font-['Hind_Siliguri']">
            {toBanglaCurrency(thisMonthContributions)}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>চলতি মাসের আদায়</span>
            <span className="text-teal-700 font-semibold flex items-center gap-0.5">
              বিস্তারিত <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Total All-Time Income */}
        <div
          onClick={() => setCurrentTab('income_expense_report')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">সর্বমোট চাঁদা ও আয়</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 font-['Hind_Siliguri']">
            {toBanglaCurrency(totalIncome)}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>চাঁদা: {toBanglaCurrency(allTimeContributions)}</span>
            <span className="text-sky-700 font-semibold">অন্যান্য: {toBanglaCurrency(allTimeOtherIncome)}</span>
          </div>
        </div>

        {/* Total All-Time Expenses */}
        <div
          onClick={() => setCurrentTab('expenses')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-rose-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">সর্বমোট খরচ</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-rose-700 font-['Hind_Siliguri']">
            {toBanglaCurrency(allTimeExpenses)}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>{currentMonthName} মাসে খরচ: {toBanglaCurrency(thisMonthExpenses)}</span>
            <span className="text-rose-700 font-semibold flex items-center gap-0.5">
              খরচের খতিয়ান <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Highlights: Dues Alert & Monthly Expense Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Dues Status Card */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-2xl p-5 border border-amber-200 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-950">বকেয়া চাঁদা সারসংক্ষেপ</h4>
                <p className="text-xs text-amber-800">যে সকল সদস্যের চাঁদা বাকি রয়েছে</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentTab('dues')}
              className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition"
            >
              বকেয়া তালিকা
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-amber-200/60">
            <div>
              <p className="text-xs text-amber-800">বকেয়াদার সদস্য</p>
              <p className="text-2xl font-bold text-amber-950 font-['Hind_Siliguri']">
                {toBanglaNumber(membersWithDuesCount)} জন
              </p>
            </div>
            <div>
              <p className="text-xs text-amber-800">মোট বকেয়া টাকার পরিমাণ</p>
              <p className="text-2xl font-bold text-rose-700 font-['Hind_Siliguri']">
                {toBanglaCurrency(totalDuesAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* This Month Financial Summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-800">
                  {currentMonthName} {toBanglaNumber(currentYearNum)}-এর হিসাব
                </h4>
              </div>
              <button
                onClick={() => setCurrentTab('monthly_report')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                মাসিক রিপোর্ট →
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">এ মাসে মোট চাঁদা জমা:</span>
                <span className="font-bold text-emerald-700">{toBanglaCurrency(thisMonthContributions)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">এ মাসে মোট খরচ:</span>
                <span className="font-bold text-rose-600">{toBanglaCurrency(thisMonthExpenses)}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">চলতি মাসের নেট সঞ্চয়:</span>
                <span
                  className={`font-bold ${
                    thisMonthContributions - thisMonthExpenses >= 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {toBanglaCurrency(thisMonthContributions - thisMonthExpenses)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-400 text-right">
            সর্বশেষ আপডেট: {formatBanglaDate(new Date().toISOString().split('T')[0])}
          </div>
        </div>
      </div>

      {/* Recent Transactions List (Requirement 2: সর্বশেষ জমা/খরচের তালিকা) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              সর্বশেষ জমা ও খরচের খতিয়ান
            </h3>
            <p className="text-xs text-slate-500">সাম্প্রতিক আর্থিক লেনদেনের তালিকা</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setTransactionFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                transactionFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              সব
            </button>
            <button
              onClick={() => setTransactionFilter('contribution')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                transactionFilter === 'contribution'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              চাঁদা
            </button>
            <button
              onClick={() => setTransactionFilter('income')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                transactionFilter === 'income'
                  ? 'bg-sky-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              অন্যান্য আয়
            </button>
            <button
              onClick={() => setTransactionFilter('expense')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                transactionFilter === 'expense'
                  ? 'bg-rose-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              খরচ
            </button>
          </div>
        </div>

        {/* Transactions Table / List */}
        <div className="divide-y divide-slate-100">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              কোনো লেনদেন পাওয়া যায়নি
            </div>
          ) : (
            recentTransactions.map((tx) => {
              const isIncome = tx.type === 'contribution' || tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  onClick={() => {
                    if (tx.refId) {
                      setSelectedMemberId(tx.refId);
                    }
                  }}
                  className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition ${
                    tx.refId ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'contribution'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tx.type === 'income'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                          {tx.title}
                        </p>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            tx.type === 'contribution'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : tx.type === 'income'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {tx.type === 'contribution' ? 'চাঁদা' : tx.type === 'income' ? 'আয়' : 'খরচ'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {tx.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-xs sm:text-sm font-bold font-['Hind_Siliguri'] ${
                        isIncome ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {toBanglaCurrency(tx.amount)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tx.date}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
