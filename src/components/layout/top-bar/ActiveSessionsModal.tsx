import { Laptop, Trash2, X } from 'lucide-react';
import type React from 'react';
import type { OperatorSessionRecord } from '../../../services/auth-service';

interface ActiveSessionsModalProps {
  sessions: OperatorSessionRecord[];
  onRevokeSession: (sessionId: string) => void;
  onClose: () => void;
}

export const ActiveSessionsModal: React.FC<ActiveSessionsModalProps> = ({ sessions, onRevokeSession, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
    <div className="bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg shadow-2xl max-w-xl w-full p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--zf-border-subtle)]">
        <div className="flex items-center gap-2">
          <Laptop className="w-4 h-4 text-[var(--zf-brand-accent)]" />
          <h2 className="text-sm font-semibold text-[var(--zf-text-primary)]">Active Operator Sessions</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {sessions.map((s) => (
          <div
            key={s.sessionId}
            className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] flex items-center justify-between text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--zf-text-primary)]">{s.deviceLabel || 'SecOps Console'}</span>
                {s.isCurrent && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
                    Current Device
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-[var(--zf-text-muted)]">
                IP: {s.ipAddress} · Active: {new Date(s.lastActiveAt).toLocaleTimeString()}
              </div>
            </div>

            {!s.isCurrent && (
              <button
                type="button"
                onClick={() => onRevokeSession(s.sessionId)}
                className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 cursor-pointer text-xs transition-colors"
                title="Terminate this session immediately"
              >
                <Trash2 className="w-3 h-3" />
                <span>Revoke</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="pt-2 flex justify-end border-t border-[var(--zf-border-subtle)]">
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] text-xs font-medium cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);
