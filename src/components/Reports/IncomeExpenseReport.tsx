import React, { useState, useMemo } from 'react';
import {
  Scale,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  Receipt,
  Wallet,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  toBanglaNumber,
  toBanglaCurrency,
  formatBanglaDate,
  getCurrentYear,
} from '../../utils/bangla';
import { exportFullFinancialStatementCSV } from '../../utils/export';

export const IncomeExpenseReport: React.FC = () => {
  const {
    contributions,
    incomeList,
    expenses,
    settings,
    categories,
  } = useApp();

  const currentYear = getCurrentYear();
  const [fromDate, setFromDate] = useState<string>(`${currentYear}-01-01`);
  const [toDate, setToDate] = useState<string>(`${currentYear}-12-31`);

  // Financial Calculations based on date range:
  const financialData = useMemo(() => {
    // 1. Opening Balance (Before fromDate)
    const priorContributions = contributions
      .filter((c) => c.payment_date < fromDate)
      .reduce((sum, c) => sum + c.amount, 0);

    const priorOtherIncome = incomeList
      .filter((i) => i.date < fromDate)
      .reduce((sum, i) => sum + i.amount, 0);

    const priorExpenses = expenses
      .filter((e) => e.date < fromDate)
      .reduce((sum, e) => sum + e.amount, 0);

    const openingBalance = priorContributions + priorOtherIncome - priorExpenses;

    // 2. In-period Contributions
    const periodContributionsList = contributions.filter(
      (c) => c.payment_date >= fromDate && c.payment_date <= toDate
    );
    const contributionsTotal = periodContributionsList.reduce(
      (sum, c) => sum + c.amount,
      0
    );

    // 3. In-period Other Income
    const periodIncomeList = incomeList.filter(
      (i) => i.date >= fromDate && i.date <= toDate
    );
    const otherIncomeTotal = periodIncomeList.reduce(
      (sum, i) => sum + i.amount,
      0
    );

    // সর্বমোট আয় = চাঁদা + অন্যান্য আয়
    const totalIncome = contributionsTotal + otherIncomeTotal;

    // 4. In-period Expenses
    const periodExpensesList = expenses.filter(
      (e) => e.date >= fromDate && e.date <= toDate
    );
    const expensesTotal = periodExpensesList.reduce(
      (sum, e) => sum + e.amount,
      0
    );

    // 5. Category-wise expense breakdown
    const categoryExpenseMap = new Map<string, number>();
    periodExpensesList.forEach((e) => {
      const current = categoryExpenseMap.get(e.category) || 0;
      categoryExpenseMap.set(e.category, current + e.amount);
    });

    const categoryExpenses = Array.from(categoryExpenseMap.entries()).map(
      ([cat, amt]) => ({
        category: cat,
        amount: amt,
        percentage: expensesTotal > 0 ? Math.round((amt / expensesTotal) * 100) : 0,
      })
    );

    // Sort highest expense first
    categoryExpenses.sort((a, b) => b.amount - a.amount);

    // 6. Current Balance = শুরুতে ব্যালেন্স + সর্বমোট আয় - সর্বমোট খরচ
    const currentBalance = openingBalance + totalIncome - expensesTotal;

    return {
      openingBalance,
      contributionsTotal,
      otherIncomeTotal,
      totalIncome,
      expensesTotal,
      currentBalance,
      categoryExpenses,
      periodContributionsCount: periodContributionsList.length,
      periodIncomeCount: periodIncomeList.length,
      periodExpensesCount: periodExpensesList.length,
    };
  }, [contributions, incomeList, expenses, fromDate, toDate]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportFullFinancialStatementCSV(
      settings,
      fromDate,
      toDate,
      financialData.openingBalance,
      financialData.contributionsTotal,
      financialData.otherIncomeTotal,
      financialData.totalIncome,
      financialData.expensesTotal,
      financialData.currentBalance,
      financialData.categoryExpenses
    );
  };

  return (
    <div className="space-y-5 pb-14">
      {/* Date Range Selector and Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            আয়-ব্যয় হিসাব রিপোর্ট
          </h2>
          <p className="text-xs text-slate-500">
            নির্দিষ্ট তারিখ অনুযায়ী সামগ্রিক আর্থিক হিসাব বিবরণী
          </p>
        </div>

        {/* Date Inputs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-500 font-medium">হতে:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-slate-900 font-semibold focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-500 font-medium">পর্যন্ত:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent text-slate-900 font-semibold focus:outline-none"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Excel/CSV ডাউনলোড"
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

      {/* Main Report Container - Ready for Screen & Native Browser Print */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Printable Letterhead Header */}
        <div className="text-center pb-6 border-b border-slate-200">
          <div className="inline-block p-2 rounded-2xl bg-emerald-700 text-white font-black text-xl mb-1.5 print:hidden">
            পা
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {settings.org_name}
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            {settings.tagline}
          </p>
          <p className="text-xs text-slate-500">
            ঠিকানা: {settings.address} • মোবাইল: {toBanglaNumber(settings.contact_phone)}
          </p>
          <div className="mt-4 inline-block px-5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
            আয়-ব্যয় হিসাব রিপোর্ট (সময়কাল: {formatBanglaDate(fromDate)} থেকে {formatBanglaDate(toDate)})
          </div>
        </div>

        {/* 4 Primary Formula Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">
              শুরুতে ব্যালেন্স (পূর্বের জের)
            </span>
            <span className="text-xl font-extrabold text-slate-800 font-['Hind_Siliguri'] mt-1 block">
              {toBanglaCurrency(financialData.openingBalance)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 block">
              সর্বমোট অর্জিত আয়
            </span>
            <span className="text-xl font-extrabold text-emerald-900 font-['Hind_Siliguri'] mt-1 block">
              +{toBanglaCurrency(financialData.totalIncome)}
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">
              চাঁদা: {toBanglaCurrency(financialData.contributionsTotal)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-800 block">
              সর্বমোট মোট খরচ
            </span>
            <span className="text-xl font-extrabold text-rose-700 font-['Hind_Siliguri'] mt-1 block">
              -{toBanglaCurrency(financialData.expensesTotal)}
            </span>
            <span className="text-[10px] text-rose-600 block mt-0.5">
              ভাউচার: {toBanglaNumber(financialData.periodExpensesCount)} টি
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-900 text-white shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-200 block">
              বর্তমান ব্যালেন্স (স্থিতি)
            </span>
            <span className="text-2xl font-black text-white font-['Hind_Siliguri'] mt-1 block">
              {toBanglaCurrency(financialData.currentBalance)}
            </span>
            <span className="text-[10px] text-emerald-200/90 block mt-0.5">
              হাতে নগদ ক্যাশ ব্যালেন্স
            </span>
          </div>
        </div>

        {/* Financial Breakdown Table (Requirement 9) */}
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2.5 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>১. আয়ের বিস্তারিত সারসংক্ষেপ</span>
              <span className="text-emerald-700 font-semibold font-['Hind_Siliguri']">
                সর্বমোট আয়: {toBanglaCurrency(financialData.totalIncome)}
              </span>
            </h3>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 text-slate-700 font-medium">
                    সদস্যদের নিয়মিত মাসিক চাঁদা আদায় ({toBanglaNumber(financialData.periodContributionsCount)} টি রসিদ)
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900 font-['Hind_Siliguri']">
                    {toBanglaCurrency(financialData.contributionsTotal)}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 text-slate-700 font-medium">
                    অন্যান্য উৎস, এককালীন দান ও অনুদান ({toBanglaNumber(financialData.periodIncomeCount)} টি প্রাপ্তি)
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900 font-['Hind_Siliguri']">
                    {toBanglaCurrency(financialData.otherIncomeTotal)}
                  </td>
                </tr>
                <tr className="bg-emerald-50/50 font-bold border-t border-emerald-200">
                  <td className="py-2.5 text-emerald-900">
                    সর্বমোট অর্জিত আয় (চাঁদা + অন্যান্য আয়)
                  </td>
                  <td className="py-2.5 text-right text-emerald-900 text-sm font-['Hind_Siliguri']">
                    {toBanglaCurrency(financialData.totalIncome)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Category-wise Expenses Breakdown Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2.5 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>২. খরচের খাত অনুযায়ী বিস্তারিত হিসাব</span>
              <span className="text-rose-700 font-semibold font-['Hind_Siliguri']">
                সর্বমোট খরচ: {toBanglaCurrency(financialData.expensesTotal)}
              </span>
            </h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold text-[11px]">
                  <th className="py-1.5 text-left">খরচের খাত</th>
                  <th className="py-1.5 text-center">শতকরা হার</th>
                  <th className="py-1.5 text-right">টাকার পরিমাণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {financialData.categoryExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-slate-400">
                      এই সময়কালে কোনো খরচ হয়নি
                    </td>
                  </tr>
                ) : (
                  financialData.categoryExpenses.map((cat) => (
                    <tr key={cat.category} className="hover:bg-slate-50">
                      <td className="py-2.5 font-medium text-slate-800">
                        {cat.category}
                      </td>
                      <td className="py-2.5 text-center text-slate-500">
                        {toBanglaNumber(cat.percentage)}%
                      </td>
                      <td className="py-2.5 text-right font-bold text-rose-700 font-['Hind_Siliguri']">
                        {toBanglaCurrency(cat.amount)}
                      </td>
                    </tr>
                  ))
                )}
                <tr className="bg-rose-50/50 font-bold border-t border-rose-200">
                  <td className="py-2.5 text-rose-900">সর্বমোট মোট খরচ</td>
                  <td className="py-2.5 text-center text-rose-900">১০০%</td>
                  <td className="py-2.5 text-right text-rose-900 text-sm font-['Hind_Siliguri']">
                    {toBanglaCurrency(financialData.expensesTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Final Formula Box (Requirement 9) */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300">
            <h4 className="text-xs font-bold text-slate-900 mb-2">হিসাবের চূড়ান্ত ফলাফল:</h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>প্রারম্ভিক ব্যালেন্স (পূর্বের স্থিতি):</span>
                <span className="font-semibold font-['Hind_Siliguri']">{toBanglaCurrency(financialData.openingBalance)}</span>
              </div>
              <div className="flex justify-between text-emerald-800">
                <span>যোগ: সর্বমোট অর্জিত আয়:</span>
                <span className="font-bold font-['Hind_Siliguri']">+{toBanglaCurrency(financialData.totalIncome)}</span>
              </div>
              <div className="flex justify-between text-rose-700">
                <span>বাদ: সর্বমোট ব্যয়/খরচ:</span>
                <span className="font-bold font-['Hind_Siliguri']">-{toBanglaCurrency(financialData.expensesTotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-300">
                <span>বর্তমান স্থিতি / ব্যালেন্স (ক্যাশ ইন হ্যান্ড):</span>
                <span className="font-['Hind_Siliguri'] text-emerald-900 text-base">
                  {toBanglaCurrency(financialData.currentBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Official Committee Signatures for Printable Reports */}
        <div className="grid grid-cols-3 gap-6 pt-20 text-center text-xs text-slate-700">
          <div>
            <div className="border-t border-slate-400 pt-1.5 font-bold">
              {settings.cashier_name}
            </div>
            <p className="text-[11px] text-slate-500">অর্থ সম্পাদক / কোষাধ্যক্ষ</p>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-1.5 font-bold">
              {settings.secretary_name}
            </div>
            <p className="text-[11px] text-slate-500">সাধারণ সম্পাদক</p>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-1.5 font-bold">
              {settings.president_name}
            </div>
            <p className="text-[11px] text-slate-500">সভাপতি</p>
          </div>
        </div>
      </div>
    </div>
  );
};
