
import { Plus, Trash2, Save, X, Info, Scale, ChevronDown, Asterisk } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface JournalLine {
  id: string;
  accountId: string;
  description: string;
  debit: number;
  credit: number;
}

const COA_ACCOUNTS = [
  { id: '1', code: '1200', name: 'NatWest Bank Account', type: 'Asset' },
  { id: '2', code: '1100', name: 'Accounts Receivable', type: 'Asset' },
  { id: '3', code: '2100', name: 'Accounts Payable', type: 'Liability' },
  { id: '4', code: '2200', name: 'VAT Control Account', type: 'Liability' },
  { id: '5', code: '4000', name: 'Sales Income', type: 'Revenue' },
  { id: '6', code: '7100', name: 'Rent & Rates', type: 'Expense' },
  { id: '7', code: '7500', name: 'Office Supplies', type: 'Expense' },
  { id: '8', code: '3100', name: 'Owner Equity', type: 'Equity' },
];

interface ManualJournalFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ManualJournalForm: React.FC<ManualJournalFormProps> = ({ onSave, onCancel }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState(`JNL-${Math.floor(Math.random() * 900) + 100}`);
  const [narration, setNarration] = useState('');
  const [lines, setLines] = useState<JournalLine[]>([
    { id: '1', accountId: '', description: '', debit: 0, credit: 0 },
    { id: '2', accountId: '', description: '', debit: 0, credit: 0 }
  ]);
  const [activeRow, setActiveRow] = useState<string | null>(null);

  const totalDebits = lines.reduce((acc, line) => acc + (line.debit || 0), 0);
  const totalCredits = lines.reduce((acc, line) => acc + (line.credit || 0), 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.001 && totalDebits > 0;

  const addLine = () => {
    setLines([...lines, { id: Math.random().toString(36).substr(2, 9), accountId: '', description: '', debit: 0, credit: 0 }]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 2) setLines(lines.filter(l => l.id !== id));
  };

  const updateLine = (id: string, field: keyof JournalLine, value: any) => {
    setLines(lines.map(l => {
      if (l.id === id) {
        const updated = { ...l, [field]: value };
        // If debit is updated, reset credit to 0 (and vice-versa) for clarity in single line
        if (field === 'debit' && value > 0) updated.credit = 0;
        if (field === 'credit' && value > 0) updated.debit = 0;
        return updated;
      }
      return l;
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="px-6 py-4 border-b border-purple-100 bg-purple-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg text-white">
            <Scale size={18} />
          </div>
          <h3 className="font-bold text-slate-800">New Journal Entry</h3>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">Date</label>
            <input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">Reference</label>
            <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">Narration</label>
            <input type="text" placeholder="General description..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" value={narration} onChange={(e) => setNarration(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="pb-3 pr-4">Account</th>
                <th className="pb-3 px-4">Description</th>
                <th className="pb-3 px-4 w-32 text-right">Debit</th>
                <th className="pb-3 px-4 w-32 text-right">Credit</th>
                <th className="pb-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {lines.map((line) => (
                <tr key={line.id} className="group hover:bg-slate-50/50">
                  <td className="py-4 pr-4 relative">
                    <div 
                      onClick={() => setActiveRow(activeRow === line.id ? null : line.id)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm flex justify-between items-center cursor-pointer hover:border-purple-300 transition-colors"
                    >
                      <span className={line.accountId ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                        {COA_ACCOUNTS.find(a => a.id === line.accountId) ? `${COA_ACCOUNTS.find(a => a.id === line.accountId)?.code} - ${COA_ACCOUNTS.find(a => a.id === line.accountId)?.name}` : 'Select Account'}
                      </span>
                      <ChevronDown size={14} className="text-slate-400" />
                    </div>
                    {activeRow === line.id && (
                      <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 max-h-60 overflow-y-auto">
                        {COA_ACCOUNTS.map(acc => (
                          <div 
                            key={acc.id} 
                            onClick={() => { updateLine(line.id, 'accountId', acc.id); setActiveRow(null); }}
                            className="p-2 hover:bg-purple-50 rounded-lg flex justify-between cursor-pointer"
                          >
                            <span className="text-xs font-bold text-slate-700">{acc.code} - {acc.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">{acc.type}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <input type="text" className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 font-medium" placeholder="Line detail..." value={line.description} onChange={(e) => updateLine(line.id, 'description', e.target.value)} />
                  </td>
                  <td className="py-4 px-4">
                    <input type="number" step="0.01" className="w-full bg-transparent border-none focus:ring-0 text-sm text-right p-0 font-bold tabular-nums" value={line.debit || ''} onChange={(e) => updateLine(line.id, 'debit', parseFloat(e.target.value) || 0)} />
                  </td>
                  <td className="py-4 px-4">
                    <input type="number" step="0.01" className="w-full bg-transparent border-none focus:ring-0 text-sm text-right p-0 font-bold tabular-nums" value={line.credit || ''} onChange={(e) => updateLine(line.id, 'credit', parseFloat(e.target.value) || 0)} />
                  </td>
                  <td className="py-4 text-center">
                    <button onClick={() => removeLine(line.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={addLine} className="flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 mb-8"><Plus size={14} /> Add Line</button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-t border-slate-100 pt-8">
          <div className="max-w-xs p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-2">
            <div className="flex items-center gap-2 text-purple-800">
              <Info size={14} className="text-purple-500" />
              <span className="text-xs font-bold">Balancing Check</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              All journal entries must have equal debits and credits. This entry will update the trial balance immediately upon posting.
            </p>
          </div>

          <div className="w-full md:w-80 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-slate-700">
              <span>Total Debits</span>
              <span className="tabular-nums">£{totalDebits.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-700">
              <span>Total Credits</span>
              <span className="tabular-nums">£{totalCredits.toFixed(2)}</span>
            </div>
            <div className="h-[1px] bg-slate-100 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Difference</span>
              <span className={`text-sm font-black tabular-nums ${Math.abs(totalDebits - totalCredits) < 0.01 ? 'text-emerald-500' : 'text-rose-600'}`}>
                £{Math.abs(totalDebits - totalCredits).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
        <button onClick={onCancel} className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Discard</button>
        <button 
          onClick={() => onSave({ date, reference, narration, lines })}
          disabled={!isBalanced}
          className="px-8 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} /> Post Journal
        </button>
      </div>
    </div>
  );
};

export default ManualJournalForm;
