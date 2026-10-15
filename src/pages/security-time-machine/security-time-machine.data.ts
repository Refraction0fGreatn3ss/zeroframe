export interface HistoricalState {
  validTime: string;
  transactionTime: string;
  knownEntities: number;
  activeIncidents: number;
  visibilityCoverage: number;
  captureState: string;
  compromisedEntityIp: string;
  observedVlan: number;
}

export const DEFAULT_SNAPSHOT_TIME = '2026-10-12T08:00:00';

/** Simulated delay between the snapshot's valid time and when it was recorded. */
const TRANSACTION_LAG_MS = 4000;

export const INITIAL_HISTORICAL_STATE: HistoricalState = {
  validTime: '2026-10-12T08:00:00Z',
  transactionTime: '2026-10-12T08:00:04Z',
  knownEntities: 4210,
  activeIncidents: 1,
  visibilityCoverage: 94.2,
  captureState: 'HEALTHY',
  compromisedEntityIp: '10.140.2.88 (Clean state at T-08:00)',
  observedVlan: 20,
};

export const buildReconstructedState = (selectedTime: string): HistoricalState => ({
  validTime: new Date(selectedTime).toISOString(),
  transactionTime: new Date(new Date(selectedTime).getTime() + TRANSACTION_LAG_MS).toISOString(),
  knownEntities: 4208,
  activeIncidents: 0,
  visibilityCoverage: 94.8,
  captureState: 'HEALTHY',
  compromisedEntityIp: '10.140.2.88 (Uncompromised; lateral movement began at 10:06Z)',
  observedVlan: 20,
});
