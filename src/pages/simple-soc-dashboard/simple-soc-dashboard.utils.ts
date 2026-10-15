export type OperationalStatus = 'STALE' | 'UNDER_ATTACK' | 'NOMINAL';

export const getOperationalStatus = (realtimeConnected: boolean, isAttacking: boolean): OperationalStatus => {
  if (!realtimeConnected) return 'STALE';
  return isAttacking ? 'UNDER_ATTACK' : 'NOMINAL';
};

/** Incident titles often join several findings with '&'; only the leading finding is shown. */
export const getLeadingFinding = (title: string): string => title.split('&')[0];
