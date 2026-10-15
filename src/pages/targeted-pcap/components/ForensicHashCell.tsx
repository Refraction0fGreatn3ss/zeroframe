import { Check, Copy } from 'lucide-react';
import type { FC } from 'react';
import { STREAMING_OPEN_HASH } from '../targeted-pcap.data';
import { formatHashPreview } from '../targeted-pcap.utils';

interface ForensicHashCellProps {
  sha256: string;
  isCopied: boolean;
  onCopy: (hash: string) => void;
}

export const ForensicHashCell: FC<ForensicHashCellProps> = ({ sha256, isCopied, onCopy }) =>
  sha256 !== STREAMING_OPEN_HASH ? (
    <button
      type="button"
      onClick={() => onCopy(sha256)}
      className="text-slate-400 hover:text-slate-200 font-mono flex items-center gap-1 truncate text-left cursor-pointer"
      title={sha256}
    >
      {isCopied ? (
        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
      ) : (
        <Copy className="w-3 h-3 shrink-0 text-slate-600" />
      )}
      <span className="truncate">{formatHashPreview(sha256)}</span>
    </button>
  ) : (
    <span className="text-slate-600 italic">Calculating on close...</span>
  );
