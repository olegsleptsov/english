export const localStorageClient = {
  async getJson<T>(key: string, fallback: T): Promise<T> {
    if (!isLocalStorageAvailable()) {
      return fallback;
    }

    const value = window.localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  },

  async setJson<T>(key: string, value: T): Promise<void> {
    if (!isLocalStorageAvailable()) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  },
};

function isLocalStorageAvailable() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}
