export interface Provenance {
  source: string;
  authority?: string | null;
  fidelity?: string | null;
  confidence?: number | null;
  observedAt?: string | null;
  sensorId?: string | null;
  siteId?: string | null;
  evidenceRef?: string | null;
}
