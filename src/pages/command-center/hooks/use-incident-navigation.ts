import { useAppStore } from '../../../stores/app-store';
import { useInvestigationStore } from '../../../stores/investigation-store';
import { ROUTES } from '../command-center.data';

export const useIncidentNavigation = () => {
  const { selectIncident } = useInvestigationStore();
  const { setCurrentPath } = useAppStore();

  const openInRoute = (incidentId: string, route: string) => {
    selectIncident(incidentId);
    setCurrentPath(route);
  };

  return {
    openIncident: (incidentId: string) => openInRoute(incidentId, ROUTES.incidents),
    openIncidentPcap: (incidentId: string) => openInRoute(incidentId, ROUTES.pcapEvidence),
    openIncidentQuarantine: (incidentId: string) => openInRoute(incidentId, ROUTES.quarantine),
  };
};
