export type AdminTab = 'SESSIONS' | 'USERS_ROLES' | 'SSO' | 'AUDIT_LOG';

export interface AdminTabOption {
  id: AdminTab;
  label: string;
}

export const DEFAULT_ADMIN_TAB: AdminTab = 'AUDIT_LOG';

export const ADMIN_TAB_OPTIONS: readonly AdminTabOption[] = [
  { id: 'AUDIT_LOG', label: 'Operator Audit Log' },
  { id: 'USERS_ROLES', label: 'Users & RBAC Roles' },
  { id: 'SESSIONS', label: 'Active Sessions' },
  { id: 'SSO', label: 'Single Sign-On (SSO)' },
];

export interface RbacRole {
  name: string;
  description: string;
  assignmentLabel: string;
}

export const RBAC_ROLES: readonly RbacRole[] = [
  {
    name: 'Security Administrator',
    description: 'Full system configuration, sensor deployment, and tenant isolation control',
    assignmentLabel: '2 users assigned',
  },
  {
    name: 'Tier 3 Threat Analyst',
    description: 'Deep investigation, targeted PCAP slicing, and dual-custody permit proposal',
    assignmentLabel: '4 users assigned',
  },
  {
    name: 'Compliance Auditor',
    description: 'Read-only access to evidence ledger, compliance controls, and export records',
    assignmentLabel: '1 user assigned',
  },
];
