import { useState } from 'react';
import { DEFAULT_ASSIGNEE, INITIAL_ASSIGNED_OPERATORS } from '../incidents.data';
import type { AssignedOperatorsByIncident } from '../incidents.types';

export const useOperatorAssignment = (incidentId: string | undefined) => {
  const [assignedOperators, setAssignedOperators] = useState<AssignedOperatorsByIncident>(INITIAL_ASSIGNED_OPERATORS);

  const assignee = (incidentId && assignedOperators[incidentId]) || DEFAULT_ASSIGNEE;

  const assignOperator = (operator: string) => {
    if (!incidentId) return;
    setAssignedOperators((prev) => ({ ...prev, [incidentId]: operator }));
  };

  return { assignee, assignOperator };
};
