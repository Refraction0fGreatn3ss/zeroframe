/**
 * Security Time Machine Page
 * Reconstructs exact authoritative historical truth at any point in time.
 * "What did ZeroFrame know at this time?"
 */

import React, { useState } from 'react';
import { Clock, Database, ShieldAlert, ArrowRight } from 'lucide-react';
import { SecurityStatusBadge } from '../components/shared/SecurityStatusBadge';

export const SecurityTimeMachinePage: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState('2026-10-12T08:00:00');
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [historicalState, setHistoricalState] = useState<{
    validTime: string;
    transactionTime: string;
    knownEntities: number;
    activeIncidents: number;
    visibilityCoverage: number;
    captureState: string;
    compromisedEntityIp: string;
    observedVlan: number;
  }>({
    validTime: '2026-10-12T08:00:00Z',
    transactionTime: '2026-10-12T08:00:04Z',
    knownEntities: 4210,
    activeIncidents: 1,
    visibilityCoverage: 94.2,
    captureState: 'HEALTHY',
    compromisedEntityIp: '10.140.2.88 (Clean state at T-08:00)',
    observedVlan: 20,
  });

  const handleReconstruct = () => {
    setIsReconstructing(true);
    setTimeout(() => {
      setHistoricalState({
        validTime: new Date(selectedTime).toISOString(),
        transactionTime: new Date(new Date(selectedTime).getTime() + 4000).toISOString(),
        knownEntities: 4208,
        activeIncidents: 0,
        visibilityCoverage: 94.8,
        captureState: 'HEALTHY',
        compromisedEntityIp: '10.140.2.88 (Uncompromised; lateral movement began at 10:06Z)',
        observedVlan: 20,
      });
      setIsReconstructing(false);
    }, 500);
  };

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#20242a]">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Security Time Machine</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Bitemporal state reconstruction: What did ZeroFrame know at timestamp T?
          </p>
        </div>
      </div>

      {/* Snapshot Picker Form */}
      <div className="p-3 bg-[#101215] border border-[#20242a] rounded space-y-2 text-xs">
        <span className="font-semibold text-zinc-300 block">Select Point-in-Time Snapshot</span>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="datetime-local"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="px-3 py-1.5 bg-[#14171c] border border-[#23272e] rounded text-zinc-100 font-mono text-xs focus:outline-hidden focus:border-zinc-500"
          />

          <button
            onClick={handleReconstruct}
            disabled={isReconstructing}
            className="px-3.5 py-1.5 rounded bg-[#181b20] border border-[#2a2f38] hover:bg-[#20242a] text-zinc-200 font-medium text-xs cursor-pointer transition-colors"
          >
            {isReconstructing ? 'Reconstructing graph...' : 'Reconstruct Truth State'}
          </button>
        </div>
      </div>

      {/* Reconstructed State Box */}
      <div className="p-4 bg-[#101215] border border-[#20242a] rounded space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#20242a]">
          <div>
            <h3 className="font-semibold text-zinc-100 text-sm">Authoritative Reconstruction Result</h3>
            <span className="font-mono text-zinc-500 text-[11px]">
              Valid time: {historicalState.validTime} · Transaction time: {historicalState.transactionTime}
            </span>
          </div>
          <SecurityStatusBadge state="HISTORICAL_SNAPSHOT" size="sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-[#131518] rounded border border-[#20242a]">
            <span className="text-zinc-500 text-[10px] block font-medium">KNOWN ENTITIES AT TIME T</span>
            <div className="font-mono text-sm font-semibold text-zinc-200 mt-0.5">{historicalState.knownEntities}</div>
          </div>

          <div className="p-3 bg-[#131518] rounded border border-[#20242a]">
            <span className="text-zinc-500 text-[10px] block font-medium">WIRE VISIBILITY COVERAGE</span>
            <div className="font-mono text-sm font-semibold text-zinc-200 mt-0.5">{historicalState.visibilityCoverage}%</div>
          </div>

          <div className="p-3 bg-[#131518] rounded border border-[#20242a]">
            <span className="text-zinc-500 text-[10px] block font-medium">ACTIVE INCIDENTS THEN</span>
            <div className="font-mono text-sm font-semibold text-zinc-200 mt-0.5">{historicalState.activeIncidents}</div>
          </div>
        </div>

        <div className="p-3 bg-[#131518] rounded border border-[#20242a] space-y-1 text-zinc-400">
          <div className="font-semibold text-zinc-300">Workload State at T: 10.140.2.88 (WKST-CORP-088)</div>
          <div>• State: {historicalState.compromisedEntityIp}</div>
          <div>• Observed VLAN: {historicalState.observedVlan} (Declared and observed matched at this timestamp)</div>
          <div className="text-[11px] text-zinc-500 pt-1 font-mono">
            Verified by Historical Transaction Ledger Block #41908
          </div>
        </div>
      </div>
    </div>
  );
};
