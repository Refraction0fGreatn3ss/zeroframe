import { useRef, useState } from 'react';
import { useClickOutside } from '../../../hooks/use-click-outside';

export function useDismissablePopover() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const toggle = () => setIsOpen((open) => !open);
  const close = () => setIsOpen(false);

  return { isOpen, toggle, close, containerRef };
}
