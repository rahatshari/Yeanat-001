import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    // Clear any service workers and reload
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
    }
    window.location.reload();
  };

  private handleResetStorage = () => {
    if (confirm('আপনি কি নিশ্চিত যে ক্যাশ মেমোরি ক্লিয়ার করে নতুন করে রিলোড করতে চান?')) {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error(e);
      }
      this.handleReload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-['Hind_Siliguri',sans-serif]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              সাময়িক যান্ত্রিক ত্রুটি দেখা দিয়েছে
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              মোবাইল ব্রাউজারের ক্যাশ বা কানেকশন ত্রুটির কারণে স্ক্রিন লোড হতে সমস্যা হয়েছে। নিচের বোতামে চাপ দিয়ে পুনরায় লোড করুন।
            </p>

            {this.state.error && (
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 font-mono text-left max-h-24 overflow-y-auto mb-5">
                {this.state.error.message || 'Unknown Error'}
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                পেজ পুনরায় লোড করুন (Reload)
              </button>

              <button
                onClick={this.handleResetStorage}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 rounded-xl font-semibold text-xs transition"
              >
                ক্যাশ রিসেট ও ফ্রেশ স্টার্ট
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
