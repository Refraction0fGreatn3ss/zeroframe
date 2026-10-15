import { ChevronDown, Sparkles } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { AiAdvisoryContent } from './AiAdvisoryContent';

interface AiAdvisoryPanelProps {
  victimHostname: string;
  isExtractingPcap: boolean;
  onPivotToNetwork: () => void;
  onPivotToEntities: () => void;
  onExtractPcap: () => void;
}

export const AiAdvisoryPanel: React.FC<AiAdvisoryPanelProps> = (props) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded border border-indigo-950/80 bg-[#070b14] overflow-hidden text-xs font-sans">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-[#0a0f1d] hover:bg-[#0e1529] border-b border-indigo-950/60 flex items-center justify-between gap-2 text-left cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="font-semibold text-slate-200">AI Investigation Advisory</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-300">
            AI ADVISORY ONLY • NO AUTHORITY GENERATION • NO UNKNOWN → CERTAINTY CONVERSION
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && <AiAdvisoryContent {...props} />}
    </div>
  );
};
