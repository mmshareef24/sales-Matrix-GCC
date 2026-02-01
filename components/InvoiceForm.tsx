
import React, { useState, useEffect, useRef } from 'react';
/* Added ShieldCheck to the imported icons from lucide-react */
import { Plus, Trash2, Save, X, Info, Package, Search, ChevronDown, Asterisk, AlertCircle, Database, ListTree, Tag, ShieldCheck } from 'lucide-react';
import { CountryConfig } from './UserExperience';

interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unit?: string; 
  unitPrice: number;
  taxRate: number; 
  itemSku?: string;
  masterGroupId?: string;
  masterSubgroupId?: string;
}

interface CatalogItem {
  id: string;
  sku: string;
  name: string;
  detailedDescription: string;
  price: number;
  taxRate: number;
  groupId: string;
  groupName: string;
  subgroupId?: string;
  subgroupName?: string;
  stockAvailable?: number;
  baseUnit: string;
}

const ITEM_CATALOG: CatalogItem[] = [
  { id: '1', sku: 'LAP-001', name: 'MacBook Pro 14"', detailedDescription: 'Hardware asset.', price: 6500.00, taxRate: 0.15, groupId: 'g1', groupName: 'Hardware', subgroupId: 'sg1', subgroupName: 'Laptops', stockAvailable: 9, baseUnit: 'Unit' },
  { id: '2', sku: 'ACC-002', name: 'USB-C Hub', detailedDescription: 'Connectivity peripheral.', price: 150.00, taxRate: 0.15, groupId: 'g1', groupName: 'Hardware', subgroupId: 'sg6', subgroupName: 'Accessories', stockAvailable: 0, baseUnit: 'Pc' },
  { id: '3', sku: 'SRV-CONS-01', name: 'Senior Consulting', detailedDescription: 'Professional strategy services.', price: 850.00, taxRate: 0.15, groupId: 'g2', groupName: 'Services', baseUnit: 'Hour' },
];

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

interface InvoiceFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  localization: CountryConfig;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSave, onCancel, localization }) => {
  const [customer, setCustomer] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${localization.code}-2024-${Math.floor(Math.random() * 900) + 100}`);
  const [lines, setLines] = useState<InvoiceLine[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, taxRate: localization.vatRate }
  ]);
  const [activeCatalogRow, setActiveCatalogRow] = useState<string | null>(null);
  const [stockWarning, setStockWarning] = useState<string[]>([]);
  const [searchCatalog, setSearchCatalog] = useState('');
  
  const [totals, setTotals] = useState({ net: 0, tax: 0, gross: 0 });

  useEffect(() => {
    const newNet = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0);
    const newTax = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice * line.taxRate), 0);
    setTotals({ net: newNet, tax: newTax, gross: newNet + newTax });
  }, [lines]);

  const addLine = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setLines([...lines, { id: newId, description: '', quantity: 1, unitPrice: 0, taxRate: localization.vatRate }]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 1) setLines(lines.filter(l => l.id !== id));
  };

  const updateLine = (id: string, field: keyof InvoiceLine, value: any) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const selectFromCatalog = (lineId: string, item: CatalogItem) => {
    setLines(lines.map(l => l.id === lineId ? {
      ...l,
      description: item.name,
      unitPrice: item.price,
      taxRate: localization.vatRate,
      itemSku: item.sku,
      unit: item.baseUnit,
      masterGroupId: item.groupId,
      masterSubgroupId: item.subgroupId
    } : l));
    setActiveCatalogRow(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100"><Plus size={20} /></div>
          <div>
            <h3 className="font-black text-slate-800 text-lg">New Sales Invoice</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{localization.name} Profile</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><X size={20} /></button>
      </div>

      <div className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer / Client</label>
            <input type="text" placeholder="e.g. Riyadh Tech Solutions" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={customer} onChange={(e) => setCustomer(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Date</label>
            <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Ref</label>
            <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto mb-10">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">
                <th className="pb-4 pr-4">Line Items & Materials</th>
                <th className="pb-4 px-4 w-24 text-center">Qty</th>
                <th className="pb-4 px-4 w-32 text-right">Rate ({localization.currency})</th>
                <th className="pb-4 pl-4 w-32 text-right">Amount</th>
                <th className="pb-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {lines.map((line) => (
                <tr key={line.id} className="group hover:bg-slate-50/50 relative">
                  <td className="py-6 pr-4">
                    <div className="space-y-2 relative">
                      <button 
                        onClick={() => setActiveCatalogRow(activeCatalogRow === line.id ? null : line.id)}
                        className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-tighter"
                      >
                        <Database size={12} />
                        {line.itemSku ? `SKU: ${line.itemSku}` : 'Catalog Lookup'}
                        <ChevronDown size={10} />
                      </button>
                      <input type="text" placeholder="Description..." className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 font-bold" value={line.description} onChange={(e) => updateLine(line.id, 'description', e.target.value)} />
                    </div>
                  </td>
                  <td className="py-6 px-4 align-top text-center">
                    <input type="number" className="w-16 bg-slate-50 border border-slate-100 rounded-lg text-sm text-center py-1 font-black" value={line.quantity} onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)} />
                  </td>
                  <td className="py-6 px-4 align-top text-right">
                    <input type="number" className="w-full bg-transparent border-none focus:ring-0 text-sm text-right p-0 font-black tabular-nums" value={line.unitPrice} onChange={(e) => updateLine(line.id, 'unitPrice', parseFloat(e.target.value) || 0)} />
                  </td>
                  <td className="py-6 pl-4 align-top text-right font-black text-slate-900 tabular-nums">
                    {(line.quantity * line.unitPrice).toLocaleString()}
                  </td>
                  <td className="py-6 pl-4 align-top text-right">
                    <button onClick={() => removeLine(line.id)} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={addLine} className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-all"><Plus size={14} /> Add Line Item</button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-t border-slate-100 pt-10 mt-10">
          <div className="max-w-xs p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
             <div className="flex items-center gap-2 mb-3">
               <ShieldCheck className="text-blue-400" size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">{localization.taxLabel} Compliance</span>
             </div>
             <p className="text-[10px] text-slate-400 leading-relaxed italic">
               This document includes a standard {localization.vatRate * 100}% {localization.taxLabel} calculation. Regional rounding rules for {localization.currency} are applied to the gross total.
             </p>
          </div>

          <div className="w-full md:w-96 space-y-4">
            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
              <span className="uppercase tracking-widest text-[10px]">Net Total</span>
              <span className="tabular-nums font-black text-slate-900">{localization.currency} {totals.net.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
              <span className="uppercase tracking-widest text-[10px]">{localization.taxLabel} ({localization.vatRate * 100}%)</span>
              <span className="tabular-nums font-black text-slate-900">{localization.currency} {totals.tax.toLocaleString()}</span>
            </div>
            <div className="h-[1px] bg-slate-100 my-4"></div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Invoice Balance</span>
              <span className="text-3xl font-black text-blue-600 tabular-nums">{localization.currency} {totals.gross.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
        <button onClick={onCancel} className="px-8 py-3 text-sm font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all">Discard</button>
        <button onClick={() => onSave({ customer, lines, totals })} className="px-10 py-3 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-slate-800 shadow-2xl shadow-slate-200 transition-all flex items-center gap-2 active:scale-95 uppercase tracking-widest"><Save size={18} /> Post to Ledger</button>
      </div>
    </div>
  );
};

export default InvoiceForm;
