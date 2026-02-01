
import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const VatEngine: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">UK VAT Calculation Engine</h3>
            <p className="text-slate-600">Handling standard, zero-rated, and exempt transactions for HMRC compliance.</p>
          </div>
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
            UK VERSION 1.0
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 uppercase text-sm tracking-widest">Supported Tax Rates</h4>
            <ul className="space-y-3">
              <VatRateItem label="Standard Rate (20%)" desc="Default for most goods and services." />
              <VatRateItem label="Reduced Rate (5%)" desc="Domestic fuel, child car seats, etc." />
              <VatRateItem label="Zero Rate (0%)" desc="Books, most food, children's clothes." />
              <VatRateItem label="Exempt" desc="Insurance, education, postage stamps." />
            </ul>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="text-amber-500" size={18} /> MTD Posting Requirements
            </h4>
            <div className="text-sm text-slate-600 space-y-4">
              <p>
                To comply with UK Making Tax Digital (MTD), the system must store 
                <span className="font-semibold text-slate-800"> digital links</span> between 
                the invoice and the summary information in the VAT return.
              </p>
              <div className="bg-white p-4 rounded border border-slate-200">
                <p className="font-mono text-xs text-slate-500 mb-2">// VAT Return Logic</p>
                <code className="text-xs text-slate-700 block whitespace-pre">
                  {`Box 1 = Sum(JournalLines where Account=2200 and Type=Credit)
Box 4 = Sum(JournalLines where Account=2201 and Type=Debit)
Box 5 = Box 1 - Box 4`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Cash Basis" 
          content="Accounting for VAT only when money changes hands. The system looks at BankTransactions linked to Invoices."
        />
        <Card 
          title="Accrual Basis" 
          content="Standard method. VAT is due when the Invoice is issued, regardless of payment date."
        />
        <Card 
          title="Flat Rate Scheme" 
          content="Simplified VAT for small businesses. Calculate VAT due as a percentage of gross turnover."
        />
      </div>
    </div>
  );
};

const VatRateItem: React.FC<{ label: string; desc: string }> = ({ label, desc }) => (
  <li className="flex gap-3">
    <CheckCircle2 className="text-blue-500 mt-1" size={16} />
    <div>
      <span className="block font-bold text-slate-800 text-sm">{label}</span>
      <span className="block text-slate-500 text-xs">{desc}</span>
    </div>
  </li>
);

const Card: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200">
    <h5 className="font-bold text-slate-800 mb-2">{title}</h5>
    <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
  </div>
);

export default VatEngine;
