import { setPersistentEngine, windowPersistentEvents } from '@nanostores/persistent';

/**
 * localStorage behind try/catch. Private modes, blocked storage and full quotas
 * all fall back to memory so the shop keeps working for the session.
 */
const memory: Record<string, string> = {};

function ls(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export const safeStorage = new Proxy(memory, {
  get(_t, key: string) {
    try {
      const v = ls()?.getItem(key);
      if (v !== null && v !== undefined) return v;
    } catch {
      /* ignore */
    }
    return memory[key];
  },
  set(_t, key: string, value: string) {
    memory[key] = value;
    try {
      ls()?.setItem(key, value);
    } catch {
      /* ignore */
    }
    return true;
  },
  has(_t, key: string) {
    try {
      if (ls()?.getItem(key) != null) return true;
    } catch {
      /* ignore */
    }
    return key in memory;
  },
  deleteProperty(_t, key: string) {
    delete memory[key];
    try {
      ls()?.removeItem(key);
    } catch {
      /* ignore */
    }
    return true;
  },
});

if (typeof window !== 'undefined') {
  setPersistentEngine(safeStorage, windowPersistentEvents);
}

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = safeStorage[key];
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown) {
  try {
    safeStorage[key] = JSON.stringify(value);
  } catch {
    /* ignore */
  }
}

export function removeKey(key: string) {
  try {
    delete safeStorage[key];
  } catch {
    /* ignore */
  }
}
