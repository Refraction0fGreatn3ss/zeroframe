import { Fingerprint } from 'lucide-react';
import { type FC, useState } from 'react';
import type { Provenance } from '../../types/provenance';
import { CopyableValue } from './CopyableValue';
import { KeyValueList } from './KeyValueList';
import { DrawerSection, SideDrawer } from './SideDrawer';

interface ProvenanceBadgeProps {
  provenance: Provenance | null | undefined;
  subject: string;
}

function formatConfidence(confidence: number | null | undefined): string | null {
  return confidence === null || confidence === undefined ? null : `${Math.round(confidence * 100)}%`;
}

export const ProvenanceDrawer: FC<{ provenance: Provenance; subject: string; onClose: () => void }> = ({
  provenance,
  subject,
  onClose,
}) => (
  <SideDrawer title="Provenance" subtitle={subject} onClose={onClose} widthClassName="w-full max-w-md">
    <DrawerSection title="Origin">
      <KeyValueList
        entries={[
          { label: 'Source', value: provenance.source },
          { label: 'Authority', value: provenance.authority },
          { label: 'Fidelity', value: provenance.fidelity },
          { label: 'Confidence', value: formatConfidence(provenance.confidence) },
          { label: 'Observed at', value: provenance.observedAt },
          { label: 'Sensor', value: provenance.sensorId },
          { label: 'Site', value: provenance.siteId },
          {
            label: 'Evidence reference',
            value: provenance.evidenceRef ? (
              <CopyableValue value={provenance.evidenceRef} label="evidence reference" />
            ) : null,
          },
        ]}
      />
    </DrawerSection>
  </SideDrawer>
);

export const ProvenanceBadge: FC<ProvenanceBadgeProps> = ({ provenance, subject }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!provenance) {
    return <span className="text-[10px] font-mono text-slate-500">provenance unknown</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
        }}
        aria-label={`Show provenance for ${subject}`}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[var(--zf-border-subtle)] text-[10px] font-mono text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--zf-border-focus)]"
      >
        <Fingerprint className="w-3 h-3" aria-hidden="true" />
        {provenance.source}
        {provenance.fidelity && <span className="text-[var(--zf-text-muted)]">· {provenance.fidelity}</span>}
      </button>
      {isOpen && <ProvenanceDrawer provenance={provenance} subject={subject} onClose={() => setIsOpen(false)} />}
    </>
  );
};
