export type InspectionTab = 'PIPELINE' | 'BLIND_SPOTS' | 'GOVERNOR';

export type GovernorState = 'NORMAL' | 'PRESSURED' | 'DEGRADED' | 'SECURITY_IMPAIRED' | 'UNSAFE';

export interface BlindSpot {
  id: string;
  name: string;
  affectedDomain: string;
  sensor: string;
  visibilityDomain: string;
  missingTelemetry: string;
  detectorImpact: string;
  rootCause: string;
  requiredRemediation: string;
  status: string;
}

export interface PressureMeter {
  name: string;
  value: number;
  max: number;
  unit: string;
  detail: string;
}
