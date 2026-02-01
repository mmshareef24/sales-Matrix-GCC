
import React from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  LayoutDashboard,
  Building2
} from 'lucide-react';
import UserExperience from './components/UserExperience';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Simplified Navigation focusing on Product only */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-600 w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            SalesMatrix <span className="text-blue-600">Accounting</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
            <ShieldCheck size={14} /> UK MTD Compliant
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
            <Building2 size={16} className="text-slate-600" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
            <span className="w-8 h-[2px] bg-blue-600"></span> 
            Platform Console
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            Workspace Management
          </h2>
          <p className="text-slate-600 max-w-2xl">
            Streamlined accounting for UK businesses. Manage invoices, purchases, and stock levels with ledger-grade accuracy.
          </p>
        </div>

        <UserExperience />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-6 px-8 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; 2024 SalesMatrix. Enterprise Accounting Infrastructure.</p>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><ShieldCheck size={14} /> Secure Ledger</span>
          <span className="flex items-center gap-1"><LayoutDashboard size={14} /> UK Version 1.0</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
