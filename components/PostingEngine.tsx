
import React from 'react';
import { Zap, Workflow, ArrowRightLeft, FileCode } from 'lucide-react';

const PostingEngine: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600 rounded-xl text-white">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Sales Posting Logic</h3>
            <p className="text-slate-500">Handling the transition from physical fulfillment to financial revenue.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Fulfillment" value="Inventory Out" desc="Reduces 'Stock on Hand' asset when DN is shipped." />
          <StatCard title="Revenue" value="Accounts Receivable" desc="Recognized when Invoice is posted." />
          <StatCard title="Direct Sync" value="Inventory + Sales" desc="Direct invoices handle both stock and AR in one atom." />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Workflow className="text-blue-500" size={20} /> Fulfillment Posting
          </h4>
          <div className="space-y-4">
            <Step number="1" title="Validate Stock" desc="Ensure available quantity matches or exceeds DN request." />
            <Step number="2" title="Commit Stock" desc="Move items to 'Allocated' state (Internal only)." />
            <Step number="3" title="Ship / Post Stock-Out" desc="Physical move. Debit 'COGS' (Expense), Credit 'Inventory' (Asset)." />
            <Step number="4" title="Billing Ready" desc="Mark DN as 'Awaiting Invoice' to allow sales recognition." />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ArrowRightLeft className="text-emerald-500" size={20} /> Direct Invoice Ledger Entry
          </h4>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="py-2">Account</th>
                  <th className="py-2 text-right">Debit</th>
                  <th className="py-2 text-right">Credit</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50">
                  <td className="py-2">Accounts Receivable (1100)</td>
                  <td className="py-2 text-right font-bold">£1,200.00</td>
                  <td className="py-2 text-right"></td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2">Sales Revenue (4000)</td>
                  <td className="py-2 text-right"></td>
                  <td className="py-2 text-right font-bold">£1,000.00</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2">VAT Liability (2200)</td>
                  <td className="py-2 text-right"></td>
                  <td className="py-2 text-right font-bold">£200.00</td>
                </tr>
                <tr className="border-b border-slate-50 bg-amber-50/50">
                  <td className="py-2 font-bold text-amber-600">Cost of Goods Sold (5000)</td>
                  <td className="py-2 text-right text-amber-600">£400.00</td>
                  <td className="py-2 text-right"></td>
                </tr>
                <tr className="border-b border-slate-50 bg-amber-50/50">
                  <td className="py-2 font-bold text-amber-600">Inventory Stock (1300)</td>
                  <td className="py-2 text-right"></td>
                  <td className="py-2 text-right text-amber-600">£400.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; desc: string }> = ({ title, value, desc }) => (
  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</span>
    <h5 className="text-lg font-bold text-slate-800 my-1">{value}</h5>
    <p className="text-xs text-slate-500 leading-tight">{desc}</p>
  </div>
);

const Step: React.FC<{ number: string; title: string; desc: string }> = ({ number, title, desc }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">{number}</div>
    <div><h5 className="font-bold text-slate-800 text-sm">{title}</h5><p className="text-xs text-slate-500 leading-relaxed">{desc}</p></div>
  </div>
);

export default PostingEngine;
