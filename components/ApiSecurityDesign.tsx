
import React from 'react';
import { Shield, Key, Users, Terminal, FileCode, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const ApiSecurityDesign: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Auth Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Key className="text-blue-600" size={20} /> Auth & Security Model
          </h3>
          <div className="space-y-4">
            <SecurityPoint 
              title="Dual-Token JWT" 
              desc="Access tokens (15m, in-memory) + Refresh tokens (7d, HttpOnly cookie) with revocation on logout." 
            />
            <SecurityPoint 
              title="Tenant Resolution" 
              desc="Resolved from JWT 'claims'. Membership validated via TenantGuard to prevent cross-tenant ID injection." 
            />
            <SecurityPoint 
              title="RBAC (Role Based Access Control)" 
              desc="Standard Roles: Admin (Full), Accountant (Financials + Posting), Staff (Drafts), Auditor (Read-only)." 
            />
            <SecurityPoint 
              title="AsyncLocalStorage Scope" 
              desc="NestJS CLS provides the current tenantId to Prisma middleware automatically for every request." 
            />
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-700">
          <div className="px-4 py-2 bg-slate-800 text-slate-400 text-xs font-mono border-b border-slate-700 flex justify-between">
            <span>TenantGuard.ts</span>
            <ShieldCheck size={14} className="text-emerald-500" />
          </div>
          <div className="p-4 text-[11px] font-mono text-blue-200 leading-relaxed overflow-x-auto">
            <pre>{`
@Injectable()
export class TenantGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // From AuthGuard
    const tenantId = request.headers['x-tenant-id'];

    // 1. Verify user is a member of the requested tenant
    const membership = user.memberships.find(m => m.tenantId === tenantId);
    if (!membership) throw new ForbiddenException('Invalid Tenant Context');

    // 2. Set tenant context for the lifecycle of the request
    this.als.enterWith({ tenantId, role: membership.role });
    return true;
  }
}
            `}</pre>
          </div>
        </div>
      </div>

      {/* REST API Endpoints */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Terminal className="text-slate-600" size={20} /> API Blueprint (SaaS Documents)
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ApiCategory title="Sales (Accounts Receivable)" color="blue">
              <Endpoint method="GET" path="/sales/invoices" desc="List tenant invoices" />
              <Endpoint method="POST" path="/sales/invoices" desc="Create DRAFT invoice" />
              <Endpoint method="POST" path="/sales/invoices/:id/post" desc="APPROVE & Post to Ledger" />
            </ApiCategory>

            <ApiCategory title="Purchases (Accounts Payable)" color="rose">
              <Endpoint method="GET" path="/purchases/bills" desc="List tenant bills" />
              <Endpoint method="POST" path="/purchases/bills" desc="Record vendor bill (DRAFT)" />
              <Endpoint method="POST" path="/purchases/bills/:id/approve" desc="Approve and Post to Ledger" />
            </ApiCategory>

            <ApiCategory title="Finance & Advisor" color="amber">
              <Endpoint method="GET" path="/finance/accounts" desc="Chart of Accounts Management" />
              <Endpoint method="POST" path="/finance/journals" desc="Create Manual Journal Entry" />
              <Endpoint method="POST" path="/finance/periods/lock" desc="Lock accounting period" />
            </ApiCategory>

            <ApiCategory title="Reporting & Core" color="emerald">
              <Endpoint method="GET" path="/reports/trial-balance" desc="Dynamic trial balance calculation" />
              <Endpoint method="GET" path="/reports/profit-loss" desc="P&L statement generation" />
              <Endpoint method="GET" path="/accounting/ledger" desc="Full Audit Log of JournalEntries" />
            </ApiCategory>
          </div>
        </div>
      </div>

      {/* Audit and Validation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="text-slate-600" size={18} /> Audit & Idempotency
          </h4>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">AuditInterceptor</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically logs every mutation (POST/PATCH/DELETE) with the user ID, timestamp, original body, and tenant ID to the `AuditLog` table.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Idempotency-Key</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mandatory header for all document posting operations. Prevents duplicate ledger entries if a network timeout occurs during posting.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={18} /> Error Handling Strategy
          </h4>
          <div className="space-y-3">
            <ErrorItem code="400 - BUSINESS_RULE_VIOLATION" desc="Attempted to post to a locked period or imbalanced journal." />
            <ErrorItem code="403 - TENANT_MISMATCH" desc="Tried to access data belonging to another tenant." />
            <ErrorItem code="409 - IDEMPOTENCY_CONFLICT" desc="Transaction with this key already exists in the system." />
            <ErrorItem code="422 - VALIDATION_ERROR" desc="Missing mandatory fields or malformed tax calculations." />
          </div>
        </div>
      </div>
    </div>
  );
};

const SecurityPoint: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="flex gap-3">
    <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={16} />
    <div>
      <span className="block font-bold text-slate-800 text-sm">{title}</span>
      <span className="block text-slate-500 text-xs leading-relaxed">{desc}</span>
    </div>
  </div>
);

const ApiCategory: React.FC<{ title: string; color: 'blue' | 'rose' | 'emerald' | 'amber'; children: React.ReactNode }> = ({ title, color, children }) => {
  const colorMap = {
    blue: 'border-blue-100 bg-blue-50/50 text-blue-800',
    rose: 'border-rose-100 bg-rose-50/50 text-rose-800',
    emerald: 'border-emerald-100 bg-emerald-50/50 text-emerald-800',
    amber: 'border-amber-100 bg-amber-50/50 text-amber-800',
  };
  return (
    <div className={`p-4 rounded-lg border ${colorMap[color]}`}>
      <h5 className="font-bold text-sm mb-3 uppercase tracking-wider">{title}</h5>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

const Endpoint: React.FC<{ method: string; path: string; desc: string }> = ({ method, path, desc }) => (
  <div className="flex items-center justify-between gap-4 py-1.5 border-b border-slate-200/50 last:border-0">
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-12 text-center ${
        method === 'GET' ? 'bg-slate-200 text-slate-600' : 
        method === 'POST' ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'
      }`}>{method}</span>
      <span className="font-mono text-[11px] text-slate-700">{path}</span>
    </div>
    <span className="text-[10px] text-slate-500 italic hidden md:inline">{desc}</span>
  </div>
);

const ErrorItem: React.FC<{ code: string; desc: string }> = ({ code, desc }) => (
  <div className="flex flex-col gap-0.5">
    <span className="font-mono text-[10px] font-bold text-slate-700">{code}</span>
    <span className="text-[11px] text-slate-500 leading-tight">{desc}</span>
  </div>
);

export default ApiSecurityDesign;
