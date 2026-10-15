import type React from 'react';

const OBSERVED_CURVE_PATH =
  'M 0 110 L 100 106 L 200 102 L 300 98 L 450 85 L 600 45 L 680 18 L 760 38 L 880 82 L 1000 88';
const OBSERVED_AREA_PATH = `${OBSERVED_CURVE_PATH} L 1000 140 L 0 140 Z`;
const BASELINE_PATH = 'M 0 105 Q 250 100, 500 98 T 1000 95';
const GRID_LINE_Y_POSITIONS = [20, 60, 100];
const ANOMALY_SPIKE = { cx: 680, cy: 18 };

export const ThroughputChart: React.FC = () => (
  <div className="h-40 w-full bg-[#060911] border border-slate-800/80 rounded relative p-2 overflow-hidden flex items-end">
    <svg
      className="w-full h-full"
      viewBox="0 0 1000 140"
      preserveAspectRatio="none"
      role="img"
      aria-label="Wire throughput velocity"
    >
      <defs>
        <linearGradient id="ingressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {GRID_LINE_Y_POSITIONS.map((y) => (
        <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
      ))}

      <path d={BASELINE_PATH} fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />

      <path d={OBSERVED_AREA_PATH} fill="url(#ingressGradient)" />

      <path d={OBSERVED_CURVE_PATH} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

      <circle cx={ANOMALY_SPIKE.cx} cy={ANOMALY_SPIKE.cy} r="5" fill="#f43f5e" />
      <circle
        cx={ANOMALY_SPIKE.cx}
        cy={ANOMALY_SPIKE.cy}
        r="10"
        fill="#f43f5e"
        opacity="0.3"
        className="animate-ping"
      />
    </svg>

    <div className="absolute top-2 left-[62%] bg-[#080c14]/90 border border-rose-500/60 rounded px-2 py-1 text-[10px] font-mono text-rose-300 shadow-md">
      <div className="font-bold text-rose-400">19:38 UTC: 4.12 Gbps Spike</div>
      <div className="text-slate-400">Cobalt Strike C2 Burst + Exfil</div>
    </div>

    <div className="absolute left-3 top-2 text-[9px] font-mono text-slate-500 flex flex-col justify-between h-[80%] pointer-events-none">
      <span>5.0 Gbps</span>
      <span>2.5 Gbps</span>
      <span>1.0 Gbps</span>
    </div>

    <div className="absolute bottom-1 w-full px-8 flex justify-between text-[9px] font-mono text-slate-500 pointer-events-none">
      <span>19:00</span>
      <span>19:15</span>
      <span>19:30</span>
      <span className="text-rose-400 font-bold">19:40 (C2 Spike)</span>
      <span>19:50</span>
      <span>20:00 (Live)</span>
    </div>
  </div>
);
