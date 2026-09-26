import React, { useState, useMemo } from 'react';
import {
  Coins,
  Search,
  Plus,
  Download,
  Filter,
  Calendar,
  Wallet,
  Edit2,
  Trash2,
  Receipt,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Contribution } from '../../types';
import {
  toBanglaNumber,
  toBanglaCurrency,
  BANGLA_MONTHS,
  PAYMENT_METHODS,
  formatBanglaDate,
  getCurrentYear,
} from '../../utils/bangla';
import { exportContributionsToCSV } from '../../utils/export';

export const ContributionList: React.FC = () => {
  const {
    contributions,
    membersMap,
    openModal,
    deleteContribution,
    setSelectedMemberId,
    canEdit,
    isAdmin,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

  const filteredContributions = useMemo(() => {
    return contributions.filter((c) => {
      const member = membersMap.get(c.member_id);
      const memberName = member ? member.name.toLowerCase() : '';
      const memberId = member ? member.member_id.toLowerCase() : '';
      const receiptNo = (c.transaction_id || '').toLowerCase();

      const matchSearch =
        memberName.includes(searchTerm.toLowerCase()) ||
        memberId.includes(searchTerm.toLowerCase()) ||
        receiptNo.includes(searchTerm.toLowerCase()) ||
        (c.note && c.note.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchMonth =
        selectedMonth === 'all' ? true : Number(c.month) === Number(selectedMonth);

      const matchYear = Number(c.year) === selectedYear;

      const matchMethod =
        selectedMethod === 'all' ? true : c.payment_method === selectedMethod;

      return matchSearch && matchMonth && matchYear && matchMethod;
    });
  }, [contributions, membersMap, searchTerm, selectedMonth, selectedYear, selectedMethod]);

  const totalFilteredAmount = useMemo(() => {
    return filteredContributions.reduce((acc, c) => acc + c.amount, 0);
  }, [filteredContributions]);

  const handleDelete = (contribution: Contribution) => {
    const member = membersMap.get(contribution.member_id);
    if (
      window.confirm(
        `আপনি কি নিশ্চিত যে ${member?.name || 'সদস্যের'} ${
          BANGLA_MONTHS[contribution.month]
        } মাসের ৳${contribution.amount} চাঁদা রেকর্ড মুছে ফেলতে চান?`
      )
    ) {
      deleteContribution(contribution.id);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-teal-700" />
            মাসিক চাঁদা আদায় তালিকা
          </h2>
          <p className="text-xs text-slate-500">
            নির্বাচিত সময়কালে মোট আদায়: <span className="font-bold text-teal-800">{toBanglaCurrency(totalFilteredAmount)}</span> ({toBanglaNumber(filteredContributions.length)} টি জমা)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportContributionsToCSV(contributions, membersMap)}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Excel/CSV আকারে ডাউনলোড"
          >
            <Download className="w-3.5 h-3.5 text-teal-700" />
            <span>Excel Export</span>
          </button>

          {canEdit && (
            <button
              onClick={() => openModal('collect_fee')}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>চাঁদা জমা নিন</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="সদস্যের নাম বা রসিদ দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          {/* Month Selector */}
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-700 font-medium"
            >
              <option value="all">সকল মাস</option>
              {Object.entries(BANGLA_MONTHS).map(([mNum, mName]) => (
                <option key={mNum} value={mNum}>
                  {mName}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-700 font-medium"
            >
              <option value={2026}>২০২৬ সাল</option>
              <option value={2025}>২০২৫ সাল</option>
              <option value={2024}>২০২৪ সাল</option>
            </select>
          </div>

          {/* Payment Method Selector */}
          <div>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-700 font-medium"
            >
              <option value="all">সকল পেমেন্ট পদ্ধতি</option>
              <option value="cash">নগদ</option>
              <option value="bank">ব্যাংক</option>
              <option value="mobile_banking">মোবাইল ব্যাংকিং</option>
              <option value="other">অন্যান্য</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contributions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3.5">রসিদ / তারিখ</th>
                <th className="py-3 px-3.5">সদস্যের তথ্য</th>
                <th className="py-3 px-3.5">চাঁদার মাস</th>
                <th className="py-3 px-3.5">পদ্ধতি</th>
                <th className="py-3 px-3.5 text-right">পরিমাণ (টাকা)</th>
                <th className="py-3 px-3.5 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContributions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    কোনো চাঁদা জমার রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredContributions.map((c) => {
                  const member = membersMap.get(c.member_id);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition">
                      {/* Receipt & Date */}
                      <td className="py-3 px-3.5">
                        <span className="font-mono font-bold text-slate-800 text-[11px] block">
                          {c.transaction_id || `#${c.id.slice(-6)}`}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatBanglaDate(c.payment_date)}
                        </span>
                      </td>

                      {/* Member Info */}
                      <td className="py-3 px-3.5">
                        {member ? (
                          <div
                            onClick={() => setSelectedMemberId(member.id)}
                            className="cursor-pointer group"
                          >
                            <span className="font-bold text-slate-900 group-hover:text-teal-700 transition block">
                              {member.name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {member.member_id} • {toBanglaNumber(member.phone)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">সদস্য পাওয়া যায়নি</span>
                        )}
                      </td>

                      {/* Month & Year */}
                      <td className="py-3 px-3.5">
                        <span className="font-semibold text-slate-800">
                          {BANGLA_MONTHS[c.month]}, {toBanglaNumber(c.year)}
                        </span>
                        {c.note && (
                          <span className="text-[10px] text-slate-400 block line-clamp-1">
                            {c.note}
                          </span>
                        )}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3 px-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                          {PAYMENT_METHODS[c.payment_method]}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-3.5 text-right font-bold text-teal-800 text-sm font-['Hind_Siliguri']">
                        {toBanglaCurrency(c.amount)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canEdit && (
                            <button
                              onClick={() => openModal('edit_contribution', c)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-slate-100"
                              title="সম্পাদনা"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(c)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
