
import React from 'react';
import { UserCheck, Book, ShoppingCart, CreditCard, PieChart, Shield, Zap, Landmark, Scale } from 'lucide-react';

const ModuleGrid: React.FC = () => {
  const modules = [
    {
      title: "PostingEngine",
      icon: <Zap className="text-amber-500" />,
      responsibility: "The central gatekeeper. Converts Business Documents into Ledger Entries.",
      data: "N/A (Orchestrator)",
      rules: "Strict ACID transactions. Idempotency is mandatory. Period-lock check is final."
    },
    {
      title: "LedgerModule",
      icon: <Book className="text-blue-500" />,
      responsibility: "The 'Golden Core'. Manages Journal Entries, Journal Lines, and Trial Balance.",
      data: "Accounts, JournalEntry, JournalLine",
      rules: "Strict double-entry validation (Debits == Credits). Immutable records."
    },
    {
      title: "FinanceModule",
      icon: <Landmark className="text-purple-600" />,
      responsibility: "Financial governance. Manual Journals, Chart of Accounts, and Fiscal Periods.",
      data: "CoA, ManualJournals, PeriodLocks",
      rules: "Only Accountants/Admins can post. Prevents deletion of accounts with balances."
    },
    {
      title: "SalesModule",
      icon: <ShoppingCart className="text-emerald-500" />,
      responsibility: "Handles AR (Accounts Receivable). Customer management and Invoicing.",
      data: "Invoices, InvoiceItems, Customers",
      rules: "Must call PostingEngine to post an invoice. Cannot modify ledger directly."
    },
    {
      title: "PurchaseModule",
      icon: <CreditCard className="text-rose-500" />,
      responsibility: "Handles AP (Accounts Payable). Bills, Expenses, and Vendor management.",
      data: "Bills, BillItems, Vendors",
      rules: "Calculates input tax (VAT). Manages multi-currency expense claims."
    },
    {
      title: "AuthModule",
      icon: <Shield className="text-slate-500" />,
      responsibility: "Cross-tenant identity. Manages User sessions and Tenant switching.",
      data: "User, Tenant, Membership",
      rules: "Enforces Tenant ID context in AsyncLocalStorage for downstream services."
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {modules.map((m, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-50 rounded-lg">{m.icon}</div>
            <h4 className="font-bold text-slate-800">{m.title}</h4>
          </div>
          <p className="text-sm text-slate-600 mb-4">{m.responsibility}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium uppercase">Owned Data</span>
              <span className="text-slate-900 font-mono">{m.data}</span>
            </div>
            <div className="flex flex-col gap-1 text-xs border-t pt-2 border-slate-100">
              <span className="text-slate-400 font-medium uppercase tracking-wider">Primary Rule</span>
              <span className="text-slate-700 italic">"{m.rules}"</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModuleGrid;
