
import React, { useState } from 'react';
import { Database, Shield, Lock, FileText, Repeat, LayoutList, ChevronRight, Package, Truck, ShoppingBag, Scale, Warehouse } from 'lucide-react';

const DomainModel: React.FC = () => {
  const [activeSchema, setActiveSchema] = useState<'core' | 'ledger' | 'sales_cycle' | 'inventory'>('core');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Prisma Schema Architecture</h3>
            <p className="text-sm text-slate-500">Multi-tenant PostgreSQL design optimized for Full Warehouse Lifecycle & Stock Flows.</p>
          </div>
          <div className="flex gap-2">
            <SchemaTab active={activeSchema === 'core'} onClick={() => setActiveSchema('core')} label="Identity" />
            <SchemaTab active={activeSchema === 'ledger'} onClick={() => setActiveSchema('ledger')} label="Ledger" />
            <SchemaTab active={activeSchema === 'sales_cycle'} onClick={() => setActiveSchema('sales_cycle')} label="Sales Cycle" />
            <SchemaTab active={activeSchema === 'inventory'} onClick={() => setActiveSchema('inventory')} label="Warehouse Logic" />
          </div>
        </div>

        <div className="p-6">
          {activeSchema === 'core' && <CoreSchema />}
          {activeSchema === 'ledger' && <LedgerSchema />}
          {activeSchema === 'sales_cycle' && <SalesCycleSchema />}
          {activeSchema === 'inventory' && <InventorySchema />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DesignDecisionCard 
          icon={<Warehouse className="text-blue-500" />}
          title="Warehouse Sharding"
          description="Stock levels are tracked as a separate table `WarehouseStock` linked to `Item` and `Warehouse`. This prevents deadlocks during high-concurrency transfers."
        />
        <DesignDecisionCard 
          icon={<Truck className="text-purple-500" />}
          title="Inter-Warehouse Transit"
          description="Stock Transfers utilize an 'In-Transit' virtual warehouse bucket to ensure stock isn't double-counted during physical transport."
        />
        <DesignDecisionCard 
          icon={<Package className="text-emerald-500" />}
          title="GRN to Invoice Matching"
          description="Goods Received Notes (GRN) create immediate stock impact, while the matching Purchase Invoice confirms the cost basis for valuation."
        />
      </div>
    </div>
  );
};

const SchemaTab: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
      active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'
    }`}
  >
    {label}
  </button>
);

const DesignDecisionCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-transform hover:translate-y-[-2px]">
    <div className="mb-3">{icon}</div>
    <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
    <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const CoreSchema = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
      <Shield size={18} /> Identity & Context
    </div>
    <CodeBlock code={`
model Tenant {
  id          String       @id @default(uuid())
  name        String
  warehouses  Warehouse[]
  items       Item[]
}
    `} />
  </div>
);

const LedgerSchema = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
      <Database size={18} /> General Ledger
    </div>
    <CodeBlock code={`
model JournalEntry {
  id            String        @id @default(uuid())
  source_type   String        // "GRN", "STOCK_TRANSFER", "RETURN"
  source_id     String?
  lines         JournalLine[]
}
    `} />
  </div>
);

const SalesCycleSchema = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
      <FileText size={18} /> Fulfillment Documents
    </div>
    <CodeBlock code={`
model DeliveryNote {
  id             String    @id @default(uuid())
  warehouse_id   String    // Source warehouse
  status         String    // SHIPPED, DELIVERED
}
    `} />
  </div>
);

const InventorySchema = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
      <Warehouse size={18} /> Warehouse & Stock Life-cycle
    </div>
    <CodeBlock code={`
model Warehouse {
  id           String           @id @default(uuid())
  code         String
  name         String
  stocks       WarehouseStock[]
}

model WarehouseStock {
  warehouse_id String
  item_id      String
  on_hand      Decimal
  allocated    Decimal
}

model StockTransfer {
  id           String    @id @default(uuid())
  from_wh_id   String
  to_wh_id     String
  status       String    // IN_TRANSIT, RECEIVED
  lines        TransferLine[]
}

model GoodsReceivedNote {
  id           String    @id @default(uuid())
  po_ref       String?
  warehouse_id String
  items        StockMove[]
}
    `} />
  </div>
);

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <div className="bg-slate-900 rounded-lg p-4 text-[10px] font-mono text-blue-300 overflow-x-auto border border-slate-700 shadow-inner max-h-60 overflow-y-auto">
    <pre>{code.trim()}</pre>
  </div>
);

export default DomainModel;
