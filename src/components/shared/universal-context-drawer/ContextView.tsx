import type React from 'react';
import type { ContextItem } from '../../../stores/context-drawer-store';
import { AssetContext } from './context-views/AssetContext';
import { DetectorContext } from './context-views/DetectorContext';
import { EvidenceContext } from './context-views/EvidenceContext';
import { IpContext } from './context-views/IpContext';
import { MitreContext } from './context-views/MitreContext';
import { SensorContext } from './context-views/SensorContext';
import { TruthProofContext } from './context-views/TruthProofContext';
import { UserContext } from './context-views/UserContext';
import type { ContextViewActions } from './universal-context-drawer.data';

interface ContextViewProps extends ContextViewActions {
  item: ContextItem;
}

export const ContextView: React.FC<ContextViewProps> = ({ item, onNavigate, onOpenContext }) => {
  const { type, id, title, data = {} } = item;

  switch (type) {
    case 'TRUTH_PROOF':
      return <TruthProofContext data={data} onNavigate={onNavigate} />;
    case 'IP':
      return <IpContext id={id} data={data} onNavigate={onNavigate} onOpenContext={onOpenContext} />;
    case 'ASSET':
      return <AssetContext title={title} data={data} onOpenContext={onOpenContext} />;
    case 'DETECTOR':
      return <DetectorContext data={data} onOpenContext={onOpenContext} />;
    case 'EVIDENCE':
      return <EvidenceContext data={data} onNavigate={onNavigate} />;
    case 'SENSOR':
      return <SensorContext data={data} />;
    case 'MITRE':
      return <MitreContext id={id} data={data} onNavigate={onNavigate} onOpenContext={onOpenContext} />;
    case 'USER':
      return <UserContext id={id} data={data} onOpenContext={onOpenContext} />;
    default:
      return null;
  }
};
