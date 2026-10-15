/**
 * Enterprise Administration & Audit Console
 * Clean secondary settings navigation: Users & Roles, Sessions, SSO, Audit Trail
 */

import React, { useState } from 'react';
import { useAdminStore } from '../stores/admin-store';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';
import { ExportButton } from '../components/shared/ExportButton';
import { timeAgo } from '../lib/utils';
import { Users, Shield, Key, History, Lock } from 'lucide-react';

const ADMIN_TABS = ['SESSIONS', 'USERS_ROLES', 'SSO', 'AUDIT_LOG'] as const;

export const AdminPage: React.FC = () => {
  const { auditLogs } = useAdminStore();
  const [activeTab, setActiveTab] = useState<(typeof ADMIN_TABS)[number]>('AUDIT_LOG');

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Enterprise Administration</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Operator RBAC governance, enterprise SSO identity bindings, and immutable audit logging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton
            resourceName="Admin Audit Trail"
            recordCount={auditLogs.length}
            data={auditLogs}
          />
        </div>
      </div>

      {/* SECTION 28: Secondary Settings Navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#20242a] pb-1 text-xs">
        <button
          onClick={() => setActiveTab('AUDIT_LOG')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            activeTab === 'AUDIT_LOG'
              ? 'bg-[#181c22] text-white font-medium border border-[#2b323c]'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Operator Audit Log
        </button>
        <button
          onClick={() => setActiveTab('USERS_ROLES')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            activeTab === 'USERS_ROLES'
              ? 'bg-[#181c22] text-white font-medium border border-[#2b323c]'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Users & RBAC Roles
        </button>
        <button
          onClick={() => setActiveTab('SESSIONS')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            activeTab === 'SESSIONS'
              ? 'bg-[#181c22] text-white font-medium border border-[#2b323c]'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Active Sessions
        </button>
        <button
          onClick={() => setActiveTab('SSO')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            activeTab === 'SSO'
              ? 'bg-[#181c22] text-white font-medium border border-[#2b323c]'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Single Sign-On (SSO)
        </button>
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'AUDIT_LOG' && (
        <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
          <div className="p-3 border-b border-[#20242a] flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
              Immutable Operator Audit Log
            </span>
            <span className="font-mono text-zinc-500 text-[11px]">SHA-256 tamper-sealed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#14171c] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Operator / Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target Resource</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Signature Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181b20] text-zinc-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#15181e] transition-colors">
                    <td className="py-2.5 px-3 text-zinc-400 font-mono text-[11px]">
                      {timeAgo(log.timestamp)}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-zinc-200">{log.actor}</div>
                      <div className="text-[10px] text-zinc-500">{log.actorRole}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-zinc-200">{log.action}</td>
                    <td className="py-2.5 px-3 text-zinc-300 max-w-sm truncate">{log.targetResource}</td>
                    <td className="py-2.5 px-3">
                      <SecurityStatusBadge state={log.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[10px] text-zinc-500">
                      {log.signatureHash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'USERS_ROLES' && (
        <div className="bg-[#101215] border border-[#20242a] rounded p-4 text-xs space-y-3 font-sans">
          <h3 className="font-semibold text-zinc-200 text-xs">Configured RBAC Roles</h3>
          <div className="space-y-2 text-zinc-300">
            <div className="p-3 bg-[#131518] rounded border border-[#20242a] flex justify-between items-center">
              <div>
                <span className="font-medium text-zinc-100 block">Security Administrator</span>
                <span className="text-[11px] text-zinc-400">Full system configuration, sensor deployment, and tenant isolation control</span>
              </div>
              <span className="text-zinc-400 font-mono text-[11px]">2 users assigned</span>
            </div>
            <div className="p-3 bg-[#131518] rounded border border-[#20242a] flex justify-between items-center">
              <div>
                <span className="font-medium text-zinc-100 block">Tier 3 Threat Analyst</span>
                <span className="text-[11px] text-zinc-400">Deep investigation, targeted PCAP slicing, and dual-custody permit proposal</span>
              </div>
              <span className="text-zinc-400 font-mono text-[11px]">4 users assigned</span>
            </div>
            <div className="p-3 bg-[#131518] rounded border border-[#20242a] flex justify-between items-center">
              <div>
                <span className="font-medium text-zinc-100 block">Compliance Auditor</span>
                <span className="text-[11px] text-zinc-400">Read-only access to evidence ledger, compliance controls, and export records</span>
              </div>
              <span className="text-zinc-400 font-mono text-[11px]">1 user assigned</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SESSIONS' && (
        <div className="bg-[#101215] border border-[#20242a] rounded p-4 text-xs space-y-3 font-sans">
          <h3 className="font-semibold text-zinc-200 text-xs">Active Operator Sessions</h3>
          <div className="space-y-2">
            <div className="p-3 bg-[#131518] rounded border border-[#20242a] flex justify-between items-center">
              <div>
                <span className="font-medium text-zinc-100">Aria Vesper (Administrator)</span>
                <div className="text-[11px] text-zinc-400">IP: 10.140.0.99 · Browser: Chrome / Linux x86_64</div>
              </div>
              <span className="text-emerald-400 text-xs font-medium">Current Active Session</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SSO' && (
        <div className="bg-[#101215] border border-[#20242a] rounded p-4 text-xs space-y-3 font-sans">
          <h3 className="font-semibold text-zinc-200 text-xs">Enterprise Identity Providers</h3>
          <div className="p-3 bg-[#131518] rounded border border-[#20242a] space-y-2 text-zinc-300">
            <div className="flex justify-between items-center">
              <span className="font-medium text-zinc-100">SAML 2.0 / OIDC Integration</span>
              <SecurityStatusBadge state="HEALTHY" size="sm" />
            </div>
            <p className="text-zinc-400 text-xs">
              Configured with Okta Enterprise Identity and Microsoft Entra ID. FIDO2 WebAuthn hardware token enforcement active.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
