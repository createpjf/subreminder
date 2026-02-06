import { useState, useMemo } from 'react'
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from 'date-fns'

export function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const start = startOfWeek(monthStart, { weekStartsOn: 1 })
    const end = endOfWeek(monthEnd, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  return {
    currentMonth,
    calendarDays,
    goToPrevMonth: () => setCurrentMonth((prev) => subMonths(prev, 1)),
    goToNextMonth: () => setCurrentMonth((prev) => addMonths(prev, 1)),
    goToToday: () => setCurrentMonth(new Date()),
  }
}
