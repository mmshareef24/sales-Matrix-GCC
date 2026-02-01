
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ShieldCheck, 
  Shield, 
  Clock, 
  MoreVertical, 
  Trash2, 
  Mail,
  UserPlus,
  Filter
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'ACCOUNTANT' | 'STAFF';
  status: 'ACTIVE' | 'INVITED';
  joinedAt: string;
}

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex@acme.com', role: 'ADMIN', status: 'ACTIVE', joinedAt: '12 Jan 2024' },
  { id: '2', name: 'Sarah Accountant', email: 'sarah@finbooks.co.uk', role: 'ACCOUNTANT', status: 'ACTIVE', joinedAt: '15 Feb 2024' },
  { id: '3', name: 'Tom Clerk', email: 'tom@acme.com', role: 'STAFF', status: 'ACTIVE', joinedAt: '01 Mar 2024' },
  { id: '4', name: 'Emily Advisor', email: 'emily@audit.com', role: 'ACCOUNTANT', status: 'INVITED', joinedAt: '22 Oct 2024' },
];

/**
 * Fuzzy match utility to handle minor typos (omitted characters)
 */
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

interface MembershipManagerProps {
  currentTenantName: string;
}

const MembershipManager: React.FC<MembershipManagerProps> = ({ currentTenantName }) => {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [search, setSearch] = useState('');

  const filteredMembers = members.filter(m => 
    fuzzyMatch(m.name, search) || 
    fuzzyMatch(m.email, search)
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Users className="text-blue-600" /> Users & Permissions
          </h3>
          <p className="text-xs text-slate-500">Manage who has access to <span className="font-bold text-slate-700">{currentTenantName}</span>.</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95">
          <UserPlus size={16} /> Invite User
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Filter size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Access Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredMembers.map(member => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{member.name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1"><Mail size={10} /> {member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={member.role} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      member.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                    {member.joinedAt}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={16} /></button>
                      <button className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl text-white">
          <ShieldCheck className="text-blue-400 mb-4" size={24} />
          <h4 className="font-bold text-lg mb-2">Role Permissions Matrix</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Roles defined at the <span className="font-bold text-slate-200">Membership</span> level determine access to specific API routes and ledger posting capabilities.
          </p>
          <div className="space-y-2">
            <RoleRow label="ADMIN" desc="Full organization control & User management" />
            <RoleRow label="ACCOUNTANT" desc="Finance controls, Ledger, and Posting" />
            <RoleRow label="STAFF" desc="Sales and Purchases Drafts only" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <Clock className="text-blue-600 mb-4" size={24} />
          <h4 className="font-bold text-blue-900 text-lg mb-2">Pending Invitations</h4>
          <p className="text-xs text-blue-700 leading-relaxed mb-4">
            These users have been invited to join the tenant but have not yet accepted their invitation.
          </p>
          <div className="bg-white rounded-xl border border-blue-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">EA</div>
              <div>
                <p className="text-xs font-bold text-slate-800">emily@audit.com</p>
                <p className="text-[10px] text-slate-500">Invited 2h ago</p>
              </div>
            </div>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Resend</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoleBadge: React.FC<{ role: Member['role'] }> = ({ role }) => {
  const styles = {
    ADMIN: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    ACCOUNTANT: 'bg-purple-50 text-purple-700 border-purple-100',
    STAFF: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border flex items-center gap-1.5 w-fit ${styles[role]}`}>
      {role === 'ADMIN' ? <Shield size={10} /> : <Users size={10} />}
      {role}
    </span>
  );
};

const RoleRow: React.FC<{ label: string; desc: string }> = ({ label, desc }) => (
  <div className="flex justify-between items-center gap-4 py-2 border-b border-slate-800 last:border-0">
    <span className="text-[10px] font-black text-slate-100 tracking-widest">{label}</span>
    <span className="text-[10px] text-slate-400 italic">{desc}</span>
  </div>
);

export default MembershipManager;
