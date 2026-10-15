/**
 * ZeroFlash Notification System Types
 * Covers all 15 operational security categories
 */

export type NotificationCategory =
  | 'SECURITY'
  | 'INCIDENT'
  | 'SYSTEM'
  | 'VISIBILITY'
  | 'DETECTION'
  | 'TRUST'
  | 'RESPONSE'
  | 'DEPLOYMENT'
  | 'EVIDENCE'
  | 'COMPLIANCE'
  | 'INTEGRATION'
  | 'LICENSE'
  | 'AUTHENTICATION'
  | 'ADMIN'
  | 'AUDIT';

export interface ZeroFlashNotification {
  id: string;
  category: NotificationCategory;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  acknowledged: boolean;
  deepLink?: string;
  fingerprintHash: string; // Used for deduplication
  tenantId: string;
}
