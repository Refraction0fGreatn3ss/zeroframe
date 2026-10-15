import type React from 'react';
import { useAppStore } from '../../../stores/app-store';
import { useDrawerStore } from '../../../stores/context-drawer-store';
import { ContextView } from './ContextView';
import { DrawerFooter } from './DrawerFooter';
import { DrawerHeader } from './DrawerHeader';
import { DrawerTitle } from './DrawerTitle';
import { useEscapeKey } from './use-escape-key';

export const UniversalContextDrawer: React.FC = () => {
  const { isOpen, currentItem, canGoBack, canGoForward, closeDrawer, goBack, goForward, openContext } =
    useDrawerStore();
  const { setCurrentPath } = useAppStore();

  useEscapeKey(isOpen, closeDrawer);

  if (!isOpen || !currentItem) {
    return null;
  }

  const closeAndNavigate = (path: string) => {
    closeDrawer();
    setCurrentPath(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans select-none animate-in fade-in duration-150">
      <div onClick={closeDrawer} className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" />

      <aside className="relative w-full max-w-lg bg-[var(--zf-surface-card)] border-l border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        <DrawerHeader
          type={currentItem.type}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onBack={goBack}
          onForward={goForward}
          onClose={closeDrawer}
        />
        <DrawerTitle title={currentItem.title} subtitle={currentItem.subtitle} />

        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          <ContextView item={currentItem} onNavigate={closeAndNavigate} onOpenContext={openContext} />
        </div>

        <DrawerFooter onClose={closeDrawer} />
      </aside>
    </div>
  );
};
