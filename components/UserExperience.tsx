
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Wallet, 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownLeft,
  RefreshCw,
  Check,
  AlertCircle,
  FileText,
  Clock,
  ArrowLeft,
  Truck,
  Scale,
  Landmark,
  BookOpenCheck,
  Users,
  Settings,
  ChevronDown,
  ShieldAlert,
  Building2,
  LogOut,
  ShieldCheck,
  Package,
  ShoppingBag,
  CreditCard,
  Globe,
  Building
} from 'lucide-react';
import BillForm from './BillForm';
import InvoiceForm from './InvoiceForm';
import ManualJournalForm from './ManualJournalForm';
import ChartOfAccounts from './ChartOfAccounts';
import MembershipManager from './MembershipManager';
import InventoryManager from './InventoryManager';
import SalesOrderForm from './SalesOrderForm';
import DeliveryNoteForm from './DeliveryNoteForm';
import BillPaymentForm from './BillPaymentForm';
import ReportsManager from './ReportsManager';

type Section = 'dashboard' | 'sales' | 'purchases' | 'banking' | 'finance' | 'inventory' | 'reports' | 'settings';
type SalesSubSection = 'orders' | 'deliveries' | 'invoices';
type Role = 'ADMIN' | 'ACCOUNTANT' | 'STAFF';

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  vatRate: number;
  taxLabel: string;
  flag: string;
}

export const COUNTRIES: Record<string, CountryConfig> = {
  UK: { code: 'UK', name: 'United Kingdom', currency: 'GBP', vatRate: 0.20, taxLabel: 'VAT', flag: '🇬🇧' },
  KSA: { code: 'KSA', name: 'Saudi Arabia', currency: 'SAR', vatRate: 0.15, taxLabel: 'VAT (ZATCA)', flag: '🇸🇦' },
  UAE: { code: 'UAE', name: 'United Arab Emirates', currency: 'AED', vatRate: 0.05, taxLabel: 'VAT (FTA)', flag: '🇦🇪' },
  BHR: { code: 'BHR', name: 'Bahrain', currency: 'BHD', vatRate: 0.10, taxLabel: 'VAT', flag: '🇧🇭' },
  OMN: { code: 'OMN', name: 'Oman', currency: 'OMR', vatRate: 0.05, taxLabel: 'VAT', flag: '🇴🇲' },
  KWT: { code: 'KWT', name: 'Kuwait', currency: 'KWD', vatRate: 0, taxLabel: 'No Tax', flag: '🇰🇼' },
  QAT: { code: 'QAT', name: 'Qatar', currency: 'QAR', vatRate: 0, taxLabel: 'No Tax', flag: '🇶🇦' },
};

interface Tenant {
  id: string;
  name: string;
  logo: string;
  country: string;
}

const INITIAL_TENANTS: Tenant[] = [
  { id: '1', name: 'Acme Middle East', logo: 'bg-indigo-600', country: 'KSA' },
  { id: '2', name: 'Global Exports LLC', logo: 'bg-emerald-600', country: 'UAE' },
];

