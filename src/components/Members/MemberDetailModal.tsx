import React, { useMemo, useState } from 'react';
import {
  X,
  Phone,
  Calendar,
  Wallet,
  Coins,
  CheckCircle2,
  AlertCircle,
  Printer,
  Download,
  Edit2,
  PlusCircle,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  toBanglaNumber,
  toBanglaCurrency,
  BANGLA_MONTHS,
  formatBanglaDate,
  getCurrentMonth,
  getCurrentYear,
  PAYMENT_METHODS,
} from '../../utils/bangla';
import { downloadCSV } from '../../utils/export';

interface MemberDetailModalProps {
  memberId: string;
  onClose: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ memberId, onClose }) => {
  const {
    membersMap,
    contributions,
    settings,
    openModal,
    updateMember,
    canEdit,
  } = useApp();

  const member = membersMap.get(memberId);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  if (!member) return null;

  // Filter member's contributions for selected year
  const memberContributions = useMemo(() => {
    return contributions.filter(
      (c) => c.member_id === memberId && Number(c.year) === selectedYear
    );
  }, [contributions, memberId, selectedYear]);

  // Map month -> contribution
  const monthContributionMap = useMemo(() => {
    const map = new Map<number, (typeof contributions)[0]>();
    memberContributions.forEach((c) => {
      map.set(Number(c.month), c);
    });
    return map;
  }, [memberContributions]);

  // Current year/month boundaries
  const currentYear = getCurrentYear();
  const currentMonth = getCurrentMonth();

  // Build the 12-month ledger for the year
  const monthlyLedger = useMemo(() => {
    const rows = [];
    // Only count months up to current month if viewing current year, or up to month 3/current
    const maxEvaluationMonth = selectedYear === currentYear ? Math.max(currentMonth, 3) : 12;

    const [joinYear, joinMonth] = member.joining_date.split('-').map(Number);

    for (let m = 1; m <= 12; m++) {
      const payment = monthContributionMap.get(m);
      const isPastOrCurrent =
        selectedYear < currentYear ||
        (selectedYear === currentYear && m <= maxEvaluationMonth);

      // Did the member join after this month?
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
        monthNumber: m,
        monthName: BANGLA_MONTHS[m],
        payment,
        status,
        expectedFee: member.monthly_fee,
      });
    }

    return rows;
  }, [monthContributionMap, selectedYear, currentYear, currentMonth, member]);

  // Summary figures
  const totalPaidInYear = memberContributions.reduce((acc, c) => acc + c.amount, 0);
  const duesCount = monthlyLedger.filter((r) => r.status === 'due').length;
  const totalDuesInYear = duesCount * member.monthly_fee;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['মাস', 'চাঁদার পরিমাণ (টাকা)', 'জমার তারিখ', 'পেমেন্ট পদ্ধতি', 'স্ট্যাটাস', 'ট্রানজেকশন/রসিদ'];
    const rows = monthlyLedger.map((row) => [
      row.monthName,
      row.payment ? row.payment.amount : row.expectedFee,
      row.payment ? row.payment.payment_date : '—',
      row.payment ? PAYMENT_METHODS[row.payment.payment_method] : '—',
      row.status === 'paid' ? 'জমা' : row.status === 'due' ? 'বকেয়া' : row.status === 'not_member' ? 'যোগদানের পূর্বে' : 'ভবিষ্যৎ',
      row.payment?.transaction_id || '',
    ]);

    downloadCSV(`${member.name}_চাঁদা_খতিয়ান_${selectedYear}`, [
      [`${settings.org_name} - সদস্য চাঁদা হিসাব বিবরণী`],
      [`সদস্যের নাম: ${member.name}`, `সদস্য ID: ${member.member_id}`],
      [`মোবাইল: ${member.phone}`, `মাসিক চাঁদা: ${member.monthly_fee} টাকা`],
      [''],
      headers,
      ...rows,
      [''],
      ['মোট আদায়', totalPaidInYear],
      ['মোট বকেয়া', totalDuesInYear],
    ]);
  };

  const toggleStatus = () => {
    if (!canEdit) return;
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    updateMember(member.id, { status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 print:max-h-none print:shadow-none print:border-none">
        
        {/* Printable Header - Visible when printing */}
        <div className="hidden print:block text-center p-6 border-b border-slate-300">
          <h1 className="text-xl font-bold">{settings.org_name}</h1>
          <p className="text-xs text-slate-600">{settings.tagline} • {settings.address}</p>
          <div className="mt-3 py-1 bg-slate-100 rounded text-sm font-semibold">
            সদস্যের চাঁদা ও আর্থিক খতিয়ান — বছর: {toBanglaNumber(selectedYear)}
          </div>
        </div>

        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
              {member.member_id}
            </span>
            <h3 className="text-base font-bold text-slate-900">সদস্যের বিস্তারিত বিবরণ ও চাঁদার ইতিহাস</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Member Profile Overview Card */}
          <div className="bg-gradient-to-br from-emerald-50/60 to-slate-50 rounded-2xl p-4 sm:p-5 border border-emerald-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {member.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{member.name}</h2>
                  <button
                    onClick={toggleStatus}
                    disabled={!canEdit}
                    title="স্ট্যাটাস পরিবর্তন করুন"
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition ${
                      member.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {member.status === 'active' ? 'সক্রিয় সদস্য' : 'নিষ্ক্রিয় সদস্য'}
                  </button>
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <a href={`tel:${member.phone}`} className="font-semibold text-emerald-800 hover:underline">
                    {toBanglaNumber(member.phone)}
                  </a>
                </p>
                {member.address && (
                  <p className="text-xs text-slate-500 mt-0.5">ঠিকানা: {member.address}</p>
                )}
              </div>
            </div>

            {/* Quick Financial pill */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
              <span className="text-xs text-slate-500">নির্ধারিত মাসিক চাঁদা:</span>
              <span className="text-lg font-bold text-slate-900 font-['Hind_Siliguri']">
                {toBanglaCurrency(member.monthly_fee)}
              </span>
              <span className="text-[11px] text-slate-400">
                যোগদান: {formatBanglaDate(member.joining_date)}
              </span>
            </div>
          </div>

          {/* Year Selector & Summary Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900">
                {toBanglaNumber(selectedYear)} সালের চাঁদার হিসাব তালিকা
              </h4>
              <div className="flex items-center gap-1.5 print:hidden">
                <span className="text-xs text-slate-500">বছর:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="text-xs bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value={2026}>২০২৬</option>
                  <option value={2025}>২০২৫</option>
                  <option value={2024}>২০২৪</option>
                </select>
              </div>
            </div>

            {/* Year Summary Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
              <div className="bg-emerald-50/80 rounded-xl p-3 border border-emerald-200">
                <p className="text-[11px] text-emerald-800">মোট জমা দিয়েছেন</p>
                <p className="text-base font-bold text-emerald-900 font-['Hind_Siliguri'] mt-0.5">
                  {toBanglaCurrency(totalPaidInYear)}
                </p>
              </div>
              <div className="bg-rose-50/80 rounded-xl p-3 border border-rose-200">
                <p className="text-[11px] text-rose-800">মোট বকেয়া আছে</p>
                <p className="text-base font-bold text-rose-900 font-['Hind_Siliguri'] mt-0.5">
                  {toBanglaCurrency(totalDuesInYear)}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-[11px] text-slate-600">বকেয়া মাস সংখ্যা</p>
                <p className="text-base font-bold text-slate-900 font-['Hind_Siliguri'] mt-0.5">
                  {toBanglaNumber(duesCount)} টি মাস
                </p>
              </div>
            </div>

            {/* Month-by-Month Table (Requirement 3) */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">মাস</th>
                    <th className="py-2.5 px-3">চাঁদা</th>
                    <th className="py-2.5 px-3">জমার তারিখ</th>
                    <th className="py-2.5 px-3">পদ্ধতি / রসিদ</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right print:hidden">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyLedger.map((row) => {
                    const isPaid = row.status === 'paid';
                    const isDue = row.status === 'due';
                    const isBeforeJoin = row.status === 'not_member';

                    return (
                      <tr
                        key={row.monthNumber}
                        className={`hover:bg-slate-50/80 transition ${
                          isDue ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {row.monthName}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 font-['Hind_Siliguri']">
                          {row.payment
                            ? toBanglaCurrency(row.payment.amount)
                            : isBeforeJoin
                            ? '—'
                            : toBanglaCurrency(row.expectedFee)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {row.payment
                            ? formatBanglaDate(row.payment.payment_date)
                            : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {row.payment ? (
                            <span>
                              {PAYMENT_METHODS[row.payment.payment_method]}
                              {row.payment.transaction_id && (
                                <span className="text-[10px] text-slate-400 block">
                                  #{row.payment.transaction_id}
                                </span>
                              )}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> জমা
                            </span>
                          ) : isDue ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <AlertCircle className="w-3 h-3" /> বকেয়া
                            </span>
                          ) : isBeforeJoin ? (
                            <span className="text-[10px] text-slate-400">
                              যোগদানের পূর্বে
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              ভবিষ্যৎ
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right print:hidden">
                          {isDue && canEdit ? (
                            <button
                              onClick={() => {
                                openModal('collect_fee', {
                                  member_id: member.id,
                                  month: row.monthNumber,
                                  year: selectedYear,
                                  amount: member.monthly_fee,
                                });
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95 transition shadow-xs"
                            >
                              জমা নিন
                            </button>
                          ) : isPaid && canEdit ? (
                            <button
                              onClick={() => {
                                openModal('edit_contribution', row.payment);
                              }}
                              className="px-2 py-1 text-[11px] font-medium rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100"
                            >
                              সম্পাদনা
                            </button>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Printable Signatures - only in Print mode */}
        <div className="hidden print:grid grid-cols-3 gap-6 pt-16 px-6 pb-6 text-center text-xs">
          <div className="border-t border-slate-400 pt-1 font-semibold">{settings.cashier_name}<br/>কোষাধ্যক্ষ</div>
          <div className="border-t border-slate-400 pt-1 font-semibold">{settings.secretary_name}<br/>সাধারণ সম্পাদক</div>
          <div className="border-t border-slate-400 pt-1 font-semibold">{settings.president_name}<br/>সভাপতি</div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>প্রিন্ট / PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>CSV ডাউনলোড</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                onClick={() => openModal('collect_fee', { member_id: member.id })}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>নতুন চাঁদা জমা</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
