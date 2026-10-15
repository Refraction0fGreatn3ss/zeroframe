export function getErrorMessage(error: unknown): string | undefined;
export function getErrorMessage(error: unknown, fallback: string): string;
export function getErrorMessage(error: unknown, fallback?: string): string | undefined {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const { message } = error;
    if (typeof message === 'string' && message) {
      return message;
    }
  }
  return fallback;
}
