import { MessageSquare, Send } from 'lucide-react';
import type React from 'react';

interface NoteComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const NoteComposer: React.FC<NoteComposerProps> = ({ value, onChange, onSubmit }) => (
  <div className="p-3.5 bg-[#080c14] border border-slate-800 rounded space-y-2.5">
    <div className="flex items-center justify-between">
      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
        <span>Record Tactical Analyst Note</span>
      </span>
      <span className="text-[10px] font-mono text-slate-500">Operator: Sarah Chen, CISSP (Tier 3 Lead)</span>
    </div>
    <textarea
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter case observations, correlation findings, or mitigation actions taken..."
      className="w-full bg-[#05080f] border border-slate-700/80 rounded p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 font-sans"
    />
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-slate-500 font-mono">
        Notes are timestamped and cryptographically indexed into the case ledger
      </span>
      <button
        type="button"
        onClick={onSubmit}
        disabled={!value.trim()}
        className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-colors"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Post Note</span>
      </button>
    </div>
  </div>
);
