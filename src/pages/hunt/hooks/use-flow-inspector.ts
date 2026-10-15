import { useState } from 'react';
import { useCopyToClipboard } from '../../../hooks/use-copy-to-clipboard';
import { WIRE_FLOWS } from '../hunt.data';
import type { InspectorTab, WireFlow } from '../hunt.types';
import { hasCopyableJa4 } from '../hunt.utils';

export interface FlowInspectorState {
  selectedFlow: WireFlow;
  selectFlow: (flow: WireFlow) => void;
  activeTab: InspectorTab;
  setActiveTab: (tab: InspectorTab) => void;
  copiedJa4: boolean;
  copyJa4: () => void;
}

export const useFlowInspector = (): FlowInspectorState => {
  const [selectedFlow, setSelectedFlow] = useState<WireFlow>(WIRE_FLOWS[0]);
  const [activeTab, setActiveTab] = useState<InspectorTab>('HEX');
  const { copiedKey, copy } = useCopyToClipboard();
  const copiedJa4 = copiedKey !== null;

  const copyJa4 = () => {
    if (!hasCopyableJa4(selectedFlow.ja4)) return;
    copy(selectedFlow.ja4);
  };

  return {
    selectedFlow,
    selectFlow: setSelectedFlow,
    activeTab,
    setActiveTab,
    copiedJa4,
    copyJa4,
  };
};
