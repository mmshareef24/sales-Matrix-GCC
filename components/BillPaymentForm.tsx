
import React, { useState } from 'react';
import { CreditCard, X, Save, Landmark, Info, ArrowRightLeft, DollarSign } from 'lucide-react';

interface Bill {
  number: string;
  vendor: string;
  amount: number;
  balance: number;
  date: string;
}

interface BillPaymentFormProps {
  bill: Bill;
  onSave: (paymentData: any) => void;
  onCancel: () => void;
}

const BillPaymentForm: React.FC<BillPaymentFormProps> = ({ bill, onSave, onCancel }) => {
  const [amount, setAmount] = useState(bill.balance);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('Bank Transfer');
  const [account, setAccount] = useState('NatWest Business Account');
  const [reference, setReference] = useState('PAY-' + Math.floor(Math.random() * 900000));

  const isFullPayment = Math.abs(amount - bill.balance) < 0.01;

  return (
    <div className="bg-white rounded-2xl border border-rose-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="px-6 py-4 border-b border-rose-100 bg-rose-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-600 rounded-lg text-white">
            <CreditCard size={18} />
          </div>
          <h3 className="font-bold text-slate-800">Record Bill Payment</h3>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-8">
        {/* Bill Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-slate-400"><CreditCard size={18} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill Reference</p>
                <p className="text-sm font-bold text-slate-900">{bill.number}</p>
                <p className="text-[10px] text-slate-500">{bill.vendor}</p>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Current Balance</p>
              <p className="text-xl font-black text-rose-600">£{bill.balance.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Bill</p>
              <p className="text-sm font-bold text-slate-700">£{bill.amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount to Record</label>
            <div className="relative group">
              <span className="absolute left-4 top-2.5 text-slate-400 font-bold">£</span>
              <input 
                type="number" 
                step="0.01"
                max={bill.balance}
                className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              />
              {isFullPayment && (
                <span className="absolute right-4 top-2.5 text-[8px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-full">Full Payment</span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment Date</label>
            <input 
              type="date" 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment Method</label>
            <select 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none appearance-none"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option>Bank Transfer</option>
              <option>Corporate Credit Card</option>
              <option>Cash / Petty Cash</option>
              <option>Cheque</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paid from Account</label>
            <select 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            >
              <option>NatWest Business Account (1200)</option>
              <option>HSBC Savings (1201)</option>
              <option>Petty Cash (1205)</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 text-white flex gap-4 items-start shadow-xl">
          <div className="p-3 bg-slate-800 rounded-xl text-rose-500 shrink-0">
            <ArrowRightLeft size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Double-Entry Preview</p>
            <div className="space-y-2 font-mono text-[10px] text-blue-200">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span>DEBIT: Accounts Payable (2100)</span>
                <span className="font-bold">£{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="pl-4 italic">CREDIT: {account.split('(')[0]}</span>
                <span className="font-bold">£{amount.toFixed(2)}</span>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-slate-500 italic">
              * This payment will be linked directly to bill {bill.number} and update the vendor ledger.
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
        <button onClick={onCancel} className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
        <button 
          onClick={() => onSave({ amount, date, method, account, billId: bill.number, reference })}
          className="px-8 py-2 bg-rose-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-rose-700 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Save size={16} /> Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default BillPaymentForm;
