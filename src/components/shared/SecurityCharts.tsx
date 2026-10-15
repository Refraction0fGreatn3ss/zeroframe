/**
 * Enterprise Operational Security Charts
 * High-performance, lightweight SVG charts styled for cybersecurity operations:
 * 1. SecurityEventTrendLineChart (Line chart with 1h/24h/7d/30d timelines, tooltips, anomaly detection flags, clear axes, and restrained semantic styling)
 * 2. ThreatDistributionDonutChart (Pie/Donut chart with tactical vector & severity breakdown, active slice inspection, readable legend, and center summary)
 */

import React, { useState } from 'react';

// ==========================================
// 1. LINE CHART: SECURITY EVENT & VELOCITY TREND
// ==========================================

export interface TrendDataPoint {
  time: string;
  totalEvents: number; // in thousands or units
  detections: number;
  incidents: number;
  anomaly?: string;
}

const TIME_RANGE_DATA: Record<'1h' | '24h' | '7d' | '30d', TrendDataPoint[]> = {
  '1h': [
    { time: '15:00', totalEvents: 148, detections: 6, incidents: 0 },
    { time: '15:05', totalEvents: 152, detections: 5, incidents: 0 },
    { time: '15:10', totalEvents: 160, detections: 7, incidents: 0 },
    { time: '15:15', totalEvents: 175, detections: 8, incidents: 0 },
    { time: '15:20', totalEvents: 190, detections: 11, incidents: 1 },
    { time: '15:25', totalEvents: 210, detections: 14, incidents: 1 },
    { time: '15:30', totalEvents: 245, detections: 18, incidents: 1 },
    { time: '15:35', totalEvents: 290, detections: 26, incidents: 2 },
    { time: '15:40', totalEvents: 485, detections: 58, incidents: 3, anomaly: 'Ingest Anomaly: Kerberos TGS Surge (3.8x baseline)' },
    { time: '15:45', totalEvents: 420, detections: 44, incidents: 2 },
    { time: '15:50', totalEvents: 330, detections: 28, incidents: 2 },
    { time: '15:55', totalEvents: 270, detections: 19, incidents: 1 },
  ],
  '24h': [
    { time: '00:00', totalEvents: 142, detections: 8, incidents: 0 },
    { time: '02:00', totalEvents: 118, detections: 6, incidents: 0 },
    { time: '04:00', totalEvents: 94, detections: 4, incidents: 0 },
    { time: '06:00', totalEvents: 165, detections: 12, incidents: 1 },
    { time: '08:00', totalEvents: 340, detections: 29, incidents: 1 },
    { time: '10:00', totalEvents: 420, detections: 46, incidents: 2 },
    { time: '12:00', totalEvents: 395, detections: 38, incidents: 2 },
    { time: '14:00', totalEvents: 520, detections: 62, incidents: 3, anomaly: 'Lateral Movement Spike: 520k eps, DC-01 Target' },
    { time: '16:00', totalEvents: 460, detections: 41, incidents: 3 },
    { time: '18:00', totalEvents: 310, detections: 22, incidents: 2 },
    { time: '20:00', totalEvents: 240, detections: 18, incidents: 2 },
    { time: '22:00', totalEvents: 185, detections: 14, incidents: 1 },
  ],
  '7d': [
    { time: 'Mon', totalEvents: 290, detections: 24, incidents: 1 },
    { time: 'Tue', totalEvents: 380, detections: 36, incidents: 2 },
    { time: 'Wed', totalEvents: 410, detections: 40, incidents: 2 },
    { time: 'Thu', totalEvents: 560, detections: 68, incidents: 4, anomaly: 'Outbound Exfiltration Burst: DNS Tunneling Surge' },
    { time: 'Fri', totalEvents: 430, detections: 39, incidents: 3 },
    { time: 'Sat', totalEvents: 190, detections: 12, incidents: 1 },
    { time: 'Sun', totalEvents: 220, detections: 15, incidents: 1 },
  ],
  '30d': [
    { time: 'D-25', totalEvents: 260, detections: 20, incidents: 1 },
    { time: 'D-20', totalEvents: 310, detections: 28, incidents: 2 },
    { time: 'D-15', totalEvents: 580, detections: 72, incidents: 4, anomaly: 'Coordinated Reconnaissance & Port Knocking Campaign' },
    { time: 'D-10', totalEvents: 390, detections: 35, incidents: 2 },
    { time: 'D-5', totalEvents: 440, detections: 42, incidents: 3 },
    { time: 'Now', totalEvents: 410, detections: 38, incidents: 2 },
  ],
};

