import { useState, useMemo } from 'react'
import { format, isSameMonth, isToday } from 'date-fns'
import { useCalendar } from '@/popup/hooks/useCalendar'
import { useSubscriptionsByDate } from '@/popup/hooks/useSubscriptionsByDate'
import { useSubscriptionStore } from '@/popup/store'
import { useSettingsStore } from '@/popup/store'
import { formatCurrencyShort, getMonthlyEquivalent } from '@/shared/utils'
import CalendarDayCell from './CalendarDayCell'
import DayDetailPanel from './DayDetailPanel'
import type { Subscription } from '@/shared/types'

const WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

interface CalendarViewProps {
  onEdit: (sub: Subscription) => void
}

export default function CalendarView({ onEdit }: CalendarViewProps) {
  const { currentMonth, calendarDays, goToPrevMonth, goToNextMonth, goToToday } = useCalendar()
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  const currency = useSettingsStore((s) => s.settings.primaryCurrency)
  const subsByDate = useSubscriptionsByDate(currentMonth, subscriptions)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthlySpend = useMemo(() => {
    return subscriptions
      .filter((s) => s.status === 'active' || s.status === 'trial')
      .reduce((sum, sub) => sum + getMonthlyEquivalent(sub), 0)
  }, [subscriptions])

  const selectedSubs = selectedDate
    ? subsByDate.get(format(selectedDate, 'yyyy-MM-dd')) || []
    : []

  return (
    <div className="flex flex-col h-full relative">
      {/* Month header */}
      <div className="flex items-end justify-between px-4 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={goToToday} className="cursor-pointer">
            <h2 className="text-xl font-bold text-text-primary leading-tight">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
          </button>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={goToPrevMonth}
              className="w-5 h-3.5 flex items-center justify-center text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
              aria-label="Previous month"
            >
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 5L5 1L9 5" />
              </svg>
            </button>
            <button
              onClick={goToNextMonth}
              className="w-5 h-3.5 flex items-center justify-center text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
              aria-label="Next month"
            >
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1L5 5L9 1" />
              </svg>
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-text-secondary uppercase tracking-wider">Monthly spend</p>
          <p className="text-sm font-semibold text-text-primary">
            {formatCurrencyShort(monthlySpend, currency)}
          </p>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 px-3 shrink-0">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-[10px] font-medium text-text-dim py-1.5">
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1 px-3 pb-3 flex-1">
        {calendarDays.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const subs = subsByDate.get(key) || []
          return (
            <CalendarDayCell
              key={key}
              date={day}
              subscriptions={subs}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              isToday={isToday(day)}
              onClick={() => setSelectedDate(day)}
            />
          )
        })}
      </div>

      {/* Day detail panel */}
      {selectedDate && selectedSubs.length > 0 && (
        <DayDetailPanel
          date={selectedDate}
          subscriptions={selectedSubs}
          onClose={() => setSelectedDate(null)}
          onEdit={(sub) => {
            setSelectedDate(null)
            onEdit(sub)
          }}
        />
      )}
    </div>
  )
}
