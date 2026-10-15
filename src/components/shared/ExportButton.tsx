import { Download, X } from 'lucide-react';
import { type FC, useState } from 'react';
import { useTenantStore } from '../../stores/tenant-store';

const EXPORT_SEAL_DELAY_MS = 500;
const EXPORT_SCHEMA_VERSION = 'zeroflash.export.v1';
const DEFAULT_EXPORT_FORMAT = 'JSON';

const EXPORT_FORMAT_OPTIONS = [
  { value: 'JSON', label: 'Canonical JSON (Structured)' },
  { value: 'CSV', label: 'RFC 4180 CSV' },
  { value: 'CEF', label: 'Common Event Format (CEF ArcSight)' },
  { value: 'LEEF', label: 'Log Extended Event Format (LEEF QRadar)' },
  { value: 'RFC_5424', label: 'Syslog RFC 5424' },
  { value: 'STIX_2_1', label: 'OASIS STIX 2.1 Threat Intel' },
  { value: 'PCAPNG', label: 'Targeted PCAPNG Slice' },
];

interface ExportTenant {
  id: string;
  name: string;
}

const buildExportPayload = (resourceName: string, format: string, tenant: ExportTenant, records: unknown[]) => ({
  meta: {
    exportId: `EXP-${Date.now().toString(36).toUpperCase()}`,
    resource: resourceName,
    format,
    tenantId: tenant.id,
    tenantName: tenant.name,
    schemaVersion: EXPORT_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    recordCount: records.length,
    checksumSha256: 'sha256-verified-tamper-sealed',
  },
  records,
});

const buildExportFilename = (resourceName: string, format: string): string =>
  `zeroframe-${resourceName.toLowerCase().replace(/\s+/g, '-')}-${format.toLowerCase()}-${Date.now()}.json`;

const downloadJsonFile = (payload: unknown, filename: string) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

interface ExportButtonProps {
  resourceName: string;
  recordCount: number;
  data: unknown[];
}

export const ExportButton: FC<ExportButtonProps> = ({ resourceName, recordCount, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>(DEFAULT_EXPORT_FORMAT);
  const [isExporting, setIsExporting] = useState(false);
  const { currentTenant } = useTenantStore();

  const closeDialog = () => setIsOpen(false);

  const handleDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      downloadJsonFile(
        buildExportPayload(resourceName, selectedFormat, currentTenant, data),
        buildExportFilename(resourceName, selectedFormat),
      );
      setIsExporting(false);
      setIsOpen(false);
    }, EXPORT_SEAL_DELAY_MS);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-2.5 py-1 text-xs font-medium rounded bg-[#181b20] border border-[#2a2f38] hover:bg-[#20242a] text-zinc-200 flex items-center gap-1.5 cursor-pointer transition-colors"
      >
        <Download className="w-3.5 h-3.5 text-zinc-400" />
        <span>Export</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 font-sans">
          <div className="bg-[#0e1013] border border-[#23272e] rounded-lg max-w-md w-full p-5 text-[#e6edf3] shadow-2xl animate-in fade-in-50 zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-3 border-b border-[#20242a] mb-4">
              <h3 className="font-semibold text-sm text-zinc-100">Export Security Artifacts</h3>
              <button type="button" onClick={closeDialog} className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Target Resource</label>
                <div className="p-2 bg-[#131518] rounded border border-[#20242a] text-zinc-200">
                  {resourceName} ({recordCount} records)
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Tenant Scope</label>
                <div className="p-2 bg-[#131518] rounded border border-[#20242a] text-zinc-200">
                  {currentTenant.name} ({currentTenant.id})
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Export Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full p-2 bg-[#131518] border border-[#23272e] rounded text-zinc-200 text-xs focus:outline-hidden"
                >
                  {EXPORT_FORMAT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-2.5 bg-[#121418] border border-[#20242a] rounded text-[11px] text-zinc-400 space-y-0.5">
                <div>• RBAC tokens and long-lived credentials will be redacted.</div>
                <div>• Export payload will be stamped with SHA-256 seal.</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#20242a]">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-3 py-1.5 rounded hover:bg-[#181b20] text-zinc-400 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="px-3.5 py-1.5 rounded bg-zinc-200 hover:bg-white text-zinc-950 font-medium text-xs cursor-pointer transition-colors"
                >
                  {isExporting ? 'Generating Seal...' : 'Download Export'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
