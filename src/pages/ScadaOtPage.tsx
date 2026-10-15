/**
 * ZeroFrame NDR/XDR SCADA / OT & Industrial Grid Defense Cockpit
 * 
 * Domain-Native Industrial Control Systems (ICS) Architecture:
 * - Passive Optical Tap Telemetry across Purdue Model Levels 0-3
 * - Deep Industrial Protocol Dissection: Modbus TCP (FC01-FC16), DNP3, Siemens S7comm, IEC 60870-5-104
 * - Physical Hardware Air-Gap Data Diode Verification (Unidirectional Optical TX, 0 RX return path)
 * - Register Map & Force Coil Anomaly Inspector with MITRE ATT&CK for ICS mappings
 * - Safety Instrumented Systems (SIS) & Emergency Shutdown (ESD) SIL-3 Loop Health
 * - Anti-AI-Slop discipline: Zero static pills, unboxed typography, tabular numerals
 */

import React, { useState } from 'react';
import { useInvestigationStore } from '../stores/investigation-store';
import { useAppStore } from '../stores/app-store';
import { ExportButton } from '../components/shared/ExportButton';
import {
  Cpu,
  Zap,
  Activity,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Lock,
  Layers,
  ArrowRight,
  Database,
  Download,
  Terminal,
  CheckCircle2,
  XCircle,
  FileCode,
  HardDrive,
  Sliders,
  ExternalLink,
} from 'lucide-react';

interface OtDevice {
  id: string;
  name: string;
  role: string;
  purdueLevel: 'Level 0' | 'Level 1' | 'Level 2' | 'Level 3';
  vendor: string;
  ip: string;
  mac: string;
  protocol: 'MODBUS_TCP' | 'DNP3' | 'S7COMM' | 'IEC_104';
  status: 'COMPROMISED' | 'SUSPICIOUS' | 'HEALTHY';
  firmwareVersion: string;
  keySwitchState: 'RUN' | 'REMOTE' | 'PROGRAM';
  lastCommand: string;
  lastCommandTime: string;
  criticality: 'CRITICAL_GRID' | 'SAFETY_INSTRUMENTED' | 'STANDARD_TELEMETRY';
}

interface OtProtocolPacket {
  id: string;
  timestamp: string;
  sourceIp: string;
  sourcePort: number;
  destIp: string;
  destPort: number;
  protocol: 'MODBUS_TCP' | 'DNP3' | 'S7COMM' | 'IEC_104';
  unitId?: number;
  functionCode: string;
  targetAddress: string;
  targetDescription: string;
  injectedValue: string;
  baselineValue: string;
  engineeringUnit: string;
  verdict: 'ATTACK_INJECTION' | 'ANOMALOUS_WRITE' | 'AUTHORIZED_POLL';
  mitreIcsTactic: string;
  hexDump: string[];
}

const OT_DEVICES: OtDevice[] = [
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

const OT_PACKETS: OtProtocolPacket[] = [
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
    hexDump: [
      '00 1f 00 00 00 06 01 05 00 2b ff 00',
      '..MBAP.. ....Unit FC.. Addr.. Val..',
    ],
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
    hexDump: [
      '03 00 00 23 02 f0 80 32 01 00 00 00 01 00 0e 00',
      '00 05 01 12 0a 10 02 00 02 00 00 84 00 00 20 00',
    ],
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
    hexDump: [
      '05 64 12 44 02 00 01 00 3c 1a 03 01 29 01 00 0e',
      '00 00 2a 00 c8 42 00 00 e4 88',
    ],
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
    hexDump: [
      '00 24 00 00 00 06 01 02 00 01 00 10',
      '..MBAP.. ....Unit FC.. Start. Count.',
    ],
  },
];

