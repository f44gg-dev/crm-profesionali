export function saveToStorage<T>(key: string,  T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Storage save error:', error);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export const STORAGE_KEYS = {
  USER: 'crm_user',
  CONTACTS: 'crm_contacts',
  DEALS: 'crm_deals',
  TASKS: 'crm_tasks',
} as const;
