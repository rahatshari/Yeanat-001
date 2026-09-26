import React, { useState } from 'react';
import {
  Settings,
  Building,
  Shield,
  Tag,
  Key,
  Plus,
  Trash2,
  Check,
  UserCheck,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrganizationSettings } from '../../types';
import { toBanglaNumber, toBanglaCurrency, ROLE_NAMES } from '../../utils/bangla';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    categories,
    addCategory,
    deleteCategory,
    users,
    currentUser,
    isAdmin,
    openModal,
    showToast,
  } = useApp();

  const [formData, setFormData] = useState<OrganizationSettings>(settings);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [activeTab, setActiveTab] = useState<'org' | 'categories' | 'roles'>('org');

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('শুধুমাত্র এডমিন সেটিংস পরিবর্তন করতে পারবেন', 'error');
      return;
    }
    updateSettings(formData);
  };

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-700" />
          অ্যাপ ও সংগঠন সেটিংস
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          সংগঠনের নাম, দায়িত্বশীল ব্যক্তিবর্গ, খরচের খাত ও ব্যবহারকারীর ভূমিকা ব্যবস্থাপনা
        </p>

        {/* Tab switch */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('org')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'org'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সংগঠনের বিবরণ ও স্বাক্ষর
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'categories'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            খরচের খাতসমূহ ({toBanglaNumber(categories.length)})
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'roles'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            নিরাপত্তা ও ব্যবহারকারী রোল
          </button>
        </div>
      </div>

      {/* Tab 1: Organization Settings */}
      {activeTab === 'org' && (
        <form onSubmit={handleSaveOrg} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building className="w-4 h-4 text-emerald-700" />
            সাধারণ তথ্য ও রিপোর্ট স্বাক্ষরকারী
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">সংগঠনের নাম *</label>
              <input
                type="text"
                value={formData.org_name}
                onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">স্লোগান / ট্যাগলাইন</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ঠিকানা</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">যোগাযোগের মোবাইল</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ডিফল্ট মাসিক চাঁদা (টাকা)</label>
              <input
                type="number"
                value={formData.default_monthly_fee}
                onChange={(e) =>
                  setFormData({ ...formData, default_monthly_fee: Number(e.target.value) })
                }
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">প্রতিষ্ঠা সাল</label>
              <input
                type="text"
                value={formData.established_year}
                onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <h4 className="text-xs font-bold text-slate-800 pt-3 border-t border-slate-100">
            রিপোর্টের নিচের কর্মকর্তা ও স্বাক্ষরকারী
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">সভাপতি</label>
              <input
                type="text"
                value={formData.president_name}
                onChange={(e) => setFormData({ ...formData, president_name: e.target.value })}
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">সাধারণ সম্পাদক</label>
              <input
                type="text"
                value={formData.secretary_name}
                onChange={(e) => setFormData({ ...formData, secretary_name: e.target.value })}
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">কোষাধ্যক্ষ</label>
              <input
                type="text"
                value={formData.cashier_name}
                onChange={(e) => setFormData({ ...formData, cashier_name: e.target.value })}
                disabled={!isAdmin}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
              />
            </div>
          </div>

          {isAdmin && (
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
              >
                সেটিংস সংরক্ষণ করুন
              </button>
            </div>
          )}
        </form>
      )}

      {/* Tab 2: Expense Categories */}
      {activeTab === 'categories' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-700" />
                খরচের নির্ধারিত খাতসমূহ
              </h3>
              <p className="text-xs text-slate-500">
                ভাউচার তৈরির সময় এই খাতগুলো নির্বাচন করা যায়
              </p>
            </div>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCat} className="flex gap-2">
            <input
              type="text"
              placeholder="নতুন খরচের খাতের নাম লিখুন..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>খাত যোগ</span>
            </button>
          </form>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-semibold text-slate-800">{c.name}</span>
                  {c.is_default && (
                    <span className="text-[10px] text-slate-400">(ডিফল্ট)</span>
                  )}
                </div>

                {!c.is_default && isAdmin && (
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                    title="খাতটি মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Security & Roles */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-emerald-700" />
              সিস্টেমের নিরাপত্তা ও ব্যবহারকারী রোলস (RBAC)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              অনুমোদিত ব্যক্তি ছাড়া অন্য কেউ আয়, খরচ ও চাঁদার তথ্য পরিবর্তন করতে পারে না
            </p>

            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    user.id === currentUser.id
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{user.name}</span>
                        {user.id === currentUser.id && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-600 text-white">
                            বর্তমান সক্রিয়
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        মোবাইল: {toBanglaNumber(user.phone)} • গোপন পিন: ****
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold text-[11px] text-slate-700">
                      {user.role === 'admin'
                        ? 'এডমিন (সবকিছু)'
                        : user.role === 'accountant'
                        ? 'হিসাবরক্ষক (যোগ/সম্পাদনা)'
                        : 'দর্শক (শুধু দেখা)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Login Modal Trigger */}
          <div className="bg-slate-100 p-4 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-700" />
              <span className="text-slate-700 font-medium">
                অন্য ব্যবহারকারী হিসেবে সুইচ করতে বা পিন দিতে চান?
              </span>
            </div>
            <button
              onClick={() => openModal('login')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition"
            >
              লগইন স্ক্রিন খুলুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
