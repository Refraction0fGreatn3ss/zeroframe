import type { FC } from 'react';
import type { LivingEntity } from '../../../types';
import { DhcpLeaseHistory } from './DhcpLeaseHistory';
import { EntityAttributeSections } from './EntityAttributeSections';
import { IdentityMetadataList } from './IdentityMetadataList';
import { IdentityScoreCards } from './IdentityScoreCards';
import { LinkedIncidentsPanel } from './LinkedIncidentsPanel';

interface IdentityContextTabProps {
  entity: LivingEntity;
  onPivotToIncident: () => void;
}

export const IdentityContextTab: FC<IdentityContextTabProps> = ({ entity, onPivotToIncident }) => (
  <div className="space-y-4 pt-4 text-xs">
    <IdentityScoreCards entity={entity} />
    <IdentityMetadataList entity={entity} />
    <EntityAttributeSections entity={entity} />

    {entity.activeIncidents && entity.activeIncidents.length > 0 && (
      <LinkedIncidentsPanel incidentIds={entity.activeIncidents} onPivotToIncident={onPivotToIncident} />
    )}

    <DhcpLeaseHistory leases={entity.historicalIps} />
  </div>
);
