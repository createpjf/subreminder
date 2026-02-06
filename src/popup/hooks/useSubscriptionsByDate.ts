import { useMemo } from 'react'
import { format, getMonth, getYear } from 'date-fns'
import type { Subscription } from '@/shared/types'
import { getBillingDateInMonth, getWeeklyBillingDatesInMonth } from '@/shared/utils'

export function useSubscriptionsByDate(month: Date, subscriptions: Subscription[]) {
  return useMemo(() => {
    const map = new Map<string, Subscription[]>()
    const year = getYear(month)
    const monthIndex = getMonth(month)

    for (const sub of subscriptions) {
      if (sub.status === 'cancelled') continue

      if (sub.cycle === 'weekly') {
        const dates = getWeeklyBillingDatesInMonth(sub, year, monthIndex)
        for (const date of dates) {
          const key = format(date, 'yyyy-MM-dd')
          const existing = map.get(key) || []
          map.set(key, [...existing, sub])
        }
      } else {
        const billingDate = getBillingDateInMonth(sub, year, monthIndex)
        if (billingDate) {
          const key = format(billingDate, 'yyyy-MM-dd')
          const existing = map.get(key) || []
          map.set(key, [...existing, sub])
        }
      }
    }

    return map
  }, [month, subscriptions])
}
