import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Download,
  Calendar,
  Wallet,
  Edit2,
  Trash2,
  Image,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Expense } from '../../types';
import {
  toBanglaNumber,
  toBanglaCurrency,
  formatBanglaDate,
} from '../../utils/bangla';
import { exportExpensesToCSV } from '../../utils/export';

export const ExpenseList: React.FC = () => {
  const { expenses, categories, openModal, deleteExpense, canEdit, isAdmin } =
    useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedReceiptImage, setSelectedReceiptImage] = useState<string | null>(null);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchSearch =
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.voucher_no &&
          item.voucher_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        categoryFilter === 'all' ? true : item.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [expenses, searchTerm, categoryFilter]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  }, [filteredExpenses]);

  const handleDelete = (expense: Expense) => {
    if (
      window.confirm(
        `আপনি কি নিশ্চিত যে "${expense.description}"-এর ৳${expense.amount} খরচের রেকর্ড মুছে ফেলতে চান? এটি মুছে দিলে বর্তমান ব্যালেন্সে টাকা পুনরায় যোগ হবে।`
      )
    ) {
      deleteExpense(expense.id);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-700" />
            সংগঠনের খরচ ও ব্যয় ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-500">
            সর্বমোট খরচ: <span className="font-bold text-rose-700">{toBanglaCurrency(totalFilteredAmount)}</span> ({toBanglaNumber(filteredExpenses.length)} টি ভাউচার)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportExpensesToCSV(expenses)}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Excel এ ডাউনলোড"
          >
            <Download className="w-3.5 h-3.5 text-rose-700" />
            <span>Excel Export</span>
          </button>

          {canEdit && (
            <button
              onClick={() => openModal('add_expense')}
              className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>খরচ যোগ করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="বিবরণ, প্রাপক বা ভাউচার দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 text-slate-700 font-medium"
          >
            <option value="all">সকল খরচের খাত</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3.5">তারিখ / ভাউচার</th>
                <th className="py-3 px-3.5">খরচের বিবরণ</th>
                <th className="py-3 px-3.5">খাত</th>
                <th className="py-3 px-3.5">প্রাপক / ব্যক্তি</th>
                <th className="py-3 px-3.5 text-center">রসিদ</th>
                <th className="py-3 px-3.5 text-right">পরিমাণ (টাকা)</th>
                <th className="py-3 px-3.5 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    কোনো খরচের রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition">
                    {/* Date & Voucher */}
                    <td className="py-3 px-3.5">
                      <span className="font-semibold text-slate-900 block">
                        {formatBanglaDate(exp.date)}
                      </span>
                      {exp.voucher_no && (
                        <span className="text-[10px] font-mono text-slate-400">
                          #{exp.voucher_no}
                        </span>
                      )}
                    </td>

                    {/* Description & Note */}
                    <td className="py-3 px-3.5">
                      <span className="font-bold text-slate-900 block">
                        {exp.description}
                      </span>
                      {exp.note && (
                        <span className="text-[10px] text-slate-500 block truncate max-w-xs">
                          {exp.note}
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                        {exp.category}
                      </span>
                    </td>

                    {/* Recipient */}
                    <td className="py-3 px-3.5 text-slate-700 font-medium">
                      {exp.recipient}
                    </td>

                    {/* Receipt Image Thumbnail */}
                    <td className="py-3 px-3.5 text-center">
                      {exp.receipt_image ? (
                        <button
                          onClick={() => setSelectedReceiptImage(exp.receipt_image!)}
                          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1 text-[10px]"
                          title="ভাউচারের ছবি দেখুন"
                        >
                          <Image className="w-3.5 h-3.5 text-emerald-700" />
                          <span>ছবি</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 text-[10px]">—</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3.5 text-right font-bold text-rose-700 text-sm font-['Hind_Siliguri']">
                      -{toBanglaCurrency(exp.amount)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && (
                          <button
                            onClick={() => openModal('edit_expense', exp)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-slate-100"
                            title="সম্পাদনা"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(exp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Image Preview Modal */}
      {selectedReceiptImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setSelectedReceiptImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              ✕
            </button>
            <h4 className="text-sm font-bold text-slate-800 mb-3">সংযুক্ত বিল / ভাউচারের ছবি</h4>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center">
              <img
                src={selectedReceiptImage}
                alt="Receipt"
                className="max-h-[65vh] w-auto rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
