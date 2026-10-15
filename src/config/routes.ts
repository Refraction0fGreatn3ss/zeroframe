/**
 * Navigation & Route Definitions for ZeroFlash Enterprise 1.0
 * Grouped into: Overview, Investigate, Respond, Evidence, System
 */

export interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    path: string;
    badgeCountKey?: string;
    warningKey?: string;
    description: string;
  }[];
}

export const NAVIGATION_STRUCTURE: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        id: 'command-center',
        label: 'Command Center',
        path: '/overview',
        description: 'Global NDR state, incidents, assurance, and live topology health',
      },
      {
        id: 'activity-log',
        label: 'Security Activity Log',
        path: '/overview/activity-log',
        description: 'Real-time telemetry tracking system events, user logins, and threat alerts',
      },
    ],
  },
  {
    title: 'Investigate',
    items: [
      {
        id: 'incidents',
        label: 'Incidents & Kill Chains',
        path: '/investigate/incidents',
        badgeCountKey: 'openIncidents',
        description: 'Correlated multi-stage security incidents mapped to MITRE ATT&CK',
      },
      {
        id: 'alerts',
        label: 'Raw Alerts',
        path: '/investigate/alerts',
        description: 'Individual detector alerts with source fidelity and packet references',
      },
      {
        id: 'assets',
        label: 'Living Identities',
        path: '/investigate/assets',
        description: 'Asset inventory with DHCP churn, cloud metadata, and protected asset tags',
      },
      {
        id: 'entity-graph',
        label: 'Entity Graph',
        path: '/investigate/entity-graph',
        description: 'Interactive topology provenance: discovered, declared, and inferred links',
      },
      {
        id: 'hunt',
        label: 'Threat Hunt',
        path: '/investigate/hunt',
        description: 'Ad-hoc query workbench for flow metadata, JA4/JA4S fingerprints, and DNS',
      },
      {
        id: 'scada-ot',
        label: 'SCADA / OT Grid Defense',
        path: '/investigate/scada-ot',
        description: 'Passive optical tap monitoring for Purdue Levels 0-3, Modbus, DNP3, and physical air-gap diodes',
      },
      {
        id: 'time-machine',
        label: 'Security Time Machine',
        path: '/investigate/time-machine',
        description: 'Historical point-in-time truth reconstruction: What did ZeroFlash know then?',
      },
    ],
  },
  {
    title: 'Respond',
    items: [
      {
        id: 'response-studio',
        label: 'Governed Response Studio',
        path: '/respond/studio',
        description: 'Dual-custody action planning, blast-radius verification, and scoped execution',
      },
      {
        id: 'quarantine',
        label: 'Isolation & Quarantine',
        path: '/respond/quarantine',
        description: 'Network-layer containment via iptables, TCP RST injection, and BGP Flowspec',
      },
      {
        id: 'permits',
        label: 'Execution Permits',
        path: '/respond/permits',
        description: 'Witness notary co-signed permits and dual-control approvals',
      },
      {
        id: 'rollback',
        label: 'Rollback Console',
        path: '/respond/rollback',
        description: 'One-click safe rollback for response actions and sensor configurations',
      },
    ],
  },
  {
    title: 'Evidence',
    items: [
      {
        id: 'evidence-center',
        label: 'Evidence Center',
        path: '/evidence/center',
        description: 'Forensic evidence collection, chain-of-custody, and legal holds',
      },
      {
        id: 'evidence-ledger',
        label: 'Cryptographic Ledger',
        path: '/evidence/ledger',
        description: 'SHA-256 Merkle hash chained blocks and cryptographic sealing',
      },
      {
        id: 'targeted-pcap',
        label: 'Targeted PCAP',
        path: '/evidence/pcap',
        description: 'On-demand high-precision packet captures and incident slices',
      },
      {
        id: 'vault',
        label: 'Vault & Master Keys',
        path: '/evidence/vault',
        description: 'Hardware/software token management, SPIFFE identities, and encryption keys',
      },
      {
        id: 'witness-plane',
        label: 'Witness Plane',
        path: '/evidence/witness',
        description: 'Independent dual-custody authorization notary and consensus nodes',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        id: 'fleet',
        label: 'Sensor Fleet',
        path: '/system/fleet',
        description: 'Physical & virtual sensors, capture drivers, mTLS trust, and outbox depth',
      },
      {
        id: 'inspection-integrity',
        label: 'Inspection Integrity',
        path: '/system/inspection',
        description: 'Capture -> L2 -> L3 -> Session -> Crypto observation path diagnostics',
      },
      {
        id: 'detection-assurance',
        label: 'Live Detection Assurance',
        path: '/system/assurance',
        description: 'Continuous safe signed canaries verifying detector capability right now',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        path: '/system/integrations',
        description: 'Defender XDR, CrowdStrike Falcon, Cortex XDR, Splunk, ServiceNow',
      },
      {
        id: 'compliance',
        label: 'Compliance Center',
        path: '/system/compliance',
        description: 'Evidence-backed mappings for UAE IAR, Qatar NIA, Saudi NCA, NIST CSF, PCI DSS',
      },
      {
        id: 'licensing',
        label: 'Enterprise Licensing',
        path: '/system/licensing',
        description: 'Cryptographically signed offline enterprise license and capacity tiers',
      },
      {
        id: 'audit-log',
        label: 'Audit Log & RBAC',
        path: '/system/audit',
        description: 'Operator actions, response commands, permission changes, and tenant boundaries',
      },
    ],
  },
];
