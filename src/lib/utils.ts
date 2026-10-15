type ClassDictionary = { [className: string]: boolean };
type ClassValue = string | boolean | undefined | null | ClassDictionary;

const BYTES_PER_KIBIBYTE = 1024;
const BITS_PER_KILOBIT = 1000;
const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const BIT_RATE_UNITS = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;
const MS_PER_SECOND = 1000;

export function cn(...classes: ClassValue[]): string {
  const classNames: string[] = [];
  for (const value of classes) {
    if (!value) continue;
    if (typeof value === 'string') {
      classNames.push(value);
    } else if (typeof value === 'object') {
      for (const [className, enabled] of Object.entries(value)) {
        if (enabled) classNames.push(className);
      }
    }
  }
  return classNames.join(' ');
}

function formatWithUnits(value: number, base: number, units: string[], decimals: number): string {
  const unitIndex = Math.floor(Math.log(value) / Math.log(base));
  return `${parseFloat((value / base ** unitIndex).toFixed(decimals))} ${units[unitIndex]}`;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  return formatWithUnits(bytes, BYTES_PER_KIBIBYTE, BYTE_UNITS, Math.max(0, decimals));
}

export function formatBitsPerSec(bps: number): string {
  if (bps === 0) return '0 bps';
  return formatWithUnits(bps, BITS_PER_KILOBIT, BIT_RATE_UNITS, 1);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    return (
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
      ' ' +
      date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    );
  } catch {
    return isoString;
  }
}

export function timeAgo(isoString: string): string {
  try {
    const elapsedSeconds = (Date.now() - new Date(isoString).getTime()) / MS_PER_SECOND;
    if (elapsedSeconds < SECONDS_PER_MINUTE) return `${Math.floor(elapsedSeconds)}s ago`;
    if (elapsedSeconds < SECONDS_PER_HOUR) return `${Math.floor(elapsedSeconds / SECONDS_PER_MINUTE)}m ago`;
    if (elapsedSeconds < SECONDS_PER_DAY) return `${Math.floor(elapsedSeconds / SECONDS_PER_HOUR)}h ago`;
    return `${Math.floor(elapsedSeconds / SECONDS_PER_DAY)}d ago`;
  } catch {
    return isoString;
  }
}

export function truncateHash(hash: string, start = 8, end = 6): string {
  if (!hash || hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
