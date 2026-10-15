const CERT_SERIAL_INDEX_OFFSET = 10;

export const formatCertSerial = (index: number): string => `4F:9A:${index + CERT_SERIAL_INDEX_OFFSET}:BC:01:E4:77`;

export const toDateOnly = (isoTimestamp: string): string => isoTimestamp.split('T')[0];
