
import React, { useState } from 'react';
import { ShoppingBag, X, Save, Plus, Package, Info } from 'lucide-react';

const SalesOrderForm: React.FC<{ onSave: (data: any) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [customer, setCustomer] = useState('');
  const [lines, setLines] = useState([{ id: '1', item: '', qty: 1, price: 0 }]);

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="px-6 py-4 border-b border-blue-100 bg-blue-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <ShoppingBag size={18} />
          </div>
          <h3 className="font-bold text-slate-800">New Sales Order</h3>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</label>
            <input 
              type="text" 
              placeholder="Enter customer name..." 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expected Date</label>
            <input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Order Items</h4>
          {lines.map((line, idx) => (
            <div key={idx} className="flex gap-4 items-end animate-in slide-in-from-left-2" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex-1 space-y-1.5">
                <input 
                  type="text" 
                  placeholder="Item SKU or Name" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  value={line.item}
                  onChange={(e) => {
                    const newLines = [...lines];
                    newLines[idx].item = e.target.value;
                    setLines(newLines);
                  }}
                />
              </div>
              <div className="w-24 space-y-1.5">
                <input type="number" placeholder="Qty" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center" value={line.qty} />
              </div>
              <div className="w-32 space-y-1.5">
                <input type="number" placeholder="Price" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-right" value={line.price} />
              </div>
            </div>
          ))}
          <button 
            onClick={() => setLines([...lines, { id: Math.random().toString(), item: '', qty: 1, price: 0 }])}
            className="flex items-center gap-2 text-xs font-bold text-blue-600 pt-2"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-700 leading-relaxed italic">
            Sales Orders do not impact the General Ledger. They are commitments used to track stock allocation and fulfillment progress.
          </p>
        </div>
      </div>

      <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
        <button onClick={onCancel} className="px-6 py-2 text-sm font-bold text-slate-500 rounded-xl">Discard</button>
        <button onClick={() => onSave({ customer, lines })} className="px-8 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg">Confirm Order</button>
      </div>
    </div>
  );
};

export default SalesOrderForm;
