export function getStorage<T>(storage: Storage, key: string): T | null {
  try {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (_error) {
    return null;
  }
}

export function setStorage<T>(storage: Storage, key: string, value: T): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (_error) {}
}
