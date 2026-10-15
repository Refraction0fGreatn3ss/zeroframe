import type React from 'react';
import { useCopyToClipboard } from '../../../hooks/use-copy-to-clipboard';
import { useActivityLogStore } from '../../../stores/activity-log-store';
import { useAppStore } from '../../../stores/app-store';
import { ActivityLogDetailModal } from './ActivityLogDetailModal';
import { ActivityLogEmptyState } from './ActivityLogEmptyState';
import { ActivityLogFilters } from './ActivityLogFilters';
import { ActivityLogFooter } from './ActivityLogFooter';
import { ActivityLogHeader } from './ActivityLogHeader';
import { ActivityLogRow } from './ActivityLogRow';
import { exportActivityLogs } from './activity-log.utils';
import { useScrollToTopOnChange } from './use-scroll-to-top-on-change';

interface SecurityActivityLogPanelProps {
  maxHeight?: string;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

export const SecurityActivityLogPanel: React.FC<SecurityActivityLogPanelProps> = ({
  maxHeight = '560px',
  showHeader = true,
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
  const { copiedKey: copiedId, copy: copyToClipboard } = useCopyToClipboard();
  const scrollContainerRef = useScrollToTopOnChange(filteredLogs.length, autoScroll);

  const resetFilters = () => {
    setCategoryFilter('ALL');
    setSeverityFilter('ALL');
    setSearchQuery('');
  };

  const pivotTo = (path: string) => {
    setSelectedLog(null);
    setCurrentPath(path);
  };

  return (
    <div
      className={`bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] rounded overflow-hidden flex flex-col font-sans select-none shadow-xs text-xs ${className}`}
    >
      {showHeader && (
        <ActivityLogHeader
          isStreaming={isStreaming}
          autoScroll={autoScroll}
          onToggleStreaming={toggleStreaming}
          onToggleAutoScroll={() => setAutoScroll(!autoScroll)}
          onExportCsv={() => exportActivityLogs(filteredLogs, 'csv')}
          onResetLogs={resetLogs}
          onClearLogs={clearLogs}
        />
      )}

      <ActivityLogFilters
        counts={counts}
        filterCategory={filterCategory}
        filterSeverity={filterSeverity}
        searchQuery={searchQuery}
        onCategoryChange={setCategoryFilter}
        onSeverityChange={setSeverityFilter}
        onSearchChange={setSearchQuery}
      />

      <div
        ref={scrollContainerRef}
        style={{ maxHeight }}
        className="overflow-y-auto divide-y divide-[var(--zf-border-subtle)] flex-1 relative"
      >
        {filteredLogs.length === 0 ? (
          <ActivityLogEmptyState onResetFilters={resetFilters} />
        ) : (
          filteredLogs.map((log) => (
            <ActivityLogRow key={log.id} log={log} isSelected={selectedLog?.id === log.id} onSelect={setSelectedLog} />
          ))
        )}
      </div>

      <ActivityLogFooter
        visibleCount={filteredLogs.length}
        totalCount={counts.all}
        criticalCount={counts.criticalCount}
      />

      {selectedLog && (
        <ActivityLogDetailModal
          log={selectedLog}
          copiedId={copiedId}
          onCopy={copyToClipboard}
          onPivot={pivotTo}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};
