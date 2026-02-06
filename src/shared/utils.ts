import {
  addMonths,
  addYears,
  addWeeks,
  isBefore,
  isEqual,
  startOfDay,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  format,
  getDaysInMonth,
  setDate,
} from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import type { Subscription, BillingCycle } from './types'
import { CURRENCY_SYMBOLS } from './constants'

export function generateId(): string {
  return uuidv4()
}

function clampDay(date: Date, day: number): Date {
  const maxDay = getDaysInMonth(date)
  return setDate(date, Math.min(day, maxDay))
}

function advanceByOneCycle(date: Date, cycle: BillingCycle, billingDay: number): Date {
  switch (cycle) {
    case 'monthly':
      return clampDay(addMonths(date, 1), billingDay)
    case 'yearly':
      return clampDay(addYears(date, 1), billingDay)
    case 'weekly':
      return addWeeks(date, 1)
    case 'quarterly':
      return clampDay(addMonths(date, 3), billingDay)
    case 'one-time':
      return date
  }
}

export function getNextBillingDate(sub: Subscription): Date {
  const today = startOfDay(new Date())
  const start = startOfDay(new Date(sub.startDate))
  let next = sub.cycle === 'weekly' ? start : clampDay(start, sub.billingDay)

  if (sub.cycle === 'one-time') {
    return next
  }

  while (isBefore(next, today)) {
    next = advanceByOneCycle(next, sub.cycle, sub.billingDay)
  }

  return next
}

export function getBillingDateInMonth(sub: Subscription, year: number, month: number): Date | null {
  if (sub.cycle === 'one-time') {
    const start = new Date(sub.startDate)
    if (start.getFullYear() === year && start.getMonth() === month) {
      return startOfDay(start)
    }
    return null
  }

  if (sub.cycle === 'weekly') {
    return null
  }

  const target = new Date(year, month, 1)
  const maxDay = getDaysInMonth(target)
  const day = Math.min(sub.billingDay, maxDay)
  const billingDate = new Date(year, month, day)

  const startDate = startOfDay(new Date(sub.startDate))
  if (isBefore(billingDate, startDate)) {
    return null
  }

  // Yearly: only show in the anniversary month
  if (sub.cycle === 'yearly') {
    if (startDate.getMonth() !== month) {
      return null
    }
  }

  // Quarterly: only show every 3 months from start month
  if (sub.cycle === 'quarterly') {
    const monthDiff = (year - startDate.getFullYear()) * 12 + (month - startDate.getMonth())
    if (monthDiff < 0 || monthDiff % 3 !== 0) {
      return null
    }
  }

  return billingDate
}

export function getWeeklyBillingDatesInMonth(sub: Subscription, year: number, month: number): Date[] {
  if (sub.cycle !== 'weekly') return []

  const dates: Date[] = []
  const start = startOfDay(new Date(sub.startDate))
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0)

  let current = start
  while (isBefore(current, monthStart)) {
    current = addWeeks(current, 1)
  }

  while (isBefore(current, monthEnd) || isEqual(current, monthEnd)) {
    if (current.getMonth() === month) {
      dates.push(current)
    }
    current = addWeeks(current, 1)
  }

  return dates
}

export function getTotalSpent(sub: Subscription): number {
  const today = startOfDay(new Date())
  const start = startOfDay(new Date(sub.startDate))

  if (isBefore(today, start)) return 0
  if (sub.cycle === 'one-time') return sub.amount

  let count = 0
  switch (sub.cycle) {
    case 'weekly':
      count = differenceInWeeks(today, start)
      break
    case 'monthly':
      count = differenceInMonths(today, start)
      break
    case 'quarterly':
      count = Math.floor(differenceInMonths(today, start) / 3)
      break
    case 'yearly':
      count = differenceInYears(today, start)
      break
  }

  return Math.max(0, count) * sub.amount
}

export function getFaviconUrl(url: string | null): string | null {
  if (!url) return null
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return null
  }
}

export function getLogoUrl(url: string | null): string | null {
  return getFaviconUrl(url)
}

export function formatCurrency(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency
  return `${symbol}${amount.toFixed(2)}`
}

export function formatCurrencyShort(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency
  if (amount === Math.floor(amount)) {
    return `${symbol}${amount}`
  }
  return `${symbol}${amount.toFixed(2)}`
}

export function getDaysUntilBilling(sub: Subscription): number {
  const next = getNextBillingDate(sub)
  const today = startOfDay(new Date())
  const diff = next.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getCycleLabel(cycle: BillingCycle): string {
  switch (cycle) {
    case 'monthly': return '/mo'
    case 'yearly': return '/yr'
    case 'weekly': return '/wk'
    case 'quarterly': return '/qtr'
    case 'one-time': return ''
  }
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy')
}

export function getMonthlyEquivalent(sub: Subscription): number {
  switch (sub.cycle) {
    case 'yearly': return sub.amount / 12
    case 'weekly': return sub.amount * 4.33
    case 'quarterly': return sub.amount / 3
    case 'one-time': return 0
    default: return sub.amount
  }
}
