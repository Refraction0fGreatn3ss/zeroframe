import { useState } from 'react';
import type { SecurityIncident } from '../../../types';
import { DEFAULT_CONTAINMENT_ACTION, FALLBACK_RESPONSE_TARGET } from '../governed-response-studio.data';
import type { ResponseTarget } from '../governed-response-studio.types';

export const useResponseTarget = (incidents: SecurityIncident[]) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState(incidents[0]?.id || '');
  const [selectedAction, setSelectedAction] = useState<string>(DEFAULT_CONTAINMENT_ACTION);

  const incident: ResponseTarget =
    incidents.find((i) => i.id === selectedIncidentId) || incidents[0] || FALLBACK_RESPONSE_TARGET;

  return {
    incident,
    selectedIncidentId,
    setSelectedIncidentId,
    selectedAction,
    setSelectedAction,
  };
};
