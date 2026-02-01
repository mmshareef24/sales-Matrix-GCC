
import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertTriangle, 
  RefreshCw, 
  MoreVertical, 
  Layers, 
  Plus, 
  History as HistoryIcon, 
  Filter,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  X,
  Save,
  Check,
  MapPin,
  Truck,
  RotateCcw,
  ClipboardList,
  Building2,
  Box,
  Warehouse as WarehouseIcon,
  Archive,
  ArrowLeftRight,
  Tags,
  Trash2,
  Edit2,
  Map as MapIcon,
  Globe,
  ClipboardCheck,
  ChevronRight,
  ChevronDown,
  Database,
  Link as LinkIcon,
  Tag,
  ListTree,
  ExternalLink,
  PlusCircle,
  PackagePlus,
  FolderPlus,
  CircleDollarSign,
  ShoppingCart,
  Receipt,
  Landmark,
  FileText,
  PieChart,
  BarChart3
} from 'lucide-react';
import ReceiptForm from './ReceiptForm';

interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  capacityUsed: number; 
  status: 'Active' | 'Full' | 'Maintenance';
}

interface MaterialSubgroup {
  id: string;
  name: string;
  code: string;
  groupId: string;
}

interface MaterialGroup {
  id: string;
  name: string;
  code: string;
  description: string;
  subgroups: MaterialSubgroup[];
}

interface StockItem {
  id: string;
  sku: string;
  name: string;
  type: 'Goods' | 'Service';
  onHand: number;
  warehouseQuantities: Record<string, number>;
  reorderPoint: number;
  groupId: string;
  subgroupId?: string;
  valuation: number;
  baseUnit: string;
  salesPrice?: number;
  purchaseCost?: number;
}

const INITIAL_GROUPS: MaterialGroup[] = [
  { 
    id: 'g1', 
    name: 'Hardware', 
    code: 'HW',
    description: 'Physical computer equipment and devices.', 
    subgroups: [
      { id: 'sg1', name: 'Laptops', code: 'LAP', groupId: 'g1' },
      { id: 'sg2', name: 'Monitors', code: 'MON', groupId: 'g1' },
      { id: 'sg3', name: 'Servers', code: 'SRV', groupId: 'g1' }
    ]
  },
  { 
    id: 'g2', 
    name: 'Software', 
    code: 'SW',
    description: 'Digital licenses and subscription products.', 
    subgroups: [
      { id: 'sg4', name: 'Cloud SaaS', code: 'CS', groupId: 'g2' },
      { id: 'sg5', name: 'On-Premise', code: 'OP', groupId: 'g2' }
    ]
  },
];

const INITIAL_WAREHOUSES: Warehouse[] = [
  { 
    id: 'wh1', 
    name: 'Main London Hub', 
    code: 'WH-LON-01', 
    address: { street: '15 Logistics Lane', city: 'London', postcode: 'EC1V 2NX', country: 'United Kingdom' },
    capacityUsed: 82, 
    status: 'Active' 
  },
  { 
    id: 'wh2', 
    name: 'Northern Distribution', 
    code: 'WH-MAN-02', 
    address: { street: 'Unit 4, Salford Industrial Estate', city: 'Manchester', postcode: 'M5 4WT', country: 'United Kingdom' },
    capacityUsed: 35, 
    status: 'Active' 
  },
];

const INITIAL_STOCK: StockItem[] = [
  { id: '1', sku: 'LAP-001', name: 'MacBook Pro 14"', type: 'Goods', onHand: 12, warehouseQuantities: { 'wh1': 10, 'wh2': 2 }, reorderPoint: 5, groupId: 'g1', subgroupId: 'sg1', valuation: 18000.00, baseUnit: 'Unit', salesPrice: 1850.00, purchaseCost: 1500.00 },
  { id: '2', sku: 'MON-042', name: 'Dell 27" UltraSharp', type: 'Goods', onHand: 8, warehouseQuantities: { 'wh1': 4, 'wh2': 4 }, reorderPoint: 2, groupId: 'g1', subgroupId: 'sg2', valuation: 2560.00, baseUnit: 'Unit', salesPrice: 450.00, purchaseCost: 320.00 },
];

