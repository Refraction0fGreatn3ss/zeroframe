import { useState } from 'react';
import { DEFAULT_EXPANDED_STAGE } from '../inspection-integrity.data';

export const useExpandedStage = () => {
  const [expandedStage, setExpandedStage] = useState<string | null>(DEFAULT_EXPANDED_STAGE);

  const toggleStage = (stage: string) => {
    setExpandedStage(expandedStage === stage ? null : stage);
  };

  return { expandedStage, toggleStage };
};
