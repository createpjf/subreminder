import type { StateStorage } from 'zustand/middleware'

const isExtension =
  typeof chrome !== 'undefined' &&
  typeof chrome.storage !== 'undefined' &&
  typeof chrome.storage.local !== 'undefined'

export const chromeStorage: StateStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isExtension) {
      const result = await chrome.storage.local.get(key)
      return (result[key] as string) ?? null
    }
    return localStorage.getItem(key)
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (isExtension) {
      await chrome.storage.local.set({ [key]: value })
    } else {
      localStorage.setItem(key, value)
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (isExtension) {
      await chrome.storage.local.remove(key)
    } else {
      localStorage.removeItem(key)
    }
  },
}
