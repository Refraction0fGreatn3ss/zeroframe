import type { FC } from 'react';
import { GRAPH_LAYER_OPTIONS } from './entity-graph.data';
import type { GraphLayer } from './entity-graph.types';

interface GraphToolbarProps {
  layer: GraphLayer;
  onLayerChange: (layer: GraphLayer) => void;
}

export const GraphToolbar: FC<GraphToolbarProps> = ({ layer, onLayerChange }) => (
  <div className="p-3 bg-[#0d121f] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
    <div className="flex items-center gap-3">
      <span className="font-semibold text-slate-100 font-sans">Attack Topology & Blast Radius</span>
      <span className="text-slate-600">·</span>
      <span className="text-slate-400">Lateral wire movements and identity credential lineage</span>
    </div>

    <div className="flex items-center bg-[#060911] border border-slate-800 rounded p-0.5 text-[11px]">
      {GRAPH_LAYER_OPTIONS.map(({ value, label }) => (
        <button
          type="button"
          key={value}
          onClick={() => onLayerChange(value)}
          className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
            layer === value
              ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);
