import React, { useState, useEffect } from 'react';
import { X, Upload, User, Phone, MapPin, Calendar, Wallet, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Member } from '../../types';
import { getTodayDateString } from '../../utils/bangla';

interface MemberFormModalProps {
  memberToEdit?: Member | null;
  onClose: () => void;
}

export const MemberFormModal: React.FC<MemberFormModalProps> = ({ memberToEdit, onClose }) => {
  const { addMember, updateMember, settings, members } = useApp();

  const isEdit = !!memberToEdit;

  const [name, setName] = useState(memberToEdit?.name || '');
  const [phone, setPhone] = useState(memberToEdit?.phone || '');
  const [address, setAddress] = useState(memberToEdit?.address || '');
  const [memberId, setMemberId] = useState(
    memberToEdit?.member_id || `PM-${String(members.length + 1).padStart(3, '0')}`
  );
  const [joiningDate, setJoiningDate] = useState(
    memberToEdit?.joining_date || getTodayDateString()
  );
  const [monthlyFee, setMonthlyFee] = useState<number>(
    memberToEdit?.monthly_fee || settings.default_monthly_fee
  );
  const [status, setStatus] = useState<'active' | 'inactive'>(
    memberToEdit?.status || 'active'
  );
  const [photo, setPhoto] = useState<string>(memberToEdit?.photo || '');
  const [error, setError] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('ছবির আকার সর্বোচ্চ ২ মেগাবাইট হতে পারবে');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('দয়া করে সদস্যের নাম লিখুন');
      return;
    }
    if (!phone.trim()) {
      setError('দয়া করে সদস্যের মোবাইল নম্বর লিখুন');
      return;
    }
    if (!monthlyFee || monthlyFee <= 0) {
      setError('মাসিক চাঁদার পরিমাণ সঠিক হতে হবে');
      return;
    }

    if (isEdit && memberToEdit) {
      updateMember(memberToEdit.id, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        member_id: memberId.trim(),
        joining_date: joiningDate,
        monthly_fee: Number(monthlyFee),
        status,
        photo,
      });
    } else {
      addMember({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        joining_date: joiningDate,
        monthly_fee: Number(monthlyFee),
        status,
        photo,
        customId: memberId.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? 'সদস্যের তথ্য সম্পাদনা' : 'নতুন সদস্য নিবন্ধন'}
            </h3>
            <p className="text-xs text-slate-500">
              সদস্যের সঠিক ও হালনাগাদ তথ্য প্রদান করুন
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Photo & Member ID row */}
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              {photo ? (
                <img
                  src={photo}
                  alt="Member"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <User className="w-6 h-6" />
                  <span className="text-[9px] mt-0.5">ছবি</span>
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition cursor-pointer text-white">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 space-y-1">
              <label className="font-semibold text-slate-700">সদস্য ID / নম্বর *</label>
              <input
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="যেমন: PM-001"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                required
              />
            </div>
          </div>

          {/* Member Name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">সদস্যের নাম *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: মোঃ আব্দুল করিম"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-medium"
              required
            />
          </div>

          {/* Phone and Monthly Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">মোবাইল নম্বর *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="০১৭১২-৩৪৫৬৭৮"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">মাসিক চাঁদা (টাকা) *</label>
              <input
                type="number"
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(Number(e.target.value))}
                min="0"
                step="50"
                placeholder="500"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">ঠিকানা (ঐচ্ছিক)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="গ্রাম, পাড়া বা এলাকা"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
            />
          </div>

          {/* Joining Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">যোগদানের তারিখ</label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">সদস্যের স্ট্যাটাস</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-medium"
              >
                <option value="active">সক্রিয় সদস্য</option>
                <option value="inactive">নিষ্ক্রিয় সদস্য</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-800/20 active:scale-95 transition"
            >
              {isEdit ? 'সংরক্ষণ করুন' : 'সদস্য যোগ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
