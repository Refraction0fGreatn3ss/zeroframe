import { useState } from 'react';
import {
  DEFAULT_PROCESS_TREE_KEY,
  INITIAL_SELECTED_PROCESS_NODE_INDEX,
  PROCESS_EXECUTION_TREES,
} from '../incidents.data';
import type { ProcessNode } from '../incidents.types';

export const useProcessNodeSelection = () => {
  const [selectedProcessNode, setSelectedProcessNode] = useState<ProcessNode | null>(
    PROCESS_EXECUTION_TREES[DEFAULT_PROCESS_TREE_KEY][INITIAL_SELECTED_PROCESS_NODE_INDEX],
  );

  return { selectedProcessNode, setSelectedProcessNode };
};
