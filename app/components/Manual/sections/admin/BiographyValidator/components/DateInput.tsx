import React, { useState } from "react"
import { CalendarPopup } from "./CalendarPopup"
import { parseDMY, formatDMY, formatDateInput } from "../utils"

interface DateInputProps {
  value: string
  onChange: (val: string) => void
  disabled?: boolean
  placeholder?: string
}

export const DateInput: React.FC<DateInputProps> = ({ value, onChange, disabled, placeholder }) => {
  const [open, setOpen] = useState(false)
  const parsed  = parseDMY(value)
  const isValid = value === "" || parsed !== null

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(formatDateInput(e.target.value))
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={handleTextChange}
          disabled={disabled}
          placeholder={placeholder || "ДД.ММ.ГГГГ"}
          maxLength={10}
          className={`flex-1 px-4 py-3 bg-input border-2 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
            isValid ? "border-border" : "border-rose-500/60"
          }`}
        />
        <button
          type="button"
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
          className="px-3 py-3 rounded-xl border-2 border-border bg-input hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
          title="Выбрать дату"
        >
          📅
        </button>
      </div>

      {!isValid && value !== "" && (
        <div className="mt-1 text-xs text-rose-400">Введите дату в формате ДД.ММ.ГГГГ</div>
      )}

      {open && !disabled && (
        <CalendarPopup
          value={parsed}
          onSelect={(date) => onChange(formatDMY(date))}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}