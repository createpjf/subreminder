import type { Subscription } from '@/shared/types'
import { formatCurrency, getCycleLabel, getDaysUntilBilling, getLogoUrl } from '@/shared/utils'
import { STATUS_COLORS } from '@/shared/constants'

interface SubCardProps {
  subscription: Subscription
  onClick: () => void
}

export default function SubCard({ subscription: sub, onClick }: SubCardProps) {
  const logoUrl = sub.logo || getLogoUrl(sub.url)
  const daysUntil = sub.cycle !== 'one-time' ? getDaysUntilBilling(sub) : null

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 bg-card-bg border border-border-color rounded-xl hover:border-text-secondary/30 transition-colors cursor-pointer text-left"
    >
      {/* Logo */}
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className="w-10 h-10 rounded-lg shrink-0"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-bg-secondary text-text-secondary flex items-center justify-center text-lg font-bold shrink-0">
          {sub.name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: STATUS_COLORS[sub.status] || STATUS_COLORS.active }}
          />
          <p className="text-sm font-medium text-text-primary truncate">{sub.name}</p>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-secondary text-text-secondary">
            {sub.category}
          </span>
          {daysUntil !== null && (
            <span className="text-[10px] text-text-secondary">
              {daysUntil === 0
                ? 'Today'
                : daysUntil === 1
                  ? 'Tomorrow'
                  : `in ${daysUntil}d`}
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-text-primary">
          {formatCurrency(sub.amount, sub.currency)}
        </p>
        <p className="text-[10px] text-text-secondary">{getCycleLabel(sub.cycle) || 'one-time'}</p>
      </div>
    </button>
  )
}
