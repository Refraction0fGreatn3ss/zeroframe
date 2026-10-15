import { useState } from 'react';
import { OT_DEVICES } from '../scada-ot.data';
import type { OtDevice } from '../scada-ot.types';

export const useDeviceSelection = () => {
  const [selectedDevice, setSelectedDevice] = useState<OtDevice>(OT_DEVICES[0]);
  return { selectedDevice, setSelectedDevice };
};
