import type { Settings, BillingCycle } from './types'

export const DEFAULT_SETTINGS: Settings = {
  primaryCurrency: 'USD',
  theme: 'dark',
  reminderDaysBefore: [1, 3],
  enableNotifications: true,
  enableUsageTracking: true,
  enableCloudSync: false,
  language: 'en',
}

export const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CNY', 'JPY', 'KRW', 'CAD', 'AUD',
  'CHF', 'HKD', 'SGD', 'SEK', 'NOK', 'DKK', 'INR', 'BRL',
  'MXN', 'TWD', 'THB', 'RUB',
] as const

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '\u20AC', GBP: '\u00A3', CNY: '\u00A5', JPY: '\u00A5',
  KRW: '\u20A9', CAD: 'C$', AUD: 'A$', CHF: 'CHF', HKD: 'HK$',
  SGD: 'S$', SEK: 'kr', NOK: 'kr', DKK: 'kr', INR: '\u20B9',
  BRL: 'R$', MXN: 'MX$', TWD: 'NT$', THB: '\u0E3F', RUB: '\u20BD',
}

export const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'one-time', label: 'One-time' },
]

export const CATEGORIES = [
  'Streaming',
  'Music',
  'Software',
  'Cloud Storage',
  'Productivity',
  'AI',
  'Education',
  'News',
  'Gaming',
  'Fitness',
  'Finance',
  'Other',
] as const

export const LOGO_API_BASE = 'https://img.logo.dev'

export const STATUS_COLORS: Record<string, string> = {
  active: 'var(--color-success)',
  paused: 'var(--color-warning)',
  cancelled: 'var(--color-danger)',
  trial: '#60a5fa',
}
