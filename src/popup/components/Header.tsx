import { useMemo } from 'react'
import { useSubscriptionStore } from '@/popup/store'
import { useSettingsStore } from '@/popup/store'
import { formatCurrency, getNextBillingDate } from '@/shared/utils'

export default function Header() {
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  const currency = useSettingsStore((s) => s.settings.primaryCurrency)

  const monthlyTotal = useMemo(() => {
    return subscriptions
      .filter((s) => s.status === 'active' || s.status === 'trial')
      .reduce((sum, sub) => {
        let monthly = sub.amount
        switch (sub.cycle) {
          case 'yearly':
            monthly = sub.amount / 12
            break
          case 'weekly':
            monthly = sub.amount * 4.33
            break
          case 'quarterly':
            monthly = sub.amount / 3
            break
          case 'one-time':
            monthly = 0
            break
        }
        return sum + monthly
      }, 0)
  }, [subscriptions])

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border-color bg-bg-primary shrink-0">
      <h1 className="text-base font-bold text-text-primary">SubTracker</h1>
      <div className="text-right">
        <p className="text-xs text-text-secondary">Monthly</p>
        <p className="text-sm font-semibold text-accent">
          {formatCurrency(monthlyTotal, currency)}
        </p>
      </div>
    </header>
  )
}
