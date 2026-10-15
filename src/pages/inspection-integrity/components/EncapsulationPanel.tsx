import { Radio } from 'lucide-react';
import type { FC } from 'react';
import type { EncapsulationIntegrity } from '../../../types/inspection';
import { formatRatioAsPercent } from '../inspection-integrity.utils';

interface EncapsulationPanelProps {
  encapsulation: EncapsulationIntegrity;
}

export const EncapsulationPanel: FC<EncapsulationPanelProps> = ({ encapsulation }) => (
  <div className="p-4 bg-[#101215] border border-[#20242a] rounded space-y-3 shadow-xs">
    <h3 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
      <Radio className="w-3.5 h-3.5 text-cyan-400" />
      <span>Tunneling & Traffic Symmetry</span>
    </h3>
    <div className="space-y-1.5 text-zinc-300">
      <div className="flex justify-between py-1 border-b border-[#20242a]">
        <span>802.1Q Single VLAN Trunk:</span>
        <span className="text-emerald-400 font-mono">Verified Active</span>
      </div>
      <div className="flex justify-between py-1 border-b border-[#20242a]">
        <span>QinQ Double Tagging:</span>
        <span className="text-emerald-400 font-mono">Outer & Inner Tag Stripped</span>
      </div>
      <div className="flex justify-between py-1 border-b border-[#20242a]">
        <span>Active VXLAN Tunnels:</span>
        <span className="text-zinc-100 font-mono">{encapsulation.vxlanTunnels} Tunnels Decapsulated</span>
      </div>
      <div className="flex justify-between py-1">
        <span>Asymmetric Flow Ratio:</span>
        <span className="text-amber-400 font-mono font-medium">
          {formatRatioAsPercent(encapsulation.asymmetricFlowRatio)}% (Half-Open Flows)
        </span>
      </div>
    </div>
  </div>
);
