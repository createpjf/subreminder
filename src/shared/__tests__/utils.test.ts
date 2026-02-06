import { describe, it, expect } from 'vitest'
import {
  getNextBillingDate,
  getTotalSpent,
  getLogoUrl,
  formatCurrency,
  generateId,
  getCycleLabel,
  getDaysUntilBilling,
  getBillingDateInMonth,
  getWeeklyBillingDatesInMonth,
} from '../utils'
import type { Subscription } from '../types'

function makeSub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: 'test-id',
    name: 'Test',
    url: null,
    logo: null,
    amount: 10,
    currency: 'USD',
    cycle: 'monthly',
    billingDay: 15,
    startDate: '2025-01-15',
    trialEndDate: null,
    category: 'Other',
    status: 'active',
    notes: null,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    ...overrides,
  }
}

describe('generateId', () => {
  it('returns a valid UUID-like string', () => {
    const id = generateId()
    expect(id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})

describe('getNextBillingDate', () => {
  it('returns a future date for monthly subscription', () => {
    const sub = makeSub({ startDate: '2024-01-15', billingDay: 15, cycle: 'monthly' })
    const next = getNextBillingDate(sub)
    expect(next.getTime()).toBeGreaterThanOrEqual(Date.now())
    expect(next.getDate()).toBeLessThanOrEqual(15)
  })

  it('returns a future date for yearly subscription', () => {
    const sub = makeSub({ startDate: '2024-06-01', billingDay: 1, cycle: 'yearly' })
    const next = getNextBillingDate(sub)
    expect(next.getTime()).toBeGreaterThanOrEqual(Date.now())
  })

  it('returns a future date for weekly subscription', () => {
    const sub = makeSub({ startDate: '2025-01-01', cycle: 'weekly' })
    const next = getNextBillingDate(sub)
    expect(next.getTime()).toBeGreaterThanOrEqual(Date.now())
  })

  it('handles billingDay=31 correctly (clamps to last day of month)', () => {
    const sub = makeSub({ startDate: '2025-01-31', billingDay: 31, cycle: 'monthly' })
    const next = getNextBillingDate(sub)
    expect(next.getDate()).toBeLessThanOrEqual(31)
  })

  it('returns the start date for one-time subscriptions', () => {
    const sub = makeSub({ startDate: '2025-06-01', billingDay: 1, cycle: 'one-time' })
    const next = getNextBillingDate(sub)
    expect(next.getFullYear()).toBe(2025)
    expect(next.getMonth()).toBe(5) // June
    expect(next.getDate()).toBe(1)
  })
})

describe('getTotalSpent', () => {
  it('returns 0 for subscription starting in the future', () => {
    const sub = makeSub({ startDate: '2099-01-01' })
    expect(getTotalSpent(sub)).toBe(0)
  })

  it('returns amount for one-time subscription', () => {
    const sub = makeSub({ cycle: 'one-time', amount: 99.99, startDate: '2024-01-01' })
    expect(getTotalSpent(sub)).toBe(99.99)
  })

  it('returns positive value for past monthly subscription', () => {
    const sub = makeSub({
      startDate: '2024-01-15',
      cycle: 'monthly',
      amount: 10,
    })
    const total = getTotalSpent(sub)
    expect(total).toBeGreaterThan(0)
    expect(total % 10).toBe(0) // multiple of amount
  })
})

describe('getLogoUrl', () => {
  it('returns logo URL for valid URL', () => {
    const url = getLogoUrl('https://netflix.com')
    expect(url).toContain('favicons?domain=netflix.com')
  })

  it('returns null for null input', () => {
    expect(getLogoUrl(null)).toBeNull()
  })

  it('returns null for invalid URL', () => {
    expect(getLogoUrl('not-a-url')).toBeNull()
  })
})

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(9.99, 'USD')).toBe('$9.99')
  })

  it('formats EUR correctly', () => {
    expect(formatCurrency(15, 'EUR')).toBe('\u20AC15.00')
  })

  it('formats CNY correctly', () => {
    expect(formatCurrency(100, 'CNY')).toBe('\u00A5100.00')
  })

  it('uses currency code when symbol not found', () => {
    expect(formatCurrency(10, 'XYZ')).toBe('XYZ10.00')
  })
})

