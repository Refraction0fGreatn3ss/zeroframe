import type { BitemporalHistoryRecord, EntityType, LivingEntity, RelationshipProvenance } from '../../types';
import {
  CRITICAL_BLAST_RADIUS_THRESHOLD,
  DEFAULT_FALLBACK_VLAN,
  DEFAULT_IDENTITY_CONFIDENCE,
  FALLBACK_HISTORY_COMMIT_LAG_MS,
  INDUSTRIAL_PROTOCOLS,
  IOT_OT_ENTITY_TYPES,
  VIDEO_PROTOCOLS,
} from './assets.data';
import type { AssetCategoryFilter, CategoryFilterTab } from './assets.types';

export const isIotOt = (type: EntityType): boolean => IOT_OT_ENTITY_TYPES.includes(type);

export const getCategoryFilterTabs = (totalCount: number): CategoryFilterTab[] => [
  { id: 'ALL', label: `All Assets (${totalCount})` },
  { id: 'IT', label: 'Enterprise IT' },
  { id: 'IOT_OT', label: 'IoT & OT Field' },
  { id: 'SERVERS', label: 'Critical Servers' },
  { id: 'CRITICAL', label: 'Tier-1 High Blast' },
];

const matchesCategory = (ent: LivingEntity, categoryFilter: AssetCategoryFilter): boolean => {
  if (categoryFilter === 'IT' && isIotOt(ent.entityType)) return false;
  if (categoryFilter === 'IOT_OT' && !isIotOt(ent.entityType)) return false;
  if (categoryFilter === 'SERVERS' && ent.entityType !== 'SERVER') return false;
  if (categoryFilter === 'CRITICAL' && !ent.isProtected && ent.blastRadiusScore < CRITICAL_BLAST_RADIUS_THRESHOLD) {
    return false;
  }
  return true;
};

const matchesSearch = (ent: LivingEntity, searchTerm: string): boolean => {
  if (searchTerm.trim() === '') return true;

  const q = searchTerm.toLowerCase();
  const matchHost = ent.hostname.toLowerCase().includes(q);
  const matchIp = ent.currentIp.includes(q);
  const matchMac = ent.mac.toLowerCase().includes(q);
  const matchType = ent.entityType.toLowerCase().includes(q);
  const matchProto = ent.discoveredProtocols?.some((p) => p.toLowerCase().includes(q));
  const matchOwner = ent.owner?.toLowerCase().includes(q);
  return Boolean(matchHost || matchIp || matchMac || matchType || matchProto || matchOwner);
};

export const filterEntities = (
  entities: LivingEntity[],
  categoryFilter: AssetCategoryFilter,
  searchTerm: string,
): LivingEntity[] => entities.filter((ent) => matchesCategory(ent, categoryFilter) && matchesSearch(ent, searchTerm));

export const hasVlanConflict = (ent: LivingEntity): boolean =>
  ent.vlanDeclared !== undefined && ent.vlanObserved !== undefined && ent.vlanDeclared !== ent.vlanObserved;

export const getIdentityConfidence = (ent: LivingEntity): number =>
  ent.identityConfidence || DEFAULT_IDENTITY_CONFIDENCE;

export const getProtocolBadgeClassName = (protocol: string): string =>
  (INDUSTRIAL_PROTOCOLS as readonly string[]).includes(protocol)
    ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    : (VIDEO_PROTOCOLS as readonly string[]).includes(protocol)
      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
      : 'bg-slate-800 text-slate-400 border-slate-700';

export const getProvenanceBadgeClassName = (provenance: RelationshipProvenance): string =>
  provenance === 'DISCOVERED'
    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    : provenance === 'DECLARED'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : provenance === 'IMPORTED'
        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
        : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

const offsetIso = (iso: string, offsetMs: number): string => new Date(new Date(iso).getTime() + offsetMs).toISOString();

// Entities without recorded history get a synthesized baseline so the ledger view is never empty.
const buildFallbackBitemporalHistory = (ent: LivingEntity): BitemporalHistoryRecord[] => [
  {
    id: `BTH-${ent.id}-01`,
    field: 'IP',
    oldValue: '0.0.0.0',
    newValue: ent.currentIp,
    validTime: ent.firstSeen,
    transactionTime: offsetIso(ent.firstSeen, FALLBACK_HISTORY_COMMIT_LAG_MS.IP),
    provenance: ent.provenance,
    recordedBy: ent.observationSource,
  },
  {
    id: `BTH-${ent.id}-02`,
    field: 'SITE_VLAN',
    oldValue: 'UNASSIGNED',
    newValue: `VLAN ${ent.vlanObserved || DEFAULT_FALLBACK_VLAN}`,
    validTime: ent.firstSeen,
    transactionTime: offsetIso(ent.firstSeen, FALLBACK_HISTORY_COMMIT_LAG_MS.SITE_VLAN),
    provenance: 'DISCOVERED',
    recordedBy: 'ZeroFrame Autonomous Tap Inspector',
  },
  {
    id: `BTH-${ent.id}-03`,
    field: 'PROTECTED_STATE',
    oldValue: 'STANDARD',
    newValue: ent.isProtected ? 'PROTECTED_TIER_1' : 'STANDARD',
    validTime: ent.firstSeen,
    transactionTime: offsetIso(ent.firstSeen, FALLBACK_HISTORY_COMMIT_LAG_MS.PROTECTED_STATE),
    provenance: 'DECLARED',
    recordedBy: 'Security Policy Engine',
  },
];

export const getBitemporalHistory = (ent: LivingEntity): BitemporalHistoryRecord[] =>
  ent.bitemporalHistory || buildFallbackBitemporalHistory(ent);
