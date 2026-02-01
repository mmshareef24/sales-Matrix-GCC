
import React, { useState } from 'react';
import { Truck, X, Save, CheckCircle2, Package, Info, ArrowRight, ClipboardCheck, AlertCircle } from 'lucide-react';

interface ShipmentItem {
  id: string;
  name: string;
  sku: string;
  ordered: number;
  previouslyShipped: number;
  toShip: number;
}

const DeliveryNoteForm: React.FC<{ onSave: (data: any) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [carrier, setCarrier] = useState('DHL Express');
  const [tracking, setTracking] = useState('TRK-' + Math.floor(Math.random() * 900000));
  
  // Mocking items from the linked Sales Order
  const [items, setItems] = useState<ShipmentItem[]>([
    { 
      id: '1', 
      name: 'MacBook Pro 14"', 
      sku: 'LAP-001', 
      ordered: 5, 
      previouslyShipped: 0, 
      toShip: 5 
    },
    { 
      id: '2', 
      name: 'USB-C Hub', 
      sku: 'ACC-002', 
      ordered: 10, 
      previouslyShipped: 2, 
      toShip: 8 
    }
  ]);

  const handleQtyChange = (id: string, val: string) => {
    const num = parseInt(val) || 0;
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const remaining = item.ordered - item.previouslyShipped;
        // Clamp between 0 and remaining quantity
        const validatedQty = Math.max(0, Math.min(num, remaining));
        return { ...item, toShip: validatedQty };
      }
      return item;
    }));
  };

  const totalToShip = items.reduce((acc, item) => acc + item.toShip, 0);

  return (
    <div className="bg-white rounded-2xl border border-emerald-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg text-white">
            <Truck size={18} />
          </div>
          <h3 className="font-bold text-slate-800">New Delivery Note (Fulfillment)</h3>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded text-blue-600"><ClipboardCheck size={16} /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Linked Order</p>
                <p className="text-sm font-bold text-slate-800">SO-2024-001 (Acme Ltd)</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-600 text-white rounded">Reference OK</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Carrier</label>
              <input 
                type="text" 
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tracking #</label>
              <input 
                type="text" 
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Shipment Items</h4>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Package size={10} /> Validating Inventory Levels
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                 <tr>
                   <th className="px-4 py-3">Item Details</th>
                   <th className="px-4 py-3 text-center">In Order</th>
                   <th className="px-4 py-3 text-center">Prev Shipped</th>
                   <th className="px-4 py-3 text-center">To Ship Now</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-sm">
                 {items.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                     <td className="px-4 py-4">
                       <p className="font-bold text-slate-800">{item.name}</p>
                       <p className="text-[10px] font-mono text-slate-400">SKU: {item.sku}</p>
                     </td>
                     <td className="px-4 py-4 text-center font-medium text-slate-600">{item.ordered}</td>
                     <td className="px-4 py-4 text-center text-slate-400 italic">
                        {item.previouslyShipped > 0 ? item.previouslyShipped : '--'}
                     </td>
                     <td className="px-4 py-4 text-center">
                       <div className="flex flex-col items-center gap-1">
                         <div className="flex items-center justify-center gap-2">
                           <input 
                             type="number" 
                             className={`w-16 text-center border rounded py-1 font-black outline-none focus:ring-1 transition-all ${
                               item.toShip > (item.ordered - item.previouslyShipped) 
                               ? 'border-rose-500 text-rose-600 bg-rose-50' 
                               : 'border-slate-200 text-emerald-600 focus:ring-emerald-500'
                             }`}
                             value={item.toShip}
                             onChange={(e) => handleQtyChange(item.id, e.target.value)}
                             max={item.ordered - item.previouslyShipped}
                             min={0}
                           />
                           <span className="text-[10px] text-slate-400">pcs</span>
                         </div>
                         {item.toShip === (item.ordered - item.previouslyShipped) && item.ordered > 0 && (
                           <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Full Balance</span>
                         )}
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-4">
          <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600 shrink-0">
            <Package size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-emerald-900 mb-0.5">Physical Inventory Reduction</p>
            <p className="text-[10px] text-emerald-700 leading-relaxed italic">
              Once posted, stock levels for selected items will decrement across warehouses. 
              Currently processing <span className="font-bold">{totalToShip} total units</span> for fulfillment.
            </p>
          </div>
          {items.some(i => i.toShip === 0) && (
            <div className="flex items-center text-amber-500" title="Some items have zero quantity to ship">
               <AlertCircle size={16} />
            </div>
          )}
        </div>
      </div>

      <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
        <button onClick={onCancel} className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel Fulfillment</button>
        <button 
          onClick={() => onSave({ carrier, tracking, items })} 
          disabled={totalToShip === 0}
          className="px-8 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-emerald-700 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Truck size={16} /> Confirm Dispatch
        </button>
      </div>
    </div>
  );
};

export default DeliveryNoteForm;
