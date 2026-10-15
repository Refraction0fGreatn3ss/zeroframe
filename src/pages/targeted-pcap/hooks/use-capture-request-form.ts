import { useState } from 'react';
import { DEFAULT_BPF_FILTER, DEFAULT_JOB_NAME, DEFAULT_PACKET_LIMIT } from '../targeted-pcap.data';

export const useCaptureRequestForm = () => {
  const [bpfFilter, setBpfFilter] = useState(DEFAULT_BPF_FILTER);
  const [jobName, setJobName] = useState(DEFAULT_JOB_NAME);
  const [packetLimit, setPacketLimit] = useState(DEFAULT_PACKET_LIMIT);

  return { bpfFilter, setBpfFilter, jobName, setJobName, packetLimit, setPacketLimit };
};
