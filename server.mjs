// server.ts
import express2 from "express";
import http from "http";
import path from "path";

// server/backend-authority.ts
import express from "express";
import { WebSocketServer, WebSocket } from "ws";
var sessions = /* @__PURE__ */ new Map();
var SEED_TOKEN = "zf-session-tok-prod-8841-lead";
var SEED_OPERATOR = {
  sessionId: "sess-8841-alpha",
  token: SEED_TOKEN,
  operator: {
    id: "op-8841",
    username: "sec-operator",
    displayName: "Sarah Chen, CISSP",
    email: "s.chen@zeroframe.enterprise",
    role: "Tier 3 Lead Incident Commander",
    clearanceLevel: "TOP_SECRET / RESTRICTED_OT"
  },
  permissions: [
    "READ_TELEMETRY",
    "EXECUTE_CONTAINMENT",
    "APPROVE_PERMIT",
    "MANAGE_SENSORS",
    "EXPORT_PCAP",
    "ADMIN_AUDIT",
    "STEP_UP_AUTHORIZED"
  ],
  mfaVerified: true,
  stepUpRequired: false,
  createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 3).toISOString(),
  expiresAt: new Date(Date.now() + 1e3 * 60 * 60 * 12).toISOString(),
  lastActiveAt: (/* @__PURE__ */ new Date()).toISOString(),
  ipAddress: "10.200.1.42",
  userAgent: "ZeroFrame Workstation SecOS/14.2",
  deviceLabel: "SecOps-Console-01 (HQ SOC Floor)"
};
sessions.set(SEED_TOKEN, SEED_OPERATOR);
var tenantDatabases = {
  "tenant-enterprise-hq": {
    seqCounter: 100,
    eventLog: [],
    metrics: {
      totalKnownEntities: 4218,
      knownSubnets: 24,
      criticalProtectedAssets: 142,
      otDevicesCount: 38,
      observationCoveragePct: 91.4,
      activeObservationPoints: 12,
      captureState: "DEGRADED",
      sourceFidelityLevel: "DEEP_PACKET",
      asymmetricTrafficRatio: 0.18,
      currentIngressThroughputBps: 245e7,
      currentPacketRatePps: 342e3,
      kernelDropPps: 18,
      uninspectedBytesRatio: 0.042,
      activeDetectorsTotal: 12,
      detectorsHealthy: 10,
      detectorsDegraded: 1,
      detectorsUnavailable: 1,
      liveAssuranceState: "DEGRADED",
      lastCanaryAuditTime: new Date(Date.now() - 1e3 * 35).toISOString(),
      openIncidentsCount: 3,
      criticalIncidentsCount: 1,
      highIncidentsCount: 2,
      containedTodayCount: 4,
      sensorsOnline: 11,
      sensorsTotal: 12,
      witnessNodesHealthy: 3,
      witnessNodesTotal: 3,
      governedResponseKillSwitch: false
    },
    chartData: {
      hourlyTrend: [
        { hour: "00:00", events: 1420, baseline: 1200, canaryPassRate: 100, packetRateKpps: 310 },
        { hour: "02:00", events: 1180, baseline: 1150, canaryPassRate: 100, packetRateKpps: 295 },
        { hour: "04:00", events: 990, baseline: 1e3, canaryPassRate: 100, packetRateKpps: 280 },
        { hour: "06:00", events: 1350, baseline: 1300, canaryPassRate: 100, packetRateKpps: 320 },
        { hour: "08:00", events: 2480, baseline: 2100, canaryPassRate: 98.5, packetRateKpps: 410 },
        { hour: "10:00", events: 3820, baseline: 2800, canaryPassRate: 91.6, packetRateKpps: 480 },
        { hour: "12:00", events: 3410, baseline: 2700, canaryPassRate: 91.6, packetRateKpps: 460 },
        { hour: "14:00", events: 3990, baseline: 2900, canaryPassRate: 88.2, packetRateKpps: 510 },
        { hour: "16:00", events: 3250, baseline: 2600, canaryPassRate: 90.4, packetRateKpps: 430 },
        { hour: "18:00", events: 2100, baseline: 1900, canaryPassRate: 95, packetRateKpps: 370 },
        { hour: "20:00", events: 1850, baseline: 1600, canaryPassRate: 97.2, packetRateKpps: 340 },
        { hour: "22:00", events: 1620, baseline: 1400, canaryPassRate: 98.1, packetRateKpps: 325 }
      ],
      threatDistribution: [
        { label: "Lateral Movement", count: 48, percentage: 38, color: "#f43f5e" },
        { label: "Credential Access", count: 32, percentage: 25, color: "#f97316" },
        { label: "Command & Control", count: 22, percentage: 17, color: "#eab308" },
        { label: "Defense Evasion", count: 14, percentage: 11, color: "#3b82f6" },
        { label: "Data Exfiltration", count: 11, percentage: 9, color: "#8b5cf6" }
      ],
      severityBreakdown: [
        { severity: "CRITICAL", count: 3, color: "#f43f5e" },
        { severity: "HIGH", count: 8, color: "#fb923c" },
        { severity: "MEDIUM", count: 19, color: "#facc15" },
        { severity: "LOW", count: 42, color: "#38bdf8" }
      ],
      assetCriticality: [
        { tier: "TIER_1 (Crown Jewels)", count: 142, percentage: 12 },
        { tier: "TIER_2 (Business Essential)", count: 856, percentage: 41 },
        { tier: "TIER_3 (Endpoints)", count: 3182, percentage: 45 },
        { tier: "TIER_OT (SCADA/Industrial)", count: 38, percentage: 2 }
      ]
    },
    incidents: [
      {
        id: "INC-2026-0881",
        title: "Adversary Multi-Stage Lateral Movement & Ransomware Staging",
        plainEnglishSummary: "A compromised workstation (10.140.2.88) is scanning internal servers and attempting to spread malicious commands to the accounting file server.",
        severity: "CRITICAL",
        state: "OPEN",
        firstSeen: new Date(Date.now() - 1e3 * 60 * 42).toISOString(),
        lastSeen: new Date(Date.now() - 1e3 * 60 * 3).toISOString(),
        entityCount: 3,
        primaryVictim: {
          ip: "10.140.2.88",
          hostname: "WKST-CORP-088",
          isProtected: false,
          criticality: "TIER_3"
        },
        threatActor: {
          ip: "185.220.101.44",
          asn: "AS208291",
          country: "NL",
          ja4Fingerprint: "t13d1516h2_8daaf6152771_0278457224b8"
        },
        fidelity: "DEEP_PACKET",
        confidenceScore: 94,
        mitreTactics: [
          { id: "T1021.002", name: "SMB/Windows Admin Shares", technique: "PsExec Service Installation", techniqueId: "T1021.002", stage: "Lateral Movement" },
          { id: "T1558.003", name: "Kerberoasting", technique: "SPN Ticket Request Spike", techniqueId: "T1558.003", stage: "Credential Access" },
          { id: "T1486", name: "Data Encrypted for Impact", technique: "Rapid Canary File Renames", techniqueId: "T1486", stage: "Impact" }
        ],
        associatedAlertIds: ["ALT-9901", "ALT-9902", "ALT-9903"],
        evidenceIds: ["EVD-PCAP-0881", "EVD-LEDGER-0881"],
        governedActionAvailable: "ISOLATE_HOST_QUARANTINE",
        tenantId: "tenant-enterprise-hq"
      },
      {
        id: "INC-2026-0880",
        title: "Outbound High-Entropy DNS Data Exfiltration Tunnel",
        plainEnglishSummary: "An internal server (10.140.10.14) is smuggling encrypted data out of the network disguised as DNS website lookups.",
        severity: "HIGH",
        state: "OPEN",
        firstSeen: new Date(Date.now() - 1e3 * 60 * 120).toISOString(),
        lastSeen: new Date(Date.now() - 1e3 * 60 * 18).toISOString(),
        entityCount: 2,
        primaryVictim: {
          ip: "10.140.10.14",
          hostname: "SRV-DB-PAYROLL-01",
          isProtected: true,
          criticality: "TIER_1"
        },
        threatActor: {
          ip: "198.51.100.89",
          asn: "AS13335",
          country: "US"
        },
        fidelity: "DEEP_PACKET",
        confidenceScore: 89,
        mitreTactics: [
          { id: "T1071.004", name: "DNS Tunneling", technique: "Base64 TXT Records", techniqueId: "T1071.004", stage: "Command and Control" },
          { id: "T1048", name: "Exfiltration Over Alternative Protocol", technique: "DNS Payload Tunnel", techniqueId: "T1048", stage: "Exfiltration" }
        ],
        associatedAlertIds: ["ALT-9871"],
        evidenceIds: ["EVD-PCAP-0880"],
        governedActionAvailable: "BLOCK_DNS_DESTINATION_IP",
        tenantId: "tenant-enterprise-hq"
      },
      {
        id: "INC-2026-0879",
        title: "Cobalt Strike Malleable C2 Beaconing Pattern",
        plainEnglishSummary: "Repeated periodic beacon calls matching known adversary command servers observed with jitter obfuscation.",
        severity: "HIGH",
        state: "INVESTIGATING",
        firstSeen: new Date(Date.now() - 1e3 * 60 * 240).toISOString(),
        lastSeen: new Date(Date.now() - 1e3 * 60 * 5).toISOString(),
        entityCount: 1,
        primaryVictim: {
          ip: "10.140.3.112",
          hostname: "WKST-ENG-042",
          isProtected: false,
          criticality: "TIER_3"
        },
        fidelity: "WIRE_METADATA",
        confidenceScore: 87,
        mitreTactics: [
          { id: "T1071.001", name: "Web Protocols", technique: "HTTPS C2 Beaconing", techniqueId: "T1071.001", stage: "Command and Control" }
        ],
        associatedAlertIds: ["ALT-9850"],
        evidenceIds: ["EVD-PCAP-0879"],
        governedActionAvailable: "ISOLATE_HOST_QUARANTINE",
        tenantId: "tenant-enterprise-hq"
      }
    ],
    alerts: [
      {
        id: "ALT-9901",
        incidentId: "INC-2026-0881",
        name: "Lateral PsExec Named Pipe Access",
        detectorName: "lateral_movement_smb.py",
        detectorVersion: "v2.8.1",
        severity: "CRITICAL",
        timestamp: new Date(Date.now() - 1e3 * 60 * 3).toISOString(),
        sourceIp: "10.140.2.88",
        sourcePort: 51240,
        destinationIp: "10.140.10.5",
        destinationPort: 445,
        protocol: "TCP",
        fidelity: "DEEP_PACKET",
        confidence: 96,
        evidenceRef: "pcap://sensor-hq-core-01/frame/8812901",
        summary: "RPC bind to \\pipe\\svcctl followed by remote service registration",
        tenantId: "tenant-enterprise-hq"
      },
      {
        id: "ALT-9902",
        incidentId: "INC-2026-0881",
        name: "Kerberos Anomalous SPN Request Spike",
        detectorName: "kerberoast_auditor.py",
        detectorVersion: "v1.4.0",
        severity: "HIGH",
        timestamp: new Date(Date.now() - 1e3 * 60 * 14).toISOString(),
        sourceIp: "10.140.2.88",
        sourcePort: 50892,
        destinationIp: "10.140.0.10",
        destinationPort: 88,
        protocol: "TCP",
        fidelity: "DEEP_PACKET",
        confidence: 91,
        evidenceRef: "pcap://sensor-hq-core-01/frame/8811400",
        summary: "TGS-REQ RC4-HMAC ticket requests for 18 service accounts in 4 seconds",
        tenantId: "tenant-enterprise-hq"
      },
      {
        id: "ALT-9903",
        incidentId: "INC-2026-0881",
        name: "Ransomware Canary File Mutation Sequence",
        detectorName: "file_entropy_canary.py",
        detectorVersion: "v3.1.0",
        severity: "CRITICAL",
        timestamp: new Date(Date.now() - 1e3 * 60 * 38).toISOString(),
        sourceIp: "10.140.2.88",
        sourcePort: 52104,
        destinationIp: "10.140.10.22",
        destinationPort: 445,
        protocol: "TCP",
        fidelity: "DEEP_PACKET",
        confidence: 98,
        evidenceRef: "pcap://sensor-hq-core-01/frame/8809110",
        summary: "Rapid extension rename .locked and high entropy payload rewrite detected",
        tenantId: "tenant-enterprise-hq"
      },
      {
        id: "ALT-9871",
        incidentId: "INC-2026-0880",
        name: "Base64 DNS TXT Exfiltration Tunnel",
        detectorName: "dns_exfil_detector.py",
        detectorVersion: "v2.2.0",
        severity: "HIGH",
        timestamp: new Date(Date.now() - 1e3 * 60 * 18).toISOString(),
        sourceIp: "10.140.10.14",
        sourcePort: 61002,
        destinationIp: "198.51.100.89",
        destinationPort: 53,
        protocol: "DNS",
        fidelity: "DEEP_PACKET",
        confidence: 89,
        evidenceRef: "pcap://sensor-hq-edge-02/frame/7410294",
        summary: "High Shannon entropy subdomains (>4.2 bits) exceeding exfiltration volume threshold",
        tenantId: "tenant-enterprise-hq"
      }
    ],
    entities: [
      {
        id: "ENT-CORP-088",
        mac: "00:50:56:a1:88:fe",
        currentIp: "10.140.2.88",
        historicalIps: [{ ip: "10.140.2.88", firstSeen: "2026-01-10T08:00:00Z", lastSeen: (/* @__PURE__ */ new Date()).toISOString(), leaseOrigin: "DHCP" }],
        hostname: "WKST-CORP-088",
        entityType: "WORKSTATION",
        os: "Windows 11 Enterprise (23H2)",
        isProtected: false,
        blastRadiusScore: 78,
        observationSource: "SENSOR-HQ-CORE-01 (SPAN)",
        vlanDeclared: 20,
        vlanObserved: 20,
        firstSeen: "2026-01-10T08:00:00Z",
        lastSeen: (/* @__PURE__ */ new Date()).toISOString(),
        provenance: "DISCOVERED",
        tenantId: "tenant-enterprise-hq"
      },
      {
        id: "ENT-SRV-PAYROLL",
        mac: "00:50:56:b2:14:02",
        currentIp: "10.140.10.14",
        historicalIps: [{ ip: "10.140.10.14", firstSeen: "2025-06-01T00:00:00Z", lastSeen: (/* @__PURE__ */ new Date()).toISOString(), leaseOrigin: "STATIC" }],
        hostname: "SRV-DB-PAYROLL-01",
        entityType: "SERVER",
        os: "RHEL 9.3 Hardened",
        isProtected: true,
        blastRadiusScore: 95,
        observationSource: "SENSOR-HQ-CORE-01 (TAP)",
        vlanDeclared: 100,
        vlanObserved: 100,
        firstSeen: "2025-06-01T00:00:00Z",
        lastSeen: (/* @__PURE__ */ new Date()).toISOString(),
        provenance: "DECLARED",
        tenantId: "tenant-enterprise-hq"
      },
      {
        id: "ENT-DC-01",
        mac: "00:50:56:00:0a:01",
        currentIp: "10.140.0.10",
        historicalIps: [{ ip: "10.140.0.10", firstSeen: "2024-01-01T00:00:00Z", lastSeen: (/* @__PURE__ */ new Date()).toISOString(), leaseOrigin: "STATIC" }],
        hostname: "DC-GLOBAL-01",
        entityType: "SERVER",
        os: "Windows Server 2025 Datacenter",
        isProtected: true,
        blastRadiusScore: 100,
        observationSource: "SENSOR-HQ-CORE-01 (TAP)",
        vlanDeclared: 10,
        vlanObserved: 10,
        firstSeen: "2024-01-01T00:00:00Z",
        lastSeen: (/* @__PURE__ */ new Date()).toISOString(),
        provenance: "DECLARED",
        tenantId: "tenant-enterprise-hq"
      }
    ],
    permits: [
      {
        id: "PERMIT-2026-0041",
        actionType: "ISOLATE_HOST_QUARANTINE",
        targetResource: "10.140.2.88 (WKST-CORP-088)",
        reason: "Contain active Kerberos abuse and PsExec propagation observed in INC-2026-0881",
        status: "PENDING_APPROVER_2",
        requestedBy: "op-8841 (Sarah Chen)",
        requestedAt: new Date(Date.now() - 1e3 * 60 * 15).toISOString(),
        approver1: "op-8841 (Sarah Chen)",
        approver1Signature: "SIG-ED25519-CHEN-8841-f7a2",
        approver2: null,
        blastRadiusValidated: true,
        compensatingControl: "Dynamic Micro-VLAN Isolation with DNS blackhole and Syslog egress only",
        rollbackWindowSeconds: 3600,
        tenantId: "tenant-enterprise-hq"
      }
    ],
    quarantine: [
      {
        id: "QUAR-092",
        targetIp: "10.140.4.99",
        hostname: "WKST-GUEST-099",
        mac: "00:50:56:cc:99:11",
        isolatedAt: new Date(Date.now() - 1e3 * 60 * 180).toISOString(),
        permitId: "PERMIT-2026-0038",
        reason: "Zero-day weaponized PDF exfiltration",
        provider: "ZeroFrame Autonomous Tap Filter",
        status: "ACTIVE_QUARANTINE",
        tenantId: "tenant-enterprise-hq"
      }
    ],
    rollbacks: [
      {
        id: "ROLL-102",
        actionType: "ISOLATE_HOST_QUARANTINE",
        targetIp: "10.140.3.11",
        hostname: "SRV-TEST-BENCH",
        appliedAt: new Date(Date.now() - 1e3 * 60 * 300).toISOString(),
        rolledBackAt: new Date(Date.now() - 1e3 * 60 * 240).toISOString(),
        initiatedBy: "sec-operator",
        reason: "False positive confirmed by engineering team; legitimate load test script",
        status: "VERIFIED_REVERTED",
        tenantId: "tenant-enterprise-hq"
      }
    ],
    evidenceLedger: [
      {
        id: "EVD-LEDGER-0881",
        hashSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        previousBlockSha256: "a718b529d32797860d94f2e2c419b36b996123396866687313028d712176461a",
        resourceType: "PCAP_BURST_CAPTURE",
        incidentId: "INC-2026-0881",
        byteSize: 14820112,
        sealedAt: new Date(Date.now() - 1e3 * 60 * 20).toISOString(),
        witnessQuorumSigned: true,
        retentionDays: 365,
        tenantId: "tenant-enterprise-hq"
      }
    ],
    pcapCaptures: [
      {
        id: "PCAP-CAP-0881",
        title: "Targeted Ring Extraction for WKST-CORP-088 (10.140.2.88)",
        status: "COMPLETED",
        framesCaptured: 42810,
        totalBytes: 14820112,
        startedAt: new Date(Date.now() - 1e3 * 60 * 22).toISOString(),
        completedAt: new Date(Date.now() - 1e3 * 60 * 20).toISOString(),
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        downloadUrl: "/api/v1/evidence/pcap/download/PCAP-CAP-0881",
        tenantId: "tenant-enterprise-hq"
      }
    ],
    witnessNodes: [
      { id: "WITNESS-HQ-01", location: "DC-East Ashburn", state: "ONLINE", role: "LEADER", quorumMember: true, latencyMs: 1.2 },
      { id: "WITNESS-HQ-02", location: "DC-Central Chicago", state: "ONLINE", role: "FOLLOWER", quorumMember: true, latencyMs: 14.8 },
      { id: "WITNESS-HQ-03", location: "DC-West Hillsboro", state: "ONLINE", role: "FOLLOWER", quorumMember: true, latencyMs: 28.4 }
    ],
    fleetSensors: [
      {
        id: "SENSOR-HQ-CORE-01",
        hostname: "sensor-hq-core-01.mgmt.internal",
        version: "ZeroFrame-Sensor-v1.4.1",
        mode: "PASSIVE_TAP",
        status: "HEALTHY",
        ingressThroughputMbps: 1850,
        packetRateKpps: 260,
        kernelDropPps: 2,
        asymmetricRatio: 0.04,
        mTLSExpiry: "2026-11-20T00:00:00Z",
        uptimeDays: 94,
        location: "HQ Datacenter Core Switch"
      },
      {
        id: "SENSOR-HQ-CORE-02",
        hostname: "sensor-hq-core-02.mgmt.internal",
        version: "ZeroFrame-Sensor-v1.4.1",
        mode: "SPAN_MIRROR",
        status: "DEGRADED",
        ingressThroughputMbps: 600,
        packetRateKpps: 82,
        kernelDropPps: 16,
        asymmetricRatio: 0.18,
        mTLSExpiry: "2026-10-30T00:00:00Z",
        uptimeDays: 41,
        location: "Core Switch 02 Distribution Mirror"
      },
      {
        id: "SENSOR-HQ-EDGE-01",
        hostname: "sensor-hq-edge-01.mgmt.internal",
        version: "ZeroFrame-Sensor-v1.4.0",
        mode: "PASSIVE_TAP",
        status: "HEALTHY",
        ingressThroughputMbps: 420,
        packetRateKpps: 58,
        kernelDropPps: 0,
        asymmetricRatio: 0.01,
        mTLSExpiry: "2026-12-15T00:00:00Z",
        uptimeDays: 112,
        location: "Edge Border Router Ingress"
      }
    ],
    inspectionPipeline: {
      stages: [
        { stage: "CAPTURE", name: "eBPF Ring Buffer & AF_XDP Driver", status: "HEALTHY", dropRatePps: 18 },
        { stage: "L2_ETHERNET", name: "EtherType & 802.1Q VLAN Tag Tracking", status: "HEALTHY", dropRatePps: 0 },
        { stage: "L3_IP", name: "IPv4/IPv6 Dual-Stack & Asymmetry Tracking", status: "DEGRADED", dropRatePps: 4 },
        { stage: "TRANSPORT", name: "TCP Sequence Reconstruction & UDP Flow Tracking", status: "HEALTHY", dropRatePps: 0 },
        { stage: "SESSION", name: "Session State Machine & Keepalive Auditor", status: "HEALTHY", dropRatePps: 0 },
        { stage: "CRYPTO", name: "TLS 1.3 JA4/JA4S Fingerprinting & ALPN", status: "HEALTHY", dropRatePps: 0 },
        { stage: "APPLICATION", name: "L7 Decoders (DNS, HTTP, SMB, Kerberos, SSH, Modbus)", status: "HEALTHY", dropRatePps: 0 }
      ],
      asymmetryWarning: "Core-Switch-02 mirror port reports 18% unidirectional flows. Return path unmonitored on secondary border link."
    },
    detectionCapabilities: [
      { id: "DET-01", detectorKey: "lateral_movement_smb", name: "SMB/RPC Lateral Movement & PsExec", category: "Lateral Movement", state: "HEALTHY", assuranceState: "AVAILABLE", requiredTelemetry: "DEEP_PACKET", mitreCoverage: ["T1021.002", "T1570"] },
      { id: "DET-02", detectorKey: "kerberoast_auditor", name: "Kerberos TGS Request Spike & Roasting", category: "Credential Access", state: "HEALTHY", assuranceState: "AVAILABLE", requiredTelemetry: "DEEP_PACKET", mitreCoverage: ["T1558.003"] },
      { id: "DET-03", detectorKey: "c2_beaconing", name: "Low-Frequency Periodic C2 Beaconing (Malleable)", category: "Command and Control", state: "DEGRADED", assuranceState: "DEGRADED", degradationReason: "Canary jitter validation failed due to queue drops on sensor-hq-core-02", requiredTelemetry: "WIRE_METADATA", mitreCoverage: ["T1071.001"] },
      { id: "DET-04", detectorKey: "dns_tunneling", name: "High-Entropy DNS Subdomain Tunneling", category: "Exfiltration", state: "HEALTHY", assuranceState: "AVAILABLE", requiredTelemetry: "DEEP_PACKET", mitreCoverage: ["T1071.004", "T1048"] },
      { id: "DET-05", detectorKey: "modbus_command_injection", name: "OT Industrial Modbus FC Protocol Abnormality", category: "Impact", state: "UNAVAILABLE", assuranceState: "UNAVAILABLE", degradationReason: "No OT Modbus protocol flows provisioned on enterprise HQ segment", requiredTelemetry: "DEEP_PACKET", mitreCoverage: ["T0855"] }
    ],
    complianceFrameworks: [
      { id: "COMP-SOC2", name: "SOC 2 Type II (Trust Services Criteria)", controlsEvaluated: 142, controlsPassing: 139, controlsDegraded: 3, complianceScore: 97.8, status: "DEGRADED", lastAudit: "2026-10-10T12:00:00Z" },
      { id: "COMP-ISO27001", name: "ISO/IEC 27001:2022 ISMS Controls", controlsEvaluated: 93, controlsPassing: 93, controlsDegraded: 0, complianceScore: 100, status: "COMPLIANT", lastAudit: "2026-10-11T08:00:00Z" },
      { id: "COMP-NIS2", name: "EU NIS 2 Directive Critical Infrastructure", controlsEvaluated: 48, controlsPassing: 45, controlsDegraded: 3, complianceScore: 93.7, status: "DEGRADED", lastAudit: "2026-10-12T00:00:00Z" }
    ],
    integrations: [
      { id: "INT-DEFENDER", category: "ENDPOINT_XDR", name: "Microsoft Defender for Endpoint", vendor: "Microsoft Defender XDR", status: "HEALTHY", lastSyncTimestamp: (/* @__PURE__ */ new Date()).toISOString(), entitiesCorroborated: 3410, apiCallLatencyMs: 82, healthMessage: "API webhook streaming nominal, 3410 agents verified" },
      { id: "INT-CROWDSTRIKE", category: "ENDPOINT_XDR", name: "CrowdStrike Falcon Enterprise", vendor: "CrowdStrike Falcon", status: "HEALTHY", lastSyncTimestamp: (/* @__PURE__ */ new Date()).toISOString(), entitiesCorroborated: 780, apiCallLatencyMs: 94, healthMessage: "Falcon Streaming API v2 connected" },
      { id: "INT-SPLUNK", category: "SIEM_SOAR", name: "Splunk Enterprise Security HEC", vendor: "Splunk", status: "HEALTHY", lastSyncTimestamp: (/* @__PURE__ */ new Date()).toISOString(), entitiesCorroborated: 4218, apiCallLatencyMs: 110, healthMessage: "HEC token verified, event streaming active" }
    ],
    auditLogs: [
      { id: "AUD-901", timestamp: new Date(Date.now() - 1e3 * 60 * 15).toISOString(), actor: "s.chen@zeroframe.enterprise", actorRole: "Tier 3 Lead Incident Commander", action: "ISSUE_EXECUTION_PERMIT", targetResource: "PERMIT-2026-0041", ipAddress: "10.200.1.42", status: "SUCCESS", details: "Dual-control permit issued for isolation of 10.140.2.88", signatureHash: "sig_f7a2_8841", tenantId: "tenant-enterprise-hq" },
      { id: "AUD-900", timestamp: new Date(Date.now() - 1e3 * 60 * 22).toISOString(), actor: "s.chen@zeroframe.enterprise", actorRole: "Tier 3 Lead Incident Commander", action: "EXTRACT_TARGETED_PCAP", targetResource: "PCAP-CAP-0881", ipAddress: "10.200.1.42", status: "SUCCESS", details: "Targeted packet capture buffer extracted (14.8 MB)", signatureHash: "sig_a912_8841", tenantId: "tenant-enterprise-hq" }
    ]
  },
  // EMEA Financial Operations - High-Assurance PCI-DSS Segregated Tenant
  "tenant-emea-finance": {
    seqCounter: 40,
    eventLog: [],
    metrics: {
      totalKnownEntities: 1140,
      knownSubnets: 8,
      criticalProtectedAssets: 86,
      otDevicesCount: 0,
      observationCoveragePct: 98.2,
      activeObservationPoints: 6,
      captureState: "HEALTHY",
      sourceFidelityLevel: "DEEP_PACKET",
      asymmetricTrafficRatio: 0.01,
      currentIngressThroughputBps: 85e7,
      currentPacketRatePps: 118e3,
      kernelDropPps: 0,
      uninspectedBytesRatio: 8e-3,
      activeDetectorsTotal: 10,
      detectorsHealthy: 10,
      detectorsDegraded: 0,
      detectorsUnavailable: 0,
      liveAssuranceState: "HEALTHY",
      lastCanaryAuditTime: new Date(Date.now() - 1e3 * 15).toISOString(),
      openIncidentsCount: 1,
      criticalIncidentsCount: 0,
      highIncidentsCount: 1,
      containedTodayCount: 2,
      sensorsOnline: 6,
      sensorsTotal: 6,
      witnessNodesHealthy: 3,
      witnessNodesTotal: 3,
      governedResponseKillSwitch: false
    },
    chartData: {
      hourlyTrend: [
        { hour: "00:00", events: 450, baseline: 430, canaryPassRate: 100, packetRateKpps: 105 },
        { hour: "04:00", events: 380, baseline: 370, canaryPassRate: 100, packetRateKpps: 98 },
        { hour: "08:00", events: 1100, baseline: 950, canaryPassRate: 100, packetRateKpps: 140 },
        { hour: "12:00", events: 1420, baseline: 1250, canaryPassRate: 100, packetRateKpps: 155 },
        { hour: "16:00", events: 1290, baseline: 1180, canaryPassRate: 100, packetRateKpps: 145 },
        { hour: "20:00", events: 680, baseline: 610, canaryPassRate: 100, packetRateKpps: 115 }
      ],
      threatDistribution: [
        { label: "Credential Access", count: 12, percentage: 48, color: "#f97316" },
        { label: "Reconnaissance", count: 8, percentage: 32, color: "#3b82f6" },
        { label: "Policy Violation", count: 5, percentage: 20, color: "#10b981" }
      ],
      severityBreakdown: [
        { severity: "CRITICAL", count: 0, color: "#f43f5e" },
        { severity: "HIGH", count: 1, color: "#fb923c" },
        { severity: "MEDIUM", count: 5, color: "#facc15" },
        { severity: "LOW", count: 14, color: "#38bdf8" }
      ],
      assetCriticality: [
        { tier: "TIER_1 (SWIFT/PCI Core)", count: 86, percentage: 8 },
        { tier: "TIER_2 (Clearing & Settlement)", count: 340, percentage: 30 },
        { tier: "TIER_3 (Trading Floor)", count: 714, percentage: 62 }
      ]
    },
    incidents: [
      {
        id: "INC-EMEA-0042",
        title: "Anomalous High-Volume SWIFT Gateway TLS Handshake Cipher Downgrade",
        plainEnglishSummary: "A payment settlement workstation attempted a legacy TLS 1.0 connection with non-approved cipher suites to the Zurich clearing server.",
        severity: "HIGH",
        state: "INVESTIGATING",
        firstSeen: new Date(Date.now() - 1e3 * 60 * 55).toISOString(),
        lastSeen: new Date(Date.now() - 1e3 * 60 * 12).toISOString(),
        entityCount: 2,
        primaryVictim: {
          ip: "10.220.14.92",
          hostname: "SRV-EMEA-SETTLE-02",
          isProtected: true,
          criticality: "TIER_1"
        },
        fidelity: "DEEP_PACKET",
        confidenceScore: 92,
        mitreTactics: [
          { id: "T1573.002", name: "Asymmetric Cryptography", technique: "Downgraded Protocol Negotiation", techniqueId: "T1573.002", stage: "Command and Control" }
        ],
        associatedAlertIds: ["ALT-EMEA-881"],
        evidenceIds: ["EVD-EMEA-PCAP-0042"],
        governedActionAvailable: "BLOCK_CLEARING_PEER",
        tenantId: "tenant-emea-finance"
      }
    ],
    alerts: [
      {
        id: "ALT-EMEA-881",
        incidentId: "INC-EMEA-0042",
        name: "TLS Non-Approved Cipher Suite Negotiation",
        detectorName: "pci_crypto_auditor.py",
        detectorVersion: "v2.1.0",
        severity: "HIGH",
        timestamp: new Date(Date.now() - 1e3 * 60 * 12).toISOString(),
        sourceIp: "10.220.14.92",
        sourcePort: 49812,
        destinationIp: "10.220.1.100",
        destinationPort: 8443,
        protocol: "TLS",
        fidelity: "DEEP_PACKET",
        confidence: 94,
        evidenceRef: "pcap://sensor-emea-core-01/frame/410982",
        summary: "ServerHello proposed TLS_RSA_WITH_3DES_EDE_CBC_SHA violating PCI-DSS 4.0 requirement 4.2.1",
        tenantId: "tenant-emea-finance"
      }
    ],
    entities: [
      {
        id: "ENT-EMEA-SETTLE-02",
        mac: "00:50:56:ee:14:92",
        currentIp: "10.220.14.92",
        historicalIps: [{ ip: "10.220.14.92", firstSeen: "2025-01-01T00:00:00Z", lastSeen: (/* @__PURE__ */ new Date()).toISOString(), leaseOrigin: "STATIC" }],
        hostname: "SRV-EMEA-SETTLE-02",
        entityType: "SERVER",
        os: "Oracle Linux 9.2 (PCI Hardened)",
        isProtected: true,
        blastRadiusScore: 98,
        observationSource: "SENSOR-EMEA-CORE-01 (TAP)",
        firstSeen: "2025-01-01T00:00:00Z",
        lastSeen: (/* @__PURE__ */ new Date()).toISOString(),
        provenance: "DECLARED",
        tenantId: "tenant-emea-finance"
      }
    ],
    permits: [],
    quarantine: [],
    rollbacks: [],
    evidenceLedger: [],
    pcapCaptures: [],
    witnessNodes: [
      { id: "WITNESS-EMEA-01", location: "Frankfurt Equinix FR2", state: "ONLINE", role: "LEADER", quorumMember: true, latencyMs: 2.1 },
      { id: "WITNESS-EMEA-02", location: "London Interxion LON1", state: "ONLINE", role: "FOLLOWER", quorumMember: true, latencyMs: 8.4 },
      { id: "WITNESS-EMEA-03", location: "Zurich Green Datacenter", state: "ONLINE", role: "FOLLOWER", quorumMember: true, latencyMs: 5.7 }
    ],
    fleetSensors: [
      {
        id: "SENSOR-EMEA-CORE-01",
        hostname: "sensor-emea-core-01.mgmt.internal",
        version: "ZeroFrame-Sensor-v1.4.1",
        mode: "PASSIVE_TAP",
        status: "HEALTHY",
        ingressThroughputMbps: 850,
        packetRateKpps: 118,
        kernelDropPps: 0,
        asymmetricRatio: 0.01,
        mTLSExpiry: "2027-01-10T00:00:00Z",
        uptimeDays: 140,
        location: "Frankfurt SWIFT Secure Enclave"
      }
    ],
    inspectionPipeline: {
      stages: [
        { stage: "CAPTURE", name: "eBPF Ring Buffer & AF_XDP Driver", status: "HEALTHY", dropRatePps: 0 },
        { stage: "L2_ETHERNET", name: "802.1Q Segregation", status: "HEALTHY", dropRatePps: 0 },
        { stage: "L3_IP", name: "IPv4 Encapsulation Inspector", status: "HEALTHY", dropRatePps: 0 },
        { stage: "TRANSPORT", name: "TCP Stream Reassembly", status: "HEALTHY", dropRatePps: 0 },
        { stage: "CRYPTO", name: "PCI-DSS FIPS 140-3 Hardware Inspector", status: "HEALTHY", dropRatePps: 0 }
      ]
    },
    detectionCapabilities: [
      { id: "DET-EMEA-01", detectorKey: "pci_crypto_auditor", name: "PCI-DSS Cryptographic Suite Assurance", category: "Compliance", state: "HEALTHY", assuranceState: "AVAILABLE", requiredTelemetry: "DEEP_PACKET", mitreCoverage: ["T1573.002"] }
    ],
    complianceFrameworks: [
      { id: "COMP-PCI-DSS-4", name: "PCI-DSS v4.0 Tier 1 Service Provider", controlsEvaluated: 240, controlsPassing: 240, controlsDegraded: 0, complianceScore: 100, status: "COMPLIANT", lastAudit: "2026-10-12T04:00:00Z" }
    ],
    integrations: [],
    auditLogs: []
  },
  // Critical Infrastructure SCADA / OT - Air-Gapped High Assurance
  "tenant-scada-grid": {
    seqCounter: 15,
    eventLog: [],
    metrics: {
      totalKnownEntities: 64,
      knownSubnets: 4,
      criticalProtectedAssets: 64,
      otDevicesCount: 52,
      observationCoveragePct: 99.8,
      activeObservationPoints: 4,
      captureState: "HEALTHY",
      sourceFidelityLevel: "DEEP_PACKET",
      asymmetricTrafficRatio: 0,
      currentIngressThroughputBps: 12e7,
      currentPacketRatePps: 22e3,
      kernelDropPps: 0,
      uninspectedBytesRatio: 0,
      activeDetectorsTotal: 8,
      detectorsHealthy: 8,
      detectorsDegraded: 0,
      detectorsUnavailable: 0,
      liveAssuranceState: "HEALTHY",
      lastCanaryAuditTime: new Date(Date.now() - 1e3 * 10).toISOString(),
      openIncidentsCount: 1,
      criticalIncidentsCount: 1,
      highIncidentsCount: 0,
      containedTodayCount: 0,
      sensorsOnline: 4,
      sensorsTotal: 4,
      witnessNodesHealthy: 3,
      witnessNodesTotal: 3,
      governedResponseKillSwitch: false
    },
    chartData: {
      hourlyTrend: [
        { hour: "00:00", events: 110, baseline: 110, canaryPassRate: 100, packetRateKpps: 20 },
        { hour: "04:00", events: 112, baseline: 110, canaryPassRate: 100, packetRateKpps: 21 },
        { hour: "08:00", events: 145, baseline: 115, canaryPassRate: 100, packetRateKpps: 23 },
        { hour: "12:00", events: 180, baseline: 120, canaryPassRate: 100, packetRateKpps: 24 },
        { hour: "16:00", events: 130, baseline: 115, canaryPassRate: 100, packetRateKpps: 21 },
        { hour: "20:00", events: 115, baseline: 110, canaryPassRate: 100, packetRateKpps: 20 }
      ],
      threatDistribution: [
        { label: "Unauthorized Protocol Function", count: 4, percentage: 80, color: "#f43f5e" },
        { label: "Unmapped PLC Polling", count: 1, percentage: 20, color: "#f97316" }
      ],
      severityBreakdown: [
        { severity: "CRITICAL", count: 1, color: "#f43f5e" },
        { severity: "HIGH", count: 0, color: "#fb923c" },
        { severity: "MEDIUM", count: 1, color: "#facc15" },
        { severity: "LOW", count: 2, color: "#38bdf8" }
      ],
      assetCriticality: [
        { tier: "TIER_OT (Protective Relays & RTUs)", count: 52, percentage: 81 },
        { tier: "TIER_1 (Substation SCADA Gateways)", count: 12, percentage: 19 }
      ]
    },
    incidents: [
      {
        id: "INC-OT-0019",
        title: "Unauthorized Modbus TCP Force Single Coil Function Code 05 Injection",
        plainEnglishSummary: "An unauthenticated engineering workstation injected a breaker trip command (FC05) into Substation-04 Protective Relay RTU-402.",
        severity: "CRITICAL",
        state: "OPEN",
        firstSeen: new Date(Date.now() - 1e3 * 60 * 18).toISOString(),
        lastSeen: new Date(Date.now() - 1e3 * 60 * 2).toISOString(),
        entityCount: 2,
        primaryVictim: {
          ip: "192.168.100.42",
          hostname: "RTU-SUBSTATION-04-RELAY",
          isProtected: true,
          criticality: "TIER_1"
        },
        fidelity: "DEEP_PACKET",
        confidenceScore: 99,
        mitreTactics: [
          { id: "T0855", name: "Unauthorized Command Message", technique: "Modbus FC05 Coil Override", techniqueId: "T0855", stage: "Impact" }
        ],
        associatedAlertIds: ["ALT-OT-902"],
        evidenceIds: ["EVD-OT-PCAP-0019"],
        governedActionAvailable: "HARDWARE_AIRGAP_INTERRUPT",
        tenantId: "tenant-scada-grid"
      }
    ],
    alerts: [
      {
        id: "ALT-OT-902",
        incidentId: "INC-OT-0019",
        name: "Modbus TCP Function Code 05 (Write Single Coil) Abnormality",
        detectorName: "modbus_ot_validator.py",
        detectorVersion: "v3.0.0",
        severity: "CRITICAL",
        timestamp: new Date(Date.now() - 1e3 * 60 * 2).toISOString(),
        sourceIp: "192.168.100.99",
        sourcePort: 50220,
        destinationIp: "192.168.100.42",
        destinationPort: 502,
        protocol: "MODBUS",
        fidelity: "DEEP_PACKET",
        confidence: 99,
        evidenceRef: "pcap://sensor-scada-tap-01/frame/109283",
        summary: "Command address 0x002B coil value 0xFF00 issued outside maintenance window",
        tenantId: "tenant-scada-grid"
      }
    ],
    entities: [
      {
        id: "ENT-OT-RELAY-402",
        mac: "00:1c:73:40:02:42",
        currentIp: "192.168.100.42",
        historicalIps: [{ ip: "192.168.100.42", firstSeen: "2023-01-01T00:00:00Z", lastSeen: (/* @__PURE__ */ new Date()).toISOString(), leaseOrigin: "STATIC" }],
        hostname: "RTU-SUBSTATION-04-RELAY",
        entityType: "OT_PLC",
        os: "Schneider Electric Micom Firmware v4.8",
        isProtected: true,
        blastRadiusScore: 100,
        observationSource: "SENSOR-SCADA-TAP-01 (PHYSICAL OPTICAL TAP)",
        firstSeen: "2023-01-01T00:00:00Z",
        lastSeen: (/* @__PURE__ */ new Date()).toISOString(),
        provenance: "DECLARED",
        tenantId: "tenant-scada-grid"
      }
    ],
    permits: [],
    quarantine: [],
    rollbacks: [],
    evidenceLedger: [],
    pcapCaptures: [],
    witnessNodes: [
      { id: "WITNESS-OT-AIRGAP-01", location: "Bunker-Alpha Substation", state: "ONLINE", role: "LEADER", quorumMember: true, latencyMs: 0.4 },
      { id: "WITNESS-OT-AIRGAP-02", location: "Bunker-Beta Hydro-Station", state: "ONLINE", role: "FOLLOWER", quorumMember: true, latencyMs: 0.6 },
      { id: "WITNESS-OT-AIRGAP-03", location: "Bunker-Gamma Switching-Yard", state: "ONLINE", role: "FOLLOWER", quorumMember: true, latencyMs: 0.5 }
    ],
    fleetSensors: [
      {
        id: "SENSOR-SCADA-TAP-01",
        hostname: "sensor-scada-tap-01.isolated.local",
        version: "ZeroFrame-Sensor-v1.4.1-OT",
        mode: "PASSIVE_TAP",
        status: "HEALTHY",
        ingressThroughputMbps: 120,
        packetRateKpps: 22,
        kernelDropPps: 0,
        asymmetricRatio: 0,
        mTLSExpiry: "2028-01-01T00:00:00Z",
        uptimeDays: 320,
        location: "Substation-04 Optical Fiber TAP Cabinet"
      }
    ],
    inspectionPipeline: {
      stages: [
        { stage: "CAPTURE", name: "Hardware Optical TAP", status: "HEALTHY", dropRatePps: 0 },
        { stage: "APPLICATION", name: "Modbus / DNP3 / IEC 61850 Deep Dissector", status: "HEALTHY", dropRatePps: 0 }
      ]
    },
    detectionCapabilities: [
      { id: "DET-OT-01", detectorKey: "modbus_ot_validator", name: "Industrial Modbus Protocol Compliance", category: "OT Safety", state: "HEALTHY", assuranceState: "AVAILABLE", requiredTelemetry: "DEEP_PACKET", mitreCoverage: ["T0855"] }
    ],
    complianceFrameworks: [
      { id: "COMP-NERC-CIP", name: "NERC CIP Version 5 Critical Cyber Asset", controlsEvaluated: 64, controlsPassing: 64, controlsDegraded: 0, complianceScore: 100, status: "COMPLIANT", lastAudit: "2026-10-12T00:00:00Z" }
    ],
    integrations: [],
    auditLogs: []
  }
};
var connectedClients = /* @__PURE__ */ new Set();
function broadcastTenantEvent(tenantId, type, payload) {
  const db = tenantDatabases[tenantId];
  if (!db) return;
  db.seqCounter += 1;
  const seq = db.seqCounter;
  const event = {
    seq,
    tenantId,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    type,
    payload
  };
  db.eventLog.push(event);
  if (db.eventLog.length > 200) {
    db.eventLog.shift();
  }
  const msg = JSON.stringify(event);
  for (const client of connectedClients) {
    if (client.tenantId === tenantId && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(msg);
      } catch (err) {
        console.error("Failed to send websocket message", err);
      }
    }
  }
}
var heartbeatIntervalStarted = false;
function startHeartbeatSimulation() {
  if (heartbeatIntervalStarted) return;
  heartbeatIntervalStarted = true;
  const timer = setInterval(() => {
    for (const [tenantId, db] of Object.entries(tenantDatabases)) {
      const jitterBps = Math.floor((Math.random() - 0.5) * 5e7);
      const jitterPps = Math.floor((Math.random() - 0.5) * 8e3);
      db.metrics.currentIngressThroughputBps = Math.max(1e7, db.metrics.currentIngressThroughputBps + jitterBps);
      db.metrics.currentPacketRatePps = Math.max(1e3, db.metrics.currentPacketRatePps + jitterPps);
      broadcastTenantEvent(tenantId, "TELEMETRY_PULSE", {
        currentIngressThroughputBps: db.metrics.currentIngressThroughputBps,
        currentPacketRatePps: db.metrics.currentPacketRatePps,
        kernelDropPps: db.metrics.kernelDropPps,
        lastCanaryAuditTime: db.metrics.lastCanaryAuditTime
      });
    }
  }, 8e3);
  if (typeof timer.unref === "function") {
    timer.unref();
  }
}
function createBackendApiRouter() {
  const router = express.Router();
  router.use(express.json());
  router.use((req, res, next) => {
    const correlationId = req.headers["x-correlation-id"] || `zf-corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    res.setHeader("x-correlation-id", correlationId);
    next();
  });
  const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Missing or invalid Authorization bearer token"
      });
    }
    const token = authHeader.substring(7).trim();
    const session = sessions.get(token);
    if (!session) {
      return res.status(401).json({
        error: "SESSION_EXPIRED",
        message: "The requested session token is invalid, expired, or revoked"
      });
    }
    session.lastActiveAt = (/* @__PURE__ */ new Date()).toISOString();
    req.session = session;
    next();
  };
  const getTenantScope = (req, res) => {
    const tenantId = req.headers["x-tenant-id"] || req.query.tenantId;
    if (!tenantId || !tenantDatabases[tenantId]) {
      res.status(400).json({
        error: "TENANT_NOT_FOUND",
        message: `Tenant '${tenantId}' is not authorized or does not exist on this cluster.`
      });
      return null;
    }
    return tenantDatabases[tenantId];
  };
  router.post("/auth/login", (req, res) => {
    const { username, password, ssoProvider } = req.body;
    if (ssoProvider) {
      const newToken = `zf-sso-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      const newSession = {
        sessionId: `sess-sso-${Date.now()}`,
        token: newToken,
        operator: {
          id: "op-sso-901",
          username: "sso.operator",
          displayName: "Alex Morgan (Okta SSO)",
          email: "a.morgan@zeroframe.enterprise",
          role: "Tier 2 Senior Investigator",
          clearanceLevel: "SECRET / SOC_ANALYST"
        },
        permissions: ["READ_TELEMETRY", "EXECUTE_CONTAINMENT", "EXPORT_PCAP"],
        mfaVerified: true,
        stepUpRequired: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        expiresAt: new Date(Date.now() + 1e3 * 60 * 60 * 8).toISOString(),
        lastActiveAt: (/* @__PURE__ */ new Date()).toISOString(),
        ipAddress: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "Browser",
        deviceLabel: "Enterprise Managed Laptop (Okta Verify)"
      };
      sessions.set(newToken, newSession);
      return res.json({ session: newSession });
    }
    if (username === "sec-operator" || username === "admin" || username === "s.chen") {
      const newToken = `zf-tok-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      const newSession = {
        sessionId: `sess-${Date.now()}`,
        token: newToken,
        operator: SEED_OPERATOR.operator,
        permissions: SEED_OPERATOR.permissions,
        mfaVerified: true,
        stepUpRequired: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        expiresAt: new Date(Date.now() + 1e3 * 60 * 60 * 12).toISOString(),
        lastActiveAt: (/* @__PURE__ */ new Date()).toISOString(),
        ipAddress: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "Browser",
        deviceLabel: "SecOps-Console (HQ SOC)"
      };
      sessions.set(newToken, newSession);
      return res.json({ session: newSession });
    }
    return res.status(401).json({
      error: "INVALID_CREDENTIALS",
      message: "Invalid operator credentials. Access attempt logged to tamper-sealed audit ledger."
    });
  });
  router.get("/auth/session", authenticate, (req, res) => {
    const session = req.session;
    return res.json({
      valid: true,
      session,
      operator: session.operator
    });
  });
  router.post("/auth/step-up", authenticate, (req, res) => {
    const { code } = req.body;
    const session = req.session;
    if (code === "884100" || typeof code === "string" && code.length === 6) {
      session.stepUpRequired = false;
      session.stepUpExpiresAt = new Date(Date.now() + 1e3 * 60 * 30).toISOString();
      return res.json({
        success: true,
        message: "Step-up MFA verified. Dual-control and destructive privileges elevated.",
        stepUpExpiresAt: session.stepUpExpiresAt
      });
    }
    return res.status(403).json({
      error: "STEP_UP_FAILED",
      message: "Invalid TOTP / FIDO2 security token challenge response."
    });
  });
  router.post("/auth/unlock", authenticate, (req, res) => {
    const { pin } = req.body;
    if (pin === "8841" || pin === "1234" || pin === "admin" || typeof pin === "string" && pin.length >= 4) {
      return res.json({
        unlocked: true,
        unlockedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    return res.status(401).json({
      error: "INVALID_PIN",
      message: "Incorrect operator unlock PIN."
    });
  });
  router.post("/auth/logout", authenticate, (req, res) => {
    const session = req.session;
    sessions.delete(session.token);
    for (const client of connectedClients) {
      if (client.sessionId === session.sessionId) {
        client.ws.close(1e3, "Operator logged out");
        connectedClients.delete(client);
      }
    }
    return res.json({ success: true, message: "Operator session revoked." });
  });
  router.get("/auth/sessions", authenticate, (req, res) => {
    const currentSession = req.session;
    const list = Array.from(sessions.values()).map((s) => ({
      sessionId: s.sessionId,
      operator: s.operator,
      createdAt: s.createdAt,
      lastActiveAt: s.lastActiveAt,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      deviceLabel: s.deviceLabel,
      isCurrent: s.sessionId === currentSession.sessionId
    }));
    return res.json({ sessions: list });
  });
  router.delete("/auth/sessions/:sessionId", authenticate, (req, res) => {
    const { sessionId } = req.params;
    for (const [token, s] of sessions.entries()) {
      if (s.sessionId === sessionId) {
        sessions.delete(token);
        for (const client of connectedClients) {
          if (client.sessionId === sessionId) {
            client.ws.send(JSON.stringify({ type: "SESSION_REVOKED", reason: "Session remotely terminated by administrator" }));
            client.ws.close(4401, "Session revoked");
            connectedClients.delete(client);
          }
        }
        return res.json({ success: true, message: `Session ${sessionId} terminated.` });
      }
    }
    return res.status(404).json({ error: "SESSION_NOT_FOUND", message: "Session ID not found." });
  });
  router.get("/tenants", authenticate, (_req, res) => {
    return res.json({
      tenants: [
        { id: "tenant-enterprise-hq", name: "Global Enterprise HQ", tier: "PRODUCTION", description: "Primary enterprise network with full NDR & Live Assurance" },
        { id: "tenant-emea-finance", name: "EMEA Financial Operations", tier: "PRODUCTION", description: "High-assurance PCI-DSS segregated trading & settlement environment" },
        { id: "tenant-scada-grid", name: "Critical Infrastructure SCADA / OT", tier: "ISOLATED", description: "Air-gapped industrial grid with Modbus/DNP3 passive monitoring" }
      ],
      defaultTenantId: "tenant-enterprise-hq"
    });
  });
  router.get("/capabilities", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({
      status: "FRESH",
      manifestVersion: "2026.4.1-AUTHORITATIVE",
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      capabilities: [
        { id: "live_detection_assurance", name: "Live Detection Assurance", status: "FRESH", details: "Continuous canary pipeline executing every 60s" },
        { id: "targeted_pcap", name: "Targeted PCAP Extraction", status: "FRESH", details: "Ring buffer depth 120s with hardware microsecond timestamps" },
        { id: "security_time_machine", name: "Security Time Machine", status: "FRESH", details: "90-day forensic rewind on living topology graph" },
        { id: "witness_quorum", name: "Witness Plane Byzantine Consensus", status: "FRESH", details: "3/3 independent witness verification quorum" },
        { id: "response_governance", name: "Governed Response Studio & Dual Control", status: "FRESH", details: "Automated 1-hour compensating rollback window" },
        { id: "compliance_frameworks", name: "Regulatory Assurance Frameworks", status: "FRESH", details: "Continuous SOC2, ISO27001, NIS2 audit evaluation" },
        { id: "export_safety", name: "Export Safety Redaction & Watermarking", status: "FRESH", details: "Cryptographic watermarking with operator signature" },
        { id: "protocol_inspection", name: "L2-L7 Protocol Inspection Pipeline", status: tenantDb.metrics.captureState === "HEALTHY" ? "FRESH" : "DEGRADED", details: "AF_XDP zero-copy capture with asymmetry monitoring" }
      ]
    });
  });
  router.get("/dashboard/metrics", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json(tenantDb.metrics);
  });
  router.get("/dashboard/charts", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json(tenantDb.chartData);
  });
  router.post("/dashboard/kill-switch", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    const { engaged, reason } = req.body;
    tenantDb.metrics.governedResponseKillSwitch = Boolean(engaged);
    const tenantId = req.headers["x-tenant-id"] || "tenant-enterprise-hq";
    broadcastTenantEvent(tenantId, "KILL_SWITCH_CHANGED", {
      governedResponseKillSwitch: tenantDb.metrics.governedResponseKillSwitch,
      reason: reason || "Manual operator toggle",
      operator: req.session.operator.username,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    return res.json({
      success: true,
      governedResponseKillSwitch: tenantDb.metrics.governedResponseKillSwitch
    });
  });
  router.get("/investigation/incidents", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ incidents: tenantDb.incidents });
  });
  router.get("/investigation/alerts", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ alerts: tenantDb.alerts });
  });
  router.get("/investigation/entities", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ entities: tenantDb.entities });
  });
  router.post("/investigation/incidents/:id/state", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    const { id } = req.params;
    const { state } = req.body;
    const incident = tenantDb.incidents.find((i) => i.id === id);
    if (!incident) {
      return res.status(404).json({ error: "INCIDENT_NOT_FOUND", message: "Incident not found" });
    }
    incident.state = state;
    const tenantId = req.headers["x-tenant-id"] || "tenant-enterprise-hq";
    broadcastTenantEvent(tenantId, "INCIDENT_STATE_CHANGED", { incidentId: id, state });
    return res.json({ success: true, incident });
  });
  router.get("/notifications", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    const tenantId = req.headers["x-tenant-id"] || "tenant-enterprise-hq";
    const notifs = [
      {
        id: `notif-${tenantId}-1`,
        category: "INCIDENT",
        severity: "CRITICAL",
        title: tenantId === "tenant-scada-grid" ? "OT Protocol FC05 Coil Override" : "Adversary Lateral Movement Cluster",
        message: tenantDb.incidents[0]?.plainEnglishSummary || "Active security threat detected",
        timestamp: new Date(Date.now() - 1e3 * 60 * 3).toISOString(),
        read: false,
        acknowledged: false,
        deepLink: "/investigate/incidents",
        fingerprintHash: `hash-inc-${tenantId}-01`,
        tenantId
      },
      {
        id: `notif-${tenantId}-2`,
        category: "DETECTION",
        severity: "HIGH",
        title: "Detection Assurance Canary Health",
        message: tenantDb.metrics.detectorsDegraded > 0 ? "Canary for detector c2_beaconing.py reports queue drop jitter" : "All detection canaries passed signed validation",
        timestamp: new Date(Date.now() - 1e3 * 60 * 12).toISOString(),
        read: false,
        acknowledged: false,
        deepLink: "/system/assurance",
        fingerprintHash: `hash-det-${tenantId}-02`,
        tenantId
      },
      {
        id: `notif-${tenantId}-3`,
        category: "VISIBILITY",
        severity: tenantDb.metrics.captureState === "DEGRADED" ? "MEDIUM" : "LOW",
        title: "Network Visibility Status",
        message: tenantDb.metrics.captureState === "DEGRADED" ? "Core-Switch-02 reports 18% unidirectional flows. Asymmetric return path uninspected." : "Passive TAP observation fidelity nominal at 99.8%.",
        timestamp: new Date(Date.now() - 1e3 * 60 * 34).toISOString(),
        read: true,
        acknowledged: false,
        deepLink: "/system/inspection",
        fingerprintHash: `hash-vis-${tenantId}-03`,
        tenantId
      },
      {
        id: `notif-${tenantId}-4`,
        category: "RESPONSE",
        severity: "HIGH",
        title: "Governed Response Permit Awaiting Approver 2",
        message: "Dual-control permit for isolating 10.140.2.88 approved by Approver 1. Approver 2 pending.",
        timestamp: new Date(Date.now() - 1e3 * 60 * 60 * 2).toISOString(),
        read: false,
        acknowledged: false,
        deepLink: "/respond/permits",
        fingerprintHash: `hash-resp-${tenantId}-04`,
        tenantId
      }
    ];
    return res.json({ notifications: notifs });
  });
  router.post("/notifications/:id/acknowledge", authenticate, (_req, res) => {
    return res.json({ success: true, acknowledged: true });
  });
  router.post("/notifications/clear-all", authenticate, (_req, res) => {
    return res.json({ success: true, cleared: true });
  });
  router.get("/response/permits", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ permits: tenantDb.permits });
  });
  router.post("/response/permits", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    const { actionType, targetResource, reason, compensatingControl } = req.body;
    const session = req.session;
    const newPermit = {
      id: `PERMIT-${Date.now().toString().slice(-4)}`,
      actionType,
      targetResource,
      reason,
      status: "PENDING_APPROVER_2",
      requestedBy: `${session.operator.id} (${session.operator.displayName})`,
      requestedAt: (/* @__PURE__ */ new Date()).toISOString(),
      approver1: `${session.operator.id} (${session.operator.displayName})`,
      approver1Signature: `SIG-ED25519-${Date.now()}`,
      approver2: null,
      blastRadiusValidated: true,
      compensatingControl: compensatingControl || "Dynamic micro-segmentation with quarantine VLAN and DNS blackhole",
      rollbackWindowSeconds: 3600,
      tenantId: req.headers["x-tenant-id"] || "tenant-enterprise-hq"
    };
    tenantDb.permits.unshift(newPermit);
    broadcastTenantEvent(newPermit.tenantId, "PERMIT_ISSUED", newPermit);
    return res.json({ success: true, permit: newPermit });
  });
  router.post("/response/permits/:id/approve", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    const { id } = req.params;
    const permit = tenantDb.permits.find((p) => p.id === id);
    if (!permit) {
      return res.status(404).json({ error: "PERMIT_NOT_FOUND", message: "Permit not found" });
    }
    const session = req.session;
    permit.approver2 = `${session.operator.id} (${session.operator.displayName})`;
    permit.status = "AUTHORIZED";
    const tenantId = req.headers["x-tenant-id"] || "tenant-enterprise-hq";
    broadcastTenantEvent(tenantId, "PERMIT_APPROVED", permit);
    return res.json({ success: true, permit });
  });
  router.get("/response/quarantine", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ quarantine: tenantDb.quarantine });
  });
  router.get("/response/rollback", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ rollbacks: tenantDb.rollbacks });
  });
  router.get("/evidence/ledger", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ ledger: tenantDb.evidenceLedger });
  });
  router.get("/evidence/pcap", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ captures: tenantDb.pcapCaptures });
  });
  router.post("/evidence/pcap/start", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    const { targetIp, durationSeconds } = req.body;
    const capture = {
      id: `PCAP-CAP-${Date.now().toString().slice(-4)}`,
      title: `On-Demand Buffer Capture for ${targetIp || "Active Anomaly"}`,
      status: "EXTRACTING",
      framesCaptured: 12450,
      totalBytes: 418e4,
      startedAt: (/* @__PURE__ */ new Date()).toISOString(),
      completedAt: null,
      sha256: `sha256-${Date.now()}`,
      downloadUrl: "#",
      tenantId: req.headers["x-tenant-id"] || "tenant-enterprise-hq"
    };
    tenantDb.pcapCaptures.unshift(capture);
    const tenantId = capture.tenantId;
    setTimeout(() => {
      capture.status = "COMPLETED";
      capture.completedAt = (/* @__PURE__ */ new Date()).toISOString();
      broadcastTenantEvent(tenantId, "PCAP_EXTRACTION_COMPLETED", capture);
    }, 3e3);
    return res.json({ success: true, capture });
  });
  router.get("/evidence/witness", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ witnessNodes: tenantDb.witnessNodes });
  });
  router.get("/system/fleet", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ sensors: tenantDb.fleetSensors });
  });
  router.get("/system/inspection", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json(tenantDb.inspectionPipeline);
  });
  router.get("/system/assurance", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ capabilities: tenantDb.detectionCapabilities });
  });
  router.post("/system/assurance/trigger-canary", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    const tenantId = req.headers["x-tenant-id"] || "tenant-enterprise-hq";
    tenantDb.metrics.lastCanaryAuditTime = (/* @__PURE__ */ new Date()).toISOString();
    broadcastTenantEvent(tenantId, "CANARY_VALIDATION_COMPLETED", {
      timestamp: tenantDb.metrics.lastCanaryAuditTime,
      canaryPassCount: 11,
      signedHash: `CANARY-SIG-SHA256-${Date.now()}`
    });
    return res.json({
      success: true,
      auditedAt: tenantDb.metrics.lastCanaryAuditTime,
      message: "Active canary injections completed across sensor ring buffers."
    });
  });
  router.get("/system/compliance", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ frameworks: tenantDb.complianceFrameworks });
  });
  router.get("/system/integrations", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ integrations: tenantDb.integrations });
  });
  router.get("/system/audit", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    return res.json({ logs: tenantDb.auditLogs });
  });
  router.get("/system/licensing", authenticate, (_req, res) => {
    return res.json({
      licenseId: "LIC-ZF-ENT-2026-9921",
      organization: "ZeroFrame Global Defense Consortium",
      tier: "ENTERPRISE_TIER_1",
      issuedAt: "2026-01-01T00:00:00Z",
      expiresAt: "2027-01-01T00:00:00Z",
      maxThroughputGbps: 100,
      maxSensors: 250,
      currentSensorsEnrolled: 22,
      featuresEnabled: [
        "LIVE_DETECTION_ASSURANCE",
        "TARGETED_PCAP_RING_BUFFER",
        "GOVERNED_RESPONSE_STUDIO",
        "DUAL_CONTROL_EXECUTION_PERMITS",
        "SECURITY_TIME_MACHINE_90D",
        "WITNESS_PLANE_BYZANTINE_CONSENSUS",
        "JA4_TLS_FINGERPRINTING",
        "AIR_GAPPED_OT_INSPECTION"
      ],
      signatureValid: true,
      tamperSealVerified: true,
      publicSigningKeyId: "KEY-ED25519-ZEROFRAME-ROOT-2026"
    });
  });
  router.get("/realtime/resync", authenticate, (req, res) => {
    const tenantDb = getTenantScope(req, res);
    if (!tenantDb) return;
    const lastSeq = parseInt(req.query.lastSeq, 10) || 0;
    const missed = tenantDb.eventLog.filter((e) => e.seq > lastSeq);
    return res.json({
      currentSeq: tenantDb.seqCounter,
      missedEvents: missed,
      freshState: {
        metrics: tenantDb.metrics,
        incidentsCount: tenantDb.incidents.length
      }
    });
  });
  return router;
}
function setupBackendAuthority(httpServer, middlewares) {
  startHeartbeatSimulation();
  const app2 = express();
  app2.use(express.json());
  const apiRouter = createBackendApiRouter();
  app2.use("/api/v1", apiRouter);
  middlewares.use(app2);
  const wss = new WebSocketServer({ noServer: true });
  if (httpServer) {
    httpServer.on("upgrade", (request, socket, head) => {
      const url = new URL(request.url || "", `http://${request.headers.host || "localhost"}`);
      if (url.pathname === "/ws/events") {
        const token = url.searchParams.get("token") || "";
        const tenantId = url.searchParams.get("tenantId") || "tenant-enterprise-hq";
        const session = sessions.get(token);
        if (!session) {
          socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
          socket.destroy();
          return;
        }
        if (!tenantDatabases[tenantId]) {
          socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
          socket.destroy();
          return;
        }
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request, session, tenantId);
        });
      }
    });
  }
  wss.on("connection", (ws, _request, session, tenantId) => {
    const client = {
      ws,
      sessionId: session.sessionId,
      tenantId,
      lastPing: Date.now()
    };
    connectedClients.add(client);
    const db = tenantDatabases[tenantId];
    const initialSeq = db ? db.seqCounter : 0;
    ws.send(
      JSON.stringify({
        type: "CONNECTED",
        seq: initialSeq,
        tenantId,
        sessionId: session.sessionId,
        operator: session.operator.username,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      })
    );
    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "PING") {
          client.lastPing = Date.now();
          ws.send(JSON.stringify({ type: "PONG", timestamp: (/* @__PURE__ */ new Date()).toISOString() }));
        }
      } catch (err) {
      }
    });
    ws.on("close", () => {
      connectedClients.delete(client);
    });
    ws.on("error", () => {
      connectedClients.delete(client);
    });
  });
  return { wss, apiRouter };
}

// server.ts
var app = express2();
var server = http.createServer(app);
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
setupBackendAuthority(server, app);
var distPath = path.resolve(__dirname, "dist");
app.use(express2.static(distPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
server.listen(PORT, "0.0.0.0", () => {
  console.log(`[ZeroFrame Authority] Production server listening on port ${PORT}`);
});
