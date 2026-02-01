
import React, { useState } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Scale, 
  PieChart, 
  Download, 
  Printer, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft,
  Info, 
  ShieldCheck,
  Briefcase,
  Building2,
  Landmark,
  Calculator,
  Globe
} from 'lucide-react';
import { CountryConfig } from './UserExperience';

type ReportType = 'pnl' | 'balance_sheet' | 'vat' | 'trial_balance';

interface ReportsManagerProps {
  localization: CountryConfig;
}

const ReportsManager: React.FC<ReportsManagerProps> = ({ localization }) => {
  const [activeReport, setActiveReport] = useState<ReportType>('pnl');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Calculator className="text-blue-600" /> Financial Reports
          </h2>
          <p className="text-slate-500 text-sm">Professional statements for {localization.name} context.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Printer size={18} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg transition-all active:scale-95">
            <Download size={16} /> Export {localization.currency}
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar border border-slate-200 shadow-inner">
        <TabButton active={activeReport === 'pnl'} onClick={() => setActiveReport('pnl')} icon={<TrendingUp size={16} />} label="Profit & Loss" />
        <TabButton active={activeReport === 'balance_sheet'} onClick={() => setActiveReport('balance_sheet')} icon={<Scale size={16} />} label="Balance Sheet" />
        <TabButton active={activeReport === 'vat'} onClick={() => setActiveReport('vat')} icon={<ShieldCheck size={16} />} label={`${localization.taxLabel} Return`} />
        <TabButton active={activeReport === 'trial_balance'} onClick={() => setActiveReport('trial_balance')} icon={<FileText size={16} />} label="Trial Balance" />
      </div>

      {/* Report Content */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
        {activeReport === 'pnl' && <ProfitAndLossReport localization={localization} />}
        {activeReport === 'balance_sheet' && <BalanceSheetReport localization={localization} />}
        {activeReport === 'vat' && <VatReturnReport localization={localization} />}
        {activeReport === 'trial_balance' && <TrialBalanceReport localization={localization} />}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
      active ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-white/50'
    }`}
  >
    {icon} {label}
  </button>
);

const ProfitAndLossReport = ({ localization }: { localization: CountryConfig }) => {
  const revenue = 1250000.00;
  const cogs = 420000.00;
  const grossProfit = revenue - cogs;
  const expenses = 185000.25;
  const netProfit = grossProfit - expenses;

  return (
    <div className="animate-in fade-in p-8">
      <ReportHeader title="Statement of Income" period="01 Jan 2024 - 31 Oct 2024" localization={localization} />
      
      <div className="space-y-8">
        <ReportSection title="Operating Revenue">
          <ReportLine label="4000 - Sales Revenue" amount={revenue} localization={localization} />
          <ReportLine label="4100 - Regional Consultancy" amount={0} localization={localization} />
          <ReportTotal label="Gross Revenue" amount={revenue} localization={localization} />
        </ReportSection>

        <ReportSection title="Direct Costs">
          <ReportLine label="5000 - COGS (Inventory Shipped)" amount={cogs} negative localization={localization} />
          <ReportTotal label="Total COGS" amount={cogs} negative localization={localization} />
        </ReportSection>

        <div className="py-4 border-y-2 border-slate-900 bg-slate-50/50 px-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-black uppercase tracking-widest text-slate-900">Gross Profit</span>
            <span className="text-lg font-black text-slate-900">{localization.currency} {grossProfit.toLocaleString()}</span>
          </div>
        </div>

        <ReportSection title="Regional Expenses">
          <ReportLine label="7100 - Rent (Local Facility)" amount={120000.00} localization={localization} />
          <ReportLine label="7600 - Global SaaS Fees" amount={35000.00} localization={localization} />
          <ReportTotal label="Operating Expenses" amount={expenses} localization={localization} />
        </ReportSection>

        <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-2xl flex justify-between items-center mt-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Net Operating Income ({localization.currency})</p>
            <h4 className="text-4xl font-black">{localization.currency} {netProfit.toLocaleString()}</h4>
          </div>
          <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
             <TrendingUp size={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

const BalanceSheetReport = ({ localization }: { localization: CountryConfig }) => {
  const assets = 2500000;
  const liabilities = 800000;
  const equity = assets - liabilities;

  return (
    <div className="animate-in fade-in p-8">
      <ReportHeader title="Balance Sheet" period="As at 31 Oct 2024" localization={localization} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ReportSection title="Assets">
           <ReportLine label="Fixed Assets" amount={1500000} localization={localization} />
           <ReportLine label="Current Assets (Cash & Inv)" amount={1000000} localization={localization} />
           <ReportTotal label="Total Assets" amount={assets} highlight localization={localization} />
        </ReportSection>
        <ReportSection title="Liabilities & Equity">
           <ReportLine label="Total Liabilities" amount={liabilities} localization={localization} />
           <ReportLine label="Owner Equity" amount={equity} localization={localization} />
           <ReportTotal label="Total L&E" amount={liabilities + equity} highlight localization={localization} />
        </ReportSection>
      </div>
    </div>
  );
};

const VatReturnReport = ({ localization }: { localization: CountryConfig }) => {
  return (
    <div className="animate-in fade-in p-8">
      <ReportHeader title={`${localization.taxLabel} Return Summary`} period="Regional Quarter Q3 2024" localization={localization} />
      
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl mb-8 flex items-center gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600">
          <Globe size={24} />
        </div>
        <div>
          <h4 className="text-sm font-black text-emerald-900 uppercase">Localized for {localization.name}</h4>
          <p className="text-xs text-emerald-700 italic leading-relaxed">Box mapping and labels adjusted for {localization.taxLabel} reporting standards in the Middle East.</p>
        </div>
      </div>

      <div className="space-y-4 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <VatBox number={1} label={`Total ${localization.taxLabel} due on Outputs (Sales)`} amount={124000.00} localization={localization} />
        <VatBox number={2} label={`Total ${localization.taxLabel} reclaimed on Inputs (Purchases)`} amount={39800.00} localization={localization} />
        <VatBox number={3} label={`Net ${localization.taxLabel} Payable to Authority`} amount={84200.00} highlight localization={localization} />
      </div>
    </div>
  );
};

const TrialBalanceReport = ({ localization }: { localization: CountryConfig }) => (
  <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest">Trial Balance Context: {localization.currency}</div>
);

const ReportHeader: React.FC<{ title: string; period: string; localization: CountryConfig }> = ({ title, period, localization }) => (
  <div className="mb-10 text-center border-b border-slate-100 pb-8">
    <div className="flex items-center justify-center gap-2 mb-2">
       <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg">{localization.flag}</div>
       <h3 className="text-xl font-black text-slate-900 tracking-tight">SalesMatrix {localization.name}</h3>
    </div>
    <h4 className="text-3xl font-black text-slate-800 mb-1">{title}</h4>
    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
      <Calendar size={14} /> {period} | Currency: {localization.currency}
    </div>
  </div>
);

const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4">
    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">{title}</h5>
    <div className="space-y-3">{children}</div>
  </div>
);

const ReportLine: React.FC<{ label: string; amount: number; bold?: boolean; negative?: boolean; localization: CountryConfig }> = ({ label, amount, bold = false, negative = false, localization }) => (
  <div className="flex justify-between items-center px-2">
    <span className={`text-sm ${bold ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{label}</span>
    <span className={`text-sm tabular-nums ${bold ? 'font-bold text-slate-900' : 'text-slate-700'} ${negative ? 'text-rose-500' : ''}`}>
      {negative ? '(' : ''}{localization.currency} {Math.abs(amount).toLocaleString()}{negative ? ')' : ''}
    </span>
  </div>
);

const ReportTotal: React.FC<{ label: string; amount: number; negative?: boolean; highlight?: boolean; localization: CountryConfig }> = ({ label, amount, negative = false, highlight = false, localization }) => (
  <div className={`flex justify-between items-center py-4 px-6 rounded-2xl ${highlight ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-900 font-bold border border-slate-100'}`}>
    <span className={`text-xs uppercase tracking-widest font-black ${highlight ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
    <span className={`text-xl font-black tabular-nums ${negative && !highlight ? 'text-rose-600' : ''}`}>
      {negative ? '(' : ''}{localization.currency} {Math.abs(amount).toLocaleString()}{negative ? ')' : ''}
    </span>
  </div>
);

const VatBox: React.FC<{ number: number; label: string; amount: number; bold?: boolean; highlight?: boolean; localization: CountryConfig }> = ({ number, label, amount, bold = false, highlight = false, localization }) => (
  <div className={`flex items-center gap-6 p-6 transition-colors ${highlight ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-slate-50 bg-white'}`}>
    <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl font-black text-sm border-2 ${
      highlight ? 'bg-white/20 border-white/30 text-white' : 'bg-slate-100 border-slate-200 text-slate-600'
    }`}>
      {number}
    </div>
    <div className="flex-1">
      <p className={`text-sm ${bold ? 'font-black' : 'font-medium opacity-80'}`}>{label}</p>
    </div>
    <div className="text-right">
      <p className={`text-2xl font-black tabular-nums`}>{localization.currency} {amount.toLocaleString()}</p>
    </div>
  </div>
);

export default ReportsManager;
