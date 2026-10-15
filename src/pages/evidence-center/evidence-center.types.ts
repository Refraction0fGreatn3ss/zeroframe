export interface EvidenceItem {
  id: string;
  title: string;
  type: string;
  state: string;
  incidentRef: string;
  sizeBytes: number;
  sha256: string;
  capturedBy: string;
  timestamp: string;
  sealedInVault: boolean;
}
