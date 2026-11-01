/**
 * Retrieves an existing session UUID from sessionStorage or generates a new one.
 * Ensures the session ID remains consistent for the current browser tab.
 */
export function getOrCreateSessionId(storage = (typeof window !== 'undefined' ? window.sessionStorage : null)) {
  const STORAGE_KEY = 'sahayak_session_id';
  try {
    let sessionId = storage?.getItem(STORAGE_KEY);
    if (!sessionId) {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        sessionId = crypto.randomUUID();
      } else {
        sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      storage?.setItem(STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch (err) {
    return 'fallback_session_' + Date.now();
  }
}