const fuzzyMatch = (text: string, query: string): boolean => {
  if (!query) return true;
  const target = text.toLowerCase();
  const search = query.toLowerCase();
  if (target.includes(search)) return true;
  let j = 0;
  for (let i = 0; i < target.length && j < search.length; i++) {
    if (target[i] === search[j]) j++;
  }
  return j === search.length;
};

type InventoryTab = 'stock' | 'materials' | 'warehouses' | 'transfers' | 'receipts' | 'returns' | 'valuation';

const InventoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('stock');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<StockItem[]>(INITIAL_STOCK);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [groups, setGroups] = useState<MaterialGroup[]>(INITIAL_GROUPS);
  const [showModal, setShowModal] = useState<'item' | 'warehouse' | 'transfer' | 'receipt' | 'return' | 'group' | null>(null);
  const [editingGroup, setEditingGroup] = useState<MaterialGroup | null>(null);
  const [contextualParent, setContextualParent] = useState<{groupId?: string, subgroupId?: string}>({});
  const [receipts, setReceipts] = useState<any[]>([
    { id: 'r1', date: '24 Oct 2024', poRef: 'PO-8821', vendor: 'Dell UK', warehouse: 'Main London Hub', status: 'Received', totalValue: 4200.00 },
    { id: 'r2', date: '21 Oct 2024', poRef: 'PO-8815', vendor: 'Apple Corp', warehouse: 'Northern Distribution', status: 'Received', totalValue: 12000.00 },
  ]);

  const filteredItems = items.filter(i => 
    fuzzyMatch(i.name, search) || 
    fuzzyMatch(i.sku, search)
  );

  const filteredGroups = groups.filter(g => 
    fuzzyMatch(g.name, search) ||
    fuzzyMatch(g.code, search)
  );

  const totalStockValue = items.reduce((acc, i) => acc + i.valuation, 0);

  const handleCreateItemInContext = (groupId?: string, subgroupId?: string) => {
    setContextualParent({ groupId, subgroupId });
    setShowModal('item');
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setShowModal('group');
  };

  const handleSaveReceipt = (receiptData: any) => {
    // 1. Add to receipts list
    const newReceipt = {
      id: 'r' + Math.random(),
      date: receiptData.date,
      poRef: receiptData.poRef,
      vendor: receiptData.vendor,
      warehouse: warehouses.find(w => w.id === receiptData.warehouseId)?.name || 'Unknown',
      status: 'Received',
      totalValue: receiptData.totalValue
    };
    setReceipts([newReceipt, ...receipts]);

    // 2. Update stock items
    setItems(prevItems => prevItems.map(item => {
      const receiptLine = receiptData.lines.find((l: any) => l.itemId === item.id);
      if (receiptLine) {
        const warehouseId = receiptData.warehouseId;
        const currentWhQty = item.warehouseQuantities[warehouseId] || 0;
        const newWhQty = currentWhQty + receiptLine.quantity;
        const newOnHand = item.onHand + receiptLine.quantity;
        // Simple average valuation or just adding to it
        const newValuation = item.valuation + (receiptLine.quantity * receiptLine.unitCost);
        
        return {
          ...item,
          onHand: newOnHand,
          valuation: newValuation,
          warehouseQuantities: {
            ...item.warehouseQuantities,
            [warehouseId]: newWhQty
          }
        };
      }
      return item;
    }));

    setShowModal(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
          <TabNav active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} icon={<Archive size={14} />} label="Stock Levels" />
          <TabNav active={activeTab === 'materials'} onClick={() => setActiveTab('materials')} icon={<Database size={14} />} label="Materials Master" />
          <TabNav active={activeTab === 'warehouses'} onClick={() => setActiveTab('warehouses')} icon={<WarehouseIcon size={14} />} label="Warehouses" />
          <TabNav active={activeTab === 'transfers'} onClick={() => setActiveTab('transfers')} icon={<ArrowLeftRight size={14} />} label="Transfers" />
          <TabNav active={activeTab === 'receipts'} onClick={() => setActiveTab('receipts')} icon={<Box size={14} />} label="Receipts (PO)" />
          <TabNav active={activeTab === 'valuation'} onClick={() => setActiveTab('valuation')} icon={<BarChart3 size={14} />} label="Valuation Report" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Inventory Value" value={`£${totalStockValue.toLocaleString()}`} icon={<TrendingUp className="text-emerald-500" />} />
        <SummaryCard label="Master Groups" value={groups.length.toString()} icon={<Database className="text-indigo-500" />} />
        <SummaryCard label="Stock SKU Count" value={items.length.toString()} icon={<Package className="text-blue-500" />} />
        <SummaryCard label="Low Stock Alert" value={items.filter(i => i.onHand <= i.reorderPoint).length.toString()} icon={<AlertTriangle className="text-rose-500" />} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm min-h-[400px]">
        {activeTab === 'stock' && (
          <StockTable 
            items={filteredItems} 
            search={search} 
            onSearch={setSearch} 
            warehouses={warehouses} 
            groups={groups} 
            onNewItem={() => handleCreateItemInContext()}
          />
        )}
        {activeTab === 'materials' && (
          <MaterialsMasterTable 
            groups={filteredGroups} 
            items={items} 
            search={search} 
            onSearch={setSearch} 
            onEdit={g => { setEditingGroup(g); setShowModal('group'); }} 
            onDelete={id => setGroups(groups.filter(g => g.id !== id))}
            onAddItem={handleCreateItemInContext}
            onNewItem={() => handleCreateItemInContext()}
            onNewGroup={handleCreateGroup}
          />
        )}
        {activeTab === 'warehouses' && (
          <WarehouseGrid warehouses={warehouses} />
        )}
        {activeTab === 'transfers' && (
          <GenericList 
            title="Recent Stock Transfers" 
            columns={['Date', 'Reference', 'From', 'To', 'Status']} 
            rows={[
              ['22 Oct 2024', 'ST-402', 'London Hub', 'Manchester Dist', 'In Transit'],
              ['20 Oct 2024', 'ST-401', 'Manchester Dist', 'London Hub', 'Received'],
            ]} 
            onAction={() => setShowModal('transfer')}
            actionLabel="New Transfer"
            actionIcon={<Truck size={14} />}
          />
        )}
        {activeTab === 'receipts' && (
          <GenericList 
            title="Purchase Receipts (GRN)" 
            columns={['Date', 'PO Ref', 'Vendor', 'Warehouse', 'Valuation', 'Status']} 
            rows={receipts.map(r => [
              r.date, 
              r.poRef, 
              r.vendor, 
              r.warehouse, 
              `£${r.totalValue.toLocaleString()}`,
              r.status
            ])} 
            onAction={() => setShowModal('receipt')}
            actionLabel="New Receipt"
            actionIcon={<ClipboardCheck size={14} />}
          />
        )}
        {activeTab === 'valuation' && (
          <InventoryValuationReport 
            items={filteredItems} 
            warehouses={warehouses} 
            groups={groups} 
          />
        )}
      </div>

      {showModal && (
        <InventoryModal 
          type={showModal} 
          onClose={() => { setShowModal(null); setEditingGroup(null); setContextualParent({}); }} 
          warehouses={warehouses}
          items={items}
          groups={groups}
          editingGroup={editingGroup}
          context={contextualParent}
          onSaveGroup={(group) => {
            if (editingGroup) setGroups(groups.map(g => g.id === group.id ? group : g));
            else setGroups([...groups, { ...group, id: 'g' + Math.random() }]);
            setShowModal(null);
          }}
          onSaveItem={(item) => {
            setItems([...items, { ...item, id: Math.random().toString(), onHand: 0, valuation: 0, warehouseQuantities: {} }]);
            setShowModal(null);
          }}
          onSaveReceipt={handleSaveReceipt}
        />
      )}
    </div>
  );
};

