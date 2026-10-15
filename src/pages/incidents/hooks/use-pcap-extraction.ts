import { useState } from 'react';
import { getErrorMessage } from '../../../lib/error-message';
import { evidenceService } from '../../../services/evidence-service';
import { useAppStore } from '../../../stores/app-store';
import type { SecurityIncident } from '../../../types';
import { PCAP_CAPTURE_DURATION_SECONDS, PCAP_REDIRECT_DELAY_MS, ROUTES } from '../incidents.data';

export const usePcapExtraction = (incident: SecurityIncident | undefined) => {
  const { setCurrentPath } = useAppStore();
  const [isExtractingPcap, setIsExtractingPcap] = useState(false);
  const [pcapStatus, setPcapStatus] = useState<string | null>(null);

  const extractPcap = async () => {
    if (!incident?.primaryVictim?.ip) return;
    setIsExtractingPcap(true);
    setPcapStatus('Extracting buffer slice...');
    try {
      await evidenceService.startPcapCapture(incident.primaryVictim.ip, PCAP_CAPTURE_DURATION_SECONDS);
      setPcapStatus('Extraction initiated');
      setTimeout(() => {
        setCurrentPath(ROUTES.pcapEvidence);
      }, PCAP_REDIRECT_DELAY_MS);
    } catch (err: unknown) {
      setPcapStatus(`Extraction error: ${getErrorMessage(err, 'Failed')}`);
    } finally {
      setIsExtractingPcap(false);
    }
  };

  return { isExtractingPcap, pcapStatus, extractPcap };
};
