import React, { useState } from 'react';
import {
  Smartphone,
  Apple,
  Monitor,
  Github,
  CheckCircle2,
  ExternalLink,
  Download,
  X,
  AlertTriangle,
  Info,
  Terminal,
  Copy,
  Check,
  Package,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'apk' | 'android' | 'ios' | 'desktop' | 'github';

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isInIframe, install, openInNewWindow } =
    usePWAInstall();

  const [activeTab, setActiveTab] = useState<TabType>(isIOS ? 'ios' : 'apk');
  const [installSuccess, setInstallSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('?')[0].replace(/\/$/, '')
      : 'https://ais-pre-mi7keu3c34zepwbua5htqu-620978928458.asia-east1.run.app';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDirectInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
              <Package className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                অ্যাপ ইনস্টলেশন ও APK গাইড
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                পাঠামারা ইয়ানত সংরক্ষণ — অ্যান্ড্রয়েড ও পিসি
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Iframe warning if in preview */}
        {isInIframe && (
          <div className="mx-4 mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">প্রিভিউ ফ্রেম নোটিশ:</span> আপনি বর্তমানে AI Studio প্রিভিউ মোডে আছেন। ব্রাউজারের সিকিউরিটি নিয়মের কারণে ফ্রেমের ভেতরে সরাসরি ক্রোম ইনস্টল বাটন প্রদর্শিত হয় না। নিচে <strong>"নতুন ট্যাবে খুলুন"</strong> বাটনে ক্লিক করে ফুল স্ক্রিনে খুললে সরাসরি ইনস্টল কাজ করবে।
              <button
                onClick={openInNewWindow}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                নতুন ট্যাবে খুলুন (Open in New Tab)
              </button>
            </div>
          </div>
        )}

        {/* Direct Install prompt button if available */}
        {isInstallable && !isInstalled && (
          <div className="p-4 mx-4 mt-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <p className="text-xs font-semibold text-emerald-800 mb-2">
              আপনার ব্রাউজার সরাসরি ইনস্টলেশন সমর্থন করছে!
            </p>
            <button
              onClick={handleDirectInstall}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-800/20 flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              এখনই ফোনে/পিসিতে ইনস্টল করুন (Direct Install)
            </button>
          </div>
        )}

        {installSuccess && (
          <div className="p-3 mx-4 mt-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            অ্যাপ সফলভাবে ইনস্টল হয়েছে!
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-4 pt-3 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'apk'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            APK ফাইল ডাউনলোড
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'android'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            ক্রোম দিয়ে ইনস্টল
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'ios'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Apple className="w-3.5 h-3.5 text-slate-800" />
            আইফোন (iOS)
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'desktop'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-blue-600" />
            কম্পিউটার
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Github className="w-3.5 h-3.5 text-purple-600" />
            GitHub নির্দেশিকা
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-5 text-slate-700 text-xs leading-relaxed max-h-[350px] overflow-y-auto">
          {/* APK Tab */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              {/* Method 1: PWABuilder (Fastest & Free) */}
              <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>পদ্ধতি ১: PWABuilder দিয়ে ১-ক্লিকে সরাসরি APK ডাউনলোড</span>
                </div>
                <p className="text-slate-600 text-[11px] mb-2.5">
                  মাইক্রোসফটের অফিশিয়াল ফ্রি টুল <strong>PWABuilder</strong> দিয়ে যেকোনো PWA অ্যাপের প্রস্তুত <code>.apk</code> ফাইল ১ মিনিটে ডাউনলোড করা যায়:
                </p>

                {/* App URL copy box */}
                <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-emerald-200 mb-2.5">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 bg-transparent text-[11px] font-mono text-slate-700 outline-hidden truncate"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold text-[10px] flex items-center gap-1 transition shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-700" /> কপি হয়েছে
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> লিংক কপি
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-600 pl-1 mb-3">
                  <div>১. উপরের বাটনে চাপ দিয়ে অ্যাপের লিংকটি কপি করুন।</div>
                  <div>২. নিচের বাটনে ক্লিক করে <strong>PWABuilder</strong> ওপেন করুন এবং লিংকটি পেস্ট করে <strong>"Start"</strong> চাপুন।</div>
                  <div>৩. এরপর <strong>"Package for Stores"</strong> এ গিয়ে <strong>Android (APK)</strong> সিলেক্ট করলেই রেডিমেড <code>.apk</code> ফাইল আপনার ফোনে নেমে যাবে!</div>
                </div>

                <a
                  href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition active:scale-98"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  PWABuilder-এ APK ফাইল ডাউনলোড করুন
                </a>
              </div>

              {/* Method 2: GitHub Actions Automated Build */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Github className="w-4 h-4 text-purple-600" />
                  <span>পদ্ধতি ২: GitHub Actions দিয়ে অটোমেটিক APK তৈরি</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  আপনার প্রজেক্টে <code>.github/workflows/build-apk.yml</code> ফাইল তৈরি করে দেওয়া হয়েছে।
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-600 text-[11px]">
                  <li>কোডটি GitHub-এ পুশ করুন।</li>
                  <li>GitHub রিপোজিটরির <strong>Actions</strong> ট্যাবে যান।</li>
                  <li>বামপাশের তালিকা থেকে <strong>"Build Android APK"</strong> সিলেক্ট করে <strong>"Run workflow"</strong> বাটনে চাপ দিন।</li>
                  <li>বিল্ড শেষ হলে <strong>Artifacts</strong> সেকশন থেকে সরাসরি <strong>Pathamara-Android-APK.zip</strong> নামিয়ে ইনস্টল করুন।</li>
                </ol>
              </div>

              {/* Note on PWA vs APK */}
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-blue-950 text-[11px] space-y-1">
                <p className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  💡 APK ফাইলের চেয়ে ব্রাউজার ইনস্টল কেন সুবিধাজনক?
                </p>
                <p>
                  মোবাইল ক্রোমে ৩-ডট মেনু থেকে <strong>"Install app"</strong> চাপলে ফোনে কোনো বড় ফাইল ডাউনলোড ও 'Unknown sources' পারমিশন দেওয়ার ঝামেলা ছাড়াই সরাসরি অরিজিনাল APK-র মতো অ্যাপ তৈরি হয়ে যায় এবং সাইজ হয় মাত্র ৩-৪ MB!
                </p>
              </div>
            </div>
          )}

          {/* Android Tab */}
          {activeTab === 'android' && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  ১
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">গুগল ক্রোম (Google Chrome) ব্রাউজারে খুলুন</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    আপনার ফোনের Chrome ব্রাউজারে অ্যাপটির লিঙ্কটি ওপেন করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  ২
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">উপরের ৩-ডট (⋮) মেনুতে চাপুন</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    ক্রোম ব্রাউজারের একদম উপরে ডানপাশে থাকা তিনটি ডট (⋮) অপশনে চাপ দিন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  ৩
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">"Install app" বা "Add to Home screen" নির্বাচন করুন</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    মেনু থেকে <strong>"Install app"</strong> (অ্যাপ ইনস্টল করুন) অথবা <strong>"Add to Home screen"</strong> (হোম স্ক্রিনে যোগ করুন) চাপুন।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-emerald-900 text-[11px]">
                💡 <strong>টিপস:</strong> ইনস্টল হওয়ার পর এটি সাধারণ অ্যান্ড্রয়েড APK অ্যাপের মতোই মোবাইল হোমস্ক্রিনে অ্যাপ আইকন হিসেবে থাকবে এবং ইন্টারনেট ছাড়াও অফলাইনে দ্রুত কাজ করবে।
              </div>
            </div>
          )}

          {/* iOS Tab */}
          {activeTab === 'ios' && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  ১
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">সাফারি (Safari) ব্রাউজারে অ্যাপটি খুলুন</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    আইফোনে Safari ব্রাউজার ব্যবহার করুন (ক্রোম নয়)।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  ২
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">নিচের Share (শেয়ার) বাটনে চাপুন</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    স্ক্রিনের একদম নিচে থাকা বর্গাকৃতির তীরচিহ্নযুক্ত <strong>Share আইকনে</strong> চাপ দিন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  ৩
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">"Add to Home Screen" নির্বাচন করে "Add" চাপুন</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    নিচে স্ক্রোল করে <strong>"Add to Home Screen"</strong> চাপুন এবং উপরে ডানপাশে <strong>"Add"</strong> বাটনে ক্লিক করুন।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Tab */}
          {activeTab === 'desktop' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  Chrome বা Microsoft Edge ব্রাউজারে:
                </h4>
                <ol className="list-decimal pl-5 mt-2 space-y-1.5 text-slate-600 text-[11px]">
                  <li>
                    ব্রাউজারের অ্যাড্রেস বারের (URL bar) ডানপাশে থাকা <strong>ইনস্টল আইকন (⊕ বা কম্পিউটার আইকন)</strong>-এ ক্লিক করুন।
                  </li>
                  <li>
                    অথবা মেনু (⋮) -&gt; <strong>"Save and share"</strong> -&gt; <strong>"Install পাঠামারা ইয়ানত সংরক্ষণ"</strong> এ ক্লিক করুন।
                  </li>
                  <li>
                    "Install" চাপলে আপনার ডেক্সটপে আলাদা উইন্ডোতে সম্পূর্ণ সফটওয়্যার হিসেবে ওপেন হবে।
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* GitHub Tab */}
          {activeTab === 'github' && (
            <div className="space-y-3">
              {/* Method 1: dist folder upload (Most recommended & instant) */}
              <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50/70 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>পদ্ধতি ১: dist ফোল্ডারের ফাইল আপলোড করা (সবচেয়ে সহজ ও তাৎক্ষণিক)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  আপনি যখন আপনার কম্পিউটার থেকে গিটহাবে ফাইল আপলোড করবেন, তখন কাঁচা সোর্স কোডের ফাইলগুলো আপলোড না করে:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 text-[11px]">
                  <li>
                    প্রজেক্ট বিল্ড করার পর তৈরি হওয়া <strong>dist</strong> ফোল্ডারে প্রবেশ করুন।
                  </li>
                  <li>
                    <strong>dist</strong> ফোল্ডারের ভেতরে থাকা ফাইল ও ফোল্ডারগুলো:
                    <ul className="list-disc pl-4 mt-1 text-slate-600 space-y-0.5 font-mono text-[10px]">
                      <li>index.html</li>
                      <li>assets/ ফোল্ডার (CSS ও JS ফাইল)</li>
                      <li>registerSW.js, manifest.webmanifest, manifest.json ইত্যাদি</li>
                      <li>icon.svg, favicon.png ও ছবিসমূহ</li>
                    </ul>
                  </li>
                  <li>
                    এগুলোকে সরাসরি আপনার GitHub রিপোজিটরির মূল পাতায় (Root) আপলোড/রিপ্লেস করে দিন।
                  </li>
                </ol>
                <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-300 text-emerald-950 text-[11px] font-medium">
                  <strong>ফলাফল:</strong> ব্রাউজার সরাসরি প্রস্তুতকৃত জাভাস্ক্রিপ্ট ফাইল পেয়ে যাবে এবং ক্রোম বা যেকোনো ব্রাউজারে সাথে সাথে লাইভ অ্যাপ কোনো এরর বা ব্ল্যাঙ্ক স্ক্রিন ছাড়াই চালু হবে!
                </div>
              </div>

              {/* Developer Terminal Commands */}
              <div className="p-3 bg-slate-900 text-slate-100 rounded-2xl font-mono text-[11px] space-y-2">
                <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  কম্পিউটারে লোকাল টার্মিনালে চালানোর নিয়ম:
                </p>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                  <div># ১. প্যাকেজ ইনস্টল: <span className="text-emerald-300 font-semibold">npm install</span></div>
                  <div># ২. লোকাল রান: <span className="text-emerald-300 font-semibold">npm run dev</span></div>
                  <div># ৩. নতুন dist বিল্ড: <span className="text-emerald-300 font-semibold">npm run build</span></div>
                </div>
              </div>

              {/* Relative base note */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-blue-950 text-[11px] space-y-1">
                <p className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  GitHub Pages সাব-ফোল্ডার সমস্যার সমাধান:
                </p>
                <p>
                  কনফিগারেশনে <code>base: './'</code> (relative path) পুরোপুরি ঠিক করা আছে, তাই GitHub Pages-এর লিংকে (যেমন <code>username.github.io/repo-name/</code>) কোনো পাথ এরর হবে না।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          {isInIframe ? (
            <button
              onClick={openInNewWindow}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              আলাদা উইন্ডোতে খুলুন
            </button>
          ) : (
            <div className="text-[11px] text-slate-500">
              {isInstalled ? '✅ অ্যাপ ইতিমধ্যে ইনস্টল করা আছে' : '১০০% অফলাইন সাপোর্টেড PWA & APK'}
            </div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm transition"
          >
            বুঝেছি
          </button>
        </div>
      </div>
    </div>
  );
};
