import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  Plus,
  Download,
  Calendar,
  Wallet,
  Edit2,
  Trash2,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Income } from '../../types';
import {
  toBanglaNumber,
  toBanglaCurrency,
  formatBanglaDate,
} from '../../utils/bangla';
import { exportIncomeToCSV } from '../../utils/export';

export const IncomeList: React.FC = () => {
  const { incomeList, openModal, deleteIncome, canEdit, isAdmin } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    incomeList.forEach((i) => set.add(i.category));
    return Array.from(set);
  }, [incomeList]);

  const filteredIncome = useMemo(() => {
    return incomeList.filter((item) => {
      const matchSearch =
        item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.transaction_id &&
          item.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        categoryFilter === 'all' ? true : item.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [incomeList, searchTerm, categoryFilter]);

  const totalFiltered = useMemo(() => {
    return filteredIncome.reduce((acc, i) => acc + i.amount, 0);
  }, [filteredIncome]);

  const handleDelete = (income: Income) => {
    if (
      window.confirm(
        `আপনি কি নিশ্চিত যে "${income.source}"-এর ৳${income.amount} আয়ের রেকর্ড মুছে ফেলতে চান?`
      )
    ) {
      deleteIncome(income.id);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-700" />
            অন্যান্য আয় ও অনুদান খতিয়ান
          </h2>
          <p className="text-xs text-slate-500">
            মোট সংগৃহীত অন্যান্য আয়: <span className="font-bold text-sky-800">{toBanglaCurrency(totalFiltered)}</span> ({toBanglaNumber(filteredIncome.length)} টি এন্ট্রি)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportIncomeToCSV(incomeList)}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Excel এ ডাউনলোড"
          >
            <Download className="w-3.5 h-3.5 text-sky-700" />
            <span>Excel Export</span>
          </button>

          {canEdit && (
            <button
              onClick={() => openModal('add_income')}
              className="px-3.5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>আয় যোগ করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="দাতার নাম, খাত বা রসিদ দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 text-slate-700 font-medium"
          >
            <option value="all">সকল আয়ের খাত</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Income List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3.5">তারিখ / রসিদ</th>
                <th className="py-3 px-3.5">দাতার নাম / উৎস</th>
                <th className="py-3 px-3.5">আয়ের খাত</th>
                <th className="py-3 px-3.5">বিবরণ / মন্তব্য</th>
                <th className="py-3 px-3.5 text-right">পরিমাণ (টাকা)</th>
                <th className="py-3 px-3.5 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncome.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    কোনো আয়ের রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredIncome.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3.5">
                      <span className="font-semibold text-slate-900 block">
                        {formatBanglaDate(item.date)}
                      </span>
                      {item.transaction_id && (
                        <span className="text-[10px] font-mono text-slate-400">
                          #{item.transaction_id}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3.5 font-bold text-slate-900">
                      {item.source}
                    </td>

                    <td className="py-3 px-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-50 text-sky-800 border border-sky-200">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-3.5 text-slate-500 max-w-xs truncate">
                      {item.note || '—'}
                    </td>

                    <td className="py-3 px-3.5 text-right font-bold text-sky-800 text-sm font-['Hind_Siliguri']">
                      +{toBanglaCurrency(item.amount)}
                    </td>

                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && (
                          <button
                            onClick={() => openModal('edit_income', item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-slate-100"
                            title="সম্পাদনা"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(item)}
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
    </div>
  );
};
