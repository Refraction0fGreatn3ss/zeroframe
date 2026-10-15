import { CheckCircle2 } from 'lucide-react';
import type { FC } from 'react';

interface ActionNotificationBannerProps {
  message: string;
}

export const ActionNotificationBanner: FC<ActionNotificationBannerProps> = ({ message }) => (
  <div className="p-3 bg-[#0a1410] border border-emerald-600/60 rounded-md text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-150">
    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
    <span>{message}</span>
  </div>
);
