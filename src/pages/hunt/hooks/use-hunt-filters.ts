import { useMemo, useState } from 'react';
import { DEFAULT_HUNT_QUERY, DNS_TUNNELING_QUERY, WIRE_FLOWS } from '../hunt.data';
import type { ProtocolFilter, WireFlow } from '../hunt.types';
import { filterFlows } from '../hunt.utils';

export interface HuntFilters {
  query: string;
  setQuery: (query: string) => void;
  selectedProtocol: ProtocolFilter;
  setSelectedProtocol: (protocol: ProtocolFilter) => void;
  filteredFlows: WireFlow[];
  applyPortFilter: (port: number) => void;
  applyEntropyFilter: () => void;
  applyTimeBucketFilter: (time: string) => void;
  applyHostFilter: (hostId: string) => void;
}

export const useHuntFilters = (): HuntFilters => {
  const [query, setQuery] = useState(DEFAULT_HUNT_QUERY);
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolFilter>('ALL');

  const filteredFlows = useMemo(() => filterFlows(WIRE_FLOWS, query, selectedProtocol), [query, selectedProtocol]);

  return {
    query,
    setQuery,
    selectedProtocol,
    setSelectedProtocol,
    filteredFlows,
    applyPortFilter: (port) => setQuery(`dst_port=${port}`),
    applyEntropyFilter: () => setQuery(DNS_TUNNELING_QUERY),
    applyTimeBucketFilter: (time) => setQuery(`timestamp="${time}"`),
    applyHostFilter: (hostId) => setQuery(`host ${hostId}`),
  };
};
