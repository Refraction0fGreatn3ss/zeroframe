import { useState } from 'react';
import { useAppStore } from '../../../stores/app-store';
import { ROUTES } from '../incidents.data';

export const useContainmentActions = () => {
  const { setCurrentPath } = useAppStore();
  const [processKilled] = useState(false);

  // Isolation must go through the governed permit workflow (dual-approver co-signature), never directly.
  const routeToGovernedIsolation = () => {
    setCurrentPath(ROUTES.governedResponseStudio);
  };

  return { processKilled, routeToGovernedIsolation };
};
