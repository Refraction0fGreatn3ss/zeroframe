import type { FC } from 'react';
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard';
import { CaptureRequestBuilder } from './components/CaptureRequestBuilder';
import { PcapHeader } from './components/PcapHeader';
import { PcapJobsLedger } from './components/PcapJobsLedger';
import { RingBufferStatusBar } from './components/RingBufferStatusBar';
import { useCaptureRequestForm } from './hooks/use-capture-request-form';
import { usePcapJobs } from './hooks/use-pcap-jobs';
import { downloadPcap } from './targeted-pcap.utils';

export const TargetedPcapPage: FC = () => {
  const { bpfFilter, setBpfFilter, jobName, setJobName, packetLimit, setPacketLimit } = useCaptureRequestForm();
  const { jobs, isCapturingNew, startCapture, stopCapture } = usePcapJobs(bpfFilter);
  const { copiedKey: copiedHash, copy: copyHash } = useCopyToClipboard();

  return (
    <div className="p-4 sm:p-5 space-y-4 text-slate-100 max-w-[1720px] mx-auto font-sans select-none">
      <PcapHeader jobs={jobs} />

      <RingBufferStatusBar />

      <CaptureRequestBuilder
        jobName={jobName}
        bpfFilter={bpfFilter}
        packetLimit={packetLimit}
        isCapturing={isCapturingNew}
        onJobNameChange={setJobName}
        onBpfFilterChange={setBpfFilter}
        onPacketLimitChange={setPacketLimit}
        onStartCapture={() => startCapture(jobName, bpfFilter)}
      />

      <PcapJobsLedger
        jobs={jobs}
        copiedHash={copiedHash}
        onCopyHash={copyHash}
        onStop={stopCapture}
        onDownload={downloadPcap}
      />
    </div>
  );
};
