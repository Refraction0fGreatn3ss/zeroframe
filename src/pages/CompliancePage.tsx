/**
 * Practical Enterprise Compliance Center
 * Clean audit layout: Framework selector tabs, Controls table, Evidence status, Last checked.
 * Avoids decorative compliance cards.
 */

import React from 'react';
import { useComplianceStore } from '../stores/compliance-store';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';
import { ExportButton } from '../components/shared/ExportButton';
import { timeAgo } from '../lib/utils';
import { FileCheck, AlertTriangle, Download } from 'lucide-react';

export const CompliancePage: React.FC = () => {
  const { frameworks, controls, selectedFramework, selectFramework } = useComplianceStore();

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Compliance Evidence Center</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Technical control audit mappings backed strictly by cryptographically verifiable wire evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton
            resourceName="Compliance Audit Report"
            recordCount={controls.length}
            data={controls}
          />
        </div>
      </div>

      {/* Framework Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-[#20242a]">
        {frameworks.map((fw) => {
          const isSelected = fw.id === selectedFramework.id;
          return (
            <button
              key={fw.id}
              onClick={() => selectFramework(fw.id)}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#181c22] text-white font-medium border border-[#2b323c]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#121417]'
              }`}
            >
              <span>{fw.name}</span>
              <span className="font-mono text-[10px] text-zinc-500 ml-1.5">({fw.readinessPercentage}%)</span>
            </button>
          );
        })}
      </div>

      {/* Framework Summary Strip */}
      <div className="p-3 bg-[#101215] border border-[#20242a] rounded flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-zinc-400">
          <div>
            Total Technical Controls: <span className="font-medium text-zinc-200">{selectedFramework.totalControls}</span>
          </div>
          <div>
            Evidenced on Wire: <span className="font-medium text-emerald-400">{selectedFramework.evidencedCount}</span>
          </div>
          <div>
            Stale / Partial Evidence: <span className="font-medium text-amber-400">{selectedFramework.staleCount}</span>
          </div>
          <div>
            Missing Evidence: <span className="font-medium text-rose-400">{selectedFramework.missingCount}</span>
          </div>
        </div>

        <div className="text-zinc-400">
          Readiness index: <span className="font-semibold text-emerald-400">{selectedFramework.readinessPercentage}%</span>
        </div>
      </div>

      {/* SECTION 27: Controls Audit Table */}
      <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#14171c] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
              <tr>
                <th className="py-2.5 px-3 w-32">Control ID</th>
                <th className="py-2.5 px-3">Control Name & Description</th>
                <th className="py-2.5 px-3 w-36">Evidence State</th>
                <th className="py-2.5 px-3">Artifact Count</th>
                <th className="py-2.5 px-3">Last Checked</th>
                <th className="py-2.5 px-3 text-right">Evidence Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181b20] text-zinc-300">
              {controls.map((ctrl) => (
                <tr key={ctrl.controlId} className="hover:bg-[#15181e] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-zinc-200">{ctrl.controlId}</td>
                  <td className="py-2.5 px-3 max-w-md">
                    <div className="font-medium text-zinc-100">{ctrl.name}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{ctrl.description}</div>
                    {ctrl.remediationRecommendation && (
                      <div className="text-[11px] text-amber-400/90 mt-1">
                        Notice: {ctrl.remediationRecommendation}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <SecurityStatusBadge state={ctrl.evidenceState} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-200">
                    {ctrl.evidenceCount} artifacts
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-500">
                    {ctrl.lastEvidenceTimestamp ? timeAgo(ctrl.lastEvidenceTimestamp) : 'None'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[10px] text-zinc-400">
                    {ctrl.evidenceIds.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
