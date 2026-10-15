/**
 * Security Activity Log Panel
 * 
 * Production-Grade Real-Time Security Operations Component:
 * - Real-time auto-streaming feed with pause/resume controls
 * - Distinct categories: Threat Alerts, User Logins, System Events
 * - Scrollable high-density list with smooth autoscroll option
 * - Interactive inspect drawer / modal for cryptographic payload verification
 * - Full multi-theme compliance across all 5 ZeroFrame palettes
 */

import React, { useState, useRef, useEffect } from 'react';
import { useActivityLogStore } from '../../stores/activity-log-store';
import { useAppStore } from '../../stores/app-store';
import { SecurityActivityItem, ActivityCategory, ActivitySeverity } from '../../types/activity-log';
import {
  ShieldAlert,
  UserCheck,
  Cpu,
  Search,
  Play,
  Pause,
  Download,
  RotateCcw,
  Trash2,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Terminal,
  X,
  Server,
  Key,
  Globe,
  Radio,
  FileText,
} from 'lucide-react';

interface SecurityActivityLogPanelProps {
  maxHeight?: string;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

export const SecurityActivityLogPanel: React.FC<SecurityActivityLogPanelProps> = ({
  maxHeight = '560px',
  showHeader = true,
  compact = false,
  className = '',
}) => {
  const {
    filteredLogs,
    counts,
    isStreaming,
    filterCategory,
    filterSeverity,
    searchQuery,
    selectedLog,
    autoScroll,
    toggleStreaming,
    setCategoryFilter,
    setSeverityFilter,
    setSearchQuery,
    setSelectedLog,
    setAutoScroll,
    clearLogs,
    resetLogs,
  } = useActivityLogStore();

  const { setCurrentPath } = useAppStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when a new event arrives if autoScroll is enabled
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [filteredLogs.length, autoScroll]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'THREAT_ALERT':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'USER_LOGIN':
        return <UserCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'SYSTEM_EVENT':
        return <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
  };

  const getCategoryLabel = (category: ActivityCategory) => {
    switch (category) {
      case 'THREAT_ALERT':
        return 'Threat Alert';
      case 'USER_LOGIN':
        return 'User Auth';
      case 'SYSTEM_EVENT':
        return 'System Event';
    }
  };

