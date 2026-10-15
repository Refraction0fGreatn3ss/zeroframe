import type {
  DiodeSpec,
  OtDevice,
  OtDeviceStatus,
  OtProtocol,
  OtProtocolPacket,
  PacketVerdict,
  ProtocolFilter,
  PurdueZone,
  StatusIndicatorStyle,
} from './scada-ot.types';

export const OT_DEVICES: OtDevice[] = [
  {
    id: 'RTU-SUBSTATION-04-RELAY',
    name: 'Substation-04 Feeder Breaker 402',
    role: 'Protective Relay / RTU',
    purdueLevel: 'Level 1',
    vendor: 'Schneider Electric Micom P142',
    ip: '192.168.100.42',
    mac: '00:1c:73:40:02:42',
    protocol: 'MODBUS_TCP',
    status: 'COMPROMISED',
    firmwareVersion: 'v4.8-b11',
    keySwitchState: 'REMOTE',
    lastCommand: 'FC05 Write Single Coil (Trip Breaker)',
    lastCommandTime: '2m ago',
    criticality: 'CRITICAL_GRID',
  },
  {
    id: 'PLC-TURBINE-GOVERNOR-01',
    name: 'Gas Turbine #1 Speed Governor PLC',
    role: 'Primary Turbine Governor',
    purdueLevel: 'Level 1',
    vendor: 'Siemens S7-1500 (CPU 1516-3 PN/DP)',
    ip: '192.168.100.45',
    mac: '00:0e:8c:12:88:01',
    protocol: 'S7COMM',
    status: 'SUSPICIOUS',
    firmwareVersion: 'v2.9.4',
    keySwitchState: 'RUN',
    lastCommand: 'Job 0x28 CPU_CONTROL (Unauthorized Poll)',
    lastCommandTime: '6m ago',
    criticality: 'SAFETY_INSTRUMENTED',
  },
  {
    id: 'RTU-HYDRO-OUTSTATION-02',
    name: 'Hydro Spillway Gate Controller RTU',
    role: 'Remote Terminal Unit',
    purdueLevel: 'Level 1',
    vendor: 'ABB RTU560',
    ip: '192.168.100.48',
    mac: '00:50:c2:7b:44:90',
    protocol: 'DNP3',
    status: 'HEALTHY',
    firmwareVersion: 'v12.4.1',
    keySwitchState: 'RUN',
    lastCommand: 'Direct Operate SBO (Analog Out: 42.0%)',
    lastCommandTime: '12m ago',
    criticality: 'CRITICAL_GRID',
  },
  {
    id: 'SIS-EMERGENCY-TRICORE-01',
    name: 'Triconex SIL-3 Emergency Shutdown Unit',
    role: 'Safety Instrumented System (SIS)',
    purdueLevel: 'Level 1',
    vendor: 'Schneider Triconex Trident v3',
    ip: '192.168.100.50',
    mac: '00:60:4b:99:a0:10',
    protocol: 'MODBUS_TCP',
    status: 'HEALTHY',
    firmwareVersion: 'SIL-3 Hardened v10.2',
    keySwitchState: 'RUN',
    lastCommand: 'Heartbeat Read Discrete Inputs (FC02)',
    lastCommandTime: '10s ago',
    criticality: 'SAFETY_INSTRUMENTED',
  },
  {
    id: 'HMI-SCADA-SUPERVISOR-01',
    name: 'Central Dispatch SCADA Supervisory Workstation',
    role: 'SCADA HMI Server',
    purdueLevel: 'Level 2',
    vendor: 'AVEVA System Platform (InTouch 2023)',
    ip: '192.168.100.10',
    mac: '00:50:56:af:02:11',
    protocol: 'MODBUS_TCP',
    status: 'HEALTHY',
    firmwareVersion: 'Windows Server 2022 LTSC',
    keySwitchState: 'REMOTE',
    lastCommand: 'Periodic Telemetry Harvest (FC03)',
    lastCommandTime: '5s ago',
    criticality: 'CRITICAL_GRID',
  },
  {
    id: 'HISTORIAN-OSISOFT-01',
    name: 'Industrial Process Time-Series Historian',
    role: 'Level 3 Plant Historian',
    purdueLevel: 'Level 3',
    vendor: 'AVEVA PI Server / OSISoft',
    ip: '192.168.100.5',
    mac: '00:50:56:bb:91:04',
    protocol: 'IEC_104',
    status: 'HEALTHY',
    firmwareVersion: 'v2023-SP1',
    keySwitchState: 'RUN',
    lastCommand: 'Interrogation Command (C_IC_NA_1)',
    lastCommandTime: '1m ago',
    criticality: 'STANDARD_TELEMETRY',
  },
];

