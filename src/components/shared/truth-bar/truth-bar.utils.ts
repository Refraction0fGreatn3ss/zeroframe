export const STALE_BORDER_CLASS = 'border-amber-500/30';
export const STALE_TEXT_CLASS = 'text-amber-400';

export const getStatusTextClass = (isHealthy: boolean): string => (isHealthy ? 'text-emerald-400' : 'text-amber-400');

export const getStatusDotClass = (isHealthy: boolean): string => (isHealthy ? 'bg-emerald-500' : 'bg-amber-400');

export const getStatusBorderClass = (isHealthy: boolean): string =>
  isHealthy ? 'border-emerald-500/20' : 'border-amber-500/30';

export const toPercent = (ratio: number, fractionDigits: number): string => (ratio * 100).toFixed(fractionDigits);

export const formatTimeOfDay = (iso?: string): string => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString();
  } catch {
    return '';
  }
};
