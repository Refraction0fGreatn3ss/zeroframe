export type OtProtocol = 'MODBUS_TCP' | 'DNP3' | 'S7COMM' | 'IEC_104';

export type ProtocolFilter = 'ALL' | 'MODBUS' | 'DNP3' | 'S7COMM';

export type OtDeviceStatus = 'COMPROMISED' | 'SUSPICIOUS' | 'HEALTHY';

export type PacketVerdict = 'ATTACK_INJECTION' | 'ANOMALOUS_WRITE' | 'AUTHORIZED_POLL';

export interface OtDevice {
  id: string;
  name: string;
  role: string;
  purdueLevel: 'Level 0' | 'Level 1' | 'Level 2' | 'Level 3';
  vendor: string;
  ip: string;
  mac: string;
  protocol: OtProtocol;
  status: OtDeviceStatus;
  firmwareVersion: string;
  keySwitchState: 'RUN' | 'REMOTE' | 'PROGRAM';
  lastCommand: string;
  lastCommandTime: string;
  criticality: 'CRITICAL_GRID' | 'SAFETY_INSTRUMENTED' | 'STANDARD_TELEMETRY';
}

export interface OtProtocolPacket {
  id: string;
  timestamp: string;
  sourceIp: string;
  sourcePort: number;
  destIp: string;
  destPort: number;
  protocol: OtProtocol;
  unitId?: number;
  functionCode: string;
  targetAddress: string;
  targetDescription: string;
  injectedValue: string;
  baselineValue: string;
  engineeringUnit: string;
  verdict: PacketVerdict;
  mitreIcsTactic: string;
  hexDump: string[];
}

export interface StatusIndicatorStyle {
  className: string;
  dotClassName: string;
  label: string;
}

export interface ZoneDeviceRowData {
  name: string;
  detail: string;
  toneClassName: string;
  detailClassName: string;
}

export interface PurdueZone {
  title: string;
  status: string;
  description: string;
  containerClassName: string;
  headerBorderClassName: string;
  titleClassName: string;
  statusClassName: string;
  descriptionClassName: string;
  devices: ZoneDeviceRowData[];
}

export interface DiodeSpec {
  label: string;
  value: string;
  valueClassName: string;
}
