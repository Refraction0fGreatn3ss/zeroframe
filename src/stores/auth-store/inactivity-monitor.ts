const INTERACTION_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'keyup',
  'scroll',
  'touchstart',
  'touchmove',
  'pointerdown',
  'wheel',
];

const INTERACTION_THROTTLE_MS = 1000;
const EVALUATION_INTERVAL_MS = 1000;

export interface InactivityMonitorHooks {
  isSessionActive: () => boolean;
  onUserActivity: () => void;
  onEvaluate: () => void;
  onBackgrounded: () => void;
}

// Wall-clock evaluation (rather than a countdown timer) keeps the policy accurate across sleep and clock drift.
export function startInactivityMonitor(hooks: InactivityMonitorHooks): void {
  if (typeof window === 'undefined') return;

  let lastHandledInteraction = 0;
  const handleInteraction = () => {
    if (!hooks.isSessionActive()) return;
    const now = Date.now();
    if (now - lastHandledInteraction > INTERACTION_THROTTLE_MS) {
      lastHandledInteraction = now;
      hooks.onUserActivity();
    }
  };

  INTERACTION_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, handleInteraction, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      hooks.onBackgrounded();
    } else if (document.visibilityState === 'visible' && hooks.isSessionActive()) {
      hooks.onEvaluate();
    }
  });

  window.addEventListener('focus', () => {
    if (hooks.isSessionActive()) hooks.onEvaluate();
  });
  window.addEventListener('blur', hooks.onBackgrounded);

  setInterval(hooks.onEvaluate, EVALUATION_INTERVAL_MS);
}
