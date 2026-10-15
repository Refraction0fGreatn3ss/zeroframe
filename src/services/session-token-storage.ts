export const SESSION_TOKEN_STORAGE_KEY = 'zf_session_token';

// Demo seed token so the console is usable before the first login round-trip.
const SEED_SESSION_TOKEN = 'zf-session-tok-prod-8841-lead';

export function restoreSessionToken(): string {
  try {
    const storedToken = sessionStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
    if (storedToken) {
      return storedToken;
    }
    sessionStorage.setItem(SESSION_TOKEN_STORAGE_KEY, SEED_SESSION_TOKEN);
    return SEED_SESSION_TOKEN;
  } catch {
    return SEED_SESSION_TOKEN;
  }
}

export function persistSessionToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
    }
  } catch {
    // Storage can be unavailable (private mode, sandboxed iframes); the in-memory token still works.
  }
}