const InventoryValuationReport: React.FC<{ 
  items: StockItem[]; 
  warehouses: Warehouse[]; 
  groups: MaterialGroup[];
}> = ({ items, warehouses, groups }) => {
  const totalValuation = items.reduce((acc, item) => acc + (item.valuation || 0), 0);
  
  const whTotals = warehouses.reduce((acc, wh) => {
    const whVal = items.reduce((sum, item) => {
      const qty = item.warehouseQuantities[wh.id] || 0;
      return sum + (qty * (item.purchaseCost || 0));
    }, 0);
    acc[wh.id] = whVal;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="animate-in fade-in p-6">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <PieChart className="text-blue-600" /> Inventory Valuation Summary
          </h3>
          <p className="text-slate-500 text-sm">Comprehensive financial breakdown of all stock assets across the network.</p>
        </div>
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-800">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Organization Valuation</p>
           <p className="text-2xl font-black tabular-nums">£{totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Item & SKU</th>
              <th className="px-6 py-4">Group</th>
              {warehouses.map(wh => (
                <th key={wh.id} className="px-6 py-4 text-right">{wh.name} (Val)</th>
              ))}
              <th className="px-6 py-4 text-center">Total Qty</th>
              <th className="px-6 py-4 text-right pr-8">Total Valuation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.filter(i => i.type === 'Goods').map(item => {
              const group = groups.find(g => g.id === item.groupId);
              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.sku}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{group?.name || 'Unset'}</span>
                  </td>
                  {warehouses.map(wh => {
                    const qty = item.warehouseQuantities[wh.id] || 0;
                    const val = qty * (item.purchaseCost || 0);
                    return (
                      <td key={wh.id} className="px-6 py-4 text-right">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">£{val.toLocaleString()}</span>
                          <span className="text-[9px] text-slate-400">{qty} units</span>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-center font-black text-slate-600 text-sm">
                    {item.onHand} {item.baseUnit}s
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900 tabular-nums pr-8">
                    £{(item.valuation || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-900 text-white">
            <tr className="font-black text-xs uppercase tracking-widest">
              <td colSpan={2} className="px-6 py-4 text-right">Grand Totals:</td>
              {warehouses.map(wh => (
                <td key={wh.id} className="px-6 py-4 text-right tabular-nums">
                  £{whTotals[wh.id].toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              ))}
              <td className="px-6 py-4 text-center">
                {items.reduce((acc, i) => acc + i.onHand, 0)} Total
              </td>
              <td className="px-6 py-4 text-right pr-8 tabular-nums">
                £{totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4">
          <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm"><FileText size={20} /></div>
          <div>
             <h4 className="text-xs font-black text-blue-900 uppercase mb-1">Financial Reconciliation</h4>
             <p className="text-[10px] text-blue-700 leading-relaxed italic">
               This report matches the Balance Sheet account 1300 (Inventory Asset). Discrepancies may occur due to Goods Received Notes awaiting Purchase Invoices (Accruals).
             </p>
          </div>
        </div>
        <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
          <div className="p-3 bg-white rounded-xl text-amber-600 shadow-sm"><Layers size={20} /></div>
          <div>
             <h4 className="text-xs font-black text-amber-900 uppercase mb-1">Stock Optimization</h4>
             <p className="text-[10px] text-amber-700 leading-relaxed italic">
               Inventory turnover is calculated based on historical movement. High-value stock in low-occupancy warehouses may indicate logistical inefficiency.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MaterialsMasterTable: React.FC<{ 
  groups: MaterialGroup[]; 
  items: StockItem[];
  search: string; 
  onSearch: (s: string) => void;
  onEdit: (g: MaterialGroup) => void;
  onDelete: (id: string) => void;
  onAddItem: (groupId: string, subgroupId?: string) => void;
  onNewItem: () => void;
  onNewGroup: () => void;
}> = ({ groups, items, search, onSearch, onEdit, onDelete, onAddItem, onNewItem, onNewGroup }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="animate-in fade-in">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filter Materials Master by group/subgroup/SKU..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={onNewItem} 
            className="flex-1 md:flex-none px-4 py-2 bg-white text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 shadow-sm active:scale-95 transition-all"
          >
            <PlusCircle size={14} /> New Item
          </button>
          <button 
            onClick={onNewGroup} 
            className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg active:scale-95 transition-all"
          >
            <FolderPlus size={14} /> New Group
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4 w-10"></th>
              <th className="px-6 py-4">Group</th>
              <th className="px-6 py-4">Hierarchy Summary</th>
              <th className="px-6 py-4 text-center">Items (SKUs)</th>
              <th className="px-6 py-4 text-right pr-12">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {groups.map(group => {
              const groupItems = items.filter(i => i.groupId === group.id);
              return (
                <React.Fragment key={group.id}>
                  <tr className={`hover:bg-slate-50/30 transition-colors group cursor-pointer ${expandedId === group.id ? 'bg-indigo-50/20' : ''}`} onClick={() => setExpandedId(expandedId === group.id ? null : group.id)}>
                    <td className="px-6 py-4">
                      {expandedId === group.id ? <ChevronDown size={16} className="text-indigo-500" /> : <ChevronRight size={16} className="text-slate-400" />}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500"><Database size={16} /></div>
                        <div>
                          <span className="font-bold text-slate-900 block">{group.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{group.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs text-slate-500 italic">{group.subgroups.length} Subgroups defined</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-600">
                        {groupItems.length} Records
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right pr-12" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onEdit(group)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors" title="Edit Group">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => onDelete(group.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors" title="Delete Group">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === group.id && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={5} className="px-12 py-6 border-t border-indigo-100">
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                             <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                               <ListTree size={12} /> Master Asset Map: {group.name}
                             </h5>
                             <button 
                               onClick={() => onAddItem(group.id)}
                               className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded transition-colors flex items-center gap-1"
                             >
                               <Plus size={10} /> Add Item to Group
                             </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group.subgroups.map(sg => {
                              const sgItems = groupItems.filter(i => i.subgroupId === sg.id);
                              return (
                                <div key={sg.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm group/sg">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <p className="text-xs font-black text-slate-800">{sg.name}</p>
                                      <p className="text-[9px] font-mono text-slate-400">REF: {sg.code}</p>
                                    </div>
                                    <button onClick={() => onAddItem(group.id, sg.id)} className="p-1 text-slate-300 hover:text-emerald-600 transition-colors">
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                  <div className="space-y-2">
                                    {sgItems.length > 0 ? sgItems.map(item => (
                                      <div key={item.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors">
                                        <div className="flex flex-col">
                                          <span className="text-[10px] font-bold text-slate-700">{item.name}</span>
                                          <span className="text-[9px] font-mono text-slate-400 uppercase">{item.sku}</span>
                                        </div>
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${item.onHand > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                          {item.onHand} {item.baseUnit}s
                                        </span>
                                      </div>
                                    )) : (
                                      <p className="text-[9px] text-slate-400 italic text-center py-4 border border-dashed border-slate-100 rounded-lg">No SKUs in this subgroup</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StockTable: React.FC<{ items: StockItem[]; search: string; onSearch: (s: string) => void; warehouses: Warehouse[]; groups: MaterialGroup[]; onNewItem: () => void }> = ({ items, search, onSearch, warehouses, groups, onNewItem }) => (
  <div className="animate-in fade-in">
    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center gap-4">
      <div className="relative flex-1 w-full">
        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search items by SKU or Name..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <button 
        onClick={onNewItem} 
        className="w-full md:w-auto px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 shadow-lg active:scale-95 transition-all"
      >
        <PackagePlus size={14} /> New SKU
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <th className="px-6 py-4">Asset & SKU</th>
            <th className="px-6 py-4">Master Grouping</th>
            {warehouses.map(wh => (
              <th key={wh.id} className="px-6 py-4 text-center">{wh.name.split(' ')[0]}</th>
            ))}
            <th className="px-6 py-4 text-center">Total Stock</th>
            <th className="px-6 py-4 text-right">Valuation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {items.map(item => {
            const group = groups.find(g => g.id === item.groupId);
            const subgroup = group?.subgroups.find(sg => sg.id === item.subgroupId);
            return (
              <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><Package size={16} /></div>
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[10px] font-mono text-slate-400 tracking-tight">{item.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase border border-indigo-100 w-fit">
                      {group?.name || 'Unassigned'}
                    </span>
                    {subgroup && (
                      <span className="text-[9px] text-slate-400 font-bold px-2 italic">{subgroup.name}</span>
                    )}
                  </div>
                </td>
                {warehouses.map(wh => (
                  <td key={wh.id} className="px-6 py-4 text-center font-medium text-slate-600">
                    {item.warehouseQuantities[wh.id] || 0}
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className={`font-black ${item.onHand <= item.reorderPoint ? 'text-rose-600' : 'text-slate-900'}`}>
                      {item.onHand}
                    </span>
                    <span className="text-[8px] text-slate-400 uppercase font-black tracking-tighter">{item.baseUnit}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-900 tabular-nums">£{(item.valuation || 0).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const InventoryModal: React.FC<{ 
  type: string; 
  onClose: () => void; 
  warehouses: Warehouse[]; 
  items: StockItem[]; 
  groups: MaterialGroup[];
  editingGroup: MaterialGroup | null;
  context: {groupId?: string, subgroupId?: string};
  onSaveGroup: (group: any) => void;
  onSaveItem: (item: any) => void;
  onSaveReceipt: (receipt: any) => void;
}> = ({ type, onClose, warehouses, items, groups, editingGroup, context, onSaveGroup, onSaveItem, onSaveReceipt }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h4 className="font-black text-slate-900 text-lg flex items-center gap-2 capitalize">
            {type === 'group' 
              ? (editingGroup ? 'Modify Master Group' : 'Define Master Group')
              : type === 'item' ? 'Register Master Material' : 
                type === 'receipt' ? 'Goods Received Note (PO)' : 'Inventory Operation'
            }
          </h4>
        </div>
        <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-all">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
        {type === 'item' && <ProductSkuForm onClose={onClose} groups={groups} context={context} onSave={onSaveItem} />}
        {type === 'group' && <MaterialGroupForm onClose={onClose} editingGroup={editingGroup} onSave={onSaveGroup} />}
        {type === 'transfer' && <TransferForm onClose={onClose} warehouses={warehouses} items={items} />}
        {type === 'receipt' && <ReceiptForm onSave={onSaveReceipt} onCancel={onClose} warehouses={warehouses} items={items} />}
      </div>
    </div>
  </div>
);

const MaterialGroupForm: React.FC<{ onClose: () => void; editingGroup: MaterialGroup | null; onSave: (g: any) => void }> = ({ onClose, editingGroup, onSave }) => {
  const [name, setName] = useState(editingGroup?.name || '');
  const [code, setCode] = useState(editingGroup?.code || '');
  const [subgroups, setSubgroups] = useState<MaterialSubgroup[]>(editingGroup?.subgroups || []);
  const [newSgName, setNewSgName] = useState('');
  const [newSgCode, setNewSgCode] = useState('');

  const addSg = () => {
    if (newSgName && newSgCode) {
      setSubgroups([...subgroups, { id: 'sg' + Math.random(), name: newSgName, code: newSgCode, groupId: editingGroup?.id || '' }]);
      setNewSgName(''); setNewSgCode('');
    }
  };

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); onSave({ ...editingGroup, name, code, subgroups }); }}>
      <div className="grid grid-cols-2 gap-4">
        <FormInput label="Group Name" placeholder="e.g. Hardware" value={name} onChange={v => setName(v)} />
        <FormInput label="Group Code" placeholder="e.g. HW" value={code} onChange={v => setCode(v)} />
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Define Subgroups</label>
        <div className="flex gap-2">
          <input type="text" placeholder="Subgroup Name" className="flex-1 px-3 py-2 bg-slate-50 border rounded-lg text-xs" value={newSgName} onChange={e => setNewSgName(e.target.value)} />
          <input type="text" placeholder="Code" className="w-20 px-3 py-2 bg-slate-50 border rounded-lg text-xs font-mono" value={newSgCode} onChange={e => setNewSgCode(e.target.value)} />
          <button type="button" onClick={addSg} className="p-2 bg-indigo-600 text-white rounded-lg"><Plus size={16} /></button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {subgroups.map(sg => (
            <div key={sg.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border">
              <span className="text-[10px] font-bold">{sg.name} ({sg.code})</span>
              <button type="button" onClick={() => setSubgroups(subgroups.filter(s => s.id !== sg.id))}><X size={12} className="text-slate-400" /></button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">Save Group Policy</button>
    </form>
  );
};

const ProductSkuForm: React.FC<{ onClose: () => void; groups: MaterialGroup[]; context: {groupId?: string, subgroupId?: string}; onSave: (i: any) => void }> = ({ onClose, groups, context, onSave }) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [type, setType] = useState<'Goods' | 'Service'>('Goods');
  const [gId, setGId] = useState(context.groupId || groups[0]?.id || '');
  const [sgId, setSgId] = useState(context.subgroupId || '');
  const [baseUnit, setBaseUnit] = useState('Unit');
  
  // Accounting & Financial Mappings
  const [salesPrice, setSalesPrice] = useState('0');
  const [purchaseCost, setPurchaseCost] = useState('0');
  const [salesAccount, setSalesAccount] = useState('4000');
  const [purchaseAccount, setPurchaseAccount] = useState('5000');
  const [inventoryAccount, setInventoryAccount] = useState('1300');

  const selectedGroup = groups.find(g => g.id === gId);

  return (
    <form className="space-y-8" onSubmit={e => { e.preventDefault(); onSave({ name, sku, type, groupId: gId, subgroupId: sgId, baseUnit, salesPrice: parseFloat(salesPrice), purchaseCost: parseFloat(purchaseCost) }); }}>
      <div className="flex gap-4 p-1 bg-slate-100 rounded-xl w-fit">
        <button type="button" onClick={() => setType('Goods')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${type === 'Goods' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>Physical Goods</button>
        <button type="button" onClick={() => setType('Service')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${type === 'Service' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>Services</button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FormInput label="Item Name" placeholder="e.g. MacBook Pro 14" value={name} onChange={v => setName(v)} />
        <FormInput label="SKU / Reference" placeholder="e.g. LAP-001" value={sku} onChange={v => setSku(v)} />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Group</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={gId} onChange={e => {setGId(e.target.value); setSgId('');}}>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subgroup</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={sgId} onChange={e => setSgId(e.target.value)}>
            <option value="">No Subgroup</option>
            {selectedGroup?.subgroups.map(sg => <option key={sg.id} value={sg.id}>{sg.name}</option>)}
          </select>
        </div>
      </div>

      <div className="h-[1px] bg-slate-100" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sales Logic */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
            <ShoppingCart size={12} /> Sales Information
          </h5>
          <div className="space-y-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase">Selling Price (£)</label>
              <input type="number" step="0.01" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" value={salesPrice} onChange={e => setSalesPrice(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase">Revenue Account</label>
              <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" value={salesAccount} onChange={e => setSalesAccount(e.target.value)}>
                <option value="4000">Sales Income (4000)</option>
                <option value="4100">Consultancy (4100)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Purchase Logic */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
            <Receipt size={12} /> Purchase Information
          </h5>
          <div className="space-y-4 p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase">Cost Price (£)</label>
              <input type="number" step="0.01" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" value={purchaseCost} onChange={e => setPurchaseCost(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase">Expense / COGS Account</label>
              <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" value={purchaseAccount} onChange={e => setPurchaseAccount(e.target.value)}>
                <option value="5000">COGS (5000)</option>
                <option value="7500">Office Supplies (7500)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Landmark size={14} className="text-slate-400" />
           <span className="text-[10px] font-bold text-slate-500 uppercase">Inventory Asset Account:</span>
        </div>
        <select className="bg-transparent text-xs font-bold outline-none" value={inventoryAccount} onChange={e => setInventoryAccount(e.target.value)} disabled={type === 'Service'}>
          <option value="1300">Stock Asset (1300)</option>
          <option value="1310">Transit Inventory (1310)</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50">Cancel</button>
        <button type="submit" className="flex-2 py-3 bg-slate-900 text-white rounded-xl font-bold px-12 hover:bg-slate-800 shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
          <Save size={18} /> Register Item
        </button>
      </div>
    </form>
  );
};

const TransferForm: React.FC<{ onClose: () => void; warehouses: Warehouse[]; items: StockItem[] }> = ({ onClose, warehouses, items }) => {
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || '');
  const selectedItem = items.find(i => i.id === selectedItemId);
  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none">
            {warehouses.map(wh => <option key={wh.id}>{wh.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none">
            {warehouses.map(wh => <option key={wh.id}>{wh.name}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Material to Move</label>
        <select className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold" value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)}>
          {items.map(it => <option key={it.id} value={it.id}>{it.name} ({it.sku})</option>)}
        </select>
      </div>
      {selectedItem && (
        <div className="bg-slate-50 p-4 rounded-xl border flex items-center gap-4 animate-in fade-in zoom-in-95">
          <div className="p-3 bg-white rounded-xl text-purple-600 shadow-sm border border-slate-200"><Package size={20} /></div>
          <div className="flex-1">
            <p className="text-xs font-black text-slate-900">{selectedItem.name}</p>
            <p className="text-[10px] font-mono text-slate-400">SKU: {selectedItem.sku}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-slate-900">{selectedItem.onHand}</p>
            <p className="text-[9px] text-slate-400 uppercase">{selectedItem.baseUnit}s on Hand</p>
          </div>
        </div>
      )}
      <FormInput label="Quantity" placeholder="0" value="" onChange={()=>{}} />
      <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Truck size={16} /> Authorize Transfer</button>
    </form>
  );
};

const SummaryCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p><p className="text-xl font-black text-slate-900">{value}</p></div>
    <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
  </div>
);

const TabNav: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${active ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-white/50'}`}>{icon} {label}</button>
);

const GenericList: React.FC<{ 
  title: string; 
  columns: string[]; 
  rows: string[][]; 
  onAction?: () => void; 
  actionLabel?: string; 
  actionIcon?: React.ReactNode 
}> = ({ title, columns, rows, onAction, actionLabel, actionIcon }) => (
  <div className="animate-in fade-in">
    <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
      <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h6>
      {onAction && (
        <button 
          onClick={onAction} 
          className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black flex items-center gap-2 hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          {actionIcon} {actionLabel}
        </button>
      )}
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead><tr className="border-b text-[10px] font-bold text-slate-400 uppercase">{columns.map((col, i) => (<th key={i} className="px-6 py-4">{col}</th>))}<th className="px-6 py-4"></th></tr></thead>
        <tbody className="divide-y divide-slate-100">{rows.map((row, i) => (<tr key={i} className="hover:bg-slate-50/50">{row.map((cell, j) => (<td key={j} className={`px-6 py-4 text-sm ${j === 5 ? 'font-bold text-blue-600' : j === 1 ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{cell}</td>))}<td className="px-6 py-4"><MoreVertical size={16} className="text-slate-300" /></td></tr>))}</tbody>
      </table>
    </div>
  </div>
);

const WarehouseGrid: React.FC<{ warehouses: Warehouse[] }> = ({ warehouses }) => (
  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
    {warehouses.map(wh => (
      <div key={wh.id} className="bg-white border rounded-3xl p-6 group transition-all hover:shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><WarehouseIcon size={24} /></div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${wh.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{wh.status}</span>
        </div>
        <h4 className="font-black text-slate-900 text-xl mb-1">{wh.name}</h4>
        <div className="flex items-center gap-1.5 text-slate-500 mb-6"><MapPin size={12} className="text-blue-500" /><p className="text-xs font-medium">{wh.address.city}, {wh.address.country}</p></div>
        <div className="space-y-2">
          <div className="flex justify-between items-end"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Physical Occupancy</span><span className="text-sm font-black text-slate-900">{wh.capacityUsed}%</span></div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${wh.capacityUsed > 80 ? 'bg-rose-500' : 'bg-emerald-500'} transition-all`} style={{ width: `${wh.capacityUsed}%` }}></div></div>
        </div>
      </div>
    ))}
  </div>
);

const FormInput: React.FC<{ label: string; placeholder: string; value: string; onChange: (v: string) => void }> = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-1 flex-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input type="text" placeholder={placeholder} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

export default InventoryManager;
