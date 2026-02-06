export type ThemeMode = 'light' | 'dark' | 'system'

export interface Settings {
  primaryCurrency: string
  theme: ThemeMode
  reminderDaysBefore: number[]
  enableNotifications: boolean
  enableUsageTracking: boolean
  enableCloudSync: boolean
  language: string
}
