import { getDate } from 'date-fns'
import type { Subscription } from '@/shared/types'
import { getLogoUrl } from '@/shared/utils'

interface CalendarDayCellProps {
  date: Date
  subscriptions: Subscription[]
  isCurrentMonth: boolean
  isToday: boolean
  onClick: () => void
}

function LogoIcon({ sub }: { sub: Subscription }) {
  const logoUrl = sub.logo || getLogoUrl(sub.url)

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt=""
        className="w-3.5 h-3.5 rounded-sm"
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    )
  }

  return (
    <div className="w-3.5 h-3.5 rounded-sm bg-text-secondary/20 text-text-secondary flex items-center justify-center text-[7px] font-bold">
      {sub.name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function CalendarDayCell({
  date,
  subscriptions,
  isCurrentMonth,
  isToday,
  onClick,
}: CalendarDayCellProps) {
  const day = getDate(date)
  const hasSubs = subscriptions.length > 0
  const maxVisible = 3
  const overflow = subscriptions.length - maxVisible

  return (
    <button
      onClick={hasSubs ? onClick : undefined}
      className={`
        flex flex-col items-center gap-0.5 py-1 px-0.5 rounded-lg min-h-[42px] transition-colors
        ${!isCurrentMonth ? 'opacity-20' : 'bg-bg-cell'}
        ${isToday ? 'ring-1 ring-text-primary/40' : ''}
        ${hasSubs ? 'cursor-pointer hover:ring-1 hover:ring-text-secondary/30' : 'cursor-default'}
      `}
    >
      <span className={`text-[11px] leading-none font-medium ${isToday ? 'text-text-primary' : isCurrentMonth ? 'text-text-secondary' : 'text-text-dim'}`}>
        {day}
      </span>
      {hasSubs && (
        <div className="flex gap-0.5 flex-wrap justify-center mt-0.5">
          {subscriptions.slice(0, maxVisible).map((sub) => (
            <LogoIcon key={sub.id} sub={sub} />
          ))}
          {overflow > 0 && (
            <div className="w-3.5 h-3.5 rounded-sm bg-bg-primary text-text-dim flex items-center justify-center text-[6px] font-medium">
              +{overflow}
            </div>
          )}
        </div>
      )}
    </button>
  )
}
