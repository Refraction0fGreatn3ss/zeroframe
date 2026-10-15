export type TrendTimeRange = '1h' | '24h' | '7d' | '30d';

export interface TrendDataPoint {
  time: string;
  totalEvents: number;
  detections: number;
  incidents: number;
  anomaly?: string;
}

export interface ThreatCategory {
  id: string;
  label: string;
  count: number;
  color: string;
  percentage: number;
}

export type ThreatViewMode = 'VECTORS' | 'SEVERITY';
