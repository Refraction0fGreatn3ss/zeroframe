export const fleetSensors = [
  {
    id: 'SENSOR-HQ-CORE-01',
    hostname: 'sensor-hq-core-01.mgmt.internal',
    version: 'ZeroFrame-Sensor-v1.4.1',
    mode: 'PASSIVE_TAP',
    status: 'HEALTHY',
    ingressThroughputMbps: 1850,
    packetRateKpps: 260,
    kernelDropPps: 2,
    asymmetricRatio: 0.04,
    mTLSExpiry: '2026-11-20T00:00:00Z',
    uptimeDays: 94,
    location: 'HQ Datacenter Core Switch',
  },
  {
    id: 'SENSOR-HQ-CORE-02',
    hostname: 'sensor-hq-core-02.mgmt.internal',
    version: 'ZeroFrame-Sensor-v1.4.1',
    mode: 'SPAN_MIRROR',
    status: 'DEGRADED',
    ingressThroughputMbps: 600,
    packetRateKpps: 82,
    kernelDropPps: 16,
    asymmetricRatio: 0.18,
    mTLSExpiry: '2026-10-30T00:00:00Z',
    uptimeDays: 41,
    location: 'Core Switch 02 Distribution Mirror',
  },
  {
    id: 'SENSOR-HQ-EDGE-01',
    hostname: 'sensor-hq-edge-01.mgmt.internal',
    version: 'ZeroFrame-Sensor-v1.4.0',
    mode: 'PASSIVE_TAP',
    status: 'HEALTHY',
    ingressThroughputMbps: 420,
    packetRateKpps: 58,
    kernelDropPps: 0,
    asymmetricRatio: 0.01,
    mTLSExpiry: '2026-12-15T00:00:00Z',
    uptimeDays: 112,
    location: 'Edge Border Router Ingress',
  },
];

export const inspectionPipeline = {
  stages: [
    { stage: 'CAPTURE', name: 'eBPF Ring Buffer & AF_XDP Driver', status: 'HEALTHY', dropRatePps: 18 },
    { stage: 'L2_ETHERNET', name: 'EtherType & 802.1Q VLAN Tag Tracking', status: 'HEALTHY', dropRatePps: 0 },
    { stage: 'L3_IP', name: 'IPv4/IPv6 Dual-Stack & Asymmetry Tracking', status: 'DEGRADED', dropRatePps: 4 },
    { stage: 'TRANSPORT', name: 'TCP Sequence Reconstruction & UDP Flow Tracking', status: 'HEALTHY', dropRatePps: 0 },
    { stage: 'SESSION', name: 'Session State Machine & Keepalive Auditor', status: 'HEALTHY', dropRatePps: 0 },
    { stage: 'CRYPTO', name: 'TLS 1.3 JA4/JA4S Fingerprinting & ALPN', status: 'HEALTHY', dropRatePps: 0 },
    { stage: 'APPLICATION', name: 'L7 Decoders (DNS, HTTP, SMB, Kerberos, SSH, Modbus)', status: 'HEALTHY', dropRatePps: 0 },
  ],
  asymmetryWarning: 'Core-Switch-02 mirror port reports 18% unidirectional flows. Return path unmonitored on secondary border link.',
};

