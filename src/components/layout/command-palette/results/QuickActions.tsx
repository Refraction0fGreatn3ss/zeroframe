import type React from 'react';
import type { QuickAction } from '../command-palette.data';
import { QUICK_ACTIONS } from '../command-palette.data';
import { PaletteResultRow } from '../PaletteResultRow';
import { PaletteSection } from '../PaletteSection';

interface QuickActionsProps {
  onRunAction: (action: QuickAction) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onRunAction }) => (
  <PaletteSection title="Quick Actions">
    {QUICK_ACTIONS.map((action) => {
      const Icon = action.icon;
      return (
        <PaletteResultRow key={action.path} onSelect={() => onRunAction(action)}>
          <div className="flex items-center gap-2">
            <Icon className={`w-3.5 h-3.5 ${action.iconClassName} shrink-0`} />
            <span>{action.label}</span>
          </div>
        </PaletteResultRow>
      );
    })}
  </PaletteSection>
);
