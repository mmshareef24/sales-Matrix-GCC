
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Save, 
  X, 
  Warehouse as WarehouseIcon, 
  Plus, 
  Trash2, 
  Landmark, 
  Info, 
  ShoppingCart,
  FileCheck
} from 'lucide-react';

interface ReceiptLine {
  id: string;
  itemId: string;
  quantity: number;
  unitCost: number;
}

interface ReceiptFormProps {
  onSave: (receiptData: any) => void;
  onCancel: () => void;
  warehouses: any[];
  items: any[];
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ onSave, onCancel, warehouses, items }) => {
  const [vendor, setVendor] = useState('');
  const [poRef, setPoRef] = useState(`PO-${Math.floor(Math.random() * 9000) + 1000}`);
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [lines, setLines] = useState<ReceiptLine[]>([
    { id: '1', itemId: items[0]?.id || '', quantity: 1, unitCost: items[0]?.purchaseCost || 0 }
  ]);

  const addLine = () => {
    setLines([...lines, { id: Math.random().toString(), itemId: items[0]?.id || '', quantity: 1, unitCost: 0 }]);
  };

  const updateLine = (id: string, field: keyof ReceiptLine, value: any) => {
    setLines(lines.map(l => {
      if (l.id === id) {
        const updated = { ...l, [field]: value };
        // Auto-fill cost if item changes
        if (field === 'itemId') {
          const item = items.find(i => i.id === value);
          if (item) updated.unitCost = item.purchaseCost || 0;
        }
        return updated;
      }
      return l;
    }));
  };

  const removeLine = (id: string) => {
    if (lines.length > 1) setLines(lines.filter(l => l.id !== id));
  };

  const totalValue = lines.reduce((acc, l) => acc + (l.quantity * l.unitCost), 0);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor / Supplier</label>
          <input 
            type="text" 
            placeholder="e.g. Dell UK" 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            value={vendor}
            onChange={e => setVendor(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PO Reference</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            value={poRef}
            onChange={e => setPoRef(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination Warehouse</label>
          <div className="relative">
            <select 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
              value={warehouseId}
              onChange={e => setWarehouseId(e.target.value)}
            >
              {warehouses.map(wh => <option key={wh.id} value={wh.id}>{wh.name} ({wh.code})</option>)}
            </select>
            <WarehouseIcon size={14} className="absolute right-4 top-3 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Received</label>
          <input 
            type="date" 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Received Items</h4>
          <button onClick={addLine} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700">
            <Plus size={14} /> Add Line
          </button>
        </div>

        <div className="space-y-3">
          {lines.map(line => (
            <div key={line.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-slate-50 rounded-2xl border border-slate-200 group">
              <div className="col-span-12 md:col-span-5 space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Item SKU / Name</label>
                <select 
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                  value={line.itemId}
                  onChange={e => updateLine(line.id, 'itemId', e.target.value)}
                >
                  {items.map(it => <option key={it.id} value={it.id}>{it.sku} - {it.name}</option>)}
                </select>
              </div>
              <div className="col-span-4 md:col-span-2 space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase text-center block">Qty</label>
                <input 
                  type="number" 
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-center font-black"
                  value={line.quantity}
                  onChange={e => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-4 md:col-span-3 space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase text-right block">Unit Cost (£)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-right font-black"
                  value={line.unitCost}
                  onChange={e => updateLine(line.id, 'unitCost', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-4 md:col-span-2 flex justify-end pb-1.5">
                <button onClick={() => removeLine(line.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between border border-slate-800">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><FileCheck size={24} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ledger Impact (Preview)</p>
            <div className="mt-2 space-y-1 font-mono text-[10px]">
              <p className="text-emerald-400">DEBIT: Inventory Asset (1300) <span className="float-right">+£{totalValue.toLocaleString()}</span></p>
              <p className="text-blue-400">CREDIT: Stock Accrual (2110) <span className="float-right">-£{totalValue.toLocaleString()}</span></p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-slate-400">Total Valuation</p>
          <p className="text-3xl font-black text-white">£{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50">Cancel</button>
        <button 
          onClick={() => onSave({ vendor, poRef, warehouseId, date, lines, totalValue })}
          disabled={!vendor || lines.length === 0}
          className="flex-2 py-3 bg-blue-600 text-white rounded-xl font-bold px-12 hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={18} /> Record Goods Receipt
        </button>
      </div>
    </div>
  );
};

export default ReceiptForm;
