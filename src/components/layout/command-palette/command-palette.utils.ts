import type { LivingEntity, SecurityIncident } from '../../../types';
import type {
  IndexedEvidencePcap,
  IndexedNetworkFlow,
  IndexedPermit,
  IndexedSensorInterface,
  IndexedUser,
  IndexedVlanSubnet,
  IndexedWitnessTransaction,
} from './command-palette.data';
import {
  INDEXED_EVIDENCE_PCAPS,
  INDEXED_NETWORK_FLOWS,
  INDEXED_PERMITS,
  INDEXED_SENSOR_INTERFACES,
  INDEXED_USERS,
  INDEXED_VLANS_SUBNETS,
  INDEXED_WITNESS_TRANSACTIONS,
} from './command-palette.data';

export interface CommandPaletteResults {
  incidents: SecurityIncident[];
  entities: LivingEntity[];
  users: IndexedUser[];
  flows: IndexedNetworkFlow[];
  sensors: IndexedSensorInterface[];
  vlans: IndexedVlanSubnet[];
  evidencePcaps: IndexedEvidencePcap[];
  permits: IndexedPermit[];
  witness: IndexedWitnessTransaction[];
}

/**
 * IP-like fields (addresses, subnets) are matched against the raw query, while
 * descriptive fields are matched case-insensitively.
 */
export function searchCommandIndex(
  query: string,
  incidents: SecurityIncident[],
  entities: LivingEntity[],
): CommandPaletteResults {
  const qLower = query.toLowerCase();
  const matches = (value: string) => value.toLowerCase().includes(qLower);

  return {
    incidents: incidents.filter(
      (inc) =>
        matches(inc.title) ||
        matches(inc.id) ||
        inc.primaryVictim.ip.includes(query) ||
        matches(inc.severity) ||
        matches(inc.state),
    ),
    entities: entities.filter(
      (ent) =>
        matches(ent.hostname) ||
        ent.currentIp.includes(query) ||
        matches(ent.mac) ||
        (ent.owner && matches(ent.owner)) ||
        (ent.entityType && matches(ent.entityType)),
    ),
    users: INDEXED_USERS.filter(
      (u) =>
        matches(u.username) || matches(u.email) || matches(u.name) || matches(u.role) || u.assignedIp.includes(query),
    ),
    flows: INDEXED_NETWORK_FLOWS.filter(
      (flw) =>
        matches(flw.flowId) ||
        flw.src.includes(query) ||
        flw.dst.includes(query) ||
        matches(flw.proto) ||
        matches(flw.desc),
    ),
    sensors: INDEXED_SENSOR_INTERFACES.filter((s) => matches(s.id) || matches(s.site) || matches(s.type)),
    vlans: INDEXED_VLANS_SUBNETS.filter(
      (v) => matches(v.vlan) || v.subnet.includes(query) || matches(v.name) || matches(v.site) || matches(v.qinq),
    ),
    evidencePcaps: INDEXED_EVIDENCE_PCAPS.filter(
      (e) => matches(e.evidenceId) || matches(e.pcapId) || matches(e.sha256) || matches(e.desc) || matches(e.site),
    ),
    permits: INDEXED_PERMITS.filter(
      (p) => matches(p.permitId) || matches(p.action) || matches(p.target) || matches(p.approver) || matches(p.status),
    ),
    witness: INDEXED_WITNESS_TRANSACTIONS.filter((w) => matches(w.txId) || matches(w.hash) || matches(w.type)),
  };
}
