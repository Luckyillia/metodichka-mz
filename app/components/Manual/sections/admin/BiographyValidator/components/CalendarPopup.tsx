import React, { useState } from "react"

const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
const DAYS_RU   = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"]

interface CalendarPopupProps {
  value: Date | null
  onSelect: (date: Date) => void
  onClose: () => void
}

export const CalendarPopup: React.FC<CalendarPopupProps> = ({ value, onSelect, onClose }) => {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(value ? value.getFullYear()  : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(value ? value.getMonth()     : today.getMonth())

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  let startDow = new Date(viewYear, viewMonth, 1).getDay() - 1
  if (startDow < 0) startDow = 6
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

  const selectedDay = value && value.getFullYear() === viewYear && value.getMonth() === viewMonth ? value.getDate() : null
  const todayDay    = today.getFullYear() === viewYear && today.getMonth() === viewMonth ? today.getDate() : null

  return (
    <div
      className="absolute z-50 top-full left-0 mt-2 w-72 rounded-2xl border border-border bg-card shadow-2xl p-4"
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground text-lg leading-none"
        >‹</button>
        <div className="text-sm font-semibold text-foreground">
          {MONTHS_RU[viewMonth]} {viewYear}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground text-lg leading-none"
        >›</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_RU.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />
          const isSelected = day === selectedDay
          const isToday    = day === todayDay
          return (
            <button
              key={day}
              type="button"
              onClick={() => { onSelect(new Date(viewYear, viewMonth, day)); onClose() }}
              className={`w-full aspect-square text-xs rounded-lg transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold"
                  : isToday
                  ? "border border-primary/50 text-primary hover:bg-primary/10"
                  : "hover:bg-accent text-foreground"
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 flex justify-between">
        <button
          type="button"
          onClick={() => { onSelect(today); onClose() }}
          className="text-xs text-primary hover:underline"
        >
          Сегодня
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}