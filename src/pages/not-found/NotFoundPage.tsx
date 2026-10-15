import type { FC } from 'react';
import { Link, useLocation } from 'react-router';

export const NotFoundPage: FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="p-10 text-center space-y-2">
      <p className="text-sm font-semibold text-[var(--zf-text-primary)]">Page not found</p>
      <p className="text-xs text-[var(--zf-text-secondary)]">
        No console route matches <span className="font-mono select-all">{pathname}</span>.
      </p>
      <Link to="/overview" className="inline-block text-xs text-[var(--zf-brand-accent)] hover:underline">
        Go to Command Center
      </Link>
    </div>
  );
};