const UserExperience: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');
  const [salesSubSection, setSalesSubSection] = useState<SalesSubSection>('invoices');
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(tenants[0]);
  const [currentRole, setCurrentRole] = useState<Role>('ADMIN');
  const [showTenantPicker, setShowTenantPicker] = useState(false);
  
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isCreatingSO, setIsCreatingSO] = useState(false);
  const [isCreatingDN, setIsCreatingDN] = useState(false);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [isPayingBill, setIsPayingBill] = useState(false);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<any>(null);
  const [isCreatingJournal, setIsCreatingJournal] = useState(false);
  const [isViewingCoA, setIsViewingCoA] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const localization = COUNTRIES[currentTenant.country] || COUNTRIES.UK;

  const permissions = {
    canManageFinance: currentRole === 'ADMIN' || currentRole === 'ACCOUNTANT',
    canManageUsers: currentRole === 'ADMIN',
    canPostDocuments: currentRole === 'ADMIN' || currentRole === 'ACCOUNTANT',
  };

  const handleUpdateCountry = (countryCode: string) => {
    setCurrentTenant(prev => ({ ...prev, country: countryCode }));
    setTenants(prev => prev.map(t => t.id === currentTenant.id ? { ...t, country: countryCode } : t));
  };

  const closeForms = () => {
    setIsCreatingInvoice(false);
    setIsCreatingSO(false);
    setIsCreatingDN(false);
    setIsCreatingBill(false);
    setIsPayingBill(false);
    setSelectedBillForPayment(null);
    setIsCreatingJournal(false);
    setIsViewingCoA(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Simulation Control Overlay */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Context: {localization.flag} {localization.name}</span>
          </div>
          <div className="h-6 w-[1px] bg-slate-700 mx-2"></div>
          <div className="flex gap-2">
            {(['ADMIN', 'ACCOUNTANT', 'STAFF'] as Role[]).map(r => (
              <button 
                key={r}
                onClick={() => { setCurrentRole(r); closeForms(); }}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${currentRole === r ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden lg:block text-[10px] font-mono text-slate-500">
          Currency: {localization.currency} | Default Tax: {localization.vatRate * 100}%
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex min-h-[700px]">
        {/* Sidebar */}
        <aside className="w-20 md:w-64 bg-slate-50 border-r border-slate-200 flex flex-shrink-0 flex-col">
          <div className="p-6 relative">
            <button onClick={() => setShowTenantPicker(!showTenantPicker)} className="flex items-center gap-3 w-full hover:bg-slate-100 p-2 -m-2 rounded-xl transition-all">
              <div className={`w-8 h-8 rounded-lg ${currentTenant.logo} flex items-center justify-center text-white shadow-lg`}>
                <Building2 size={16} />
              </div>
              <div className="hidden md:block flex-1 text-left">
                <p className="text-xs font-black text-slate-900 truncate">{currentTenant.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                  {localization.flag} {localization.code} Branch
                </p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {showTenantPicker && (
              <div className="absolute top-full left-4 right-4 z-50 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
                {tenants.map(t => (
                  <button key={t.id} onClick={() => { setCurrentTenant(t); setShowTenantPicker(false); closeForms(); }} className={`w-full flex items-center gap-3 p-2 rounded-xl ${currentTenant.id === t.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600'}`}>
                    <div className={`w-6 h-6 rounded ${t.logo}`} />
                    <span className="text-xs font-bold truncate">{t.name} ({t.country})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <nav className="flex-1 px-4 space-y-1 mt-4">
            <SidebarItem active={currentSection === 'dashboard'} onClick={() => { setCurrentSection('dashboard'); closeForms(); }} icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarItem active={currentSection === 'sales'} onClick={() => { setCurrentSection('sales'); closeForms(); }} icon={<ShoppingCart size={20} />} label="Sales" />
            <SidebarItem active={currentSection === 'purchases'} onClick={() => { setCurrentSection('purchases'); closeForms(); }} icon={<Truck size={20} />} label="Purchases" />
            <SidebarItem active={currentSection === 'inventory'} onClick={() => { setCurrentSection('inventory'); closeForms(); }} icon={<Package size={20} />} label="Inventory" />
            {permissions.canManageFinance && <SidebarItem active={currentSection === 'finance'} onClick={() => { setCurrentSection('finance'); closeForms(); }} icon={<Scale size={20} />} label="Finance" />}
            <SidebarItem active={currentSection === 'banking'} onClick={() => { setCurrentSection('banking'); closeForms(); }} icon={<Wallet size={20} />} label="Banking" />
            <SidebarItem active={currentSection === 'reports'} onClick={() => { setCurrentSection('reports'); closeForms(); }} icon={<BarChart3 size={20} />} label="Reports" />
            <SidebarItem active={currentSection === 'settings'} onClick={() => { setCurrentSection('settings'); closeForms(); }} icon={<Settings size={20} />} label="Company Profile" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-white">
          <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-4">
              {(isCreatingInvoice || isCreatingSO || isCreatingDN || isCreatingBill || isPayingBill || isCreatingJournal || isViewingCoA) && (
                <button onClick={closeForms} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><ArrowLeft size={18} /></button>
              )}
              <h4 className="font-bold text-slate-800 capitalize">
                {isCreatingInvoice ? 'New Invoice' : currentSection}
              </h4>
            </div>
            {!isCreatingInvoice && !isCreatingSO && !isCreatingDN && !isCreatingBill && !isPayingBill && !isCreatingJournal && !isViewingCoA && (
              <button onClick={() => { if(currentSection === 'sales') setIsCreatingInvoice(true); else if(currentSection === 'purchases') setIsCreatingBill(true); }} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg transition-all active:scale-95">
                <Plus size={16} /> <span className="hidden sm:inline">Create New</span>
              </button>
            )}
          </header>

          <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(100vh-16rem)]">
            {currentSection === 'dashboard' && <DashboardSimulation role={currentRole} localization={localization} />}
            
            {currentSection === 'sales' && (
              isCreatingInvoice ? <InvoiceForm onSave={closeForms} onCancel={closeForms} localization={localization} /> :
              <SalesSimulation onNew={() => setIsCreatingInvoice(true)} canPost={permissions.canPostDocuments} localization={localization} />
            )}

            {currentSection === 'purchases' && (
              isCreatingBill ? <BillForm onSave={closeForms} onCancel={closeForms} localization={localization} /> :
              <PurchasesSimulation localization={localization} />
            )}

            {currentSection === 'inventory' && <InventoryManager localization={localization} />}
            {currentSection === 'finance' && <FinanceSimulation localization={localization} />}
            {currentSection === 'reports' && <ReportsManager localization={localization} />}
            {currentSection === 'settings' && <CompanySettings tenant={currentTenant} onUpdateCountry={handleUpdateCountry} />}
          </div>
        </main>
      </div>
    </div>
  );
};

const CompanySettings: React.FC<{ tenant: Tenant; onUpdateCountry: (code: string) => void }> = ({ tenant, onUpdateCountry }) => (
  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
    <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-600 text-white rounded-2xl"><Building size={24} /></div>
        <div>
          <h3 className="text-xl font-black text-slate-900">Company Identity</h3>
          <p className="text-sm text-slate-500">Define your regional taxation and reporting profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Name</label>
          <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold" defaultValue={tenant.name} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Country</label>
          <select 
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold appearance-none"
            value={tenant.country}
            onChange={(e) => onUpdateCountry(e.target.value)}
          >
            {Object.values(COUNTRIES).map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white border border-slate-200 rounded-2xl flex gap-6">
        <div className="flex-1 space-y-2">
          <h4 className="text-xs font-black text-slate-900 uppercase">Local Tax Rules</h4>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Tax Type: <span className="font-bold text-slate-700">{COUNTRIES[tenant.country].taxLabel}</span></p>
            <p className="text-xs text-slate-500">Default Rate: <span className="font-bold text-slate-700">{COUNTRIES[tenant.country].vatRate * 100}%</span></p>
            <p className="text-xs text-slate-500">Reporting Currency: <span className="font-bold text-slate-700">{COUNTRIES[tenant.country].currency}</span></p>
          </div>
        </div>
        <div className="w-[1px] bg-slate-100" />
        <div className="flex-1">
           <div className="flex items-center gap-2 mb-2">
             <Globe className="text-blue-600" size={14} />
             <span className="text-xs font-black text-slate-900 uppercase">Legal Compliance</span>
           </div>
           <p className="text-[10px] text-slate-400 leading-relaxed italic">
             All tax calculations are adjusted according to the {COUNTRIES[tenant.country].name} legal framework. Invoice headers will reflect mandatory regional disclosures.
           </p>
        </div>
      </div>
    </div>
  </div>
);

const SidebarItem: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}>
    <span className="flex-shrink-0">{icon}</span>
    <span className="font-bold text-sm hidden md:block whitespace-nowrap">{label}</span>
  </button>
);

const DashboardSimulation: React.FC<{ role: Role; localization: CountryConfig }> = ({ localization }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Sales This Month" value={`${localization.currency} 42,850`} trend="+12%" />
      <MetricCard title="Inventory Value" value={`${localization.currency} 118,200`} trend="+2%" />
      <MetricCard title="Open Orders" value="12" status="4 Late" />
      <MetricCard title="Tax Liability" value={`${localization.currency} 8,420`} status={`${localization.taxLabel} Draft`} />
    </div>
  </div>
);

const SalesSimulation: React.FC<{ onNew: () => void; canPost: boolean; localization: CountryConfig }> = ({ localization }) => (
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><th className="px-6 py-4">Date</th><th className="px-6 py-4">Invoice #</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4 text-right">Amount</th><th className="px-6 py-4 text-center">Actions</th></tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-sm">
        <InvoiceRow localization={localization} date="22 Oct 2024" number="INV-2024-ME-01" contact="Riyadh Tech" status="POSTED" amount="2,400" />
        <InvoiceRow localization={localization} date="20 Oct 2024" number="INV-2024-ME-02" contact="Dubai Design" status="DRAFT" amount="850" />
      </tbody>
    </table>
  </div>
);

const PurchasesSimulation = ({ localization }: { localization: CountryConfig }) => (
  <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
    <Truck className="mx-auto text-slate-300 mb-4" size={48} />
    <p className="text-sm font-bold text-slate-500">Purchase Ledger Context: {localization.currency}</p>
  </div>
);

const FinanceSimulation = ({ localization }: { localization: CountryConfig }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-xl">
       <Scale className="text-blue-400 mb-4" size={32} />
       <h3 className="text-lg font-black">Regional Chart of Accounts</h3>
       <p className="text-xs text-slate-400 mt-2">Structure adjusted for {localization.taxLabel} compliance in {localization.name}.</p>
    </div>
  </div>
);

const MetricCard: React.FC<{ title: string; value: string; trend?: string; status?: string }> = ({ title, value, trend, status }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-colors group">
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
    <h4 className="text-xl font-extrabold text-slate-900 mb-2">{value}</h4>
    <div className="flex items-center gap-2">
      {trend && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100">{trend}</span>}
      {status && <span className="text-[10px] font-bold text-slate-400">{status}</span>}
    </div>
  </div>
);

const InvoiceRow: React.FC<{ date: string; number: string; contact: string; status: string; amount: string; localization: CountryConfig }> = ({ date, number, contact, status, amount, localization }) => (
  <tr className="hover:bg-slate-50/50 transition-colors group">
    <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">{date}</td>
    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">{number}</td>
    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{contact}</td>
    <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${status === 'POSTED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{status}</span></td>
    <td className="px-6 py-4 text-right font-bold text-slate-900 whitespace-nowrap">{localization.currency} {amount}</td>
    <td className="px-6 py-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={16} /></button>
      </div>
    </td>
  </tr>
);

export default UserExperience;
