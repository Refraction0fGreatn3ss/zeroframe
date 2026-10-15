import type React from 'react';
import type { DataTableColumn } from '../../components/page/DataTable';
import { DataTable } from '../../components/page/DataTable';
import { HeaderActions } from '../../components/page/HeaderActions';
import { PageHeader } from '../../components/page/PageHeader';
import { TableEmptyRow } from '../../components/page/TableEmptyRow';
import { ExportButton } from '../../components/shared/ExportButton';
import { EvidenceRow } from './components/EvidenceRow';
import { useEvidenceItems } from './hooks/use-evidence-items';

const EVIDENCE_COLUMNS: readonly DataTableColumn[] = [
  { label: 'Evidence ID' },
  { label: 'Artifact Description' },
  { label: 'State' },
  { label: 'Incident Link' },
  { label: 'Captured By' },
  { label: 'Size' },
  { label: 'SHA-256 Hash' },
  { label: 'Vault Sealing', className: 'text-right' },
];

export const EvidenceCenterPage: React.FC = () => {
  const { items, isLoading } = useEvidenceItems();

  return (
    <div className="p-5 space-y-5 text-[#e6edf3] max-w-[1520px] mx-auto font-sans">
      <PageHeader
        title="Evidence Center & Chain of Custody"
        description="Audit-grade cryptographic evidence artifacts sealed in tamper-evident vault storage."
        actions={
          <HeaderActions>
            <ExportButton resourceName="Evidence Artifacts" recordCount={items.length} data={items} />
          </HeaderActions>
        }
      />

      <DataTable columns={EVIDENCE_COLUMNS}>
        {items.length === 0 ? (
          <TableEmptyRow colSpan={EVIDENCE_COLUMNS.length}>
            {isLoading
              ? 'Reading sealed evidence ledger and PCAP store...'
              : 'No evidence artifacts found for this tenant scope.'}
          </TableEmptyRow>
        ) : (
          items.map((item) => <EvidenceRow key={item.id} item={item} />)
        )}
      </DataTable>
    </div>
  );
};
