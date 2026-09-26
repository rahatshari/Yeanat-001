import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Printer,
  Download,
  Users,
  CheckCircle,
  XCircle,
  Coins,
  AlertCircle,
  TrendingUp,
  Receipt,
  Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  toBanglaNumber,
  toBanglaCurrency,
  BANGLA_MONTHS,
  PAYMENT_METHODS,
  formatBanglaDate,
  getCurrentMonth,
  getCurrentYear,
} from '../../utils/bangla';
import { downloadCSV } from '../../utils/export';

export const MonthlyReport: React.FC = () => {
  const {
    members,
    contributions,
    incomeList,
    expenses,
    settings,
    currentBalance,
    totalIncome,
    allTimeExpenses,
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<number>(3); // March by default
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const monthReport = useMemo(() => {
    const activeMembers = members.filter((m) => m.status === 'active');
    const totalActiveCount = activeMembers.length;

    // Filter contributions for this month & year
    const monthContributions = contributions.filter(
      (c) => Number(c.month) === selectedMonth && Number(c.year) === selectedYear
    );

    const paidMemberIds = new Set<string>();
    let totalFeeCollected = 0;

    monthContributions.forEach((c) => {
      paidMemberIds.add(c.member_id);
      totalFeeCollected += c.amount;
    });

    const paidCount = paidMemberIds.size;
    const unpaidCount = Math.max(0, totalActiveCount - paidCount);

    // Unpaid members list
    const unpaidMembers = activeMembers.filter((m) => !paidMemberIds.has(m.id));
    const totalDuesThisMonth = unpaidMembers.reduce((sum, m) => sum + m.monthly_fee, 0);

    // Other income in this month
    const monthPrefix = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    const monthIncomeList = incomeList.filter((i) => i.date.startsWith(monthPrefix));
    const totalOtherIncome = monthIncomeList.reduce((sum, i) => sum + i.amount, 0);

    // Total expenses in this month
    const monthExpensesList = expenses.filter((e) => e.date.startsWith(monthPrefix));
    const totalExpenses = monthExpensesList.reduce((sum, e) => sum + e.amount, 0);

    // Net month result
    const netMonthSavings = totalFeeCollected + totalOtherIncome - totalExpenses;

    return {
      totalActiveCount,
      paidCount,
      unpaidCount,
      totalFeeCollected,
      totalDuesThisMonth,
      totalOtherIncome,
      totalExpenses,
      netMonthSavings,
      monthContributions,
      unpaidMembers,
      monthIncomeList,
      monthExpensesList,
    };
  }, [members, contributions, incomeList, expenses, selectedMonth, selectedYear]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const monthName = BANGLA_MONTHS[selectedMonth];
    const rows = [
      [`${settings.org_name} - ${monthName} ${selectedYear} মাসিক আর্থিক রিপোর্ট`],
      ['বিবরণ', 'মান / সংখ্যা / টাকা'],
      ['মোট সক্রিয় সদস্য', monthReport.totalActiveCount],
      ['কতজন চাঁদা দিয়েছে', monthReport.paidCount],
      ['কতজন চাঁদা দেয়নি (বকেয়া)', monthReport.unpaidCount],
      ['মোট চাঁদা আদায়', monthReport.totalFeeCollected],
      ['এই মাসের মোট বকেয়া চাঁদা', monthReport.totalDuesThisMonth],
      ['অন্যান্য আয়', monthReport.totalOtherIncome],
      ['এই মাসের মোট খরচ', monthReport.totalExpenses],
      ['মাসের মোট নিট সাশ্রয়', monthReport.netMonthSavings],
      ['বর্তমানে সংগঠনের সর্বমোট ব্যালেন্স', currentBalance],
    ];

    downloadCSV(`মাসিক_রিপোর্ট_${monthName}_${selectedYear}`, rows);
  };

  return (
    <div className="space-y-5 pb-14">
      {/* Top Filter & Buttons */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-700" />
            মাসিক আর্থিক ও চাঁদা রিপোর্ট
          </h2>
          <p className="text-xs text-slate-500">
            নির্দিষ্ট মাসের সদস্য চাঁদা আদায় ও খরচের বিস্তারিত পর্যালোচনামূলক খতিয়ান
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
          >
            {Object.entries(BANGLA_MONTHS).map(([mNum, mName]) => (
              <option key={mNum} value={mNum}>
                {mName}
              </option>
            ))}
          </select>

          {/* Year selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value={2026}>২০২৬</option>
            <option value={2025}>২০২৫</option>
            <option value={2024}>২০২৪</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট / PDF</span>
          </button>
        </div>
      </div>

      {/* Report Document Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 print:p-0 print:border-none print:shadow-none">
        {/* Printable Header */}
        <div className="text-center pb-6 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {settings.org_name}
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            {settings.tagline} • {settings.address}
          </p>
          <div className="mt-3 inline-block px-5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
            {BANGLA_MONTHS[selectedMonth]} {toBanglaNumber(selectedYear)} মাসের সামগ্রিক আর্থিক রিপোর্ট
          </div>
        </div>

        {/* 8 Primary Cards required by Requirement 11 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {/* 1. মোট সদস্য */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">মোট সদস্য</span>
            <span className="text-xl font-extrabold text-slate-900 font-['Hind_Siliguri'] mt-0.5 block">
              {toBanglaNumber(monthReport.totalActiveCount)} জন
            </span>
          </div>

          {/* 2. কতজন চাঁদা দিয়েছে */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 block">কতজন চাঁদা দিয়েছে</span>
            <span className="text-xl font-extrabold text-emerald-900 font-['Hind_Siliguri'] mt-0.5 block">
              {toBanglaNumber(monthReport.paidCount)} জন
            </span>
          </div>

          {/* 3. কতজন দেয়নি */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-800 block">কতজন দেয়নি</span>
            <span className="text-xl font-extrabold text-rose-700 font-['Hind_Siliguri'] mt-0.5 block">
              {toBanglaNumber(monthReport.unpaidCount)} জন
            </span>
          </div>

          {/* 4. মোট চাঁদা আদায় */}
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
            <span className="text-[11px] font-semibold text-teal-800 block">মোট চাঁদা আদায়</span>
            <span className="text-xl font-extrabold text-teal-900 font-['Hind_Siliguri'] mt-0.5 block">
              {toBanglaCurrency(monthReport.totalFeeCollected)}
            </span>
          </div>

          {/* 5. মোট বকেয়া */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 block">মোট বকেয়া</span>
            <span className="text-xl font-extrabold text-amber-900 font-['Hind_Siliguri'] mt-0.5 block">
              {toBanglaCurrency(monthReport.totalDuesThisMonth)}
            </span>
          </div>

          {/* 6. অন্যান্য আয় */}
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
            <span className="text-[11px] font-semibold text-sky-800 block">অন্যান্য আয়</span>
            <span className="text-xl font-extrabold text-sky-900 font-['Hind_Siliguri'] mt-0.5 block">
              {toBanglaCurrency(monthReport.totalOtherIncome)}
            </span>
          </div>

          {/* 7. মোট খরচ */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-800 block">মোট খরচ</span>
            <span className="text-xl font-extrabold text-rose-700 font-['Hind_Siliguri'] mt-0.5 block">
              {toBanglaCurrency(monthReport.totalExpenses)}
            </span>
          </div>

          {/* 8. বর্তমান ব্যালেন্স */}
          <div className="p-3.5 rounded-2xl bg-emerald-800 text-white shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-200 block">বর্তমান মোট ব্যালেন্স</span>
            <span className="text-xl font-black text-white font-['Hind_Siliguri'] mt-0.5 block">
              {toBanglaCurrency(currentBalance)}
            </span>
          </div>
        </div>

        {/* Detailed Breakdown for this month */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Who Paid this Month */}
          <div className="border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>চাঁদা জমাদানকারী সম্মানিত সদস্যবৃন্দ ({toBanglaNumber(monthReport.paidCount)} জন)</span>
              <span className="text-emerald-700 font-['Hind_Siliguri']">{toBanglaCurrency(monthReport.totalFeeCollected)}</span>
            </h4>
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2 text-xs">
              {monthReport.monthContributions.length === 0 ? (
                <p className="py-4 text-center text-slate-400">এই মাসে কোনো চাঁদা জমা হয়নি</p>
              ) : (
                monthReport.monthContributions.map((c) => {
                  const m = members.find((mem) => mem.id === c.member_id);
                  return (
                    <div key={c.id} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800">{m?.name || 'সদস্য'}</span>
                        <span className="text-[10px] text-slate-400 block">{m?.member_id} • {formatBanglaDate(c.payment_date)}</span>
                      </div>
                      <span className="font-bold text-teal-800 font-['Hind_Siliguri']">{toBanglaCurrency(c.amount)}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Who did NOT Pay (Unpaid) */}
          <div className="border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>বকেয়াদার সদস্যবৃন্দ ({toBanglaNumber(monthReport.unpaidCount)} জন)</span>
              <span className="text-rose-700 font-['Hind_Siliguri']">{toBanglaCurrency(monthReport.totalDuesThisMonth)}</span>
            </h4>
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2 text-xs">
              {monthReport.unpaidMembers.length === 0 ? (
                <p className="py-4 text-center text-emerald-600 font-medium">আলহামদুলিল্লাহ! এই মাসে সবার চাঁদা জমা হয়েছে</p>
              ) : (
                monthReport.unpaidMembers.map((m) => (
                  <div key={m.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">{m.name}</span>
                      <span className="text-[10px] text-slate-400 block">{m.member_id} • {toBanglaNumber(m.phone)}</span>
                    </div>
                    <span className="font-bold text-rose-600 font-['Hind_Siliguri']">{toBanglaCurrency(m.monthly_fee)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-6 pt-16 text-center text-xs text-slate-700">
          <div>
            <div className="border-t border-slate-400 pt-1 font-bold">{settings.cashier_name}</div>
            <p className="text-[10px] text-slate-500">কোষাধ্যক্ষ</p>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-1 font-bold">{settings.secretary_name}</div>
            <p className="text-[10px] text-slate-500">সাধারণ সম্পাদক</p>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-1 font-bold">{settings.president_name}</div>
            <p className="text-[10px] text-slate-500">সভাপতি</p>
          </div>
        </div>
      </div>
    </div>
  );
};
