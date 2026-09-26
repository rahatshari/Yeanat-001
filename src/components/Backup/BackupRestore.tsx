import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  History,
  ShieldCheck,
  AlertTriangle,
  FileJson,
  User,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  formatBanglaDateTime,
  toBanglaNumber,
} from '../../utils/bangla';

export const BackupRestore: React.FC = () => {
  const {
    exportBackupJSON,
    importBackupJSON,
    resetDataToDefault,
    logs,
    isAdmin,
    members,
    contributions,
    incomeList,
    expenses,
  } = useApp();

  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackupJSON(content);
      if (res.success) {
        setImportStatus({ message: 'অভিনন্দন! ডাটা সফলভাবে রিস্টোর করা হয়েছে।', isError: false });
      } else {
        setImportStatus({ message: res.message, isError: true });
      }
    };
    reader.readAsText(file);
  };

  const handleResetConfirm = () => {
    if (
      window.confirm(
        'সতর্কতা: এটি বর্তমান সকল তথ্য মুছে প্রাথমিক নমুনা (Demo) ডাটাতে ফিরিয়ে আনবে। আপনি কি এগিয়ে যেতে চান?'
      )
    ) {
      resetDataToDefault();
    }
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-700" />
            ডাটা ব্যাকআপ, রিস্টোর ও অডিট লগ
          </h2>
          <p className="text-xs text-slate-500">
            সংগঠনের মূল্যবান হিসাব স্থায়ীভাবে ডিভাইসে সংরক্ষণ ও পুনরুদ্ধার করুন
          </p>
        </div>

        <button
          onClick={exportBackupJSON}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          <span>সম্পূর্ণ ব্যাকআপ ডাউনলোড (JSON)</span>
        </button>
      </div>

      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Backup Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">অফলাইন ফাইল ব্যাকআপ</h3>
                <p className="text-[11px] text-slate-500">একটি ফাইলে সকল সদস্য, চাঁদা ও খরচের তথ্য</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 space-y-1">
              <p>• বর্তমান সদস্য সংখ্যা: <strong>{toBanglaNumber(members.length)} জন</strong></p>
              <p>• মোট চাঁদার রসিদ: <strong>{toBanglaNumber(contributions.length)} টি</strong></p>
              <p>• অন্যান্য আয় এন্ট্রি: <strong>{toBanglaNumber(incomeList.length)} টি</strong></p>
              <p>• খরচ ও ভাউচার: <strong>{toBanglaNumber(expenses.length)} টি</strong></p>
            </div>
          </div>

          <button
            onClick={exportBackupJSON}
            className="mt-4 w-full py-2.5 rounded-xl border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>নতুন ব্যাকআপ ফাইল ডাউনলোড করুন</span>
          </button>
        </div>

        {/* Card 2: Restore Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">ব্যাকআপ থেকে পুনরুদ্ধার (Restore)</h3>
                <p className="text-[11px] text-slate-500">পূর্বে সংরক্ষিত JSON ব্যাকআপ ফাইল আপলোড করুন</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              ফোন পরিবর্তন করলে বা ডাটা হারিয়ে গেলে ডাউনলোডকৃত ব্যাকআপ ফাইলটি এখানে সিলেক্ট করলেই সমস্ত হিসাব ফিরিয়ে আনা যাবে।
            </p>

            {importStatus && (
              <div
                className={`mt-3 p-2.5 rounded-xl text-xs font-medium border ${
                  importStatus.isError
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {importStatus.message}
              </div>
            )}
          </div>

          <label className="mt-4 w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition">
            <Upload className="w-4 h-4" />
            <span>ব্যাকআপ ফাইল নির্বাচন করুন (.json)</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone: Reset to Initial Data (Admin only) */}
      {isAdmin && (
        <div className="bg-rose-50/60 p-4 sm:p-5 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-rose-900">প্রাথমিক ডেমো ডাটা রিসেট</h4>
              <p className="text-[11px] text-rose-700">
                পরীক্ষামূলক বা ডেমো হিসাব রিসেট করে ডিফল্ট অবস্থায় নিয়ে যান
              </p>
            </div>
          </div>

          <button
            onClick={handleResetConfirm}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition self-start sm:self-auto"
          >
            ডাটা রিসেট করুন
          </button>
        </div>
      )}

      {/* Activity Logs (Requirement 16: হিসাব পরিবর্তনের ইতিহাস) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              হিসাব পরিবর্তনের ইতিহাস (Activity Logs)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            সর্বশেষ {toBanglaNumber(logs.length)} টি কার্যক্রম
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="p-8 text-center text-slate-400 text-xs">কোনো ইতিহাস রেকর্ড নেই</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-3.5 sm:p-4 hover:bg-slate-50 transition text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold text-[10px] mt-0.5 ${
                        log.action === 'create'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'update'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'delete'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {log.action === 'create'
                        ? 'সংযোজন'
                        : log.action === 'update'
                        ? 'সংশোধন'
                        : log.action === 'delete'
                        ? 'বাতিল'
                        : log.action === 'login'
                        ? 'লগইন'
                        : 'ব্যাকআপ'}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 text-xs sm:text-sm leading-snug">
                        {log.description}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {log.user_name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {formatBanglaDateTime(log.timestamp)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
