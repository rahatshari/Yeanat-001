import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Printer,
  Download,
  Phone,
  Coins,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  toBanglaNumber,
  toBanglaCurrency,
  BANGLA_MONTHS,
  formatBanglaDate,
  PAYMENT_METHODS,
  getCurrentMonth,
  getCurrentYear,
} from '../../utils/bangla';
import { downloadCSV } from '../../utils/export';

export const MemberReport: React.FC = () => {
  const { members, contributions, settings } = useApp();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    members.length > 0 ? members[0].id : ''
  );
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const selectedMember = useMemo(() => {
    return members.find((m) => m.id === selectedMemberId);
  }, [members, selectedMemberId]);

  const memberContributions = useMemo(() => {
    if (!selectedMemberId) return [];
    return contributions.filter(
      (c) => c.member_id === selectedMemberId && Number(c.year) === selectedYear
    );
  }, [contributions, selectedMemberId, selectedYear]);

  const monthMap = useMemo(() => {
    const map = new Map<number, (typeof contributions)[0]>();
    memberContributions.forEach((c) => {
      map.set(Number(c.month), c);
    });
    return map;
  }, [memberContributions]);

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const fullYearBreakdown = useMemo(() => {
    if (!selectedMember) return [];
    const rows = [];
    const maxEvaluationMonth = selectedYear === currentYear ? Math.max(currentMonth, 3) : 12;
    const [joinYear, joinMonth] = selectedMember.joining_date.split('-').map(Number);

    for (let m = 1; m <= 12; m++) {
      const payment = monthMap.get(m);
      const isPastOrCurrent =
        selectedYear < currentYear || (selectedYear === currentYear && m <= maxEvaluationMonth);
      const isBeforeJoin =
        joinYear > selectedYear || (joinYear === selectedYear && joinMonth > m);

      let status: 'paid' | 'due' | 'future' | 'not_member';
      if (isBeforeJoin) {
        status = 'not_member';
      } else if (payment) {
        status = 'paid';
      } else if (isPastOrCurrent) {
        status = 'due';
      } else {
        status = 'future';
      }

      rows.push({
        month: m,
        monthName: BANGLA_MONTHS[m],
        payment,
        status,
        amount: payment ? payment.amount : selectedMember.monthly_fee,
      });
    }

    return rows;
  }, [selectedMember, monthMap, selectedYear, currentYear, currentMonth]);

  const totalPaid = memberContributions.reduce((acc, c) => acc + c.amount, 0);
  const duesRows = fullYearBreakdown.filter((r) => r.status === 'due');
  const duesCount = duesRows.length;
  const totalDue = duesCount * (selectedMember?.monthly_fee || 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!selectedMember) return;
    const headers = [
      'মাস',
      'নির্ধারিত চাঁদা (টাকা)',
      'পরিশোধিত টাকা',
      'জমার তারিখ',
      'পেমেন্ট পদ্ধতি',
      'স্ট্যাটাস',
      'রসিদ নম্বর',
    ];

    const rows = fullYearBreakdown.map((r) => [
      r.monthName,
      selectedMember.monthly_fee,
      r.payment ? r.payment.amount : 0,
      r.payment ? r.payment.payment_date : '—',
      r.payment ? PAYMENT_METHODS[r.payment.payment_method] : '—',
      r.status === 'paid' ? 'জমা' : r.status === 'due' ? 'বকেয়া' : 'ভবিষ্যৎ/অপ্রযোজ্য',
      r.payment?.transaction_id || '',
    ]);

    downloadCSV(`${selectedMember.name}_${selectedYear}_রিপোর্ট`, [
      [`${settings.org_name} - সদস্যভিত্তিক চাঁদা রিপোর্ট`],
      [`সদস্যের নাম: ${selectedMember.name}`],
      [`সদস্য নম্বর: ${selectedMember.member_id}`],
      [`মোবাইল: ${selectedMember.phone}`],
      [`মাসিক চাঁদা: ${selectedMember.monthly_fee} টাকা`],
      [`যোগদানের তারিখ: ${selectedMember.joining_date}`],
      [`মোট আদায়: ${totalPaid} টাকা`, `মোট বকেয়া: ${totalDue} টাকা (${duesCount} টি মাস)`],
      [''],
      headers,
      ...rows,
    ]);
  };

  return (
    <div className="space-y-5 pb-14">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-700" />
            সদস্যভিত্তিক ব্যক্তিগত চাঁদা রিপোর্ট
          </h2>
          <p className="text-xs text-slate-500">
            যেকোনো সদস্যের নাম নির্বাচন করে তার বার্ষিক পূর্ণাঙ্গ রিপোর্ট তৈরি করুন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Member dropdown */}
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none max-w-xs"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.member_id} - {m.name}
              </option>
            ))}
          </select>

          {/* Year selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
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

      {/* Member Report Document */}
      {selectedMember ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 print:p-0 print:border-none print:shadow-none">
          {/* Header */}
          <div className="text-center pb-6 border-b border-slate-200">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {settings.org_name}
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              {settings.tagline} • {settings.address}
            </p>
            <div className="mt-3 inline-block px-5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              সদস্য ব্যক্তিগত চাঁদা ও বকেয়া খতিয়ান — বছর: {toBanglaNumber(selectedYear)}
            </div>
          </div>

          {/* Member Bio Box (Requirement 10) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">সদস্যের নাম:</span>
              <span className="font-bold text-slate-900 text-sm block mt-0.5">{selectedMember.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">সদস্য ID / নম্বর:</span>
              <span className="font-bold text-emerald-800 text-sm block mt-0.5">{selectedMember.member_id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">মোবাইল নম্বর:</span>
              <span className="font-bold text-slate-900 block mt-0.5">{toBanglaNumber(selectedMember.phone)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">নির্ধারিত মাসিক চাঁদা:</span>
              <span className="font-bold text-slate-900 block mt-0.5 font-['Hind_Siliguri']">{toBanglaCurrency(selectedMember.monthly_fee)}</span>
            </div>
          </div>

          {/* Summary Figures (Requirement 10: মোট কত টাকা দিয়েছে, কত টাকা বকেয়া, কত মাস বকেয়া) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs text-emerald-800 font-semibold block">মোট পরিশোধিত চাঁদা</span>
              <span className="text-2xl font-black text-emerald-950 font-['Hind_Siliguri'] mt-1 block">
                {toBanglaCurrency(totalPaid)}
              </span>
              <span className="text-[11px] text-emerald-700 mt-0.5 block">
                পরিশোধিত মাস: {toBanglaNumber(memberContributions.length)} টি
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-xs text-rose-800 font-semibold block">মোট বকেয়া চাঁদা</span>
              <span className="text-2xl font-black text-rose-700 font-['Hind_Siliguri'] mt-1 block">
                {toBanglaCurrency(totalDue)}
              </span>
              <span className="text-[11px] text-rose-600 mt-0.5 block">
                বকেয়া মাস সংখ্যা: {toBanglaNumber(duesCount)} টি
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <span className="text-xs text-slate-600 font-semibold block">সদস্যের বর্তমান স্ট্যাটাস</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">
                {selectedMember.status === 'active' ? 'সক্রিয় সদস্য' : 'নিষ্ক্রিয় সদস্য'}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                যোগদান: {formatBanglaDate(selectedMember.joining_date)}
              </span>
            </div>
          </div>

          {/* Month-wise Full History Table (Requirement 10) */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">মাস</th>
                  <th className="py-2.5 px-3">নির্ধারিত চাঁদা</th>
                  <th className="py-2.5 px-3">জমার তারিখ</th>
                  <th className="py-2.5 px-3">পদ্ধতি ও রসিদ</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">আদায়কৃত টাকা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fullYearBreakdown.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {row.monthName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-['Hind_Siliguri']">
                      {toBanglaCurrency(selectedMember.monthly_fee)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {row.payment ? formatBanglaDate(row.payment.payment_date) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {row.payment ? (
                        <span>
                          {PAYMENT_METHODS[row.payment.payment_method]}
                          {row.payment.transaction_id && (
                            <span className="text-[10px] text-slate-400 block font-mono">
                              #{row.payment.transaction_id}
                            </span>
                          )}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {row.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> জমা
                        </span>
                      ) : row.status === 'due' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertCircle className="w-3 h-3" /> বকেয়া
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold font-['Hind_Siliguri'] text-slate-900">
                      {row.payment ? toBanglaCurrency(row.payment.amount) : '০'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td colSpan={5} className="py-3 px-3 text-slate-800 text-right">
                    সর্বমোট আদায়কৃত চাঁদা:
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-900 text-sm font-['Hind_Siliguri']">
                    {toBanglaCurrency(totalPaid)}
                  </td>
                </tr>
              </tbody>
            </table>
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
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-xs">
          কোনো সদস্য পাওয়া যায়নি
        </div>
      )}
    </div>
  );
};