  const getSeverityBadge = (severity: ActivitySeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            MEDIUM
          </span>
        );
      case 'INFO':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)]">
            INFO
          </span>
        );
    }
  };

  const getStatusBadge = (status: SecurityActivityItem['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="text-emerald-400 font-mono text-[10px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>SUCCESS</span>
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="text-rose-400 font-mono text-[10px] font-bold flex items-center gap-1">
            <X className="w-2.5 h-2.5" />
            <span>BLOCKED</span>
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="text-amber-400 font-mono text-[10px] font-semibold flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>FLAGGED</span>
          </span>
        );
      case 'INVESTIGATING':
        return (
          <span className="text-cyan-400 font-mono text-[10px] font-semibold flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            <span>INVESTIGATING</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="text-amber-300 font-mono text-[10px] font-semibold flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>WARNING</span>
          </span>
        );
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 5) return 'just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    return `${diffHr}h ago`;
  };

  const exportData = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Security_Activity_Log_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['id', 'timestamp', 'category', 'severity', 'title', 'actor', 'sourceIp', 'status'];
      const rows = filteredLogs.map((l) => [
        l.id,
        l.timestamp,
        l.category,
        l.severity,
        `"${l.title.replace(/"/g, '""')}"`,
        l.actor,
        l.sourceIp,
        l.status,
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Security_Activity_Log_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className={`bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] rounded overflow-hidden flex flex-col font-sans select-none shadow-xs text-xs ${className}`}
    >
      {/* Top Header Strip */}
      {showHeader && (
        <div className="p-3 border-b border-[var(--zf-border-subtle)] bg-[var(--zf-surface-subtle)] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--zf-brand-accent)] shrink-0" />
              <h2 className="text-xs font-semibold text-[var(--zf-text-primary)] uppercase tracking-wider">
                Security Activity Log
              </h2>
            </div>

            {/* Real-time Streaming Pulse Indicator */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[var(--zf-border-subtle)] bg-[var(--zf-surface-tertiary)] text-[10px] font-mono">
              {isStreaming ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-semibold">LIVE STREAMING</span>
                  <span className="text-[var(--zf-text-muted)]">· 1.2 evt/s</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-amber-400 font-semibold">PAUSED</span>
                </>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5">
            {/* Play/Pause Streaming Toggle */}
            <button
              type="button"
              onClick={toggleStreaming}
              className={`px-2 py-1 rounded border text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                isStreaming
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              }`}
              title={isStreaming ? 'Pause live ingestion' : 'Resume live ingestion'}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>Resume Live</span>
                </>
              )}
            </button>

            {/* AutoScroll Toggle */}
            <button
              type="button"
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-2 py-1 rounded border text-[11px] font-mono cursor-pointer transition-colors ${
                autoScroll
                  ? 'bg-[var(--zf-brand-accent-subtle)] border-[var(--zf-brand-accent)] text-[var(--zf-brand-accent)] font-semibold'
                  : 'border-[var(--zf-border-subtle)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]'
              }`}
              title="Auto-scroll to latest events"
            >
              Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
            </button>

            {/* Export Dropdown */}
            <button
              type="button"
              onClick={() => exportData('csv')}
              className="p-1.5 rounded border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] transition-colors cursor-pointer"
              title="Export visible activity logs to CSV"
            >
              <Download className="w-3 h-3" />
            </button>

            {/* Reload / Reset Defaults */}
            <button
              type="button"
              onClick={resetLogs}
              className="p-1.5 rounded border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] transition-colors cursor-pointer"
              title="Reset default demo logs"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            {/* Clear Logs */}
            <button
              type="button"
              onClick={clearLogs}
              className="p-1.5 rounded border border-[var(--zf-border-subtle)] hover:border-rose-500/40 text-[var(--zf-text-muted)] hover:text-rose-400 transition-colors cursor-pointer"
              title="Clear activity log buffer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Rail: Category Tabs & Search Bar */}
      <div className="p-2.5 border-b border-[var(--zf-border-subtle)] bg-[var(--zf-surface-card)] flex flex-wrap items-center justify-between gap-2.5">
        {/* Category Segmented Control */}
        <div className="flex items-center gap-1 bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] rounded p-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'ALL'
                ? 'bg-[var(--zf-surface-card)] text-[var(--zf-text-primary)] font-semibold shadow-xs border border-[var(--zf-border-subtle)]'
                : 'text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]'
            }`}
          >
            <span>All Events</span>
            <span className="text-[10px] font-semibold text-[var(--zf-brand-accent)]">({counts.all})</span>
          </button>

          <button
            type="button"
            onClick={() => setCategoryFilter('THREAT_ALERT')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'THREAT_ALERT'
                ? 'bg-rose-500/15 text-rose-400 font-semibold shadow-xs border border-rose-500/30'
                : 'text-[var(--zf-text-muted)] hover:text-rose-400'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Threat Alerts</span>
            <span className="text-[10px] font-bold text-rose-400">({counts.threatAlerts})</span>
          </button>

          <button
            type="button"
            onClick={() => setCategoryFilter('USER_LOGIN')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'USER_LOGIN'
                ? 'bg-sky-500/15 text-sky-400 font-semibold shadow-xs border border-sky-500/30'
                : 'text-[var(--zf-text-muted)] hover:text-sky-400'
            }`}
          >
            <UserCheck className="w-3 h-3 text-sky-400" />
            <span>User Logins</span>
            <span className="text-[10px] font-bold text-sky-400">({counts.userLogins})</span>
          </button>

          <button
            type="button"
            onClick={() => setCategoryFilter('SYSTEM_EVENT')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'SYSTEM_EVENT'
                ? 'bg-emerald-500/15 text-emerald-400 font-semibold shadow-xs border border-emerald-500/30'
                : 'text-[var(--zf-text-muted)] hover:text-emerald-400'
            }`}
          >
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>System Events</span>
            <span className="text-[10px] font-bold text-emerald-400">({counts.systemEvents})</span>
          </button>
        </div>

        {/* Severity Selector & Search Input */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-2 py-1 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-secondary)] text-[11px] font-mono focus:outline-hidden focus:border-[var(--zf-brand-accent)] cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium</option>
            <option value="INFO">Info</option>
          </select>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[var(--zf-text-muted)]" />
            <input
              type="text"
              placeholder="Search actor, IP, tactic, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] rounded pl-8 pr-2.5 py-1 text-xs text-[var(--zf-text-primary)] placeholder-[var(--zf-text-muted)] focus:outline-hidden focus:border-[var(--zf-brand-accent)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Scrollable List Component */}
      <div
        ref={scrollContainerRef}
        style={{ maxHeight }}
        className="overflow-y-auto divide-y divide-[var(--zf-border-subtle)] flex-1 relative"
      >
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-[var(--zf-text-muted)] space-y-2">
            <Search className="w-6 h-6 mx-auto opacity-40 text-[var(--zf-text-muted)]" />
            <div className="text-xs font-semibold text-[var(--zf-text-primary)]">
              No security activity matching current filters
            </div>
            <p className="text-[11px] text-[var(--zf-text-muted)] max-w-sm mx-auto">
              Try adjusting your category filter, severity threshold, or search keyword.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('ALL');
                setSeverityFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-2 px-3 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-brand-accent)] text-xs font-mono cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isSelected = selectedLog?.id === log.id;
            return (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={`p-3 transition-all cursor-pointer relative group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  log.isNew
                    ? 'bg-[var(--zf-brand-accent-subtle)] animate-pulse'
                    : isSelected
                    ? 'bg-[var(--zf-surface-subtle)] border-l-2 border-[var(--zf-brand-accent)]'
                    : 'hover:bg-[var(--zf-surface-card-hover)]'
                }`}
              >
                {/* Left Column: Icon + Category + Title + Details */}
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="mt-0.5 p-1.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] shrink-0">
                    {getCategoryIcon(log.category)}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    {/* Top Row: Category + Severity + Relative Time + ID */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                      <span className="font-semibold text-[var(--zf-text-muted)] uppercase">
                        {getCategoryLabel(log.category)}
                      </span>
                      <span className="text-[var(--zf-text-muted)]">·</span>
                      {getSeverityBadge(log.severity)}
                      <span className="text-[var(--zf-text-muted)]">·</span>
                      <span className="text-[var(--zf-text-secondary)] font-medium">
                        {formatRelativeTime(log.timestamp)}
                      </span>
                      <span className="text-[var(--zf-text-muted)] hidden md:inline">
                        ({new Date(log.timestamp).toISOString().slice(11, 19)} UTC)
                      </span>
                      <span className="text-[var(--zf-text-muted)]">·</span>
                      <span className="text-[var(--zf-text-muted)] hover:text-[var(--zf-brand-accent)]">
                        {log.id}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="font-semibold text-xs text-[var(--zf-text-primary)] group-hover:text-[var(--zf-brand-accent)] transition-colors truncate">
                      {log.title}
                    </div>

                    {/* Plain English Description */}
                    <p className="text-[11px] text-[var(--zf-text-secondary)] leading-relaxed line-clamp-1">
                      {log.description}
                    </p>

                    {/* Metadata strip: Actor, Target, MITRE Tactic */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-[var(--zf-text-muted)] pt-0.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--zf-text-muted)]">Actor:</span>
                        <span className="text-[var(--zf-text-primary)] font-medium truncate max-w-[160px]">
                          {log.actor}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[var(--zf-text-muted)]">IP:</span>
                        <span className="text-[var(--zf-text-primary)] font-semibold">{log.sourceIp}</span>
                      </div>

                      {log.targetResource && (
                        <div className="flex items-center gap-1 truncate max-w-[220px]">
                          <span className="text-[var(--zf-text-muted)]">Target:</span>
                          <span className="text-[var(--zf-text-secondary)] truncate">{log.targetResource}</span>
                        </div>
                      )}

                      {log.mitreTactic && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold">
                          {log.mitreTactic.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Status & Quick Inspect Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[var(--zf-border-subtle)]">
                  <div>{getStatusBadge(log.status)}</div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLog(log);
                    }}
                    className="px-2 py-1 rounded bg-[var(--zf-surface-subtle)] hover:bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[10px] font-mono text-[var(--zf-brand-accent)] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Summary Footer */}
      <div className="p-2 border-t border-[var(--zf-border-subtle)] bg-[var(--zf-surface-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--zf-text-muted)]">
        <div className="flex items-center gap-3">
          <span>
            Displaying <strong className="text-[var(--zf-text-primary)]">{filteredLogs.length}</strong> of{' '}
            <strong className="text-[var(--zf-text-primary)]">{counts.all}</strong> buffered events
          </span>
          <span className="text-[var(--zf-text-muted)] hidden sm:inline">·</span>
          <span className="hidden sm:inline text-rose-400 font-semibold">{counts.criticalCount} Critical</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--zf-text-muted)]">
            Click any entry to inspect raw cryptographic payload
          </span>
        </div>
      </div>

      {/* Inspect Detail Modal / Drawer */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-100 text-xs font-sans">
            {/* Modal Header */}
            <div className="p-3.5 border-b border-[var(--zf-border-subtle)] bg-[var(--zf-surface-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)]">
                  {getCategoryIcon(selectedLog.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-[var(--zf-brand-accent)]">
                      {selectedLog.id}
                    </span>
                    <span className="text-[var(--zf-text-muted)]">·</span>
                    {getSeverityBadge(selectedLog.severity)}
                  </div>
                  <h3 className="font-semibold text-xs text-[var(--zf-text-primary)] mt-0.5">
                    {selectedLog.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-3.5 font-sans">
              {/* Event Description */}
              <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)]">
                  Executive Incident Summary
                </span>
                <p className="text-xs text-[var(--zf-text-primary)] leading-relaxed">
                  {selectedLog.description}
                </p>
              </div>

              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
                  <span className="text-[10px] text-[var(--zf-text-muted)] block">Event Category</span>
                  <span className="font-semibold text-[var(--zf-text-primary)] mt-0.5 block">
                    {getCategoryLabel(selectedLog.category)}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
                  <span className="text-[10px] text-[var(--zf-text-muted)] block">Verification State</span>
                  <div className="mt-0.5">{getStatusBadge(selectedLog.status)}</div>
                </div>

                <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
                  <span className="text-[10px] text-[var(--zf-text-muted)] block">Actor Identity</span>
                  <span className="font-semibold text-[var(--zf-text-primary)] mt-0.5 block truncate">
                    {selectedLog.actor}
                  </span>
                  {selectedLog.actorRole && (
                    <span className="text-[10px] text-[var(--zf-text-muted)] block mt-0.5">
                      {selectedLog.actorRole}
                    </span>
                  )}
                </div>

                <div className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
                  <span className="text-[10px] text-[var(--zf-text-muted)] block">Source IP Address</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-bold text-[var(--zf-text-primary)]">{selectedLog.sourceIp}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedLog.sourceIp, 'ip')}
                      className="text-[10px] text-[var(--zf-brand-accent)] hover:underline cursor-pointer"
                    >
                      {copiedId === 'ip' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  {selectedLog.location && (
                    <span className="text-[10px] text-[var(--zf-text-muted)] block mt-0.5">
                      {selectedLog.location}
                    </span>
                  )}
                </div>

                {selectedLog.targetResource && (
                  <div className="col-span-2 p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)]">
                    <span className="text-[10px] text-[var(--zf-text-muted)] block">Target Asset / Protocol Endpoint</span>
                    <span className="font-semibold text-[var(--zf-text-primary)] mt-0.5 block">
                      {selectedLog.targetResource}
                    </span>
                  </div>
                )}

                {selectedLog.mitreTactic && (
                  <div className="col-span-2 p-2.5 rounded bg-rose-500/10 border border-rose-500/30">
                    <span className="text-[10px] text-rose-400 block font-bold">MITRE ATT&CK Mapping</span>
                    <span className="font-semibold text-rose-300 mt-0.5 block">
                      {selectedLog.mitreTactic}
                    </span>
                  </div>
                )}
              </div>

              {/* Raw JSON Telemetry Payload */}
              {selectedLog.payload && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--zf-text-muted)]">
                    <span className="font-semibold uppercase tracking-wider">Raw Telemetry Attributes</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(JSON.stringify(selectedLog.payload, null, 2), 'payload')
                      }
                      className="text-[var(--zf-brand-accent)] hover:underline cursor-pointer"
                    >
                      {copiedId === 'payload' ? 'Copied JSON' : 'Copy JSON'}
                    </button>
                  </div>
                  <pre className="p-3 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] font-mono text-[11px] text-[var(--zf-text-secondary)] overflow-x-auto max-h-48 leading-relaxed">
                    {JSON.stringify(selectedLog.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer & Pivot Actions */}
            <div className="p-3 border-t border-[var(--zf-border-subtle)] bg-[var(--zf-surface-subtle)] flex items-center justify-between">
              <span className="font-mono text-[10px] text-[var(--zf-text-muted)]">
                Logged: {selectedLog.timestamp}
              </span>

              <div className="flex items-center gap-2">
                {selectedLog.category === 'THREAT_ALERT' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLog(null);
                      setCurrentPath('/investigate/incidents');
                    }}
                    className="px-2.5 py-1 rounded bg-[var(--zf-brand-accent)] text-black font-semibold text-xs flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <span>Pivot to Incidents</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}

                {selectedLog.category === 'USER_LOGIN' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLog(null);
                      setCurrentPath('/system/audit');
                    }}
                    className="px-2.5 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-primary)] font-medium text-xs flex items-center gap-1 cursor-pointer hover:border-[var(--zf-border-medium)] transition-colors"
                  >
                    <span>Inspect RBAC Audit</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}

                {selectedLog.category === 'SYSTEM_EVENT' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLog(null);
                      setCurrentPath('/system/fleet');
                    }}
                    className="px-2.5 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-primary)] font-medium text-xs flex items-center gap-1 cursor-pointer hover:border-[var(--zf-border-medium)] transition-colors"
                  >
                    <span>Inspect Sensor Fleet</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-3 py-1 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