export const OT_PACKETS: OtProtocolPacket[] = [
  {
    id: 'OT-PKT-9901',
    timestamp: '2026-10-14T11:08:42.190Z',
    sourceIp: '192.168.100.99',
    sourcePort: 50220,
    destIp: '192.168.100.42',
    destPort: 502,
    protocol: 'MODBUS_TCP',
    unitId: 1,
    functionCode: '0x05 (Force Single Coil)',
    targetAddress: 'Coil 0x002B (Decimal 43)',
    targetDescription: 'Substation-04 132kV Main Bus Breaker Trip Coil',
    injectedValue: '0xFF00 (TRIP / FORCE OPEN)',
    baselineValue: '0x0000 (CLOSED / NORMAL ENERGIZED)',
    engineeringUnit: 'Breaker State: TRIP',
    verdict: 'ATTACK_INJECTION',
    mitreIcsTactic: 'T0855 Unauthorized Command Message · Impact',
    hexDump: ['00 1f 00 00 00 06 01 05 00 2b ff 00', '..MBAP.. ....Unit FC.. Addr.. Val..'],
  },
  {
    id: 'OT-PKT-9902',
    timestamp: '2026-10-14T11:05:11.840Z',
    sourceIp: '192.168.100.99',
    sourcePort: 49182,
    destIp: '192.168.100.45',
    destPort: 102,
    protocol: 'S7COMM',
    functionCode: 'Job 0x28 (PLC CPU Control)',
    targetAddress: 'CPU Block DB101.DBX4.0',
    targetDescription: 'Turbine Speed Governor Overspeed Trip Threshold',
    injectedValue: '0x0E10 (3600 RPM -> Overridden to 4800 RPM)',
    baselineValue: '0x0E10 (3600 RPM Standard 60Hz)',
    engineeringUnit: 'Turbine RPM: 4800',
    verdict: 'ANOMALOUS_WRITE',
    mitreIcsTactic: 'T0831 Manipulation of Control · Impair Process',
    hexDump: ['03 00 00 23 02 f0 80 32 01 00 00 00 01 00 0e 00', '00 05 01 12 0a 10 02 00 02 00 00 84 00 00 20 00'],
  },
  {
    id: 'OT-PKT-9903',
    timestamp: '2026-10-14T11:02:04.112Z',
    sourceIp: '192.168.100.10',
    sourcePort: 51200,
    destIp: '192.168.100.48',
    destPort: 20000,
    protocol: 'DNP3',
    functionCode: '0x03 (Select-Before-Operate)',
    targetAddress: 'Analog Output Point #14',
    targetDescription: 'Spillway Gate Elevation Target Servo',
    injectedValue: 'Value: 42.0% Open',
    baselineValue: 'Value: 42.0% Open',
    engineeringUnit: 'Gate Opening: 42.0%',
    verdict: 'AUTHORIZED_POLL',
    mitreIcsTactic: 'T0801 Monitor Process State (Authorized Dispatch)',
    hexDump: ['05 64 12 44 02 00 01 00 3c 1a 03 01 29 01 00 0e', '00 00 2a 00 c8 42 00 00 e4 88'],
  },
  {
    id: 'OT-PKT-9904',
    timestamp: '2026-10-14T10:59:18.990Z',
    sourceIp: '192.168.100.10',
    sourcePort: 50201,
    destIp: '192.168.100.50',
    destPort: 502,
    protocol: 'MODBUS_TCP',
    unitId: 1,
    functionCode: '0x02 (Read Discrete Inputs)',
    targetAddress: 'Inputs 0x0001 - 0x0010',
    targetDescription: 'SIL-3 Safety Loop Interlock Sensors',
    injectedValue: 'Read 16 Discrete Bits (All Safe 0x0000)',
    baselineValue: '0x0000 (Safe State)',
    engineeringUnit: 'Interlock Loop: NORMAL',
    verdict: 'AUTHORIZED_POLL',
    mitreIcsTactic: 'T0801 Routine Safety Interlock Polling',
    hexDump: ['00 24 00 00 00 06 01 02 00 01 00 10', '..MBAP.. ....Unit FC.. Start. Count.'],
  },
];

