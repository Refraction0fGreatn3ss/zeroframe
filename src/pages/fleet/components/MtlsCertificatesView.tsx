import type { FC } from 'react';
import type { SensorNode } from '../../../types/fleet';
import { SensorCertificatesTable } from './SensorCertificatesTable';
import { TrustDomainSummary } from './TrustDomainSummary';

interface MtlsCertificatesViewProps {
  sensors: SensorNode[];
  onSelectSensor: (sensor: SensorNode) => void;
}

export const MtlsCertificatesView: FC<MtlsCertificatesViewProps> = ({ sensors, onSelectSensor }) => (
  <div className="space-y-4">
    <TrustDomainSummary />
    <SensorCertificatesTable sensors={sensors} onSelectSensor={onSelectSensor} />
  </div>
);
