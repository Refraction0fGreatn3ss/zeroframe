/**
 * Security Activity Log Store
 * Real-time event bus tracking system events, user logins, and threat alerts.
 * Features live streaming, filtering, search, export, and tenant isolation.
 */

import { useState, useEffect } from 'react';
import {
  SecurityActivityItem,
  ActivityCategory,
  ActivitySeverity,
  ActivityStatus,
} from '../types/activity-log';
import { tenantRegistry } from './tenant-registry';

const INITIAL_LOGS: SecurityActivityItem[] = [
  {
    id: 'ACT-2026-9041',
    timestamp: new Date(Date.now() - 1000 * 12).toISOString(),
    category: 'THREAT_ALERT',
    severity: 'CRITICAL',
    title: 'DNS Tunneling Beacon Detected (C2 Exfiltration)',
    description: 'High-entropy TXT lookup burst to dynamic apex domain 185.220.101.44 matching Cobalt Strike malleable profile.',
    actor: 'detector.dns-entropy-probe',
    actorRole: 'Autonomous NDR Detector',
    sourceIp: '10.140.2.88',
    targetResource: 'ns1.threat-actor-zone.cc (Wire Port 53)',
    mitreTactic: 'T1071.004 (DNS Communication)',
    status: 'FLAGGED',
    payload: {
      queriesPerSec: 142,
      entropyScore: 4.88,
      ja4Fingerprint: 't13d1516h2_8daaf6152771_b172a39a25b1',
      affectedVictim: 'WKST-CORP-088',
    },
  },
  {
    id: 'ACT-2026-9040',
    timestamp: new Date(Date.now() - 1000 * 38).toISOString(),
    category: 'USER_LOGIN',
    severity: 'INFO',
    title: 'Operator Console Login via Okta SSO',
    description: 'Security Analyst Sarah Chen successfully authenticated via SAML 2.0 with FIDO2 WebAuthn token.',
    actor: 'sarah.chen@corp.zeroflash',
    actorRole: 'Security Analyst Tier 3',
    sourceIp: '10.140.0.102',
    targetResource: 'Console Web Interface (HTTPS / 443)',
    location: 'Zurich SOC Operations Center',
    status: 'SUCCESS',
    payload: {
      authMethod: 'SAML_SSO_FIDO2',
      sessionTimeoutPolicy: '15m Strict Zero Remanence',
      mfaVerified: true,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    },
  },
  {
    id: 'ACT-2026-9039',
    timestamp: new Date(Date.now() - 1000 * 75).toISOString(),
    category: 'SYSTEM_EVENT',
    severity: 'INFO',
    title: 'AF_XDP Kernel Tap Ring Buffer Re-synchronized',
    description: 'Physical optical tap tap-sfp28-core-01 verified 10 Gbps bidirectional frame symmetry with 0 dropped frames.',
    actor: 'kernel.af_xdp_driver',
    actorRole: 'Core Ingress Engine',
    sourceIp: '192.168.1.10',
    targetResource: 'tap-sfp28-core-01 (10G Optical Diode)',
    status: 'SUCCESS',
    payload: {
      linkRate: '9.84 Gbps',
      ringBufferSize: '65536 descriptors',
      kernelDrops: 0,
      asymmetricFlowRatio: 0.002,
    },
  },
  {
    id: 'ACT-2026-9038',
    timestamp: new Date(Date.now() - 1000 * 115).toISOString(),
    category: 'THREAT_ALERT',
    severity: 'HIGH',
    title: 'Modbus TCP FC05 Unauthorized Coil Force Write Attempt',
    description: 'Suspicious FC05 Write Single Coil command targeted Feeder Breaker 402 coil 0x002B outside maintenance window.',
    actor: 'detector.modbus-ics-probe',
    actorRole: 'SCADA Protocol Dissector',
    sourceIp: '192.168.100.42',
    targetResource: 'RTU-SUBSTATION-04-RELAY (Purdue Level 1)',
    mitreTactic: 'T0855 (Unauthorized Command Message)',
    status: 'BLOCKED',
    payload: {
      functionCode: 'FC05',
      coilAddress: '0x002B',
      interlockStatus: 'Dropped at Hardware Tap',
      deviceModel: 'Schneider Micom P142',
    },
  },
  {
    id: 'ACT-2026-9037',
    timestamp: new Date(Date.now() - 1000 * 180).toISOString(),
    category: 'USER_LOGIN',
    severity: 'HIGH',
    title: 'Step-Up MFA Challenge Prompted for Governed Action',
    description: 'Operator attempted host containment permit generation; step-up biometric verification was requested.',
    actor: 'alex.vance@secops',
    actorRole: 'Incident Commander',
    sourceIp: '10.140.0.114',
    targetResource: 'Governed Response Studio (/respond/studio)',
    location: 'Remote VPN (Dubai Gate)',
    status: 'WARNING',
    payload: {
      actionAttempted: 'EXECUTE_CONTAINMENT_PERMIT',
      targetHost: 'WKST-CORP-088',
      mfaMethod: 'TOTP_HARDWARE_TOKEN',
      status: 'AWAITING_CO_SIGNATURE',
    },
  },
  {
    id: 'ACT-2026-9036',
    timestamp: new Date(Date.now() - 1000 * 240).toISOString(),
    category: 'SYSTEM_EVENT',
    severity: 'INFO',
    title: 'Live Detection Assurance Canary #994 Verified',
    description: 'Cryptographically signed canary packet passed through detector ring; detector health verified in 4.2ms.',
    actor: 'system.canary-dispatcher',
    actorRole: 'Assurance Service',
    sourceIp: '127.0.0.1',
    targetResource: 'Detector Ring (68 Active Detectors)',
    status: 'SUCCESS',
    payload: {
      canaryId: 'CNR-994-SIGNED',
      signatureValid: true,
      detectorsVerified: 68,
      latencyMs: 4.2,
    },
  },
  {
    id: 'ACT-2026-9035',
    timestamp: new Date(Date.now() - 1000 * 310).toISOString(),
    category: 'THREAT_ALERT',
    severity: 'CRITICAL',
    title: 'Kerberos Bronze Bit Ticket Forgery (CVE-2020-17049)',
    description: 'Anomalous unconstrained S4U2self transit detected bypassing PAC validation checks on domain controller.',
    actor: 'detector.kerberos-dissector',
    actorRole: 'L7 Protocol Inspector',
    sourceIp: '10.140.2.88',
    targetResource: 'DC-CORP-PRIMARY-01 (10.140.1.10)',
    mitreTactic: 'T1558.003 (Kerberoasting / PAC Bypass)',
    status: 'FLAGGED',
    payload: {
      ticketFlags: '0x40a10000',
      clientRealm: 'CORP.ZEROFLASH',
      targetService: 'krbtgt/CORP.ZEROFLASH',
      cveReference: 'CVE-2020-17049',
    },
  },
  {
    id: 'ACT-2026-9034',
    timestamp: new Date(Date.now() - 1000 * 420).toISOString(),
    category: 'USER_LOGIN',
    severity: 'MEDIUM',
    title: 'Failed Operator Sign-In Attempt (Bad Credential)',
    description: 'Invalid credentials supplied for operator identity marcus.reid@corp from unauthorized IP subnet.',
    actor: 'marcus.reid@corp',
    actorRole: 'Unverified Operator',
    sourceIp: '198.51.100.44',
    targetResource: 'Console Auth Endpoint (/api/auth/login)',
    location: 'External Internet Subnet',
    status: 'BLOCKED',
    payload: {
      failureReason: 'INVALID_CREDENTIALS',
      attemptCount: 3,
      lockoutTriggered: false,
      ipReputation: 'Suspicious Tor Exit Node',
    },
  },
  {
    id: 'ACT-2026-9033',
    timestamp: new Date(Date.now() - 1000 * 540).toISOString(),
    category: 'SYSTEM_EVENT',
    severity: 'INFO',
    title: 'Hardware Air-Gap Data Diode Heartbeat Nominal',
    description: 'Passive optical receiver diode confirmed 100% unidirectional pulse stream with 0 TX back-channel pulses.',
    actor: 'sensor.optical-diode-controller',
    actorRole: 'Hardware Security Module',
    sourceIp: '192.168.100.1',
    targetResource: 'Diode Model ZF-OPT-10G (Substation 4)',
    status: 'SUCCESS',
    payload: {
      opticalPowerDbm: -3.2,
      reverseSignalDetected: false,
      diodeState: 'STRICT_AIR_GAP_CONFIRMED',
    },
  },
  {
    id: 'ACT-2026-9032',
    timestamp: new Date(Date.now() - 1000 * 680).toISOString(),
    category: 'THREAT_ALERT',
    severity: 'MEDIUM',
    title: 'Anomalous JA4S Cryptographic Fingerprint on Payment Gateway',
    description: 'Outbound TLS connection to Stripe API exhibited unknown cipher suite ordering matching python requests client.',
    actor: 'detector.tls-ja4-profiler',
    actorRole: 'Cryptographic Classifier',
    sourceIp: '10.140.4.19',
    targetResource: 'api.stripe.com (443)',
    mitreTactic: 'T1071.001 (Web Protocols)',
    status: 'INVESTIGATING',
    payload: {
      ja4: 't13d3112h2_002f,0035_0100',
      expectedJa4: 't13d1516h2_8daaf6152771_b172a39a25b1',
      serverName: 'api.stripe.com',
    },
  },
];

