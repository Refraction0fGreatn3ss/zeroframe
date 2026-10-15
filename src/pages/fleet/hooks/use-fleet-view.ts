import { useState } from 'react';
import type { SensorNode } from '../../../types/fleet';
import type { FleetViewTab, SensorDrawerTab } from '../fleet.types';

export const useFleetView = () => {
  const [activeViewTab, setActiveViewTab] = useState<FleetViewTab>('SENSORS');
  const [activeDrawerSensor, setActiveDrawerSensor] = useState<SensorNode | null>(null);
  const [drawerSubTab, setDrawerSubTab] = useState<SensorDrawerTab>('TELEMETRY');

  const openSensorDrawer = (sensor: SensorNode, tab: SensorDrawerTab) => {
    setActiveDrawerSensor(sensor);
    setDrawerSubTab(tab);
  };

  const closeSensorDrawer = () => setActiveDrawerSensor(null);

  return {
    activeViewTab,
    setActiveViewTab,
    activeDrawerSensor,
    drawerSubTab,
    setDrawerSubTab,
    openSensorDrawer,
    closeSensorDrawer,
  };
};
