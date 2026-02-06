import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { chromeStorage } from '@/shared/storage'
import { DEFAULT_SETTINGS } from '@/shared/constants'
import type { Settings } from '@/shared/types'

interface SettingsState {
  settings: Settings
  updateSettings: (partial: Partial<Settings>) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: { ...DEFAULT_SETTINGS },

      updateSettings: (partial) => {
        set((state) => ({
          settings: { ...state.settings, ...partial },
        }))
      },

      resetSettings: () => {
        set({ settings: { ...DEFAULT_SETTINGS } })
      },
    }),
    {
      name: 'subtracker-settings',
      storage: createJSONStorage(() => chromeStorage),
    }
  )
)