// Pool of dynamic real-time event templates for realistic streaming
const STREAMING_TEMPLATES: Omit<SecurityActivityItem, 'id' | 'timestamp'>[] = [
  {
    category: 'THREAT_ALERT',
    severity: 'HIGH',
    title: 'Lateral SMB Named Pipe Impersonation Attempt',
    description: 'Spike in IPC$ tree connect with anomalous named pipe \\pipe\\spoolss from victim workstation.',
    actor: 'detector.smb-flow-engine',
    actorRole: 'L7 Protocol Inspector',
    sourceIp: '10.140.2.88',
    targetResource: 'FS-CORP-FINANCE-02 (445)',
    mitreTactic: 'T1021.002 (SMB/Windows Admin Shares)',
    status: 'FLAGGED',
    payload: {
      pipeName: '\\pipe\\spoolss',
      dialect: 'SMB 3.1.1',
      sessionUid: '0x00004f12',
    },
  },
  {
    category: 'USER_LOGIN',
    severity: 'INFO',
    title: 'Session Inactivity Policy Extended (+15m)',
    description: 'Operator acknowledged console activity HUD. Key purge timer reset with cryptographic continuity.',
    actor: 'sarah.chen@corp.zeroflash',
    actorRole: 'Security Analyst Tier 3',
    sourceIp: '10.140.0.102',
    targetResource: 'ZeroFrame Active Console',
    location: 'Zurich SOC Operations Center',
    status: 'SUCCESS',
    payload: {
      policy: '15m Strict',
      priorRemainingSeconds: 42,
      newRemainingSeconds: 900,
    },
  },
  {
    category: 'SYSTEM_EVENT',
    severity: 'INFO',
    title: 'Cryptographic Evidence Ledger Block #8820 Sealed',
    description: 'SHA-256 Merkle root notarized across decentralized witness plane quorum.',
    actor: 'system.evidence-notary',
    actorRole: 'Ledger Engine',
    sourceIp: '127.0.0.1',
    targetResource: 'Evidence Chain Block #8820',
    status: 'SUCCESS',
    payload: {
      merkleRoot: '7e2c9b4f108842adce3309b119a084ef7721cc83',
      quorumVotes: '3/3 Witness Nodes',
      recordCount: 14,
    },
  },
  {
    category: 'THREAT_ALERT',
    severity: 'CRITICAL',
    title: 'Rapid Port Sweep Anomaly (TCP SYN Scanner)',
    description: 'Unusual TCP SYN burst scanning internal /24 subnet without completing 3-way handshake.',
    actor: 'detector.syn-scanner-probe',
    actorRole: 'Network Anomaly Detector',
    sourceIp: '10.140.2.88',
    targetResource: '10.140.3.0/24 Subnet',
    mitreTactic: 'T1046 (Network Service Discovery)',
    status: 'FLAGGED',
    payload: {
      synRate: '340 pkts/sec',
      targetPorts: '22, 80, 443, 445, 3389, 8080',
      handshakeCompletionRate: '0.0%',
    },
  },
  {
    category: 'USER_LOGIN',
    severity: 'INFO',
    title: 'Operator Unlocked Console via Biometrics',
    description: 'Operator cleared lock screen challenge; active state and forensic tabs restored.',
    actor: 'alex.vance@secops',
    actorRole: 'Incident Commander',
    sourceIp: '10.140.0.114',
    targetResource: 'ZeroFrame Operations Workbench',
    location: 'Remote VPN (Dubai Gate)',
    status: 'SUCCESS',
    payload: {
      unlockMethod: 'BIOMETRIC_PASSKEY',
      lockDurationSeconds: 140,
    },
  },
  {
    category: 'SYSTEM_EVENT',
    severity: 'INFO',
    title: 'Optical Ingress Tap Sync: Zero Drops Reported',
    description: 'Optical fiber tap reported 100% telemetry continuity across all Purdue Level 0-3 rings.',
    actor: 'kernel.af_xdp_driver',
    actorRole: 'Core Ingress Engine',
    sourceIp: '192.168.1.10',
    targetResource: 'tap-core-01 (10G Fiber)',
    status: 'SUCCESS',
    payload: {
      bps: '1.42 Gbps',
      pps: '184,200',
      hardwareBufferDropPct: 0.0,
    },
  },
];

