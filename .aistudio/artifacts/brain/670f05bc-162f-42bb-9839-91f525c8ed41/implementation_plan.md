# Implementation Plan - 50x Enterprise Security Hardening

Implement military-grade and high-assurance financial compliance security hardening (50x) for the ZeroFrame Enterprise console, prioritizing zero data remanence, automated DOM obfuscation, and configurable inactivity timeout enforcement.

---

## 1. User Choices & Requirements Synthesis

- **Primary Defense Vector**: Full memory scrub, DOM obfuscation, and cryptographic key destruction (Zero Remanence).
- **Inactivity Policy**: Configurable operator compliance profiles between **5 minutes** (Maximum Defense / SCIF), **10 minutes** (PCI-DSS / Healthcare), and **15 minutes** (NIST SP 800-53 AC-12 / SOC 2).
- **Grace Period & Warning**: Live 60-second countdown warning modal with synchronized cross-tab acknowledgement and keyboard-first extension.
- **Visual Design Standard**: High-density SOC dashboard layout following `frontend-design` constitution: zero-pill discipline, tabular numerals (`font-mono`, `tabular-nums`), single-elevation borders, and domain-authentic status states.

---

## 2. Architecture & Technical Strategy

### A. Configurable Inactivity Policy Engine
- **Supported Policies**:
  - `MAX_DEFENSE` (5 minutes = 300,000 ms, 30s–60s warning)
  - `FIN_COMPLIANCE` (10 minutes = 600,000 ms, 60s warning)
  - `STANDARD_NIST` (15 minutes = 900,000 ms, 60s warning)
- **State & Store Integration**:
  - Persist active policy in `auth-store` and `localStorage` (`zf_inactivity_policy`).
  - Broadcast policy changes to all tabs via `BroadcastChannel('zeroframe_auth_sync_bus')`.
  - Transmit configured policy to backend authority `/auth/ping` and `/auth/policy` for synchronized server-side verification.

### B. DOM Obfuscation & Privacy Screen Shielding
- **Component**: `src/components/shared/DOMPrivacyShield.tsx`
  - Automatically triggers when:
    1. Tab is hidden or loses focus (`document.hidden` or `!document.hasFocus()`) when high-security mode is enabled.
    2. Inactivity enters the final 60-second warning countdown.
    3. Operator manually triggers "Privacy Shield" from the TopBar Security HUD.
  - Features:
    - High-assurance frosted glass backdrop (`backdrop-blur-xl bg-black/85`).
    - Cryptographic hash watermark: `RESTRICTED COMPLIANCE BOUNDARY · ACTIVE TAMPER SEAL #ZF-SEC-8841`.
    - Live countdown ticker and "Click to Verify & Restore Display" interaction.

### C. Cryptographic Key Destruction & Memory Scrubbing (Zero Remanence)
- **Sanitization Protocol**:
  1. Overwrite session tokens and sensitive in-memory strings using cryptographic noise (`crypto.getRandomValues`) before dereferencing.
  2. Clear all browser storage items: `sessionStorage.clear()`, wipe `zf_*` keys from `localStorage`.
  3. Abort all in-flight network requests immediately (`apiClient.abortAll()`).
  4. Wipe memory stores in React (clear incident drafts, alert filters, PCAP buffers, and telemetry metrics).
  5. Close all active WebSockets with status code `4401` and reason `'OPERATOR_KEY_PURGE_INACTIVITY'`.
  6. Dispatch authoritative server-side ledger entry: `OPERATOR_KEY_PURGE_INACTIVITY` in `server/backend-authority.ts`.

### D. Anti-Brute Force & Unlock Rate Limiting
- Progressive exponential lockout delay:
  - 1–2 failed attempts: standard error banner.
  - 3–4 failed attempts: 10-second penalty lockout countdown.
  - 5+ failed attempts: 30-second penalty lockout with tamper alert dispatched to audit ledger.
- Option to cleanly switch operator or authenticate via full credentials.

---

## 3. Step-by-Step Implementation Sequence

1. **Backend Authority Updates (`server/backend-authority.ts`)**:
   - Update `authenticate` middleware to support dynamic policy durations (5m / 10m / 15m) passed per session.
   - Add endpoint `POST /api/v1/auth/policy` to update and synchronize the active tenant session policy.
   - Enhance audit log actions: record `SESSION_KEY_PURGE_INACTIVITY`, `PRIVACY_SHIELD_ENGAGED`, and `UNLOCK_RATE_LIMIT_TRIGGERED`.

2. **Auth Store Hardening (`src/stores/auth-store.ts`)**:
   - Add policy configuration: `inactivityPolicy: '5m' | '10m' | '15m'`.
   - Implement `setInactivityPolicy(policy)` with cross-tab broadcast and backend synchronization.
   - Add `isPrivacyShieldActive: boolean` and `togglePrivacyShield()`.
   - Implement zero-remanence memory overwriting in `executeLocalSessionRevocation`.

3. **DOM Privacy Shield Component (`src/components/shared/DOMPrivacyShield.tsx`)**:
   - Build a discreet, high-contrast security overlay with watermark hash and de-obfuscation controls.
   - Mount in `src/components/layout/AppShell.tsx`.

4. **Security HUD & Policy Selector in TopBar (`src/components/layout/TopBar.tsx`)**:
   - Add segmented policy selector (`5m`, `10m`, `15m`) inside the Session Security HUD popover.
   - Add manual "Engage Privacy Shield" trigger button.
   - Update live countdown display to reflect the active policy in real time.

5. **Inactivity Warning Modal & LockScreen Updates**:
   - Adapt countdown and warning threshold based on active policy profile.
   - Sync de-obfuscation and unlock actions with zero-trust credentials.

6. **Verification & Audit Check**:
   - Run `lint_applet` to verify TypeScript types and syntax.
   - Run `compile_applet` and `npm run build` to ensure production bundle integrity.
   - Validate policy switching and memory scrub behavior.
