import type { FC } from 'react';
import { useAppStore } from '../../stores/app-store';
import { ActionNotificationBanner } from './components/ActionNotificationBanner';
import { AirGapControls } from './components/AirGapControls';
import { OtAssetCatalog } from './components/OtAssetCatalog';
import { PacketInspectorPanel } from './components/PacketInspectorPanel';
import { ProtocolDissectorPanel } from './components/ProtocolDissectorPanel';
import { PurdueModelMap } from './components/PurdueModelMap';
import { ScadaHeader } from './components/ScadaHeader';
import { TelemetryKpiStrip } from './components/TelemetryKpiStrip';
import { useAirGapControls } from './hooks/use-air-gap-controls';
import { useDeviceSelection } from './hooks/use-device-selection';
import { usePacketInspector } from './hooks/use-packet-inspector';
import { INCIDENTS_PATH, OT_DEVICES, PCAP_PATH } from './scada-ot.data';

export const ScadaOtPage: FC = () => {
  const { setCurrentPath } = useAppStore();
  const airGap = useAirGapControls();
  const inspector = usePacketInspector();
  const { selectedDevice, setSelectedDevice } = useDeviceSelection();

  return (
    <div className="p-4 sm:p-5 space-y-4 text-slate-100 max-w-[1720px] mx-auto font-sans select-none">
      <ScadaHeader
        actions={
          <AirGapControls
            isDiodeIsolated={airGap.isDiodeIsolated}
            isReadOnlyInterlockEngaged={airGap.isReadOnlyInterlockEngaged}
            onToggleDiode={airGap.toggleDiode}
            onToggleInterlock={airGap.toggleInterlock}
          />
        }
      />

      {airGap.actionSuccessMsg && <ActionNotificationBanner message={airGap.actionSuccessMsg} />}

      <TelemetryKpiStrip />

      <PurdueModelMap />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start">
        <ProtocolDissectorPanel
          packets={inspector.filteredPackets}
          selectedPacketId={inspector.selectedPacket.id}
          onSelectPacket={inspector.setSelectedPacket}
          activeFilter={inspector.activeFilter}
          onFilterChange={inspector.setActiveFilter}
        />

        <PacketInspectorPanel
          packet={inspector.selectedPacket}
          onOpenIncidentDossier={() => setCurrentPath(INCIDENTS_PATH)}
          onExportPcap={() => setCurrentPath(PCAP_PATH)}
        />
      </div>

      <OtAssetCatalog devices={OT_DEVICES} selectedDeviceId={selectedDevice.id} onSelectDevice={setSelectedDevice} />
    </div>
  );
};
