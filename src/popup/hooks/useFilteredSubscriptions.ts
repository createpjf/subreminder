import { useMemo } from 'react'
import type { Subscription, SubscriptionStatus } from '@/shared/types'
import { getNextBillingDate } from '@/shared/utils'

export type SortBy = 'name' | 'amount' | 'nextBilling' | 'dateAdded'

export function useFilteredSubscriptions(
  subscriptions: Subscription[],
  search: string,
  statusFilter: SubscriptionStatus | 'all',
  sortBy: SortBy
) {
  return useMemo(() => {
    let result = [...subscriptions]

    if (search) {
      const lower = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(lower) ||
          s.category.toLowerCase().includes(lower)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((s) => s.status === statusFilter)
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'amount':
        result.sort((a, b) => b.amount - a.amount)
        break
      case 'nextBilling':
        result.sort(
          (a, b) => getNextBillingDate(a).getTime() - getNextBillingDate(b).getTime()
        )
        break
      case 'dateAdded':
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
    }

    return result
  }, [subscriptions, search, statusFilter, sortBy])
}
