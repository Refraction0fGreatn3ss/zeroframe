import { CheckCircle2 } from 'lucide-react';
import type React from 'react';

interface VerificationBannerProps {
  message: string;
}

export const VerificationBanner: React.FC<VerificationBannerProps> = ({ message }) => (
  <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
    <CheckCircle2 className="w-4 h-4 shrink-0" />
    <span>{message}</span>
  </div>
);
