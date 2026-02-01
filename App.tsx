import React from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  LayoutDashboard,
  Building2,
  Globe
} from 'lucide-react';
import UserExperience from './components/UserExperience';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Premium Global Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">
              SalesMatrix <span className="text-blue-600">Accounting</span>
            </h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise GCC Edition</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black border border-emerald-100 uppercase tracking-widest">
            <Globe size={12} /> GCC Multilingual Support
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black border border-blue-100 uppercase tracking-widest">
            <ShieldCheck size={12} /> ZATCA & FTA Compliant
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer group">
            <Building2 size={18} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-3">
            <span className="w-10 h-[3px] bg-blue-600 rounded-full"></span> 
            Unified Console
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            Organization Workspace
          </h2>
          <p className="text-slate-500 text-lg max-w-3xl font-medium leading-relaxed">
            Scalable financial infrastructure for high-growth businesses. Seamlessly manage multi-regional entities, inventory lifecycles, and localized tax compliance.
          </p>
        </div>

        <UserExperience />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10 px-8 text-xs font-medium border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
             <p className="font-black text-white text-sm">SalesMatrix GCC</p>
             <p>&copy; 2024 SalesMatrix Enterprise Infrastructure. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700 hover:text-white transition-colors cursor-default">
              <ShieldCheck size={14} className="text-emerald-500" /> Secure Cloud Ledger
            </span>
            <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700 hover:text-white transition-colors cursor-default">
              <LayoutDashboard size={14} className="text-blue-500" /> Core Engine v1.2.4
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;