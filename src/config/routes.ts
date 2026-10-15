export interface NavItem {
  id: string;
  label: string;
  path: string;
  description: string;
  requiredCapability?: string;
  badgeCountKey?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAVIGATION_STRUCTURE: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        id: 'command-center',
        label: 'Command Center',
        path: '/overview',
        description: 'Global NDR state, incidents, assurance, and topology health',
      },
      {
        id: 'activity-log',
        label: 'Security Activity Log',
        path: '/overview/activity-log',
        description: 'System events, operator logins, and threat alerts',
      },
      {
        id: 'search',
        label: 'Search',
        path: '/search',
        description: 'Search incidents, alerts, assets, flows, indicators, CVEs and evidence',
        requiredCapability: 'global_search',
      },
      {
        id: 'reports',
        label: 'Reports',
        path: '/reports',
        description: 'Backend-generated security, assurance and compliance reports',
        requiredCapability: 'reporting',
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
        description: 'Correlated attack chains and incident dossiers',
      },
      {
        id: 'alerts',
        label: 'Raw Alerts',
        path: '/investigate/alerts',
        description: 'Detector signals before correlation',
      },
      {
        id: 'assets',
        label: 'Living Identities',
        path: '/investigate/assets',
        description: 'Asset identity, criticality and historical identity',
      },
      {
        id: 'entity-graph',
        label: 'Entity Graph',
        path: '/investigate/entity-graph',
        description: 'Who and what is related',
      },
      {
        id: 'network',
        label: 'Network Explorer',
        path: '/investigate/network',
        description: 'Flow analysis, application intelligence and encrypted DNS visibility',
        requiredCapability: 'network_explorer',
      },
      {
        id: 'hunt',
        label: 'Threat Hunt',
        path: '/investigate/hunt',
        description: 'Query-driven hunting across wire telemetry',
      },
      {
        id: 'threat-intel',
        label: 'Threat Intelligence',
        path: '/investigate/threat-intel',
        description: 'Indicators, reputation, local observations and feed health',
        requiredCapability: 'threat_intelligence',
      },
      {
        id: 'vulnerabilities',
        label: 'Vulnerability & Exposure',
        path: '/investigate/vulnerabilities',
        description:
          'Asset CVE intelligence, active-exploit context, observed services and authorized exposure validation',
        requiredCapability: 'vulnerability_exposure',
      },
      {
        id: 'baselines',
        label: 'Network Memory',
        path: '/investigate/baselines',
        description: 'Learned normal network behavior and meaningful deviation',
        requiredCapability: 'network_memory',
      },
      {
        id: 'scada-ot',
        label: 'SCADA / OT Grid Defense',
        path: '/investigate/scada-ot',
        description: 'Industrial protocol monitoring',
      },
      {
        id: 'time-machine',
        label: 'Security Time Machine',
        path: '/investigate/time-machine',
        description: 'Forensic rewind of the entity topology',
        requiredCapability: 'security_time_machine',
      },
    ],
  },
  {
    title: 'Assurance',
    items: [
      {
        id: 'detection-assurance',
        label: 'Live Detection Assurance',
        path: '/assurance/detection',
        description: 'Canary-verified detector health',
        requiredCapability: 'live_detection_assurance',
      },
      {
        id: 'detectors',
        label: 'Detector Catalog',
        path: '/assurance/detectors',
        description: 'Every detector, its dependencies and current capability',
        requiredCapability: 'detector_catalog',
      },
      {
        id: 'blind-spots',
        label: 'Blind Spots',
        path: '/assurance/blind-spots',
        description: 'Where observation or telemetry is missing and what it affects',
        requiredCapability: 'blind_spots',
      },
      {
        id: 'tuning',
        label: 'Detector Tuning',
        path: '/assurance/tuning',
        description: 'Audited suppressions, allowlists and thresholds',
        requiredCapability: 'detector_tuning',
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
        description: 'Dual-control containment workflow',
        requiredCapability: 'response_governance',
      },
      {
        id: 'response-authority',
        label: 'Response Authority',
        path: '/respond/authority',
        description: 'Each independent condition that governs whether response may act',
        requiredCapability: 'response_governance',
      },
      {
        id: 'protected-assets',
        label: 'Protected Assets',
        path: '/respond/protected-assets',
        description: 'Backend-enforced response policy per protected asset',
        requiredCapability: 'protected_assets',
      },
      {
        id: 'permits',
        label: 'Execution Permits',
        path: '/respond/permits',
        description: 'Dual-control execution permits',
      },
      {
        id: 'quarantine',
        label: 'Isolation & Quarantine',
        path: '/respond/quarantine',
        description: 'Active isolations',
      },
      {
        id: 'rollback',
        label: 'Rollback Console',
        path: '/respond/rollback',
        description: 'Compensating rollback of response actions',
      },
    ],
  },
  {
    title: 'Evidence',
    items: [
      {
        id: 'evidence-center',
        label: 'Evidence Center',
        path: '/evidence',
        description: 'Collected evidence artifacts',
      },
      {
        id: 'ledger',
        label: 'Cryptographic Ledger',
        path: '/evidence/ledger',
        description: 'Hash-chained evidence ledger',
      },
      {
        id: 'pcap',
        label: 'Targeted PCAP',
        path: '/evidence/pcap',
        description: 'Ring-buffer packet extraction',
        requiredCapability: 'targeted_pcap',
      },
      {
        id: 'vault',
        label: 'Vault & Master Keys',
        path: '/evidence/vault',
        description: 'Key custody',
      },
      {
        id: 'witness',
        label: 'Witness Plane',
        path: '/evidence/witness',
        description: 'Independent witness quorum',
        requiredCapability: 'witness_quorum',
      },
      {
        id: 'exports',
        label: 'Export Jobs',
        path: '/evidence/exports',
        description: 'Backend export jobs, formats and artifact hashes',
        requiredCapability: 'export_jobs',
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
        description: 'Sensors, enrollment, trust and software lifecycle',
      },
      {
        id: 'deployment',
        label: 'Deployment & Preflight',
        path: '/system/deployment',
        description: 'What ZeroFrame will actually see if a sensor is deployed',
        requiredCapability: 'deployment_preflight',
      },
      {
        id: 'topology',
        label: 'Topology & Visibility',
        path: '/system/topology',
        description: 'Where ZeroFrame can physically and logically observe',
        requiredCapability: 'topology_visibility',
      },
      {
        id: 'inspection',
        label: 'Inspection Integrity',
        path: '/system/inspection',
        description: 'Observation pipeline integrity',
        requiredCapability: 'protocol_inspection',
      },
      {
        id: 'diagnostics',
        label: 'System Diagnostics',
        path: '/system/diagnostics',
        description: 'Product component health, resource governor and build identity',
        requiredCapability: 'system_diagnostics',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        path: '/system/integrations',
        description: 'Connected security tools',
      },
      {
        id: 'compliance',
        label: 'Compliance Center',
        path: '/system/compliance',
        description: 'Framework evidence and control state',
        requiredCapability: 'compliance_frameworks',
      },
      {
        id: 'licensing',
        label: 'Enterprise Licensing',
        path: '/system/licensing',
        description: 'License entitlements',
      },
      {
        id: 'support',
        label: 'Support Bundle',
        path: '/system/support',
        description: 'Redacted diagnostic bundles for support',
        requiredCapability: 'support_bundle',
      },
    ],
  },
  {
    title: 'Admin',
    items: [
      {
        id: 'admin',
        label: 'Audit Log & RBAC',
        path: '/admin',
        description: 'Operator audit trail and access control',
      },
      {
        id: 'tenants',
        label: 'Tenant Administration',
        path: '/admin/tenants',
        description: 'Tenants, retention, licensing and health',
        requiredCapability: 'tenant_administration',
      },
    ],
  },
];

export const ROUTE_REDIRECTS: Record<string, string> = {
  '/': '/overview',
  '/evidence/center': '/evidence',
  '/system/assurance': '/assurance/detection',
  '/system/audit': '/admin',
};

export const ALL_NAV_ITEMS: NavItem[] = NAVIGATION_STRUCTURE.flatMap((section) => section.items);

const NAV_ITEMS_BY_SPECIFICITY = [...ALL_NAV_ITEMS].sort((a, b) => b.path.length - a.path.length);

export function findNavItem(path: string): NavItem | undefined {
  return NAV_ITEMS_BY_SPECIFICITY.find((item) => path === item.path || path.startsWith(`${item.path}/`));
}
