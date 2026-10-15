import type {
  AnalystNotesByIncident,
  AssignedOperatorsByIncident,
  IncidentStateOption,
  OperatorOption,
  ProcessNode,
  SeverityFilter,
} from './incidents.types';

export const DEFAULT_PROCESS_TREE_KEY = 'default';

export const PROCESS_EXECUTION_TREES: Record<string, ProcessNode[]> = {
  [DEFAULT_PROCESS_TREE_KEY]: [
    {
      id: 'node-1',
      name: 'w3wp.exe (IIS Worker Process)',
      pid: 3108,
      user: 'IIS_IUSRS',
      cmdline: 'C:\\Windows\\System32\\inetsrv\\w3wp.exe -ap "DefaultAppPool"',
      status: 'LEGITIMATE',
      type: 'PROCESS',
      meta: 'Parent web application worker service',
    },
    {
      id: 'node-2',
      name: 'cmd.exe',
      pid: 4920,
      user: 'IIS_IUSRS',
      cmdline: 'C:\\Windows\\System32\\cmd.exe /c powershell.exe -nop -w hidden -enc JABzAD0...',
      status: 'SUSPICIOUS',
      type: 'PROCESS',
      meta: 'Spawned shell via web shell POST command',
    },
    {
      id: 'node-3',
      name: 'powershell.exe',
      pid: 5012,
      user: 'NT AUTHORITY\\SYSTEM',
      cmdline: 'powershell.exe -nop -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAA...',
      status: 'MALICIOUS',
      type: 'PROCESS',
      meta: 'Token impersonation to SYSTEM · downloads stage 2 beacon',
    },
    {
      id: 'node-4',
      name: 'Network C2 Socket (TCP 443)',
      pid: 5012,
      user: 'NT AUTHORITY\\SYSTEM',
      cmdline: 'Outbound connect 185.220.101.44:443 (JA4: t13d1516h2_8daaf6152771...)',
      status: 'MALICIOUS',
      type: 'NETWORK',
      meta: 'Cobalt Strike malleable C2 TLS session · 48KB beaconing',
    },
    {
      id: 'node-5',
      name: 'svchost_upd.exe',
      pid: 9112,
      user: 'NT AUTHORITY\\SYSTEM',
      cmdline: 'C:\\ProgramData\\svchost_upd.exe --inject-lsass',
      hash: 'a93f8e42b109c0d38194e21a8d424b91fe203a1194248a80194812f840912e84',
      status: 'MALICIOUS',
      type: 'FILE',
      meta: 'Dropped payload into C:\\ProgramData · Memory dump tool',
    },
    {
      id: 'node-6',
      name: 'SMB Named Pipe Lateral Movement',
      pid: 9112,
      user: 'NT AUTHORITY\\SYSTEM',
      cmdline: '\\\\10.140.10.5\\pipe\\svcctl (RPC bind to Domain Controller)',
      status: 'MALICIOUS',
      type: 'NETWORK',
      meta: 'PsExec-style lateral pivoting to Domain Controller DC-01',
    },
  ],
};

export const INITIAL_SELECTED_PROCESS_NODE_INDEX = 2;

export const PROCESS_TREE_INDENT_STEP_PX = 20;

export const PROCESS_TREE_MAX_INDENT_PX = 80;

export const CURRENT_OPERATOR_AUTHOR = 'Sarah Chen, CISSP';

export const DEFAULT_ASSIGNEE = 'Sarah Chen, CISSP (Tier 3 Lead)';

export const OPERATOR_OPTIONS: OperatorOption[] = [
  { name: 'Sarah Chen, CISSP (Tier 3 Lead)' },
  { name: 'Alex Rivera (Tier 2 SOC)' },
  { name: 'Marcus Vance (OT Lead)' },
  { name: 'Elena Rostova (Threat Hunter)' },
  { name: 'Unassigned', muted: true },
];

export const INITIAL_ASSIGNED_OPERATORS: AssignedOperatorsByIncident = {
  'INC-8812': 'Sarah Chen, CISSP (Tier 3 Lead)',
  'INC-8813': 'Alex Rivera (Tier 2 SOC)',
  'INC-8814': 'Marcus Vance (OT Lead)',
};

export const INITIAL_ANALYST_NOTES: AnalystNotesByIncident = {
  'INC-8812': [
    {
      id: 'note-1',
      author: 'Sarah Chen, CISSP',
      timestamp: '19:52:10 UTC',
      content:
        'Correlated outbound TLS session with known Cobalt Strike malleable C2 profile (JA4: t13d1516h2_8daaf6152771_0278457224b8). Initiated dual-control host quarantine review.',
    },
    {
      id: 'note-2',
      author: 'Alex Rivera (Tier 2)',
      timestamp: '19:56:44 UTC',
      content:
        'Extracted 100MB PCAP slice from ring buffer on tap-core-01. SHA-256 hash sealed in immutable ledger block #8819.',
    },
  ],
};

export const INCIDENT_STATE_OPTIONS: IncidentStateOption[] = [
  { value: 'OPEN', label: 'OPEN (TRIAGE)' },
  { value: 'INVESTIGATING', label: 'INVESTIGATING' },
  { value: 'CONTAINED', label: 'CONTAINED' },
  { value: 'RESOLVED', label: 'RESOLVED' },
];

export const SEVERITY_FILTER_OPTIONS: readonly SeverityFilter[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'];

export const DEFAULT_MITRE_TECHNIQUE = 'T1059';

export const FALLBACK_C2_IP = '185.220.101.44';

export const FALLBACK_C2_COUNTRY = 'NL';

export const FALLBACK_DETECTION_TIMESTAMP = '2026-10-15T09:12:44Z';

export const PCAP_CAPTURE_DURATION_SECONDS = 60;

export const PCAP_REDIRECT_DELAY_MS = 700;

export const ROUTES = {
  governedResponseStudio: '/respond/studio',
  pcapEvidence: '/evidence/pcap',
  networkInvestigation: '/investigate/network',
  entityInvestigation: '/investigate/entities',
} as const;
