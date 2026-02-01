
import React from 'react';

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="font-mono text-xs md:text-sm text-blue-300 overflow-x-auto bg-slate-800 p-6 rounded-lg leading-tight">
      <pre>{`
 [ Client: React/Mobile ]
           |
           | HTTPS / REST API
           v
 +---------------------------------------------------------------+
 |                        NESTJS MODULAR MONOLITH                 |
 |                                                               |
 |  +--------------------+       +----------------------------+  |
 |  |  TENANCY MODULE    | <---> |    IDENTITY & ACCESS       |  |
 |  | (Isolation Logic)  |       | (JWT, RBAC, Permissions)   |  |
 |  +----------+---------+       +-------------+--------------+  |
 |             |                               |                 |
 |             v                               v                 |
 |  +---------------------------------------------------------+  |
 |  |                    PRISMA MULTI-TENANT PROXY            |  |
 |  |       (Injects tenant_id into every where clause)       |  |
 |  +--------------------------+------------------------------+  |
 |                             |                                 |
 |  +--------------------------v------------------------------+  |
 |  |                 BUSINESS LOGIC DOMAINS                   |  |
 |  |                                                          |  |
 |  |  [ Sales ]       [ Purchases ]     [ Banking ]           |  |
 |  | (Invoices)      (Bills, Exp)      (Feed, Reconcile)      |  |
 |  |      |               |                 |                 |
 |  +------+---------------+-----------------+-----------------+  |
 |         |               |                 |                 |
 |         +---------------+-----------------+                 |
 |                         |                                   |
 |                         v                                   |
 |           +--------------------------------+                |
 |           |      LEDGER SERVICE (POSTING)  |                |
 |           | (Only Module allowed to Write) |                |
 |           +-------------+------------------+                |
 |                         |                                   |
 |  +----------------------v----------------------------------+  |
 |  |                 CORE ACCOUNTING (SHARED)                |  |
 |  |   [ Chart of Accounts ]    [ VAT Engine ]   [ Currency ]|  |
 |  +---------------------------------------------------------+  |
 |                                                               |
 +------------------------------+--------------------------------+
                                |
                                v
                +-------------------------------+
                |     POSTGRESQL (SHARED DB)    |
                |   - Row-Level Tenancy         |
                |   - Ledger (JournalLines)     |
                +-------------------------------+
      `}</pre>
    </div>
  );
};

export default ArchitectureDiagram;