export interface SecurityEventTrendLineChartProps {
  className?: string;
  data?: TrendDataPoint[];
  timeRange?: '1h' | '24h' | '7d' | '30d';
  onTimeRangeChange?: (range: '1h' | '24h' | '7d' | '30d') => void;
  bare?: boolean;
}

export const SecurityEventTrendLineChart: React.FC<SecurityEventTrendLineChartProps> = ({
  className = '',
  data: customData,
  timeRange: controlledTimeRange,
  onTimeRangeChange,
  bare = false,
}) => {
  const [internalTimeRange, setInternalTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeTimeRange = controlledTimeRange || internalTimeRange;
  const setRange = (range: '1h' | '24h' | '7d' | '30d') => {
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    } else {
      setInternalTimeRange(range);
    }
  };

  const chartData = customData || TIME_RANGE_DATA[activeTimeRange];

  const width = 640;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 26;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxEvents = 600;
  const maxDetections = 70;

  // Coordinate mappers
  const getX = (idx: number) => paddingLeft + (idx / Math.max(1, chartData.length - 1)) * chartWidth;
  const getYEvents = (val: number) => paddingTop + chartHeight - (Math.min(val, maxEvents) / maxEvents) * chartHeight;
  const getYDetections = (val: number) => paddingTop + chartHeight - (Math.min(val, maxDetections) / maxDetections) * chartHeight;

  // Build SVG path strings
  const eventsPoints = chartData.map((d, i) => `${getX(i)},${getYEvents(d.totalEvents)}`);
  const eventsPath = `M ${eventsPoints.join(' L ')}`;
  const eventsArea = `${eventsPath} L ${getX(chartData.length - 1)},${paddingTop + chartHeight} L ${getX(0)},${paddingTop + chartHeight} Z`;

  const detectionsPoints = chartData.map((d, i) => `${getX(i)},${getYDetections(d.detections)}`);
  const detectionsPath = `M ${detectionsPoints.join(' L ')}`;
  const detectionsArea = `${detectionsPath} L ${getX(chartData.length - 1)},${paddingTop + chartHeight} L ${getX(0)},${paddingTop + chartHeight} Z`;

  const hoveredPoint = hoveredIndex !== null ? chartData[hoveredIndex] : null;

  // Peak metrics calculation
  const peakEvent = Math.max(...chartData.map((d) => d.totalEvents));
  const activeAnomaly = chartData.find((d) => Boolean(d.anomaly));

  const content = (
    <div className="flex flex-col h-full justify-between space-y-3 font-sans">
      {/* Title & Controls Header */}
      {!bare && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--zf-border-subtle)]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--zf-text-primary)]">
                Security Activity & Telemetry Velocity
              </h2>
            </div>
            <p className="text-[11px] text-[var(--zf-text-muted)] truncate mt-0.5">
              Ingest flow rate, behavioral detections, and anomaly timeline
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Time range selector buttons */}
            <div className="flex items-center rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] p-0.5 text-[11px] font-mono">
              {(['1h', '24h', '7d', '30d'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium ${
                    activeTimeRange === r
                      ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] border border-[var(--zf-brand-accent)]'
                      : 'text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Compact Legend */}
            <div className="hidden sm:flex items-center gap-2.5 text-[11px] font-mono pl-1 border-l border-[var(--zf-border-subtle)]">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-sky-400 rounded-sm" />
                <span className="text-[var(--zf-text-muted)] text-[10px]">Events</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-amber-400 rounded-sm" />
                <span className="text-[var(--zf-text-muted)] text-[10px]">Detections</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-[var(--zf-text-muted)] text-[10px]">Incidents</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anomaly / Peak Summary Bar */}
      <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] text-[11px] font-mono">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[var(--zf-text-muted)]">Peak Ingest: </span>
            <span className="font-bold text-[var(--zf-text-primary)]">{peakEvent}k/hr</span>
          </div>
          <span className="text-[var(--zf-border-subtle)]">·</span>
          <div>
            <span className="text-[var(--zf-text-muted)]">Window: </span>
            <span className="text-sky-400 font-semibold">{activeTimeRange}</span>
          </div>
        </div>

        {activeAnomaly ? (
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="truncate max-w-[280px]">{activeAnomaly.anomaly}</span>
          </div>
        ) : (
          <div className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Nominal Trend Baseline</span>
          </div>
        )}
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full aspect-[3/1] max-h-56 min-h-[170px] select-none overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="zf-events-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="zf-detections-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y Axis labels */}
          {[0, 150, 300, 450, 600].map((val) => {
            const y = getYEvents(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-[var(--zf-border-subtle)] opacity-60"
                  strokeDasharray="2 3"
                  strokeWidth="0.8"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-[var(--zf-text-muted)] text-[9px] font-mono"
                >
                  {val}k
                </text>
              </g>
            );
          })}

          {/* X Axis labels */}
          {chartData.map((d, i) => (
            <text
              key={d.time}
              x={getX(i)}
              y={height - 6}
              textAnchor="middle"
              className="fill-[var(--zf-text-muted)] text-[9px] font-mono"
            >
              {d.time}
            </text>
          ))}

          {/* Area fills */}
          <path d={eventsArea} fill="url(#zf-events-gradient)" />
          <path d={detectionsArea} fill="url(#zf-detections-gradient)" />

          {/* Lines */}
          <path
            d={eventsPath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d={detectionsPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Incident markers */}
          {chartData.map((d, i) => {
            if (d.incidents === 0) return null;
            const x = getX(i);
            const y = getYDetections(d.detections);
            return (
              <g key={`inc-${i}`}>
                <circle cx={x} cy={y} r="4.5" fill="#f43f5e" stroke="var(--zf-surface-card)" strokeWidth="1.5" />
                <text
                  x={x}
                  y={y - 7}
                  textAnchor="middle"
                  className="fill-rose-400 text-[8px] font-mono font-bold"
                >
                  !
                </text>
              </g>
            );
          })}

          {/* Anomaly Highlight Callout Flag (Crisp, static professional security beacon) */}
          {chartData.map((d, i) => {
            if (!d.anomaly) return null;
            const x = getX(i);
            const y = getYEvents(d.totalEvents);
            return (
              <g key={`anomaly-marker-${i}`}>
                {/* Subtle static halo for clarity, no moving/growing animation */}
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="rgba(245, 158, 11, 0.15)"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#f59e0b"
                  stroke="var(--zf-surface-card)"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Interactive Hover Guides & Circles */}
          {chartData.map((d, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={`interactive-${i}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Wide invisible hit-target */}
                <rect
                  x={x - chartWidth / (chartData.length * 2)}
                  y={paddingTop}
                  width={chartWidth / chartData.length}
                  height={chartHeight}
                  fill="transparent"
                />

                {isHovered && (
                  <>
                    <line
                      x1={x}
                      y1={paddingTop}
                      x2={x}
                      y2={paddingTop + chartHeight}
                      stroke="currentColor"
                      className="text-[var(--zf-brand-accent)]"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={x}
                      cy={getYEvents(d.totalEvents)}
                      r="4"
                      fill="#38bdf8"
                      stroke="var(--zf-surface-card)"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={x}
                      cy={getYDetections(d.detections)}
                      r="4"
                      fill="#f59e0b"
                      stroke="var(--zf-surface-card)"
                      strokeWidth="1.5"
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute top-1 pointer-events-none p-2 rounded shadow-lg bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] text-[11px] font-mono z-30 space-y-1 backdrop-blur-xs min-w-[170px]"
            style={{
              left: `${Math.min(Math.max(6, (hoveredIndex! / Math.max(1, chartData.length - 1)) * 78), 70)}%`,
            }}
          >
            <div className="font-semibold text-[var(--zf-text-primary)] border-b border-[var(--zf-border-subtle)] pb-1 flex items-center justify-between">
              <span>Timestamp:</span>
              <span className="text-[var(--zf-brand-accent)]">{hoveredPoint.time}</span>
            </div>
            <div className="text-sky-400 flex items-center justify-between gap-3">
              <span>Ingest Events:</span>
              <span className="font-bold">{hoveredPoint.totalEvents}k</span>
            </div>
            <div className="text-amber-400 flex items-center justify-between gap-3">
              <span>Detections:</span>
              <span className="font-bold">{hoveredPoint.detections}</span>
            </div>
            {hoveredPoint.incidents > 0 && (
              <div className="text-rose-400 flex items-center justify-between gap-3 font-bold">
                <span>Incidents:</span>
                <span>{hoveredPoint.incidents} active</span>
              </div>
            )}
            {hoveredPoint.anomaly && (
              <div className="pt-1 border-t border-[var(--zf-border-subtle)] text-[10px] text-amber-300 font-sans leading-tight">
                ⚠️ {hoveredPoint.anomaly}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (bare) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div className={`p-4 rounded-lg bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] flex flex-col justify-between h-full ${className}`}>
      {content}
    </div>
  );
};

// ===============================================
// 2. PIE / DONUT CHART: TACTICAL VECTORS & SEVERITY
// ===============================================

export interface ThreatCategory {
  id: string;
  label: string;
  count: number;
  color: string;
  percentage: number;
}

const DEFAULT_TACTICAL_CATEGORIES: ThreatCategory[] = [
  { id: 'lateral', label: 'Lateral Movement (Kerberos/SMB)', count: 18, color: '#f43f5e', percentage: 38 },
  { id: 'c2', label: 'C2 Beaconing & DNS Tunneling', count: 12, color: '#f59e0b', percentage: 25 },
  { id: 'credential', label: 'Credential Access / DCSync', count: 9, color: '#38bdf8', percentage: 19 },
  { id: 'exfiltration', label: 'Exfiltration Over Raw TCP', count: 5, color: '#a855f7', percentage: 10 },
  { id: 'recon', label: 'Reconnaissance / Sweep', count: 4, color: '#10b981', percentage: 8 },
];

const DEFAULT_SEVERITY_CATEGORIES: ThreatCategory[] = [
  { id: 'critical', label: 'Critical (Immediate Quarantine)', count: 4, color: '#f43f5e', percentage: 28 },
  { id: 'high', label: 'High (Under Investigation)', count: 6, color: '#f59e0b', percentage: 42 },
  { id: 'medium', label: 'Medium (Telemetry Alert)', count: 3, color: '#38bdf8', percentage: 21 },
  { id: 'low', label: 'Low / Informational Signal', count: 1, color: '#10b981', percentage: 9 },
];

export interface ThreatDistributionDonutChartProps {
  className?: string;
  categories?: ThreatCategory[];
  bare?: boolean;
}

export const ThreatDistributionDonutChart: React.FC<ThreatDistributionDonutChartProps> = ({
  className = '',
  categories: customCategories,
  bare = false,
}) => {
  const [viewMode, setViewMode] = useState<'VECTORS' | 'SEVERITY'>('VECTORS');
  const [activeId, setActiveId] = useState<string | null>(null);

  const categories =
    customCategories ||
    (viewMode === 'VECTORS' ? DEFAULT_TACTICAL_CATEGORIES : DEFAULT_SEVERITY_CATEGORIES);

  const totalCount = categories.reduce((acc, c) => acc + c.count, 0);

  // Donut geometry
  const size = 160;
  const center = size / 2;
  const radius = 54;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = 0;

  const content = (
    <div className="flex flex-col h-full justify-between space-y-3 font-sans">
      {/* Header */}
      {!bare && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--zf-border-subtle)]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--zf-text-primary)]">
                Tactical Vectors & Threat Distribution
              </h2>
            </div>
            <p className="text-[11px] text-[var(--zf-text-muted)] truncate mt-0.5">
              Active kill-chain classifications & alert severity
            </p>
          </div>

          {/* Mode switch */}
          <div className="flex items-center rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] p-0.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => {
                setViewMode('VECTORS');
                setActiveId(null);
              }}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium ${
                viewMode === 'VECTORS'
                  ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] border border-[var(--zf-brand-accent)]'
                  : 'text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]'
              }`}
            >
              Vectors
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('SEVERITY');
                setActiveId(null);
              }}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium ${
                viewMode === 'SEVERITY'
                  ? 'bg-[var(--zf-nav-active-bg)] text-[var(--zf-text-primary)] border border-[var(--zf-brand-accent)]'
                  : 'text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]'
              }`}
            >
              Severity
            </button>
          </div>
        </div>
      )}

      {/* Metric Banner */}
      <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] text-[11px] font-mono">
        <div>
          <span className="text-[var(--zf-text-muted)]">Active Scope: </span>
          <span className="font-bold text-[var(--zf-text-primary)]">
            {viewMode === 'VECTORS' ? 'MITRE ATT&CK' : 'Triage Severity'}
          </span>
        </div>
        <div>
          <span className="text-[var(--zf-text-muted)]">Total Classified: </span>
          <span className="text-amber-400 font-bold">{totalCount} signals</span>
        </div>
      </div>

      {/* Main Body: Donut Graphic + Legend List */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-1 flex-1 justify-center min-h-[170px]">
        {/* Donut Graphic */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center select-none">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="rotate-[-90deg] w-full h-full overflow-visible"
          >
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-[var(--zf-border-subtle)] opacity-40"
              strokeWidth={strokeWidth}
            />

            {/* Segments */}
            {categories.map((cat) => {
              const dashLength = (cat.percentage / 100) * circumference;
              const dashOffset = -accumulatedAngle;
              accumulatedAngle += dashLength;

              const isHovered = activeId === cat.id;

              return (
                <circle
                  key={cat.id}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={cat.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${Math.max(0, dashLength - 1.5)} ${circumference - Math.max(0, dashLength - 1.5)}`}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setActiveId(cat.id)}
                  onMouseLeave={() => setActiveId(null)}
                />
              );
            })}
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center select-none">
            <span className="text-xl font-mono font-bold text-[var(--zf-text-primary)] leading-none">
              {activeId
                ? categories.find((c) => c.id === activeId)?.count
                : totalCount}
            </span>
            <span className="text-[10px] text-[var(--zf-text-muted)] uppercase tracking-wider font-sans mt-1">
              {activeId
                ? `${categories.find((c) => c.id === activeId)?.percentage}%`
                : 'Total'}
            </span>
          </div>
        </div>

        {/* Legend / Category breakdown list */}
        <div className="flex-1 w-full space-y-1.5 min-w-0">
          {categories.map((cat) => {
            const isHovered = activeId === cat.id;
            return (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveId(cat.id)}
                onMouseLeave={() => setActiveId(null)}
                className={`flex items-center justify-between p-1.5 rounded transition-all cursor-pointer text-xs ${
                  isHovered
                    ? 'bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] font-semibold shadow-xs'
                    : 'text-[var(--zf-text-secondary)] hover:bg-[var(--zf-surface-subtle)]'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0 transition-transform"
                    style={{
                      backgroundColor: cat.color,
                      transform: isHovered ? 'scale(1.2)' : 'none',
                    }}
                  />
                  <span className="truncate text-[11px]">{cat.label}</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                  <span className="text-[var(--zf-text-primary)] font-bold">{cat.count}</span>
                  <span className="text-[var(--zf-text-muted)] w-8 text-right text-[10px]">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (bare) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div className={`p-4 rounded-lg bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] flex flex-col justify-between h-full ${className}`}>
      {content}
    </div>
  );
};
