import { OT_PACKETS, PACKET_TIME_SLICE, PROTOCOL_FILTER_TARGETS } from './scada-ot.data';
import type { OtProtocolPacket, ProtocolFilter } from './scada-ot.types';

export const filterPacketsByProtocol = (filter: ProtocolFilter): OtProtocolPacket[] =>
  filter === 'ALL' ? OT_PACKETS : OT_PACKETS.filter((p) => p.protocol === PROTOCOL_FILTER_TARGETS[filter]);

export const formatPacketTime = (timestamp: string): string =>
  timestamp.slice(PACKET_TIME_SLICE.START, PACKET_TIME_SLICE.END);
