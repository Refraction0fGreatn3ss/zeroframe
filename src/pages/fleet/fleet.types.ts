export type FleetViewTab = 'SENSORS' | 'PREFLIGHT' | 'MTLS';

export type SensorDrawerTab = 'TELEMETRY' | 'LIFECYCLE' | 'CERTIFICATE';

export interface LifecycleStage {
  step: number;
  id: string;
  label: string;
  desc: string;
}

export interface PreflightCheck {
  id: string;
  name: string;
  status: string;
  target: string;
  metric: string;
  latency: string;
}