export const ScadaOtPage: React.FC = () => {
  const { setCurrentPath } = useAppStore();
  const [selectedDevice, setSelectedDevice] = useState<OtDevice>(OT_DEVICES[0]);
  const [selectedPacket, setSelectedPacket] = useState<OtProtocolPacket>(OT_PACKETS[0]);
  const [isDiodeIsolated, setIsDiodeIsolated] = useState(false);
  const [isReadOnlyInterlockEngaged, setIsReadOnlyInterlockEngaged] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MODBUS' | 'DNP3' | 'S7COMM'>('ALL');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const filteredPackets = activeFilter === 'ALL'
    ? OT_PACKETS
    : activeFilter === 'MODBUS'
    ? OT_PACKETS.filter((p) => p.protocol === 'MODBUS_TCP')
    : activeFilter === 'DNP3'
    ? OT_PACKETS.filter((p) => p.protocol === 'DNP3')
    : OT_PACKETS.filter((p) => p.protocol === 'S7COMM');

  const handleToggleDiode = () => {
    setIsDiodeIsolated((prev) => !prev);
    setActionSuccessMsg(
      !isDiodeIsolated
        ? 'Physical Hardware Data Diode Optical Link Tripped to STRICT ISOLATION. All egress uninspected channels physically cut.'
        : 'Physical Hardware Data Diode returned to 1-Way Optical Tap Monitoring.'
    );
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleToggleInterlock = () => {
    setIsReadOnlyInterlockEngaged((prev) => !prev);
    setActionSuccessMsg(
      !isReadOnlyInterlockEngaged
        ? 'PLC Read-Only Hardware Interlock Engaged! All Modbus write function codes (FC05/FC06/FC16) dropped at hardware tap.'
        : 'PLC Read-Only Hardware Interlock Disengaged.'
    );
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 text-slate-100 max-w-[1720px] mx-auto font-sans select-none">
      {/* Top Header & Air-Gap Diode Status */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>SCADA / OT & Industrial Grid Defense</span>
            </h1>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-cyan-400 font-medium">
              Purdue Model Levels 0–3 Passive Optical Tap
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time industrial protocol dissector, Modbus coil injection detector, and physical hardware data diode assurance.
          </p>
        </div>

        {/* Tactical Air-Gap Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleInterlock}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 border ${
              isReadOnlyInterlockEngaged
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                : 'bg-[#080c14] border-slate-700 hover:border-slate-500 text-slate-300'
            }`}
          >
            <Lock className={`w-3.5 h-3.5 ${isReadOnlyInterlockEngaged ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{isReadOnlyInterlockEngaged ? 'PLC Interlock: READ-ONLY ACTIVE' : 'Engage PLC Read-Only Lock'}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleDiode}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 border ${
              isDiodeIsolated
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-sm'
                : 'bg-amber-950/40 border-amber-600/70 hover:bg-amber-900/50 text-amber-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>{isDiodeIsolated ? 'Air-Gap: HARDWARE DISCONNECT' : 'Trip Air-Gap Diode'}</span>
          </button>

          <ExportButton
            resourceName="SCADA_OT_Telemetry"
            recordCount={OT_PACKETS.length}
            data={OT_PACKETS}
          />
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionSuccessMsg && (
        <div className="p-3 bg-[#0a1410] border border-emerald-600/60 rounded-md text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Hardware Telemetry & Air-Gap KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-mono">
        <div className="p-3 bg-[#090d16] border border-slate-800 rounded">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">ICS Devices Monitored</div>
          <div className="text-base font-bold text-slate-100 mt-1 tabular-nums">52 PLCs / RTUs</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">100% Optical Tap Visibility</div>
        </div>

        <div className="p-3 bg-[#090d16] border border-slate-800 rounded">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Physical Data Diode</div>
          <div className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>1-Way Optical</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">0 RX Return Channels</div>
        </div>

        <div className="p-3 bg-[#090d16] border border-slate-800 rounded">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Modbus/DNP3 Wire Rate</div>
          <div className="text-base font-bold text-slate-100 mt-1 tabular-nums">22,400 msg/s</div>
          <div className="text-[10px] text-slate-400 mt-0.5">0 Ring Drops · 0.08ms Jitter</div>
        </div>

        <div className="p-3 bg-[#090d16] border border-slate-800 rounded">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">SIL-3 Safety Loop (SIS)</div>
          <div className="text-base font-bold text-emerald-400 mt-1">8/8 Armed & Nominal</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Triconex Trident Interlock</div>
        </div>

        <div className="p-3 bg-[#090d16] border border-slate-800 rounded">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Key Switch Hardware</div>
          <div className="text-base font-bold text-amber-400 mt-1">1 In REMOTE State</div>
          <div className="text-[10px] text-rose-400 mt-0.5">RTU-402 Unlocked to Modbus</div>
        </div>

        <div className="p-3 bg-[#090d16] border border-slate-800 rounded">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Active OT Anomaly</div>
          <div className="text-base font-bold text-rose-400 mt-1 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>FC05 Breaker Trip</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">MITRE ATT&CK T0855</div>
        </div>
      </div>

      {/* Purdue Model Level Hierarchy Map */}
      <div className="p-3.5 bg-[#090d16] border border-slate-800 rounded space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">
              Purdue Model Architecture Segmentation & Real-Time Threat State
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            ISA/IEC 62443 Security Zones & Conduits
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs font-mono">
          {/* Level 0/1: Field & Direct Control */}
          <div className="p-2.5 rounded bg-[#060911] border border-rose-900/60 space-y-2">
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-rose-900/40">
              <span className="text-rose-400 font-bold">LEVEL 0 & 1 · FIELD CONTROL</span>
              <span className="text-rose-400 font-mono text-[10px] px-1 bg-rose-500/20 rounded">THREAT DETECTED</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Protective relays, PLCs, RTUs, and turbine governors. Direct actuator and coil force control.
            </p>
            <div className="space-y-1 text-[11px]">
              <div className="p-1 rounded bg-rose-950/40 text-rose-300 flex items-center justify-between">
                <span>RTU-SUBSTATION-04-RELAY</span>
                <span className="text-[10px] font-bold">MODBUS FC05 TRIP</span>
              </div>
              <div className="p-1 rounded bg-[#0b0f19] text-amber-300 flex items-center justify-between">
                <span>PLC-TURBINE-GOVERNOR-01</span>
                <span className="text-[10px]">S7comm Poll</span>
              </div>
              <div className="p-1 rounded bg-[#0b0f19] text-emerald-400 flex items-center justify-between">
                <span>SIS-EMERGENCY-TRICORE-01</span>
                <span className="text-[10px]">SIL-3 Armed</span>
              </div>
            </div>
          </div>

          {/* Level 2: Supervisory SCADA */}
          <div className="p-2.5 rounded bg-[#060911] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800">
              <span className="text-slate-200 font-bold">LEVEL 2 · SCADA SUPERVISORY</span>
              <span className="text-emerald-400 font-mono text-[10px]">TAP ACTIVE</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              InTouch HMI operator consoles and engineering engineering stations managing telemetry polling.
            </p>
            <div className="space-y-1 text-[11px]">
              <div className="p-1 rounded bg-[#0b0f19] text-slate-300 flex items-center justify-between">
                <span>HMI-SCADA-SUPERVISOR-01</span>
                <span className="text-[10px] text-slate-500">192.168.100.10</span>
              </div>
              <div className="p-1 rounded bg-rose-950/30 text-rose-300 flex items-center justify-between">
                <span>ENG-WORKSTATION-ROGUE</span>
                <span className="text-[10px] text-rose-400 font-bold">192.168.100.99</span>
              </div>
            </div>
          </div>

          {/* Air-Gap Barrier */}
          <div className="p-2.5 rounded bg-[#0a121d] border border-cyan-800/80 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-cyan-800/60">
              <span className="text-cyan-300 font-bold">PHYSICAL DATA DIODE</span>
              <span className="text-cyan-400 font-mono text-[10px] px-1 bg-cyan-500/20 rounded">TX OPTICAL</span>
            </div>
            <p className="text-[10px] text-slate-300 font-sans">
              Hardware optical transmitter to photodiode receiver. Guaranteed unidirectional air-gap barrier.
            </p>
            <div className="p-2 rounded bg-[#060b14] border border-cyan-700/50 text-[10px] text-cyan-200 space-y-1">
              <div className="flex justify-between">
                <span>Diode Model:</span>
                <span className="font-bold">Fox-IT DataDiode 1000</span>
              </div>
              <div className="flex justify-between">
                <span>Hardware State:</span>
                <span className="text-emerald-400 font-bold">Unidirectional TX Locked</span>
              </div>
              <div className="flex justify-between">
                <span>Reverse Frame Leak:</span>
                <span className="text-emerald-400 font-bold">0.00% (Physical Impossibility)</span>
              </div>
            </div>
          </div>

          {/* Level 3: Industrial DMZ & Enterprise */}
          <div className="p-2.5 rounded bg-[#060911] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800">
              <span className="text-slate-200 font-bold">LEVEL 3 · DMZ & HISTORIAN</span>
              <span className="text-emerald-400 font-mono text-[10px]">REPLICATION OK</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Replicated PI Historians and monitoring endpoints. No control messages permitted outward.
            </p>
            <div className="space-y-1 text-[11px]">
              <div className="p-1 rounded bg-[#0b0f19] text-slate-300 flex items-center justify-between">
                <span>HISTORIAN-OSISOFT-01</span>
                <span className="text-[10px] text-slate-500">192.168.100.5</span>
              </div>
              <div className="p-1 rounded bg-[#0b0f19] text-slate-400 flex items-center justify-between">
                <span>OT-JUMP-SERVER-01</span>
                <span className="text-[10px] text-emerald-400">mTLS Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Industrial Protocol Dissector & Device Inventory */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start">
        {/* Left Pane: Industrial Protocol Stream (7 cols) */}
        <div className="xl:col-span-7 bg-[#090d16] border border-slate-800 rounded overflow-hidden flex flex-col">
          <div className="p-3 bg-[#0d121f] border-b border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-100 font-semibold">Live Industrial Protocol Dissector</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-400">{filteredPackets.length} Captured Wire Packets</span>
            </div>

            {/* Protocol Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#060911] border border-slate-800 rounded p-0.5 text-[10px]">
              {(['ALL', 'MODBUS', 'DNP3', 'S7COMM'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    activeFilter === f
                      ? 'bg-slate-800 text-cyan-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#060911] border-b border-slate-800 text-slate-500 text-[10px] uppercase font-semibold">
                <tr>
                  <th className="py-2 px-3">Packet ID</th>
                  <th className="py-2 px-3">Protocol / Unit</th>
                  <th className="py-2 px-3">Source &rarr; Target</th>
                  <th className="py-2 px-3">Function Code</th>
                  <th className="py-2 px-3">Register / Coil</th>
                  <th className="py-2 px-3 text-right">Injected Value</th>
                  <th className="py-2 px-3 text-center">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredPackets.map((pkt) => {
                  const isSelected = selectedPacket.id === pkt.id;
                  return (
                    <tr
                      key={pkt.id}
                      onClick={() => setSelectedPacket(pkt)}
                      className={`hover:bg-[#12192b] transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#131c33] text-white' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-cyan-300">{pkt.id}</span>
                        <div className="text-[10px] text-slate-500">{pkt.timestamp.slice(11, 19)}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300">
                          {pkt.protocol}
                        </span>
                        {pkt.unitId !== undefined && (
                          <span className="text-[10px] text-slate-500 ml-1">U:{pkt.unitId}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-[11px]">
                        <div>{pkt.sourceIp}:{pkt.sourcePort}</div>
                        <div className="text-slate-500">&rarr; {pkt.destIp}:{pkt.destPort}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] font-medium text-slate-200">
                        {pkt.functionCode}
                      </td>
                      <td className="py-2.5 px-3 text-[11px]">
                        <div className="text-slate-300 font-semibold">{pkt.targetAddress}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{pkt.targetDescription}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right text-[11px] font-semibold">
                        <span className={pkt.verdict === 'ATTACK_INJECTION' ? 'text-rose-400' : 'text-slate-300'}>
                          {pkt.injectedValue}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {pkt.verdict === 'ATTACK_INJECTION' && (
                          <span className="text-[10px] font-bold text-rose-400 flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span>INJECTION</span>
                          </span>
                        )}
                        {pkt.verdict === 'ANOMALOUS_WRITE' && (
                          <span className="text-[10px] font-bold text-amber-400 flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>OVERRIDE</span>
                          </span>
                        )}
                        {pkt.verdict === 'AUTHORIZED_POLL' && (
                          <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            <span>NORMAL</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Dissector Summary Footer */}
          <div className="p-2.5 bg-[#070b14] border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>Tap Interface: SENSOR-SCADA-OPTICAL-01 (enp4s0f0)</span>
            <span className="text-rose-400 font-semibold">Unauthenticated FC05 Injection Flagged</span>
          </div>
        </div>

        {/* Right Pane: Deep Packet & Register Map Inspector (5 cols) */}
        <div className="xl:col-span-5 bg-[#090d16] border border-slate-800 rounded overflow-hidden flex flex-col">
          <div className="p-3 bg-[#0d121f] border-b border-slate-800 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-slate-200">
                SCADA Dissection: {selectedPacket.id}
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-300 font-bold">
              {selectedPacket.protocol}
            </span>
          </div>

          <div className="p-4 space-y-4 font-mono text-xs">
            {/* Target Asset & Physical Grid Impact */}
            <div className="p-3 bg-[#060911] border border-slate-800 rounded space-y-2">
              <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800/80">
                <span className="text-slate-400 font-semibold">Target Grid Device:</span>
                <span className="text-cyan-400 font-bold">{selectedPacket.destIp}</span>
              </div>
              <div className="text-xs text-slate-200 font-semibold">
                {selectedPacket.targetDescription}
              </div>
              <div className="text-[11px] text-slate-400">
                Target Address: <span className="text-amber-400">{selectedPacket.targetAddress}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Baseline Normal: <span className="text-emerald-400">{selectedPacket.baselineValue}</span>
              </div>
              <div className="text-[11px] text-rose-400 font-bold">
                Injected Payload: {selectedPacket.injectedValue}
              </div>
            </div>

            {/* MITRE ATT&CK for ICS Attribution */}
            <div className="p-3 bg-[#0f111a] border border-rose-900/60 rounded space-y-1.5">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                <span>MITRE ATT&CK for ICS</span>
                <span className="px-1 py-0.5 rounded bg-rose-500/20 text-rose-300">T0855</span>
              </div>
              <div className="text-xs font-semibold text-slate-100">
                {selectedPacket.mitreIcsTactic}
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Adversary injected a direct Function Code 05 command from an unauthenticated IP address (192.168.100.99) outside of scheduled maintenance window.
              </p>
            </div>

            {/* Raw Wire Hex Dump */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Modbus / ICS PDU Frame Bytes</span>
                <span className="text-slate-500">Offset 0x0000</span>
              </div>
              <div className="p-2.5 rounded bg-[#05070c] border border-slate-900 space-y-1 font-mono text-[11px]">
                {selectedPacket.hexDump.map((line, idx) => (
                  <div key={idx} className={idx % 2 === 0 ? 'text-cyan-300' : 'text-slate-500 text-[10px]'}>
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Containment & Forensic Pivot Actions */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Immediate Incident Response Actions
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPath('/investigate/incidents');
                  }}
                  className="py-2 px-3 rounded bg-[#131b2e] hover:bg-[#1b2640] border border-cyan-800/80 text-cyan-300 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open Incident Dossier</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPath('/evidence/pcap');
                  }}
                  className="py-2 px-3 rounded bg-[#0e1422] hover:bg-[#151e33] border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export PCAP Slice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Asset Inventory Table (Purdue Level 0-3) */}
      <div className="bg-[#090d16] border border-slate-800 rounded overflow-hidden space-y-0">
        <div className="p-3 bg-[#0d121f] border-b border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-100">
              Operational Technology & SCADA Asset Catalog
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-cyan-400">{OT_DEVICES.length} High-Assurance Field Assets</span>
          </div>
          <span className="text-slate-500 text-[10px]">Purdue Level 0–3 Grid Hardware</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#060911] border-b border-slate-800 text-slate-500 text-[10px] uppercase font-semibold">
              <tr>
                <th className="py-2 px-3">Device Identifier</th>
                <th className="py-2 px-3">Purdue Level</th>
                <th className="py-2 px-3">Hardware Vendor & Model</th>
                <th className="py-2 px-3">IP / MAC Address</th>
                <th className="py-2 px-3">Protocol</th>
                <th className="py-2 px-3">Firmware</th>
                <th className="py-2 px-3">Key Switch</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {OT_DEVICES.map((dev) => (
                <tr
                  key={dev.id}
                  onClick={() => setSelectedDevice(dev)}
                  className={`hover:bg-[#12192b] transition-colors cursor-pointer ${
                    selectedDevice.id === dev.id ? 'bg-[#131c33]' : ''
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-100">{dev.name}</div>
                    <div className="text-[10px] text-cyan-400">{dev.id}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300">
                      {dev.purdueLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px]">{dev.vendor}</td>
                  <td className="py-2.5 px-3 text-[11px]">
                    <div>{dev.ip}</div>
                    <div className="text-slate-500 text-[10px]">{dev.mac}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-200">{dev.protocol}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{dev.firmwareVersion}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        dev.keySwitchState === 'REMOTE'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {dev.keySwitchState}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {dev.status === 'COMPROMISED' && (
                      <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span>COMPROMISED</span>
                      </span>
                    )}
                    {dev.status === 'SUSPICIOUS' && (
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>SUSPICIOUS</span>
                      </span>
                    )}
                    {dev.status === 'HEALTHY' && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>ARMED</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
