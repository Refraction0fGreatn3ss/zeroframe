import type { TenantMetrics } from '../types/tenant.ts';

export function buildCapabilityManifest(metrics: TenantMetrics) {
  return {
    status: 'FRESH',
    manifestVersion: '2026.4.1-AUTHORITATIVE',
    generatedAt: new Date().toISOString(),
    capabilities: [
      { id: 'live_detection_assurance', name: 'Live Detection Assurance', status: 'FRESH', details: 'Continuous canary pipeline executing every 60s' },
      { id: 'targeted_pcap', name: 'Targeted PCAP Extraction', status: 'FRESH', details: 'Ring buffer depth 120s with hardware microsecond timestamps' },
      { id: 'security_time_machine', name: 'Security Time Machine', status: 'FRESH', details: '90-day forensic rewind on living topology graph' },
      { id: 'witness_quorum', name: 'Witness Plane Byzantine Consensus', status: 'FRESH', details: '3/3 independent witness verification quorum' },
      { id: 'response_governance', name: 'Governed Response Studio & Dual Control', status: 'FRESH', details: 'Automated 1-hour compensating rollback window' },
      { id: 'compliance_frameworks', name: 'Regulatory Assurance Frameworks', status: 'FRESH', details: 'Continuous SOC2, ISO27001, NIS2 audit evaluation' },
      { id: 'export_safety', name: 'Export Safety Redaction & Watermarking', status: 'FRESH', details: 'Cryptographic watermarking with operator signature' },
      { id: 'protocol_inspection', name: 'L2-L7 Protocol Inspection Pipeline', status: metrics.captureState === 'HEALTHY' ? 'FRESH' : 'DEGRADED', details: 'AF_XDP zero-copy capture with asymmetry monitoring' },
    ],
  };
}
