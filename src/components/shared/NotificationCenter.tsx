/**
 * Compact Enterprise Notification Center
 * Slide-over drawer with 15 categories, read status, and deep investigation links.
 */

import React from 'react';
import { useNotificationStore } from '../../stores/notification-store';
import { useAppStore } from '../../stores/app-store';
import { NotificationCategory } from '../../types/notifications';
import { X, CheckCheck, Bell, ChevronRight, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { timeAgo } from '../../lib/utils';

const CATEGORIES: (NotificationCategory | 'ALL')[] = [
  'ALL',
  'INCIDENT',
  'SECURITY',
  'DETECTION',
  'VISIBILITY',
  'TRUST',
  'RESPONSE',
  'COMPLIANCE',
];

export const NotificationCenter: React.FC = () => {
  const { isNotificationPanelOpen, setNotificationPanelOpen, setCurrentPath } = useAppStore();
  const {
    filteredNotifications,
    selectedCategory,
    unreadCount,
    setCategoryFilter,
    markAllAsRead,
    acknowledge,
  } = useNotificationStore();

  if (!isNotificationPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={() => setNotificationPanelOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0e1013] border-l border-[#20242a] text-[#e6edf3] flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-right duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-[#20242a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-zinc-400" />
            <h2 className="font-semibold text-xs text-zinc-100 uppercase tracking-wider">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={() => setNotificationPanelOpen(false)}
              className="p-1 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-3 py-1.5 border-b border-[#20242a] flex items-center gap-1 overflow-x-auto text-[11px] bg-[#101215]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1e232a] text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15171b]'
              }`}
            >
              {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#181b20] p-2 space-y-1">
          {filteredNotifications.length === 0 ? (
            <div className="p-10 text-center text-zinc-500 text-xs">
              No notifications matching this category.
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const isCrit = n.severity === 'CRITICAL';
              const isHigh = n.severity === 'HIGH';

              return (
                <div
                  key={n.id}
                  className={`p-3 rounded transition-colors text-xs ${
                    n.read ? 'bg-transparent text-zinc-400' : 'bg-[#131519] text-zinc-200 border border-[#20242a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {isCrit ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : isHigh ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      )}
                      <span className="font-semibold text-zinc-200">{n.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">
                      {timeAgo(n.timestamp)}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-[11px] leading-relaxed mb-2">
                    {n.message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
                    <span>{n.category}</span>
                    <div className="flex items-center gap-2">
                      {!n.acknowledged && (
                        <button
                          onClick={() => acknowledge(n.id)}
                          className="hover:text-zinc-300 cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      )}
                      {n.deepLink && (
                        <button
                          onClick={() => {
                            setCurrentPath(n.deepLink!);
                            setNotificationPanelOpen(false);
                          }}
                          className="text-zinc-300 hover:text-white flex items-center gap-0.5 cursor-pointer font-medium"
                        >
                          <span>Investigate</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