describe('getCycleLabel', () => {
  it('returns /mo for monthly', () => {
    expect(getCycleLabel('monthly')).toBe('/mo')
  })

  it('returns /yr for yearly', () => {
    expect(getCycleLabel('yearly')).toBe('/yr')
  })

  it('returns empty string for one-time', () => {
    expect(getCycleLabel('one-time')).toBe('')
  })
})

describe('getDaysUntilBilling', () => {
  it('returns a non-negative number', () => {
    const sub = makeSub({ startDate: '2025-01-15', cycle: 'monthly', billingDay: 15 })
    expect(getDaysUntilBilling(sub)).toBeGreaterThanOrEqual(0)
  })
})

describe('getBillingDateInMonth', () => {
  it('returns correct billing date for month', () => {
    const sub = makeSub({ startDate: '2025-01-15', billingDay: 15, cycle: 'monthly' })
    const date = getBillingDateInMonth(sub, 2025, 5) // June
    expect(date).not.toBeNull()
    expect(date!.getDate()).toBe(15)
    expect(date!.getMonth()).toBe(5)
  })

  it('returns null for one-time sub in wrong month', () => {
    const sub = makeSub({ startDate: '2025-01-15', cycle: 'one-time' })
    const date = getBillingDateInMonth(sub, 2025, 5)
    expect(date).toBeNull()
  })

  it('returns null for date before start', () => {
    const sub = makeSub({ startDate: '2025-06-15', billingDay: 15, cycle: 'monthly' })
    const date = getBillingDateInMonth(sub, 2025, 0) // January before start
    expect(date).toBeNull()
  })

  it('clamps day 31 to end of short month', () => {
    const sub = makeSub({ startDate: '2025-01-31', billingDay: 31, cycle: 'monthly' })
    const date = getBillingDateInMonth(sub, 2025, 1) // February
    expect(date).not.toBeNull()
    expect(date!.getDate()).toBe(28)
  })

  it('returns null for yearly sub in non-anniversary month', () => {
    const sub = makeSub({ startDate: '2025-03-15', billingDay: 15, cycle: 'yearly' })
    // June is not the anniversary month (March)
    expect(getBillingDateInMonth(sub, 2026, 5)).toBeNull()
    // January is not either
    expect(getBillingDateInMonth(sub, 2026, 0)).toBeNull()
  })

  it('returns date for yearly sub in anniversary month', () => {
    const sub = makeSub({ startDate: '2025-03-15', billingDay: 15, cycle: 'yearly' })
    const date = getBillingDateInMonth(sub, 2026, 2) // March
    expect(date).not.toBeNull()
    expect(date!.getMonth()).toBe(2)
    expect(date!.getDate()).toBe(15)
  })

  it('returns null for quarterly sub in non-quarter month', () => {
    const sub = makeSub({ startDate: '2025-01-10', billingDay: 10, cycle: 'quarterly' })
    // Feb is 1 month after start, not a multiple of 3
    expect(getBillingDateInMonth(sub, 2025, 1)).toBeNull()
    // March is 2 months after start, not a multiple of 3
    expect(getBillingDateInMonth(sub, 2025, 2)).toBeNull()
  })

  it('returns date for quarterly sub in correct quarter month', () => {
    const sub = makeSub({ startDate: '2025-01-10', billingDay: 10, cycle: 'quarterly' })
    // April is 3 months after Jan
    const date = getBillingDateInMonth(sub, 2025, 3)
    expect(date).not.toBeNull()
    expect(date!.getMonth()).toBe(3)
    expect(date!.getDate()).toBe(10)
  })
})

describe('getWeeklyBillingDatesInMonth', () => {
  it('returns multiple dates for weekly sub', () => {
    const sub = makeSub({ startDate: '2025-01-01', cycle: 'weekly' })
    const dates = getWeeklyBillingDatesInMonth(sub, 2025, 1) // February
    expect(dates.length).toBeGreaterThanOrEqual(4)
    for (const d of dates) {
      expect(d.getMonth()).toBe(1)
    }
  })

  it('returns empty for non-weekly sub', () => {
    const sub = makeSub({ cycle: 'monthly' })
    const dates = getWeeklyBillingDatesInMonth(sub, 2025, 1)
    expect(dates).toEqual([])
  })
})
