import type { FC } from 'react';
import { CommandCenterPage } from '../pages/command-center/CommandCenterPage';
import { SimpleSOCDashboard } from '../pages/simple-soc-dashboard/SimpleSOCDashboard';
import { useAppStore } from '../stores/app-store';

export const OverviewRoute: FC = () => {
  const { viewMode } = useAppStore();
  return viewMode === 'SIMPLE_SOC' ? <SimpleSOCDashboard /> : <CommandCenterPage />;
};
