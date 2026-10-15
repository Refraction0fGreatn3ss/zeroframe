import type { ActivityCategory, SecurityActivityItem } from '../../types/activity-log';

export type SimulationKind = 'threat' | 'auth' | 'system';

export type SimulatedActivityEvent = Omit<SecurityActivityItem, 'id' | 'timestamp'>;

export const SIMULATED_EVENTS: Record<SimulationKind, SimulatedActivityEvent> = {
  threat: {
    category: 'THREAT_ALERT',
    severity: 'CRITICAL',
    title: 'Manual Simulation: Encrypted JA4 C2 Beacon Injection',
    description: 'Simulated live adversary beacon trigger across port 443 with randomized jitter intervals.',
    actor: 'operator.simulation-suite',
    actorRole: 'Security Operator Test',
    sourceIp: '10.140.2.88',
    targetResource: 'c2-sim.zeroflash-lab.net',
    mitreTactic: 'T1071.001 (Web Protocols)',
    status: 'FLAGGED',
    payload: {
      simulated: true,
      jitterPct: 24,
      payloadBytes: 1048,
    },
  },
  auth: {
    category: 'USER_LOGIN',
    severity: 'HIGH',
    title: 'Manual Simulation: Privileged Operator Role Assumption',
    description:
      'Operator assumed Root Security Administrator role with temporary 30-minute privilege elevation lease.',
    actor: 'operator.admin@corp.zeroflash',
    actorRole: 'Root Security Admin',
    sourceIp: '10.140.0.102',
    targetResource: 'Console RBAC Policy Engine',
    status: 'WARNING',
    payload: {
      simulated: true,
      leaseDuration: '30m',
      elevationMethod: 'HARDWARE_U2F_TOKEN',
    },
  },
  system: {
    category: 'SYSTEM_EVENT',
    severity: 'INFO',
    title: 'Manual Simulation: Optical Tap Laser Power Calibration',
    description: 'Calibrated optical receiver sensitivity on tap-sfp28-core-01; signal-to-noise ratio nominal.',
    actor: 'hardware.calibration-service',
    actorRole: 'Sensor Maintenance',
    sourceIp: '192.168.1.10',
    targetResource: 'tap-sfp28-core-01',
    status: 'SUCCESS',
    payload: {
      simulated: true,
      opticalPower: '-2.8 dBm',
      calibrationResult: 'PASS',
    },
  },
};

export interface SimulationButtonConfig {
  kind: SimulationKind;
  label: string;
  title: string;
  toneClassName: string;
}

export const SIMULATION_BUTTONS: readonly SimulationButtonConfig[] = [
  {
    kind: 'threat',
    label: '+ Sim Threat',
    title: 'Inject a simulated threat alert',
    toneClassName: 'text-rose-400 hover:bg-rose-500/10',
  },
  {
    kind: 'auth',
    label: '+ Sim Auth',
    title: 'Inject a simulated user login event',
    toneClassName: 'text-sky-400 hover:bg-sky-500/10',
  },
  {
    kind: 'system',
    label: '+ Sim Sys',
    title: 'Inject a simulated system event',
    toneClassName: 'text-emerald-400 hover:bg-emerald-500/10',
  },
];

export type CategoryFilter = ActivityCategory | 'ALL';
