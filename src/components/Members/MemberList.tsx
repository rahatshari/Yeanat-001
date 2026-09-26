import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Phone,
  Calendar,
  Wallet,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  Coins,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Member } from '../../types';
import {
  toBanglaNumber,
  toBanglaCurrency,
  formatBanglaDate,
} from '../../utils/bangla';
import { exportMembersToCSV } from '../../utils/export';

export const MemberList: React.FC = () => {
  const {
    members,
    contributions,
    openModal,
    setSelectedMemberId,
    deleteMember,
    canEdit,
    isAdmin,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm) ||
        m.member_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.address && m.address.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus =
        statusFilter === 'all' ? true : m.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [members, searchTerm, statusFilter]);

  // Calculate total fees paid by each member
  const memberTotalPaidMap = useMemo(() => {
    const map = new Map<string, number>();
    contributions.forEach((c) => {
      const current = map.get(c.member_id) || 0;
      map.set(c.member_id, current + c.amount);
    });
    return map;
  }, [contributions]);

  const handleDelete = (member: Member) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${member.name}" (${member.member_id})-এর তথ্য মুছে ফেলতে চান?`)) {
      deleteMember(member.id);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Bar with Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            সংগঠনের সদস্য তালিকা ({toBanglaNumber(filteredMembers.length)} জন)
          </h2>
          <p className="text-xs text-slate-500">সকল সম্মানিত সদস্যের বিবরণ ও চাঁদা হিসাব</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportMembersToCSV(members)}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Excel/CSV আকারে ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Excel Export</span>
          </button>

          {canEdit && (
            <button
              onClick={() => openModal('add_member')}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন সদস্য যোগ</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="নাম, মোবাইল নম্বর বা সদস্য ID দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              statusFilter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সকল ({toBanglaNumber(members.length)})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              statusFilter === 'active'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সক্রিয় ({toBanglaNumber(members.filter((m) => m.status === 'active').length)})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              statusFilter === 'inactive'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            নিষ্ক্রিয় ({toBanglaNumber(members.filter((m) => m.status === 'inactive').length)})
          </button>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredMembers.map((member) => {
          const totalPaid = memberTotalPaidMap.get(member.id) || 0;
          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition p-4 flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => setSelectedMemberId(member.id)}
                    className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                  >
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-11 h-11 rounded-xl object-cover border border-emerald-200 shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                          {member.member_id}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            member.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {member.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition truncate mt-0.5">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === member.id ? null : member.id)
                      }
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === member.id && (
                      <div
                        className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-20 text-xs"
                        onClick={() => setActiveMenuId(null)}
                      >
                        <button
                          onClick={() => setSelectedMemberId(member.id)}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          বিস্তারিত দেখুন
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => openModal('edit_member', member)}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                            সম্পাদনা (Edit)
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() =>
                              openModal('collect_fee', { member_id: member.id })
                            }
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-medium"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            চাঁদা জমা নিন
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(member)}
                            className="w-full text-left px-3 py-1.5 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium border-t border-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            মুছে ফেলুন
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Member Details Rows */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      মোবাইল:
                    </span>
                    <a
                      href={`tel:${member.phone}`}
                      className="font-medium text-emerald-700 hover:underline"
                    >
                      {toBanglaNumber(member.phone)}
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Wallet className="w-3.5 h-3.5 text-slate-400" />
                      মাসিক চাঁদা:
                    </span>
                    <span className="font-bold text-slate-800">
                      {toBanglaCurrency(member.monthly_fee)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Coins className="w-3.5 h-3.5 text-slate-400" />
                      মোট জমা দিয়েছেন:
                    </span>
                    <span className="font-bold text-emerald-700">
                      {toBanglaCurrency(totalPaid)}
                    </span>
                  </div>

                  {member.address && (
                    <p className="text-[11px] text-slate-500 pt-1 line-clamp-1">
                      ঠিকানা: {member.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedMemberId(member.id)}
                  className="flex-1 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition"
                >
                  বিস্তারিত খতিয়ান
                </button>
                {canEdit && (
                  <button
                    onClick={() =>
                      openModal('collect_fee', { member_id: member.id })
                    }
                    className="flex-1 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold text-center border border-emerald-200 transition flex items-center justify-center gap-1"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    চাঁদা জমা
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
