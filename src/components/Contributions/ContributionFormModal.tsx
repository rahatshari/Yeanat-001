import React, { useState, useEffect } from 'react';
import { X, Coins, Calendar, Wallet, Check, AlertTriangle, Edit3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Contribution, PaymentMethod } from '../../types';
import {
  BANGLA_MONTHS,
  PAYMENT_METHODS,
  getCurrentMonth,
  getCurrentYear,
  getTodayDateString,
  toBanglaCurrency,
} from '../../utils/bangla';

interface ContributionFormModalProps {
  initialData?: Partial<Contribution> | null;
  onClose: () => void;
}

export const ContributionFormModal: React.FC<ContributionFormModalProps> = ({
  initialData,
  onClose,
}) => {
  const {
    members,
    contributions,
    addContribution,
    updateContribution,
    membersMap,
    openModal,
  } = useApp();

  const isEdit = !!initialData?.id;

  const [memberId, setMemberId] = useState<string>(
    initialData?.member_id || (members.length > 0 ? members[0].id : '')
  );
  const [month, setMonth] = useState<number>(
    initialData?.month || getCurrentMonth()
  );
  const [year, setYear] = useState<number>(
    initialData?.year || getCurrentYear()
  );

  const selectedMember = membersMap.get(memberId);

  const [amount, setAmount] = useState<number>(
    initialData?.amount || (selectedMember ? selectedMember.monthly_fee : 500)
  );
  const [paymentDate, setPaymentDate] = useState<string>(
    initialData?.payment_date || getTodayDateString()
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initialData?.payment_method || 'cash'
  );
  const [transactionId, setTransactionId] = useState<string>(
    initialData?.transaction_id || `REC-${Date.now().toString().slice(-6)}`
  );
  const [note, setNote] = useState<string>(initialData?.note || '');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [duplicateItem, setDuplicateItem] = useState<Contribution | null>(null);

  // Update amount when member changes (if not editing an existing payment)
  useEffect(() => {
    if (!isEdit && selectedMember) {
      setAmount(selectedMember.monthly_fee);
    }
  }, [memberId, isEdit, selectedMember]);

  // Check for duplicate on the fly
  useEffect(() => {
    if (!isEdit && memberId) {
      const dup = contributions.find(
        (c) =>
          c.member_id === memberId &&
          Number(c.month) === Number(month) &&
          Number(c.year) === Number(year)
      );
      if (dup) {
        setDuplicateItem(dup);
        setErrorMessage(
          `সতর্কতা: ${selectedMember?.name || 'এই সদস্যের'} ${BANGLA_MONTHS[month]} ${year}-এর চাঁদা ইতিপূর্বেই জমা করা আছে!`
        );
      } else {
        setDuplicateItem(null);
        setErrorMessage('');
      }
    }
  }, [memberId, month, year, contributions, isEdit, selectedMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) {
      setErrorMessage('দয়া করে সদস্য নির্বাচন করুন');
      return;
    }
    if (!amount || amount <= 0) {
      setErrorMessage('চাঁদার পরিমাণ সঠিক হতে হবে');
      return;
    }

    if (isEdit && initialData?.id) {
      updateContribution(initialData.id, {
        member_id: memberId,
        month: Number(month),
        year: Number(year),
        amount: Number(amount),
        payment_date: paymentDate,
        payment_method: paymentMethod,
        transaction_id: transactionId.trim(),
        note: note.trim(),
      });
      onClose();
    } else {
      const res = addContribution({
        member_id: memberId,
        month: Number(month),
        year: Number(year),
        amount: Number(amount),
        payment_date: paymentDate,
        payment_method: paymentMethod,
        transaction_id: transactionId.trim(),
        note: note.trim(),
      });

      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.message || 'চাঁদা যোগ করা সম্ভব হয়নি');
      }
    }
  };

  const handleEditExistingDuplicate = () => {
    if (duplicateItem) {
      onClose();
      openModal('edit_contribution', duplicateItem);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEdit ? 'চাঁদা জমার তথ্য সংশোধন' : 'সদস্যের মাসিক চাঁদা জমা নিন'}
              </h3>
              <p className="text-xs text-slate-500">চাঁদা রসিদ ও ব্যাংকিং তথ্য সংরক্ষণ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Warning Box */}
        {duplicateItem && !isEdit && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>একই মাসের চাঁদা পূর্বে জমা হয়েছে</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              {errorMessage} ভুলবশত দ্বৈত এন্ট্রি রোধ করতে নতুন জমা ব্লক করা হয়েছে।
            </p>
            <button
              type="button"
              onClick={handleEditExistingDuplicate}
              className="self-start px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3 h-3" />
              পূর্বের এন্ট্রি সম্পাদনা (Edit) করুন
            </button>
          </div>
        )}

        {errorMessage && !duplicateItem && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Member Selection */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">সদস্য নির্বাচন *</label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-semibold"
              required
            >
              <option value="">-- সদস্য নির্বাচন করুন --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.member_id} - {m.name} ({toBanglaCurrency(m.monthly_fee)})
                  {m.status === 'inactive' ? ' [নিষ্ক্রিয়]' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Month & Year Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">চাঁদার মাস *</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-medium"
              >
                {Object.entries(BANGLA_MONTHS).map(([mNum, mName]) => (
                  <option key={mNum} value={mNum}>
                    {mName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">বছর *</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-medium"
              >
                <option value={2026}>২০২৬</option>
                <option value={2025}>২০২৫</option>
                <option value={2024}>২০২৪</option>
              </select>
            </div>
          </div>

          {/* Amount and Payment Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">জমার পরিমাণ (টাকা) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="10"
                step="10"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">টাকা দেওয়ার তারিখ *</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
                required
              />
            </div>
          </div>

          {/* Payment Method & Transaction/Receipt No */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">পেমেন্ট পদ্ধতি</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-medium"
              >
                <option value="cash">নগদ (Cash)</option>
                <option value="bank">ব্যাংক (Bank)</option>
                <option value="mobile_banking">মোবাইল ব্যাংকিং (বিকাশ/নগদ)</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">রসিদ / ট্রানজেকশন ID</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="রসিদ নম্বর"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Note / Comments */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">মন্তব্য (ঐচ্ছিক)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="যেমন: নিয়মিত মাসিক চাঁদা"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900"
            />
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
              disabled={!!duplicateItem && !isEdit}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold shadow-md shadow-emerald-800/20 active:scale-95 transition"
            >
              {isEdit ? 'সংরক্ষণ করুন' : 'চাঁদা জমা নিশ্চিত করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