export const PROTOCOL_FILTERS: readonly ProtocolFilter[] = ['ALL', 'MODBUS', 'DNP3', 'S7COMM'];

export const PROTOCOL_FILTER_TARGETS: Record<Exclude<ProtocolFilter, 'ALL'>, OtProtocol> = {
  MODBUS: 'MODBUS_TCP',
  DNP3: 'DNP3',
  S7COMM: 'S7COMM',
};

export const PACKET_VERDICT_STYLES: Record<PacketVerdict, StatusIndicatorStyle> = {
  ATTACK_INJECTION: {
    className: 'text-[10px] font-bold text-rose-400 flex items-center justify-center gap-1',
    dotClassName: 'w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse',
    label: 'INJECTION',
  },
  ANOMALOUS_WRITE: {
    className: 'text-[10px] font-bold text-amber-400 flex items-center justify-center gap-1',
    dotClassName: 'w-1.5 h-1.5 rounded-full bg-amber-500',
    label: 'OVERRIDE',
  },
  AUTHORIZED_POLL: {
    className: 'text-[10px] text-slate-500 flex items-center justify-center gap-1',
    dotClassName: 'w-1.5 h-1.5 rounded-full bg-slate-600',
    label: 'NORMAL',
  },
};

export const DEVICE_STATUS_STYLES: Record<OtDeviceStatus, StatusIndicatorStyle> = {
  COMPROMISED: {
    className: 'text-[10px] font-bold text-rose-400 flex items-center gap-1',
    dotClassName: 'w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse',
    label: 'COMPROMISED',
  },
  SUSPICIOUS: {
    className: 'text-[10px] font-bold text-amber-400 flex items-center gap-1',
    dotClassName: 'w-1.5 h-1.5 rounded-full bg-amber-500',
    label: 'SUSPICIOUS',
  },
  HEALTHY: {
    className: 'text-[10px] text-emerald-400 flex items-center gap-1',
    dotClassName: 'w-1.5 h-1.5 rounded-full bg-emerald-500',
    label: 'ARMED',
  },
};

export const FIELD_CONTROL_ZONE: PurdueZone = {
  title: 'LEVEL 0 & 1 · FIELD CONTROL',
  status: 'THREAT DETECTED',
  description: 'Protective relays, PLCs, RTUs, and turbine governors. Direct actuator and coil force control.',
  containerClassName: 'p-2.5 rounded bg-[#060911] border border-rose-900/60 space-y-2',
  headerBorderClassName: 'border-rose-900/40',
  titleClassName: 'text-rose-400 font-bold',
  statusClassName: 'text-rose-400 font-mono text-[10px] px-1 bg-rose-500/20 rounded',
  descriptionClassName: 'text-[10px] text-slate-400 font-sans',
  devices: [
    {
      name: 'RTU-SUBSTATION-04-RELAY',
      detail: 'MODBUS FC05 TRIP',
      toneClassName: 'bg-rose-950/40 text-rose-300',
      detailClassName: 'text-[10px] font-bold',
    },
    {
      name: 'PLC-TURBINE-GOVERNOR-01',
      detail: 'S7comm Poll',
      toneClassName: 'bg-[#0b0f19] text-amber-300',
      detailClassName: 'text-[10px]',
    },
    {
      name: 'SIS-EMERGENCY-TRICORE-01',
      detail: 'SIL-3 Armed',
      toneClassName: 'bg-[#0b0f19] text-emerald-400',
      detailClassName: 'text-[10px]',
    },
  ],
};

