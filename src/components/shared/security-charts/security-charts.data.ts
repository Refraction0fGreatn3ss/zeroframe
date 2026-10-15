import type { ThreatCategory, ThreatViewMode, TrendDataPoint, TrendTimeRange } from './security-charts.types';

export const TREND_TIME_RANGES: readonly TrendTimeRange[] = ['1h', '24h', '7d', '30d'];

export const DEFAULT_TREND_TIME_RANGE: TrendTimeRange = '24h';

export const TREND_DATA_BY_RANGE: Record<TrendTimeRange, TrendDataPoint[]> = {
  '1h': [
    { time: '15:00', totalEvents: 148, detections: 6, incidents: 0 },
    { time: '15:05', totalEvents: 152, detections: 5, incidents: 0 },
    { time: '15:10', totalEvents: 160, detections: 7, incidents: 0 },
    { time: '15:15', totalEvents: 175, detections: 8, incidents: 0 },
    { time: '15:20', totalEvents: 190, detections: 11, incidents: 1 },
    { time: '15:25', totalEvents: 210, detections: 14, incidents: 1 },
    { time: '15:30', totalEvents: 245, detections: 18, incidents: 1 },
    { time: '15:35', totalEvents: 290, detections: 26, incidents: 2 },
    {
      time: '15:40',
      totalEvents: 485,
      detections: 58,
      incidents: 3,
      anomaly: 'Ingest Anomaly: Kerberos TGS Surge (3.8x baseline)',
    },
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
    {
      time: '14:00',
      totalEvents: 520,
      detections: 62,
      incidents: 3,
      anomaly: 'Lateral Movement Spike: 520k eps, DC-01 Target',
    },
    { time: '16:00', totalEvents: 460, detections: 41, incidents: 3 },
    { time: '18:00', totalEvents: 310, detections: 22, incidents: 2 },
    { time: '20:00', totalEvents: 240, detections: 18, incidents: 2 },
    { time: '22:00', totalEvents: 185, detections: 14, incidents: 1 },
  ],
  '7d': [
    { time: 'Mon', totalEvents: 290, detections: 24, incidents: 1 },
    { time: 'Tue', totalEvents: 380, detections: 36, incidents: 2 },
    { time: 'Wed', totalEvents: 410, detections: 40, incidents: 2 },
    {
      time: 'Thu',
      totalEvents: 560,
      detections: 68,
      incidents: 4,
      anomaly: 'Outbound Exfiltration Burst: DNS Tunneling Surge',
    },
    { time: 'Fri', totalEvents: 430, detections: 39, incidents: 3 },
    { time: 'Sat', totalEvents: 190, detections: 12, incidents: 1 },
    { time: 'Sun', totalEvents: 220, detections: 15, incidents: 1 },
  ],
  '30d': [
    { time: 'D-25', totalEvents: 260, detections: 20, incidents: 1 },
    { time: 'D-20', totalEvents: 310, detections: 28, incidents: 2 },
    {
      time: 'D-15',
      totalEvents: 580,
      detections: 72,
      incidents: 4,
      anomaly: 'Coordinated Reconnaissance & Port Knocking Campaign',
    },
    { time: 'D-10', totalEvents: 390, detections: 35, incidents: 2 },
    { time: 'D-5', totalEvents: 440, detections: 42, incidents: 3 },
    { time: 'Now', totalEvents: 410, detections: 38, incidents: 2 },
  ],
};

export const DEFAULT_TACTICAL_CATEGORIES: ThreatCategory[] = [
  { id: 'lateral', label: 'Lateral Movement (Kerberos/SMB)', count: 18, color: '#f43f5e', percentage: 38 },
  { id: 'c2', label: 'C2 Beaconing & DNS Tunneling', count: 12, color: '#f59e0b', percentage: 25 },
  { id: 'credential', label: 'Credential Access / DCSync', count: 9, color: '#38bdf8', percentage: 19 },
  { id: 'exfiltration', label: 'Exfiltration Over Raw TCP', count: 5, color: '#a855f7', percentage: 10 },
  { id: 'recon', label: 'Reconnaissance / Sweep', count: 4, color: '#10b981', percentage: 8 },
];

export const DEFAULT_SEVERITY_CATEGORIES: ThreatCategory[] = [
  { id: 'critical', label: 'Critical (Immediate Quarantine)', count: 4, color: '#f43f5e', percentage: 28 },
  { id: 'high', label: 'High (Under Investigation)', count: 6, color: '#f59e0b', percentage: 42 },
  { id: 'medium', label: 'Medium (Telemetry Alert)', count: 3, color: '#38bdf8', percentage: 21 },
  { id: 'low', label: 'Low / Informational Signal', count: 1, color: '#10b981', percentage: 9 },
];

export const DEFAULT_CATEGORIES_BY_VIEW_MODE: Record<ThreatViewMode, ThreatCategory[]> = {
  VECTORS: DEFAULT_TACTICAL_CATEGORIES,
  SEVERITY: DEFAULT_SEVERITY_CATEGORIES,
};

export const THREAT_VIEW_MODE_OPTIONS: { value: ThreatViewMode; label: string }[] = [
  { value: 'VECTORS', label: 'Vectors' },
  { value: 'SEVERITY', label: 'Severity' },
];

export const THREAT_VIEW_MODE_SCOPE_LABELS: Record<ThreatViewMode, string> = {
  VECTORS: 'MITRE ATT&CK',
  SEVERITY: 'Triage Severity',
};
