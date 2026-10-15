import { useState } from 'react';
import { OT_PACKETS } from '../scada-ot.data';
import type { OtProtocolPacket, ProtocolFilter } from '../scada-ot.types';
import { filterPacketsByProtocol } from '../scada-ot.utils';

export const usePacketInspector = () => {
  const [selectedPacket, setSelectedPacket] = useState<OtProtocolPacket>(OT_PACKETS[0]);
  const [activeFilter, setActiveFilter] = useState<ProtocolFilter>('ALL');

  const filteredPackets = filterPacketsByProtocol(activeFilter);

  return { selectedPacket, setSelectedPacket, activeFilter, setActiveFilter, filteredPackets };
};
