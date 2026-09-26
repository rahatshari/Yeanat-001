import React from 'react';
import {
  FileSpreadsheet,
  Scale,
  CalendarDays,
  UserCheck,
  AlertCircle,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  Receipt,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  exportMembersToCSV,
  exportContributionsToCSV,
  exportIncomeToCSV,
  exportExpensesToCSV,
} from '../../utils/export';

export const AllReportsHub: React.FC = () => {
  const {
    setCurrentTab,
    members,
    contributions,
    incomeList,
    expenses,
    membersMap,
    membersWithDuesCount,
  } = useApp();

  return (
    <div className="space-y-6 pb-14">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-purple-700" />
          সকল আর্থিক ও প্রাতিষ্ঠানিক রিপোর্ট কেন্দ্র
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          সংগঠনের প্রয়োজনীয় সকল আর্থিক বিবরণী, অডিট শিট ও ডেটাবেজ এক্সপোর্ট এক নজরে
        </p>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Income-Expense Full Report */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">আয়-ব্যয় অডিট রিপোর্ট</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              নির্দিষ্ট তারিখ সীমা নির্ধারণ করে প্রারম্ভিক ব্যালেন্স, মোট চাঁদা, আয়, খাতওয়ারী খরচ এবং বর্তমান স্থিতি।
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('income_expense_report')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>রিপোর্ট দেখুন ও প্রিন্ট করুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Monthly Report */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">মাসিক পূর্ণাঙ্গ রিপোর্ট</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              মাস নির্বাচন করে কতজন চাঁদা দিয়েছে, কতজন দেয়নি, মোট চাঁদা ও বকেয়া, অন্যান্য আয় ও খরচের বিস্তারিত।
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('monthly_report')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>মাসিক রিপোর্ট দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. Member-wise Report */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-sky-400 hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-3">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">সদস্যভিত্তিক ব্যক্তিগত খতিয়ান</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              যেকোনো নির্দিষ্ট সদস্যের ১২ মাসের চাঁদা প্রদানের ইতিহাস, জমার তারিখ, বকেয়া মাস এবং মোট হিসাব।
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('member_report')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>সদস্য রিপোর্ট দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. Dues Report */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">বকেয়া চাঁদা রিপোর্ট</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              কোন কোন সদস্যের কত মাসের চাঁদা বকেয়া আছে তার তালিকা এবং দ্রুত তা আদায়ের ব্যবস্থা।
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('dues')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>বকেয়া খতিয়ান ({membersWithDuesCount} জন)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5. Expense Breakdown Report */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-rose-400 hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-3">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">খরচের ভাউচার খতিয়ান</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              উন্নয়ন, শিক্ষা, চিকিৎসা, সামাজিক ও ধর্মীয় কার্যক্রমের সকল ব্যয়ের বিবরণ ও বিল রসিদ।
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('expenses')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>খরচের খতিয়ান দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Excel Downloads Box (Requirement 13: Excel/CSV Export) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
          <Download className="w-4 h-4 text-emerald-700" />
          দ্রুত Excel / CSV ডেটা এক্সপোর্ট (বাংলা ইউনিকোড সাপোর্টেড)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          সকল ফাইল Microsoft Excel এবং Google Sheets-এ সরাসরি বাংলা ফন্টে উন্মুক্ত হবে
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => exportMembersToCSV(members)}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>সদস্য তালিকা</span>
          </button>

          <button
            onClick={() => exportContributionsToCSV(contributions, membersMap)}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-teal-700" />
            <span>সকল চাঁদা জমা</span>
          </button>

          <button
            onClick={() => exportIncomeToCSV(incomeList)}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 transition"
          >
            <TrendingUp className="w-4 h-4 text-sky-700" />
            <span>অন্যান্য আয় শিট</span>
          </button>

          <button
            onClick={() => exportExpensesToCSV(expenses)}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Receipt className="w-4 h-4 text-rose-700" />
            <span>সকল খরচের তালিকা</span>
          </button>
        </div>
      </div>
    </div>
  );
};
