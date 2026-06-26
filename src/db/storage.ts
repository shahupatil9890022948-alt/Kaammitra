import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin JSON-document store on top of AsyncStorage.
 *
 * Each "collection" is persisted as a single JSON array under a namespaced key.
 * This keeps the MVP dependency-light (no native SQLite build step) while the
 * repository API below mirrors what a future SQLite/remote-sync layer would
 * expose, so swapping the backend later is a localized change.
 */

const PREFIX = 'kaammitra:v1:';

export async function readCollection<T>(name: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + name);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export async function writeCollection<T>(name: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(PREFIX + name, JSON.stringify(items));
}

export async function readDoc<T>(name: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + name);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function writeDoc<T>(name: string, value: T): Promise<void> {
  await AsyncStorage.setItem(PREFIX + name, JSON.stringify(value));
}

export async function clearAll(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const ours = keys.filter((k) => k.startsWith(PREFIX));
  if (ours.length) await AsyncStorage.multiRemove(ours);
}

let counter = 0;
/** Collision-resistant id good enough for a local-first single-device store. */
export function uid(prefix = 'id'): string {
  counter = (counter + 1) % 100000;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}_${Math.floor(
    Math.random() * 1e6,
  ).toString(36)}`;
}
