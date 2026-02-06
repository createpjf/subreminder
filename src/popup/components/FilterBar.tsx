import type { SubscriptionStatus } from '@/shared/types'

type FilterValue = SubscriptionStatus | 'all'

interface FilterBarProps {
  value: FilterValue
  onChange: (value: FilterValue) => void
}

const filters: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'trial', label: 'Trial' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`
            px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors cursor-pointer
            ${
              value === f.value
                ? 'bg-text-primary text-bg-primary'
                : 'bg-bg-secondary text-text-secondary hover:bg-border-color'
            }
          `}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
