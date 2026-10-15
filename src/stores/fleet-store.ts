import { DEFAULT_SENSORS } from '../data/fleet.data';
import { createStore, useStore } from '../lib/create-store';
import { systemService } from '../services/system-service';
import type { SensorNode } from '../types/fleet';
import { tenantRegistry } from './tenant-registry';

interface FleetState {
  sensors: SensorNode[];
  selectedSensorId: string | null;
  isLoading: boolean;
}

const fleetStore = createStore<FleetState>({
  sensors: DEFAULT_SENSORS,
  selectedSensorId: DEFAULT_SENSORS[0].id,
  isLoading: false,
});

function resolveSelectedSensorId(sensors: SensorNode[], currentId: string | null): string | null {
  if (sensors.length === 0) {
    return null;
  }
  const stillPresent = currentId !== null && sensors.some((sensor) => sensor.id === currentId);
  return stillPresent ? currentId : sensors[0].id;
}

async function loadSensors() {
  fleetStore.setState({ isLoading: true });
  try {
    const list: SensorNode[] | undefined = await systemService.getFleetSensors();
    const sensors = list || [];
    fleetStore.setState((state) => ({
      sensors,
      selectedSensorId: resolveSelectedSensorId(sensors, state.selectedSensorId),
    }));
  } catch (err) {
    console.warn('[Fleet Store] Error loading fleet', err);
  } finally {
    fleetStore.setState({ isLoading: false });
  }
}

loadSensors();

tenantRegistry.register(
  () => fleetStore.setState({ sensors: [] }),
  async () => {
    await loadSensors();
  },
);

export const fleetActions = {
  selectSensor: (id: string) => fleetStore.setState({ selectedSensorId: id }),
  refreshFleet: loadSensors,
};

function findSelectedSensor({ sensors, selectedSensorId }: FleetState): SensorNode {
  return sensors.find((sensor) => sensor.id === selectedSensorId) || sensors[0];
}

export function useFleetStore() {
  const state = useStore(fleetStore);
  return {
    ...state,
    selectedSensor: findSelectedSensor(state),
    ...fleetActions,
  };
}
