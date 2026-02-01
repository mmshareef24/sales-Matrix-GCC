
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowLeft, 
  MoreVertical, 
  Info,
  Layers,
  FileText,
  History,
  Pencil
} from 'lucide-react';

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  description: string;
  balance: number;
  isSystem: boolean;
}

const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', code: '1200', name: 'NatWest Business Account', type: 'Asset', description: 'Primary business current account.', balance: 89400.15, isSystem: true },
  { id: '2', code: '1100', name: 'Accounts Receivable', type: 'Asset', description: 'Outstanding customer invoices.', balance: 42850.20, isSystem: true },
  { id: '11', code: '1300', name: 'Inventory Asset', type: 'Asset', description: 'Physical stock held for sale.', balance: 118200.00, isSystem: true },
  { id: '3', code: '2100', name: 'Accounts Payable', type: 'Liability', description: 'Outstanding vendor bills.', balance: 18200.00, isSystem: true },
  { id: '4', code: '2200', name: 'VAT Control Account', type: 'Liability', description: 'HMRC VAT liability/reclaim.', balance: 8420.00, isSystem: true },
  { id: '5', code: '4000', name: 'Sales Income', type: 'Revenue', description: 'Income from services and products.', balance: 125000.00, isSystem: true },
  { id: '12', code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'Expense', description: 'Purchase value of goods sold to customers.', balance: 42000.00, isSystem: true },
  { id: '6', code: '7100', name: 'Rent & Rates', type: 'Expense', description: 'Office rental and business rates.', balance: 12000.00, isSystem: false },
  { id: '7', code: '7500', name: 'Office Supplies', type: 'Expense', description: 'Stationery and small equipment.', balance: 450.25, isSystem: false },
  { id: '8', code: '3100', name: 'Owner Equity', type: 'Equity', description: 'Initial investment and retained earnings.', balance: 50000.00, isSystem: true },
];

/**
 * Fuzzy match utility to handle minor typos (omitted characters)
 */
const fuzzyMatch = (text: string, query: string): boolean => {
  if (!query) return true;
  const target = text.toLowerCase();
  const search = query.toLowerCase();
  
  if (target.includes(search)) return true;
  
  let j = 0;
  for (let i = 0; i < target.length && j < search.length; i++) {
    if (target[i] === search[j]) j++;
  }
  return j === search.length;
};

interface ChartOfAccountsProps {
  onBack: () => void;
}

const ChartOfAccounts: React.FC<ChartOfAccountsProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const filteredAccounts = INITIAL_ACCOUNTS.filter(acc => {
    const matchesSearch = fuzzyMatch(acc.name, search) || fuzzyMatch(acc.code, search);
    const matchesType = filterType === 'All' || acc.type === filterType;
    return matchesSearch && matchesType;
  });

  const types = ['All', 'Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800">Chart of Accounts</h3>
            <p className="text-xs text-slate-500">Business financial ledger structure.</p>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 flex items-center gap-2"><Plus size={16} /> Add Account</button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input type="text" placeholder="Search accounts..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><th className="px-6 py-4">Code</th><th className="px-6 py-4">Account Name</th><th className="px-6 py-4">Type</th><th className="px-6 py-4 text-right">Balance</th><th className="px-6 py-4 text-center">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAccounts.map(acc => (
              <tr key={acc.id} className="group hover:bg-slate-50/50">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{acc.code}</td>
                <td className="px-6 py-4"><span className="font-bold text-slate-900 text-sm">{acc.name}</span></td>
                <td className="px-6 py-4"><TypeBadge type={acc.type} /></td>
                <td className="px-6 py-4 text-right font-black text-slate-900 text-sm">£{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-center"><button className="p-1.5 text-slate-300 hover:text-slate-600"><MoreVertical size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TypeBadge: React.FC<{ type: Account['type'] }> = ({ type }) => {
  const styles = { Asset: 'bg-emerald-50 text-emerald-700 border-emerald-100', Liability: 'bg-rose-50 text-rose-700 border-rose-100', Equity: 'bg-amber-50 text-amber-700 border-amber-100', Revenue: 'bg-blue-50 text-blue-700 border-blue-100', Expense: 'bg-slate-100 text-slate-700 border-slate-200' };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[type]}`}>{type}</span>;
};

export default ChartOfAccounts;
