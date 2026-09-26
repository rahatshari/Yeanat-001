import React, { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Income } from '../../types';
import { getTodayDateString } from '../../utils/bangla';

interface IncomeFormModalProps {
  incomeToEdit?: Income | null;
  onClose: () => void;
}

export const IncomeFormModal: React.FC<IncomeFormModalProps> = ({ incomeToEdit, onClose }) => {
  const { addIncome, updateIncome } = useApp();

  const isEdit = !!incomeToEdit;

  const [category, setCategory] = useState<string>(
    incomeToEdit?.category || 'অনুদান'
  );
  const [customCategory, setCustomCategory] = useState<string>('');
  const [amount, setAmount] = useState<number>(incomeToEdit?.amount || 1000);
  const [date, setDate] = useState<string>(
    incomeToEdit?.date || getTodayDateString()
  );
  const [source, setSource] = useState<string>(incomeToEdit?.source || '');
  const [transactionId, setTransactionId] = useState<string>(
    incomeToEdit?.transaction_id || `INC-${Date.now().toString().slice(-6)}`
  );
  const [note, setNote] = useState<string>(incomeToEdit?.note || '');
  const [error, setError] = useState<string>('');

  const defaultCategories = ['অনুদান', 'দান', 'প্রকল্প অনুদান', 'এককালীন চাঁদা', 'ব্যাংক মুনাফা', 'অন্যান্য আয়'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === 'অন্যান্য' && customCategory.trim() ? customCategory.trim() : category;

    if (!finalCategory.trim()) {
      setError('দয়া করে আয়ের ধরন নির্ধারণ করুন');
      return;
    }
    if (!amount || amount <= 0) {
      setError('আয়ের পরিমাণ সঠিক হতে হবে');
      return;
    }
    if (!source.trim()) {
      setError('দয়া করে আয়ের উৎস বা দাতার নাম লিখুন');
      return;
    }

    if (isEdit && incomeToEdit) {
      updateIncome(incomeToEdit.id, {
        category: finalCategory,
        amount: Number(amount),
        date,
        source: source.trim(),
        transaction_id: transactionId.trim(),
        note: note.trim(),
      });
    } else {
      addIncome({
        category: finalCategory,
        amount: Number(amount),
        date,
        source: source.trim(),
        transaction_id: transactionId.trim(),
        note: note.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEdit ? 'আয়ের তথ্য সংশোধন' : 'নতুন আয় বা অনুদান যোগ করুন'}
              </h3>
              <p className="text-xs text-slate-500">সংগঠনের অতিরিক্ত আয় ও দানের হিসাব সংরক্ষণ</p>
            </div>
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
          {/* Income Category */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">আয়ের ধরন *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900 font-medium"
            >
              {defaultCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="অন্যান্য">অন্যান্য (নতুন খাত)</option>
            </select>
          </div>

          {category === 'অন্যান্য' && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">নতুন আয়ের খাতের নাম *</label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="যেমন: জমি উন্নয়ন বাবদ দান"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900"
                required
              />
            </div>
          )}

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">টাকার পরিমাণ (টাকা) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="10"
                step="50"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900 font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">তারিখ *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900"
                required
              />
            </div>
          </div>

          {/* Source / Donor Name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">উৎস / দাতার নাম *</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="যেমন: সৌদি প্রবাসী কল্যাণ তহবিল / হাজী রফিকুল ইসলাম"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900 font-medium"
              required
            />
          </div>

          {/* Transaction / Receipt No */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">রসিদ / ট্রানজেকশন নম্বর (ঐচ্ছিক)</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="রসিদ নম্বর"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900 font-mono"
            />
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">মন্তব্য / বিবরণ</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="দান বা আয়ের উদ্দেশ্য বা বিবরণ লিখুন"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-900 resize-none"
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
              className="px-5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold shadow-md shadow-sky-800/20 active:scale-95 transition"
            >
              {isEdit ? 'সংরক্ষণ করুন' : 'আয় যোগ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
