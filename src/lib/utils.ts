/**
 * Universal Utility Helpers for ZeroFlash Enterprise
 */

export function cn(...classes: (string | boolean | undefined | null | { [key: string]: boolean })[]): string {
  const result: string[] = [];
  for (const item of classes) {
    if (!item) continue;
    if (typeof item === 'string') {
      result.push(item);
    } else if (typeof item === 'object') {
      for (const [key, val] of Object.entries(item)) {
        if (val) result.push(key);
      }
    }
  }
  return result.join(' ');
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatBitsPerSec(bps: number): string {
  if (bps === 0) return '0 bps';
  const k = 1000;
  const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
  const i = Math.floor(Math.log(bps) / Math.log(k));
  return parseFloat((bps / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
      ' ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return isoString;
  }
}

export function timeAgo(isoString: string): string {
  try {
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return isoString;
  }
}

export function truncateHash(hash: string, start = 8, end = 6): string {
  if (!hash || hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
