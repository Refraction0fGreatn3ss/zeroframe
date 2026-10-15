import { Bell } from 'lucide-react';
import type React from 'react';

interface NotificationBellProps {
  hasUnread: boolean;
  onOpen: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ hasUnread, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="relative p-1.5 rounded hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] transition-colors cursor-pointer"
    title="Notification Center"
    aria-label="Open notifications"
  >
    <Bell className="w-3.5 h-3.5" />
    {hasUnread && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />}
  </button>
);
