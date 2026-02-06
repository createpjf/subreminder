import { useState } from 'react'
import { useSubscriptionStore } from '@/popup/store'
import { useDebounce } from '@/popup/hooks/useDebounce'
import { useFilteredSubscriptions, type SortBy } from '@/popup/hooks/useFilteredSubscriptions'
import SearchBar from './SearchBar'
import FilterBar from './FilterBar'
import SubCard from './SubCard'
import type { Subscription, SubscriptionStatus } from '@/shared/types'

interface ListViewProps {
  onEdit: (sub: Subscription) => void
}

export default function ListView({ onEdit }: ListViewProps) {
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortBy>('nextBilling')
  const debouncedSearch = useDebounce(search)

  const filtered = useFilteredSubscriptions(subscriptions, debouncedSearch, statusFilter, sortBy)

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="px-3 pt-3 space-y-2 shrink-0">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex items-center justify-between">
          <FilterBar value={statusFilter} onChange={setStatusFilter} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="text-[10px] bg-bg-secondary border border-border-color rounded px-1.5 py-1 text-text-secondary focus:outline-none ml-2 shrink-0"
          >
            <option value="nextBilling">Next billing</option>
            <option value="name">Name</option>
            <option value="amount">Amount</option>
            <option value="dateAdded">Date added</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
            <p className="text-3xl mb-2">
              {subscriptions.length === 0 ? '\uD83D\uDCE6' : '\uD83D\uDD0D'}
            </p>
            <p className="text-sm">
              {subscriptions.length === 0
                ? 'No subscriptions yet'
                : 'No matching subscriptions'}
            </p>
            {subscriptions.length === 0 && (
              <p className="text-xs mt-1">Tap + to add your first one</p>
            )}
          </div>
        ) : (
          filtered.map((sub) => (
            <SubCard key={sub.id} subscription={sub} onClick={() => onEdit(sub)} />
          ))
        )}
      </div>
    </div>
  )
}
