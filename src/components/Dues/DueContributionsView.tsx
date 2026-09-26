import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  Search,
  Download,
  Coins,
  ChevronRight,
  Phone,
  Calendar,
  Wallet,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  toBanglaNumber,
  toBanglaCurrency,
  BANGLA_MONTHS,
} from '../../utils/bangla';
import { downloadCSV } from '../../utils/export';

export const DueContributionsView: React.FC = () => {
  const { duesList, totalDuesAmount, membersWithDuesCount, openModal, setSelectedMemberId, canEdit, settings } =
    useApp();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredDues = useMemo(() => {
    return duesList.filter((item) => {
      const name = item.member.name.toLowerCase();
      const id = item.member.member_id.toLowerCase();
      const phone = item.member.phone;
      return (
        name.includes(searchTerm.toLowerCase()) ||
        id.includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm)
      );
    });
  }, [duesList, searchTerm]);

  const handleExportDues = () => {
    const headers = [
      'সদস্য নম্বর',
      'সদস্যের নাম',
      'মোবাইল নম্বর',
      'মাসিক চাঁদা (টাকা)',
      'বকেয়া মাসের সংখ্যা',
      'বকেয়া মাসসমূহ',
      'মোট বকেয়া পরিমাণ (টাকা)',
    ];

    const rows = filteredDues.map((item) => [
      item.member.member_id,
      item.member.name,
      item.member.phone,
      item.member.monthly_fee,
      item.unpaidMonths.length,
      item.unpaidMonths.map((m) => `${m.monthName} ${m.year}`).join('; '),
      item.totalDueAmount,
    ]);

    downloadCSV(`বকেয়া_চাঁদা_তালিকা_${new Date().toISOString().split('T')[0]}`, [
      [`${settings.org_name} - বকেয়া চাঁদা হিসাব রিপোর্ট`],
      [`তারিখ: ${new Date().toLocaleDateString()}`],
      [`মোট বকেয়া সদস্য: ${membersWithDuesCount} জন`, `সর্বমোট বকেয়া টাকা: ${totalDuesAmount} টাকা`],
      [''],
      headers,
      ...rows,
    ]);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <AlertCircle className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">বকেয়া চাঁদা ব্যবস্থাপনা</h2>
              <p className="text-xs text-amber-100">
                সংগঠনের যে সকল সদস্যের চাঁদা বাকি রয়েছে তাদের তালিকা ও আদায়
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/20 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10 self-start sm:self-auto">
            <div>
              <p className="text-[11px] text-amber-200">মোট বকেয়াদার সদস্য</p>
              <p className="text-lg font-bold font-['Hind_Siliguri']">
                {toBanglaNumber(membersWithDuesCount)} জন
              </p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-[11px] text-amber-200">সর্বমোট বকেয়া টাকা</p>
              <p className="text-xl font-extrabold text-amber-200 font-['Hind_Siliguri']">
                {toBanglaCurrency(totalDuesAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="বকেয়াদার সদস্যের নাম বা মোবাইল দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
          />
        </div>

        <button
          onClick={handleExportDues}
          className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Download className="w-3.5 h-3.5 text-amber-700" />
          <span>Excel এ ডাউনলোড</span>
        </button>
      </div>

      {/* Dues Cards List */}
      <div className="space-y-3">
        {filteredDues.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">
              আলহামদুলিল্লাহ! কোনো বকেয়া নেই
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              সকল সক্রিয় সদস্যের চাঁদা পরিশোধিত আছে
            </p>
          </div>
        ) : (
          filteredDues.map((item) => (
            <div
              key={item.member.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 hover:border-amber-400 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Member Details */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                    {item.member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {item.member.member_id}
                      </span>
                      <h3
                        onClick={() => setSelectedMemberId(item.member.id)}
                        className="text-sm font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition"
                      >
                        {item.member.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <a href={`tel:${item.member.phone}`} className="hover:underline">
                          {toBanglaNumber(item.member.phone)}
                        </a>
                      </span>
                      <span>•</span>
                      <span>মাসিক চাঁদা: {toBanglaCurrency(item.member.monthly_fee)}</span>
                    </div>
                  </div>
                </div>

                {/* Due summary for this member */}
                <div className="flex items-center justify-between md:justify-end gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <p className="text-[11px] text-slate-400">বকেয়ার সময়কাল</p>
                    <p className="text-xs font-bold text-amber-900">
                      {toBanglaNumber(item.unpaidMonths.length)} মাসের চাঁদা বাকি
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">মোট বকেয়া</p>
                    <p className="text-base sm:text-lg font-extrabold text-rose-600 font-['Hind_Siliguri']">
                      {toBanglaCurrency(item.totalDueAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Unpaid Months Pill Badges with Quick Collect Action */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500 mr-1">
                  যেসব মাস বাকি:
                </span>
                {item.unpaidMonths.map((m) => (
                  <div
                    key={`${m.year}-${m.month}`}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs"
                  >
                    <span className="font-semibold">
                      {m.monthName} ({toBanglaCurrency(m.fee)})
                    </span>
                    {canEdit && (
                      <button
                        onClick={() =>
                          openModal('collect_fee', {
                            member_id: item.member.id,
                            month: m.month,
                            year: m.year,
                            amount: m.fee,
                          })
                        }
                        className="px-1.5 py-0.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold transition shadow-2xs"
                        title="এই মাসের চাঁদা জমা নিন"
                      >
                        জমা নিন
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => setSelectedMemberId(item.member.id)}
                  className="ml-auto text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
                >
                  সম্পূর্ণ খতিয়ান দেখুন <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
