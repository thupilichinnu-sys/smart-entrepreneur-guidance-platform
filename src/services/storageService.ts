/**
 * User Data Isolation and Local Storage Service
 * All user data is strictly namespaced under the user's unique ID.
 */

const APP_PREFIX = 'segp_v1_';

export const storageService = {
  getKey(userId: string, itemKey: string): string {
    return `${APP_PREFIX}usr_${userId}_${itemKey}`;
  },

  getItem<T>(userId: string, itemKey: string, defaultValue: T): T {
    try {
      const key = this.getKey(userId, itemKey);
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.error(`Error reading ${itemKey} for user ${userId}`, err);
      return defaultValue;
    }
  },

  setItem<T>(userId: string, itemKey: string, value: T): void {
    try {
      const key = this.getKey(userId, itemKey);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error writing ${itemKey} for user ${userId}`, err);
    }
  },

  removeItem(userId: string, itemKey: string): void {
    try {
      const key = this.getKey(userId, itemKey);
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing ${itemKey} for user ${userId}`, err);
    }
  },

  /**
   * Export all private user data as a consolidated backup JSON
   */
  exportUserData(userId: string): Record<string, unknown> {
    const backup: Record<string, unknown> = {
      userId,
      exportTimestamp: new Date().toISOString()
    };
    const prefix = `${APP_PREFIX}usr_${userId}_`;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        const simpleKey = k.replace(prefix, '');
        try {
          backup[simpleKey] = JSON.parse(localStorage.getItem(k) || 'null');
        } catch {
          backup[simpleKey] = localStorage.getItem(k);
        }
      }
    }
    return backup;
  },

  /**
   * Complete account data deletion (compliance with privacy mandate)
   */
  deleteUserData(userId: string): void {
    const prefix = `${APP_PREFIX}usr_${userId}_`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
};