export const SUPERVISORY_ZONE: PurdueZone = {
  title: 'LEVEL 2 · SCADA SUPERVISORY',
  status: 'TAP ACTIVE',
  description: 'InTouch HMI operator consoles and engineering engineering stations managing telemetry polling.',
  containerClassName: 'p-2.5 rounded bg-[#060911] border border-slate-800 space-y-2',
  headerBorderClassName: 'border-slate-800',
  titleClassName: 'text-slate-200 font-bold',
  statusClassName: 'text-emerald-400 font-mono text-[10px]',
  descriptionClassName: 'text-[10px] text-slate-400 font-sans',
  devices: [
    {
      name: 'HMI-SCADA-SUPERVISOR-01',
      detail: '192.168.100.10',
      toneClassName: 'bg-[#0b0f19] text-slate-300',
      detailClassName: 'text-[10px] text-slate-500',
    },
    {
      name: 'ENG-WORKSTATION-ROGUE',
      detail: '192.168.100.99',
      toneClassName: 'bg-rose-950/30 text-rose-300',
      detailClassName: 'text-[10px] text-rose-400 font-bold',
    },
  ],
};

export const DMZ_HISTORIAN_ZONE: PurdueZone = {
  title: 'LEVEL 3 · DMZ & HISTORIAN',
  status: 'REPLICATION OK',
  description: 'Replicated PI Historians and monitoring endpoints. No control messages permitted outward.',
  containerClassName: 'p-2.5 rounded bg-[#060911] border border-slate-800 space-y-2',
  headerBorderClassName: 'border-slate-800',
  titleClassName: 'text-slate-200 font-bold',
  statusClassName: 'text-emerald-400 font-mono text-[10px]',
  descriptionClassName: 'text-[10px] text-slate-400 font-sans',
  devices: [
    {
      name: 'HISTORIAN-OSISOFT-01',
      detail: '192.168.100.5',
      toneClassName: 'bg-[#0b0f19] text-slate-300',
      detailClassName: 'text-[10px] text-slate-500',
    },
    {
      name: 'OT-JUMP-SERVER-01',
      detail: 'mTLS Verified',
      toneClassName: 'bg-[#0b0f19] text-slate-400',
      detailClassName: 'text-[10px] text-emerald-400',
    },
  ],
};

export const DATA_DIODE_ZONE: Omit<PurdueZone, 'devices'> = {
  title: 'PHYSICAL DATA DIODE',
  status: 'TX OPTICAL',
  description: 'Hardware optical transmitter to photodiode receiver. Guaranteed unidirectional air-gap barrier.',
  containerClassName: 'p-2.5 rounded bg-[#0a121d] border border-cyan-800/80 space-y-2 relative overflow-hidden',
  headerBorderClassName: 'border-cyan-800/60',
  titleClassName: 'text-cyan-300 font-bold',
  statusClassName: 'text-cyan-400 font-mono text-[10px] px-1 bg-cyan-500/20 rounded',
  descriptionClassName: 'text-[10px] text-slate-300 font-sans',
};

export const DATA_DIODE_SPECS: readonly DiodeSpec[] = [
  { label: 'Diode Model:', value: 'Fox-IT DataDiode 1000', valueClassName: 'font-bold' },
  { label: 'Hardware State:', value: 'Unidirectional TX Locked', valueClassName: 'text-emerald-400 font-bold' },
  {
    label: 'Reverse Frame Leak:',
    value: '0.00% (Physical Impossibility)',
    valueClassName: 'text-emerald-400 font-bold',
  },
];

export const AIR_GAP_MESSAGES = {
  DIODE_ISOLATED:
    'Physical Hardware Data Diode Optical Link Tripped to STRICT ISOLATION. All egress uninspected channels physically cut.',
  DIODE_RESTORED: 'Physical Hardware Data Diode returned to 1-Way Optical Tap Monitoring.',
  INTERLOCK_ENGAGED:
    'PLC Read-Only Hardware Interlock Engaged! All Modbus write function codes (FC05/FC06/FC16) dropped at hardware tap.',
  INTERLOCK_DISENGAGED: 'PLC Read-Only Hardware Interlock Disengaged.',
} as const;

export const ACTION_MESSAGE_DURATION_MS = 4000;

export const INCIDENTS_PATH = '/investigate/incidents';
export const PCAP_PATH = '/evidence/pcap';

export const PACKET_TIME_SLICE = { START: 11, END: 19 } as const;
