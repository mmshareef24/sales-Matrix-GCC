
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, X, Info, Box, Search, ChevronDown, Asterisk } from 'lucide-react';

interface BillLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; 
  accountId: string; // Expense account
}

interface ExpenseCategory {
  id: string;
  code: string;
  name: string;
  defaultTaxRate: number;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: '1', code: '7100', name: 'Rent & Rates', defaultTaxRate: 0.20 },
  { id: '2', code: '7200', name: 'Heat & Light', defaultTaxRate: 0.20 },
  { id: '3', code: '7300', name: 'Telecommunications', defaultTaxRate: 0.20 },
  { id: '4', code: '7400', name: 'Travel & Subsistence', defaultTaxRate: 0.20 },
  { id: '5', code: '7500', name: 'Office Supplies', defaultTaxRate: 0.20 },
  { id: '6', code: '7600', name: 'Software & Tools', defaultTaxRate: 0.20 },
  { id: '7', code: '7700', name: 'Marketing & Advertising', defaultTaxRate: 0.20 },
  { id: '8', code: '7800', name: 'Professional Fees', defaultTaxRate: 0.20 },
  { id: '9', code: '5000', name: 'Cost of Goods Sold', defaultTaxRate: 0.20 },
];

interface BillFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const BillForm: React.FC<BillFormProps> = ({ onSave, onCancel }) => {
  const [vendor, setVendor] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [billNumber, setBillNumber] = useState(`BIL-2024-${Math.floor(Math.random() * 900) + 100}`);
  const [lines, setLines] = useState<BillLine[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, taxRate: 0.20, accountId: '6' }
  ]);
  const [activeCategoryRow, setActiveCategoryRow] = useState<string | null>(null);
  const lastLineRef = useRef<HTMLInputElement>(null);

  const [totals, setTotals] = useState({
    net: 0,
    tax: 0,
    gross: 0
  });

  useEffect(() => {
    const newNet = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0);
    const newTax = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice * line.taxRate), 0);
    setTotals({
      net: newNet,
      tax: newTax,
      gross: newNet + newTax
    });
  }, [lines]);

  const addLine = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setLines([...lines, { 
      id: newId, 
      description: '', 
      quantity: 1, 
      unitPrice: 0, 
      taxRate: 0.20,
      accountId: '5'
    }]);
    setTimeout(() => {
      lastLineRef.current?.focus();
    }, 0);
  };

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter(l => l.id !== id));
    }
  };

  const updateLine = (id: string, field: keyof BillLine, value: any) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const selectCategory = (lineId: string, category: ExpenseCategory) => {
    setLines(lines.map(l => l.id === lineId ? {
      ...l,
      accountId: category.id,
      taxRate: category.defaultTaxRate,
      description: l.description || `${category.name} expense`
    } : l));
    setActiveCategoryRow(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && index === lines.length - 1) {
      e.preventDefault();
      addLine();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="px-6 py-4 border-b border-rose-100 bg-rose-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-600 rounded-lg text-white">
            <Plus size={18} />
          </div>
          <h3 className="font-bold text-slate-800">New Purchase Bill</h3>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              Vendor <Asterisk size={10} className="text-rose-500" />
            </label>
            <div className="relative group">
              <input 
                type="text" 
                required
                placeholder="Select or enter vendor..." 
                className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent focus:bg-white outline-none transition-all"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />
              <Search size={14} className="absolute right-3 top-3 text-slate-400" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              Bill Date <Asterisk size={10} className="text-rose-500" />
            </label>
            <input 
              type="date" 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent focus:bg-white outline-none transition-all"
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              Bill Reference <Asterisk size={10} className="text-rose-500" />
            </label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent focus:bg-white outline-none transition-all"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-3 pr-4">Description / Expense Account</th>
                  <th className="pb-3 px-4 w-24 text-center">Qty</th>
                  <th className="pb-3 px-4 w-32 text-right">Unit Price</th>
                  <th className="pb-3 px-4 w-28 text-right">Tax Rate</th>
                  <th className="pb-3 pl-4 w-32 text-right">Total</th>
                  <th className="pb-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lines.map((line, index) => (
                  <tr key={line.id} className="group hover:bg-slate-50/50 transition-colors relative">
                    <td className="py-4 pr-4">
                      <div className="space-y-2 relative">
                        <button 
                          onClick={() => setActiveCategoryRow(activeCategoryRow === line.id ? null : line.id)}
                          className="flex items-center gap-2 text-[10px] font-bold text-rose-600 hover:text-rose-800 transition-colors uppercase tracking-tight focus:outline-none"
                        >
                          <Box size={12} />
                          {EXPENSE_CATEGORIES.find(c => c.id === line.accountId)?.name || 'Choose Account'}
                          <ChevronDown size={10} />
                        </button>
                        
                        {activeCategoryRow === line.id && (
                          <div className="absolute top-8 left-0 z-30 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-2">
                            <div className="max-h-60 overflow-y-auto">
                              {EXPENSE_CATEGORIES.map((cat) => (
                                <button
                                  key={cat.id}
                                  onClick={() => selectCategory(line.id, cat)}
                                  className="w-full text-left p-3 hover:bg-rose-50 rounded-lg transition-all"
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-slate-900">{cat.name}</span>
                                    <span className="text-[10px] font-mono text-slate-400">{cat.code}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <textarea 
                          ref={index === lines.length - 1 ? (lastLineRef as any) : null}
                          required
                          rows={2}
                          placeholder="Bill item description..."
                          className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 placeholder:text-slate-300 font-medium focus:text-rose-600 resize-none min-h-[40px]"
                          value={line.description}
                          onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top pt-8">
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-full bg-transparent border-none focus:ring-0 text-sm text-center p-0 font-medium focus:text-rose-600"
                        value={line.quantity}
                        onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-4 px-4 align-top pt-8 text-right">
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-full bg-transparent border-none focus:ring-0 text-sm text-right p-0 font-medium focus:text-rose-600"
                        value={line.unitPrice}
                        onChange={(e) => updateLine(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    </td>
                    <td className="py-4 px-4 align-top pt-8 text-right">
                      <select 
                        className="bg-transparent border-none focus:ring-0 text-sm text-right p-0 appearance-none cursor-pointer text-slate-600 font-medium hover:text-rose-600"
                        value={line.taxRate}
                        onChange={(e) => updateLine(line.id, 'taxRate', parseFloat(e.target.value))}
                      >
                        <option value={0.20}>Std (20%)</option>
                        <option value={0.05}>Red (5%)</option>
                        <option value={0}>Zero (0%)</option>
                        <option value={0}>Exempt</option>
                      </select>
                    </td>
                    <td className="py-4 pl-4 align-top pt-8 text-right font-black text-slate-900 tabular-nums">
                      £{(line.quantity * line.unitPrice).toFixed(2)}
                    </td>
                    <td className="py-4 pl-4 align-top pt-8 text-right">
                      <button 
                        onClick={() => removeLine(line.id)}
                        disabled={lines.length <= 1}
                        className={`text-slate-200 hover:text-rose-500 transition-all ${lines.length > 1 ? 'opacity-0 group-hover:opacity-100' : 'cursor-not-allowed'}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button 
            onClick={addLine}
            className="mt-4 flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 transition-all"
          >
            <Plus size={14} /> Add Line Item
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-t border-slate-100 pt-8">
          <div className="max-w-xs p-4 bg-rose-50/30 rounded-xl border border-rose-100 space-y-2 group/ledger">
            <div className="flex items-center gap-2 text-slate-800">
              <Info size={14} className="text-rose-500 group-hover/ledger:rotate-12 transition-transform" />
              <span className="text-xs font-bold">Posting logic</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Recording this bill will debit selected <span className="font-semibold text-slate-700">Expense accounts</span> and credit <span className="font-semibold text-slate-700">Accounts Payable (2100)</span>.
            </p>
          </div>

          <div className="w-full md:w-80 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">Subtotal (Net)</span>
              <span className="font-bold text-slate-700 tabular-nums">£{totals.net.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">VAT Input</span>
              <span className="font-bold text-slate-700 tabular-nums">£{totals.tax.toFixed(2)}</span>
            </div>
            <div className="h-[1px] bg-slate-100 my-2"></div>
            <div className="flex justify-between items-center text-xl">
              <span className="font-black text-slate-900">Total Payable</span>
              <span className="font-black text-rose-600 tabular-nums">£{totals.gross.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
        <button onClick={onCancel} className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Discard</button>
        <button 
          onClick={() => onSave({ vendor, billDate, billNumber, lines, totals })}
          disabled={!vendor || lines.some(l => !l.description)}
          className="px-8 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} /> Save Bill
        </button>
      </div>
    </div>
  );
};

export default BillForm;