interface ActivityLogStoreState {
  logs: SecurityActivityItem[];
  isStreaming: boolean;
  filterCategory: ActivityCategory | 'ALL';
  filterSeverity: ActivitySeverity | 'ALL';
  searchQuery: string;
  selectedLog: SecurityActivityItem | null;
  autoScroll: boolean;
}

let activityState: ActivityLogStoreState = {
  logs: [...INITIAL_LOGS],
  isStreaming: true,
  filterCategory: 'ALL',
  filterSeverity: 'ALL',
  searchQuery: '',
  selectedLog: null,
  autoScroll: true,
};

const listeners = new Set<(state: ActivityLogStoreState) => void>();

function notify() {
  listeners.forEach((l) => l({ ...activityState }));
}

// Background simulated real-time stream
let streamTimer: NodeJS.Timeout | null = null;
let templateIndex = 0;

function startStreaming() {
  if (streamTimer) clearInterval(streamTimer);
  streamTimer = setInterval(() => {
    if (!activityState.isStreaming) return;

    const template = STREAMING_TEMPLATES[templateIndex % STREAMING_TEMPLATES.length];
    templateIndex++;

    const newEvent: SecurityActivityItem = {
      ...template,
      id: `ACT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      isNew: true,
    };

    // Prepend new event and keep latest 200 items in memory
    activityState.logs = [newEvent, ...activityState.logs.slice(0, 199)];
    notify();

    // Clear isNew highlight after 3 seconds
    setTimeout(() => {
      activityState.logs = activityState.logs.map((l) =>
        l.id === newEvent.id ? { ...l, isNew: false } : l
      );
      notify();
    }, 3000);
  }, 5000);
}

// Start live streaming on boot
if (typeof window !== 'undefined') {
  startStreaming();
}

// Register with tenant isolation registry
tenantRegistry.register(
  () => {
    activityState.logs = [];
    notify();
  },
  async () => {
    activityState.logs = [...INITIAL_LOGS];
    notify();
  }
);

export function useActivityLogStore() {
  const [state, setState] = useState<ActivityLogStoreState>(activityState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const toggleStreaming = () => {
    activityState.isStreaming = !activityState.isStreaming;
    notify();
  };

  const setCategoryFilter = (cat: ActivityCategory | 'ALL') => {
    activityState.filterCategory = cat;
    notify();
  };

  const setSeverityFilter = (sev: ActivitySeverity | 'ALL') => {
    activityState.filterSeverity = sev;
    notify();
  };

  const setSearchQuery = (q: string) => {
    activityState.searchQuery = q;
    notify();
  };

  const setSelectedLog = (item: SecurityActivityItem | null) => {
    activityState.selectedLog = item;
    notify();
  };

  const setAutoScroll = (enabled: boolean) => {
    activityState.autoScroll = enabled;
    notify();
  };

  const clearLogs = () => {
    activityState.logs = [];
    notify();
  };

  const resetLogs = () => {
    activityState.logs = [...INITIAL_LOGS];
    notify();
  };

  const addManualEvent = (event: Omit<SecurityActivityItem, 'id' | 'timestamp'>) => {
    const newItem: SecurityActivityItem = {
      ...event,
      id: `ACT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      isNew: true,
    };
    activityState.logs = [newItem, ...activityState.logs.slice(0, 199)];
    notify();
  };

  // Filtered computed logs
  const filteredLogs = activityState.logs.filter((log) => {
    if (activityState.filterCategory !== 'ALL' && log.category !== activityState.filterCategory) {
      return false;
    }
    if (activityState.filterSeverity !== 'ALL' && log.severity !== activityState.filterSeverity) {
      return false;
    }
    if (activityState.searchQuery.trim()) {
      const q = activityState.searchQuery.toLowerCase();
      const match =
        log.title.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.sourceIp.toLowerCase().includes(q) ||
        (log.targetResource && log.targetResource.toLowerCase().includes(q)) ||
        (log.mitreTactic && log.mitreTactic.toLowerCase().includes(q)) ||
        log.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const counts = {
    all: activityState.logs.length,
    threatAlerts: activityState.logs.filter((l) => l.category === 'THREAT_ALERT').length,
    userLogins: activityState.logs.filter((l) => l.category === 'USER_LOGIN').length,
    systemEvents: activityState.logs.filter((l) => l.category === 'SYSTEM_EVENT').length,
    criticalCount: activityState.logs.filter((l) => l.severity === 'CRITICAL').length,
  };

  return {
    ...state,
    filteredLogs,
    counts,
    toggleStreaming,
    setCategoryFilter,
    setSeverityFilter,
    setSearchQuery,
    setSelectedLog,
    setAutoScroll,
    clearLogs,
    resetLogs,
    addManualEvent,
  };
}