export const detectionCapabilities = [
  { id: 'DET-01', detectorKey: 'lateral_movement_smb', name: 'SMB/RPC Lateral Movement & PsExec', category: 'Lateral Movement', state: 'HEALTHY', assuranceState: 'AVAILABLE', lastCanaryTimestamp: new Date(Date.now() - 1000 * 25).toISOString(), lastCanarySignedHash: 'sha256-e8f01a39...42bd', requiredTelemetry: 'DEEP_PACKET', mitreCoverage: ['T1021.002', 'T1570'] },
  { id: 'DET-02', detectorKey: 'kerberoast_auditor', name: 'Kerberos TGS Request Spike & Roasting', category: 'Credential Access', state: 'HEALTHY', assuranceState: 'AVAILABLE', lastCanaryTimestamp: new Date(Date.now() - 1000 * 30).toISOString(), lastCanarySignedHash: 'sha256-2a91fa12...9901', requiredTelemetry: 'DEEP_PACKET', mitreCoverage: ['T1558.003'] },
  { id: 'DET-03', detectorKey: 'c2_beaconing', name: 'Low-Frequency Periodic C2 Beaconing (Malleable)', category: 'Command and Control', state: 'DEGRADED', assuranceState: 'DEGRADED', lastCanaryTimestamp: new Date(Date.now() - 1000 * 45).toISOString(), lastCanarySignedHash: 'sha256-3c78b10e...88ab', degradationReason: 'Canary jitter validation failed due to queue drops on sensor-hq-core-02', requiredTelemetry: 'WIRE_METADATA', mitreCoverage: ['T1071.001'] },
  { id: 'DET-04', detectorKey: 'dns_tunneling', name: 'High-Entropy DNS Subdomain Tunneling', category: 'Exfiltration', state: 'HEALTHY', assuranceState: 'AVAILABLE', lastCanaryTimestamp: new Date(Date.now() - 1000 * 18).toISOString(), lastCanarySignedHash: 'sha256-91b4fa00...7712', requiredTelemetry: 'DEEP_PACKET', mitreCoverage: ['T1071.004', 'T1048'] },
  { id: 'DET-05', detectorKey: 'modbus_command_injection', name: 'OT Industrial Modbus FC Protocol Abnormality', category: 'Impact', state: 'UNAVAILABLE', assuranceState: 'UNAVAILABLE', lastCanaryTimestamp: new Date(Date.now() - 1000 * 3600).toISOString(), lastCanarySignedHash: 'sha256-0000dead...beef', degradationReason: 'No OT Modbus protocol flows provisioned on enterprise HQ segment', requiredTelemetry: 'DEEP_PACKET', mitreCoverage: ['T0855'] },
];

export const complianceFrameworks = [
  { id: 'COMP-SOC2', name: 'SOC 2 Type II (Trust Services Criteria)', controlsEvaluated: 142, controlsPassing: 139, controlsDegraded: 3, complianceScore: 97.8, status: 'DEGRADED', lastAudit: '2026-10-10T12:00:00Z' },
  { id: 'COMP-ISO27001', name: 'ISO/IEC 27001:2022 ISMS Controls', controlsEvaluated: 93, controlsPassing: 93, controlsDegraded: 0, complianceScore: 100.0, status: 'COMPLIANT', lastAudit: '2026-10-11T08:00:00Z' },
  { id: 'COMP-NIS2', name: 'EU NIS 2 Directive Critical Infrastructure', controlsEvaluated: 48, controlsPassing: 45, controlsDegraded: 3, complianceScore: 93.7, status: 'DEGRADED', lastAudit: '2026-10-12T00:00:00Z' },
];

export const integrations = [
  { id: 'INT-DEFENDER', category: 'ENDPOINT_XDR', name: 'Microsoft Defender for Endpoint', vendor: 'Microsoft Defender XDR', status: 'HEALTHY', lastSyncTimestamp: new Date().toISOString(), entitiesCorroborated: 3410, apiCallLatencyMs: 82, healthMessage: 'API webhook streaming nominal, 3410 agents verified' },
  { id: 'INT-CROWDSTRIKE', category: 'ENDPOINT_XDR', name: 'CrowdStrike Falcon Enterprise', vendor: 'CrowdStrike Falcon', status: 'HEALTHY', lastSyncTimestamp: new Date().toISOString(), entitiesCorroborated: 780, apiCallLatencyMs: 94, healthMessage: 'Falcon Streaming API v2 connected' },
  { id: 'INT-SPLUNK', category: 'SIEM_SOAR', name: 'Splunk Enterprise Security HEC', vendor: 'Splunk', status: 'HEALTHY', lastSyncTimestamp: new Date().toISOString(), entitiesCorroborated: 4218, apiCallLatencyMs: 110, healthMessage: 'HEC token verified, event streaming active' },
];

export const auditLogs = [
  { id: 'AUD-901', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), actor: 's.chen@zeroframe.enterprise', actorRole: 'Tier 3 Lead Incident Commander', action: 'ISSUE_EXECUTION_PERMIT', targetResource: 'PERMIT-2026-0041', ipAddress: '10.200.1.42', status: 'SUCCESS', details: 'Dual-control permit issued for isolation of 10.140.2.88', signatureHash: 'sig_f7a2_8841', tenantId: 'tenant-enterprise-hq' },
  { id: 'AUD-900', timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(), actor: 's.chen@zeroframe.enterprise', actorRole: 'Tier 3 Lead Incident Commander', action: 'EXTRACT_TARGETED_PCAP', targetResource: 'PCAP-CAP-0881', ipAddress: '10.200.1.42', status: 'SUCCESS', details: 'Targeted packet capture buffer extracted (14.8 MB)', signatureHash: 'sig_a912_8841', tenantId: 'tenant-enterprise-hq' },
];
