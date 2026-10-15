export const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = 60 * MS_PER_SECOND;
export const MS_PER_HOUR = 60 * MS_PER_MINUTE;

export function isoFromNow(offsetMs: number): string {
  return new Date(Date.now() + offsetMs).toISOString();
}

export function secondsAgo(seconds: number): string {
  return isoFromNow(-seconds * MS_PER_SECOND);
}

export function minutesAgo(minutes: number): string {
  return isoFromNow(-minutes * MS_PER_MINUTE);
}

export function hoursAgo(hours: number): string {
  return isoFromNow(-hours * MS_PER_HOUR);
}

export function minutesFromNow(minutes: number): string {
  return isoFromNow(minutes * MS_PER_MINUTE);
}
