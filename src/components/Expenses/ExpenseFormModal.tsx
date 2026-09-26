import React, { useState } from 'react';
import { X, Receipt, Upload, Image, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Expense } from '../../types';
import { getTodayDateString } from '../../utils/bangla';

interface ExpenseFormModalProps {
  expenseToEdit?: Expense | null;
  onClose: () => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({ expenseToEdit, onClose }) => {
  const { addExpense, updateExpense, categories, addCategory } = useApp();

  const isEdit = !!expenseToEdit;

  const [category, setCategory] = useState<string>(
    expenseToEdit?.category || (categories[0]?.name || 'উন্নয়ন')
  );
  const [newCatName, setNewCatName] = useState<string>('');
  const [showAddCatInput, setShowAddCatInput] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(
    expenseToEdit?.description || ''
  );
  const [amount, setAmount] = useState<number>(expenseToEdit?.amount || 500);
  const [date, setDate] = useState<string>(
    expenseToEdit?.date || getTodayDateString()
  );
  const [recipient, setRecipient] = useState<string>(
    expenseToEdit?.recipient || ''
  );
  const [voucherNo, setVoucherNo] = useState<string>(
    expenseToEdit?.voucher_no || `VCH-${Date.now().toString().slice(-4)}`
  );
  const [note, setNote] = useState<string>(expenseToEdit?.note || '');
  const [receiptImage, setReceiptImage] = useState<string>(
    expenseToEdit?.receipt_image || ''
  );
  const [error, setError] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setError('ভাউচার ছবির আকার সর্বোচ্চ ৩ মেগাবাইট হতে পারবে');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNewCategory = () => {
    if (newCatName.trim()) {
      addCategory(newCatName.trim());
      setCategory(newCatName.trim());
      setNewCatName('');
      setShowAddCatInput(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('দয়া করে খরচের বিবরণ লিখুন');
      return;
    }
    if (!amount || amount <= 0) {
      setError('খরচের পরিমাণ সঠিক হতে হবে');
      return;
    }
    if (!recipient.trim()) {
      setError('যাকে টাকা দেওয়া হয়েছে তার নাম লিখুন');
      return;
    }

    if (isEdit && expenseToEdit) {
      updateExpense(expenseToEdit.id, {
        category,
        description: description.trim(),
        amount: Number(amount),
        date,
        recipient: recipient.trim(),
        voucher_no: voucherNo.trim(),
        note: note.trim(),
        receipt_image: receiptImage,
      });
    } else {
      addExpense({
        category,
        description: description.trim(),
        amount: Number(amount),
        date,
        recipient: recipient.trim(),
        voucher_no: voucherNo.trim(),
        note: note.trim(),
        receipt_image: receiptImage,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEdit ? 'খরচের তথ্য সংশোধন' : 'নতুন খরচ লিপিবদ্ধ করুন'}
              </h3>
              <p className="text-xs text-slate-500">সংগঠনের ব্যয় ও ভাউচার সংরক্ষণ</p>
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
          {/* Expense Category & Add Category */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">খরচের খাত *</label>
              <button
                type="button"
                onClick={() => setShowAddCatInput(!showAddCatInput)}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3 h-3" />
                নতুন খাত তৈরি
              </button>
            </div>

            {showAddCatInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="নতুন খাতের নাম লিখুন..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleCreateNewCategory}
                  className="px-3 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                >
                  যোগ করুন
                </button>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 text-slate-900 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">খরচের বিবরণ *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="যেমন: রাস্তা উন্নয়ন কাজ / রোগীর চিকিৎসার সাহায্য"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 text-slate-900 font-medium"
              required
            />
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">টাকার পরিমাণ (টাকা) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="10"
                step="50"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 text-slate-900 font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">খরচের তারিখ *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 text-slate-900"
                required
              />
            </div>
          </div>

          {/* Recipient & Voucher No */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">যাকে টাকা দেওয়া হয়েছে *</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="ব্যক্তি বা প্রতিষ্ঠানের নাম"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 text-slate-900"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ভাউচার / রসিদ নম্বর</label>
              <input
                type="text"
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                placeholder="যেমন: VCH-102"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Receipt Image Upload */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">বিল / রসিদের ছবি সংযুক্ত করুন (ঐচ্ছিক)</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer border border-slate-200 text-slate-700 font-medium transition">
                <Upload className="w-4 h-4 text-emerald-700" />
                <span>ছবি নির্বাচন করুন</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {receiptImage && (
                <div className="flex items-center gap-2">
                  <img
                    src={receiptImage}
                    alt="Receipt preview"
                    className="w-10 h-10 object-cover rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setReceiptImage('')}
                    className="text-[11px] text-rose-600 hover:underline"
                  >
                    ছবি মুছুন
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">মন্তব্য</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="অতিরিক্ত মন্তব্য"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 text-slate-900"
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
              className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold shadow-md shadow-rose-800/20 active:scale-95 transition"
            >
              {isEdit ? 'সংরক্ষণ করুন' : 'খরচ রেকর্ড করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
