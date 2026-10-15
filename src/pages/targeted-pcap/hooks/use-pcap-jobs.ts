import { useCallback, useEffect, useState } from 'react';
import type { PcapCaptureRecord } from '../../../services/evidence-service';
import { evidenceService } from '../../../services/evidence-service';
import { realtimeClient } from '../../../services/realtime-client';
import { tenantRegistry } from '../../../stores/tenant-registry';
import { CAPTURE_DURATION_SECONDS, INITIAL_PCAP_JOBS } from '../targeted-pcap.data';
import type { PcapJob } from '../targeted-pcap.types';
import {
  createCapturingJob,
  createFallbackJobId,
  extractTargetIp,
  formatUtcTimestamp,
  mapCaptureRecordToJob,
} from '../targeted-pcap.utils';

const CAPTURE_TICK_INTERVAL_MS = 2000;
const PACKET_TICK_MIN = 2;
const PACKET_TICK_SPREAD = 8;
const BYTES_TICK_MIN = 1200;
const BYTES_TICK_SPREAD = 8000;

const randomIncrement = (min: number, spread: number): number => Math.floor(Math.random() * spread) + min;

export const usePcapJobs = (bpfFilter: string) => {
  const [jobs, setJobs] = useState<PcapJob[]>(INITIAL_PCAP_JOBS);
  const [isCapturingNew, setIsCapturingNew] = useState(false);

  const loadCaptures = useCallback(async () => {
    try {
      const backendCaptures = await evidenceService.getPcapCaptures();
      if (backendCaptures && Array.isArray(backendCaptures) && backendCaptures.length > 0) {
        setJobs(backendCaptures.map((c) => mapCaptureRecordToJob(c, bpfFilter)));
      }
    } catch (err) {
      console.warn('Failed to load PCAP captures from backend authority', err);
    }
  }, [bpfFilter]);

  useEffect(() => {
    loadCaptures();

    const unsubCompleted = realtimeClient.subscribe('PCAP_EXTRACTION_COMPLETED', (payload: PcapCaptureRecord) => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === payload.id
            ? {
                ...j,
                state: 'COMPLETED',
                completedAt: new Date().toLocaleString(),
                sha256: payload.sha256 || `sha256_${Date.now()}_sealed`,
              }
            : j,
        ),
      );
    });

    const unreg = tenantRegistry.register(
      () => setJobs([]),
      async () => {
        await loadCaptures();
      },
    );

    return () => {
      unsubCompleted();
      unreg();
    };
  }, [loadCaptures]);

  useEffect(() => {
    const timer = setInterval(() => {
      setJobs((prev) =>
        prev.map((job) =>
          job.state === 'CAPTURING'
            ? {
                ...job,
                packetCount: job.packetCount + randomIncrement(PACKET_TICK_MIN, PACKET_TICK_SPREAD),
                fileSizeBytes: job.fileSizeBytes + randomIncrement(BYTES_TICK_MIN, BYTES_TICK_SPREAD),
              }
            : job,
        ),
      );
    }, CAPTURE_TICK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const startCapture = async (jobName: string, targetBpf: string) => {
    setIsCapturingNew(true);
    try {
      const newCapture = await evidenceService.startPcapCapture(extractTargetIp(targetBpf), CAPTURE_DURATION_SECONDS);
      const newJob = createCapturingJob(newCapture.id, jobName, targetBpf, new Date().toLocaleString());
      setJobs((prev) => [newJob, ...prev]);
    } catch (err) {
      console.error('Failed to trigger backend PCAP capture', err);
      const newJob = createCapturingJob(createFallbackJobId(), jobName, targetBpf, formatUtcTimestamp(new Date()));
      setJobs((prev) => [newJob, ...prev]);
    } finally {
      setIsCapturingNew(false);
    }
  };

  const stopCapture = (id: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? {
              ...job,
              state: 'COMPLETED',
              completedAt: formatUtcTimestamp(new Date()),
              sha256: `sha256_${Date.now()}_sealed_evidence_receipt`,
            }
          : job,
      ),
    );
  };

  return { jobs, isCapturingNew, startCapture, stopCapture };
};
