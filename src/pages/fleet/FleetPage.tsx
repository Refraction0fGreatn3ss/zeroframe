import type { FC } from 'react';
import { useFleetStore } from '../../stores/fleet-store';
import { FleetHeader } from './components/FleetHeader';
import { FleetViewTabs } from './components/FleetViewTabs';
import { LifecyclePreflightView } from './components/LifecyclePreflightView';
import { MtlsCertificatesView } from './components/MtlsCertificatesView';
import { SensorAppliancesTable } from './components/SensorAppliancesTable';
import { SensorDrawer } from './components/SensorDrawer';
import { useFleetView } from './hooks/use-fleet-view';

export const FleetPage: FC = () => {
  const { sensors } = useFleetStore();
  const {
    activeViewTab,
    setActiveViewTab,
    activeDrawerSensor,
    drawerSubTab,
    setDrawerSubTab,
    openSensorDrawer,
    closeSensorDrawer,
  } = useFleetView();

  return (
    <div className="p-5 space-y-4 text-[#e6edf3] max-w-[1720px] mx-auto font-sans">
      <FleetHeader sensors={sensors} />

      <FleetViewTabs activeTab={activeViewTab} sensorCount={sensors.length} onSelect={setActiveViewTab} />

      {activeViewTab === 'SENSORS' && (
        <SensorAppliancesTable sensors={sensors} onSelectSensor={(sensor) => openSensorDrawer(sensor, 'TELEMETRY')} />
      )}

      {activeViewTab === 'PREFLIGHT' && <LifecyclePreflightView />}

      {activeViewTab === 'MTLS' && (
        <MtlsCertificatesView sensors={sensors} onSelectSensor={(sensor) => openSensorDrawer(sensor, 'CERTIFICATE')} />
      )}

      {activeDrawerSensor && (
        <SensorDrawer
          sensor={activeDrawerSensor}
          activeTab={drawerSubTab}
          onSelectTab={setDrawerSubTab}
          onClose={closeSensorDrawer}
        />
      )}
    </div>
  );
};
