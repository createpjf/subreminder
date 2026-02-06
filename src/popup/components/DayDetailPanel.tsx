import { format } from 'date-fns'
import type { Subscription } from '@/shared/types'
import { formatCurrency, getCycleLabel, getLogoUrl } from '@/shared/utils'

interface DayDetailPanelProps {
  date: Date
  subscriptions: Subscription[]
  onClose: () => void
  onEdit: (sub: Subscription) => void
}

export default function DayDetailPanel({ date, subscriptions, onClose, onEdit }: DayDetailPanelProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-card-bg border-t border-border-color rounded-t-xl shadow-lg z-10 max-h-[50%] overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-color sticky top-0 bg-card-bg">
        <h3 className="text-sm font-semibold text-text-primary">
          {format(date, 'MMM d, yyyy')}
        </h3>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary text-lg leading-none cursor-pointer"
        >
          &times;
        </button>
      </div>
      <div className="divide-y divide-border-color">
        {subscriptions.map((sub) => {
          const logoUrl = sub.logo || getLogoUrl(sub.url)
          return (
            <button
              key={sub.id}
              onClick={() => onEdit(sub)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-secondary transition-colors cursor-pointer text-left"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="w-8 h-8 rounded-md shrink-0"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-md bg-bg-secondary text-text-secondary flex items-center justify-center text-sm font-bold shrink-0">
                  {sub.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{sub.name}</p>
                <p className="text-xs text-text-secondary">{sub.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-text-primary">
                  {formatCurrency(sub.amount, sub.currency)}
                  <span className="text-xs font-normal text-text-secondary">
                    {getCycleLabel(sub.cycle)}
                  </span>
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
