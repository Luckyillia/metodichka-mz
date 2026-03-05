"use client"

import React, { useMemo, useRef, useState } from "react"
import { AuthService } from "@/lib/auth/auth-service"

type Status = "success" | "warning" | "error"

type BiographyValidationResult = {
  valid: boolean
  score: number
  sections?: Array<{
    number: number
    title: string
    ok: boolean
    status: Status
    notes: string
    issues: string[]
  }>
  birthdate: {
    extracted: string | null
    calculatedAge: number | null
    statedAge: number | null
    match: boolean
    difference: number
    issues: string[]
    status: Status
  }
  grammar: {
    errorsCount: number
    errors: Array<{
      section: string
      type: "орфография" | "пунктуация" | "согласование" | "стиль"
      error: string
      original: string
      suggestion: string
      severity: "minor" | "major"
    }>
    status: Status
  }
  perspective: {
    isFirstPerson: boolean
    violations: Array<{
      section: string
      text: string
      issue: string
      suggestion: string
    }>
    status: Status
  }
  structure: {
    allSectionsPresent: boolean
    totalSections: number
    missingSections: number[]
    emptySections: number[]
    status: "success" | "error"
  }
  logic: {
    chronologyIssues: string[]
    ageConsistency: boolean
    educationCareerMatch: boolean
    issues: string[]
    status: Status
  }
  recommendations: string[]
  summary: string
}

const MIN_CHARS = 100
const MAX_CHARS = 10000

function statusBadgeClass(status: Status) {
  switch (status) {
    case "success": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    case "warning": return "bg-amber-500/15 text-amber-400 border-amber-500/30"
    case "error":   return "bg-rose-500/15 text-rose-400 border-rose-500/30"
  }
}

function scoreClass(score: number) {
  if (score >= 8) return "text-emerald-400"
  if (score >= 6) return "text-amber-400"
  return "text-rose-400"
}

function normalizeErrorMessage(err: unknown) {
  if (typeof err === "string") return err
  if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
    return (err as any).message
  }
  return "Ошибка запроса"
}

// ─── Date helpers ────────────────────────────────────────────────────────────

function parseDMY(value: string): Date | null {
  const m = value.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (!m) return null
  const d = Number(m[1]), mo = Number(m[2]), y = Number(m[3])
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || y < 1900 || y > 2100) return null
  const date = new Date(y, mo - 1, d)
  if (date.getMonth() !== mo - 1) return null
  return date
}

function formatDMY(date: Date): string {
  return [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join(".")
}

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function isFutureDateISO(iso: string) {
  const d = new Date(iso + "T00:00:00")
  if (Number.isNaN(d.getTime())) return false
  const today = new Date()
  const todayISO = toISODate(today)
  const t = new Date(todayISO + "T00:00:00")
  return d.getTime() > t.getTime()
}

function validateBiographyTitle(title: string) {
  const t = title.trim()
  if (!t) return { ok: false, error: "Укажите заголовок темы" }
  if (t.includes("_")) return { ok: false, error: "Заголовок не должен содержать нижние подчёркивания" }

  const m = /^биография\s+([A-Za-zА-Яа-яЁё]+)\s+([A-Za-zА-Яа-яЁё]+)$/iu.exec(t)
  if (!m) {
    return { ok: false, error: 'Формат: "Биография Имя Фамилия" (кириллица или латиница, 2 слова)' }
  }
  return { ok: true, firstName: m[1], lastName: m[2] }
}

function normalizeNameToken(token: string) {
  const t = token.trim().toLowerCase()
  if (!t) return ""

  // For Latin names: simple lowercase token
  const hasCyr = /[а-яё]/iu.test(t)
  if (!hasCyr) return t

  // Very lightweight RU case normalization:
  // allow common genitive endings (Амбала -> Амбал, Бобрышева -> Бобрышев, Иванова -> Иванов)
  // This is heuristic and intentionally conservative.
  let s = t
  if (s.endsWith("ова") || s.endsWith("ева")) s = s.slice(0, -1) // Иванова -> Иванов
  else if (s.endsWith("иной")) s = s.slice(0, -2) // условно
  else if (s.endsWith("ого") || s.endsWith("его")) s = s.slice(0, -1)
  else if (s.endsWith("а") || s.endsWith("я")) s = s.slice(0, -1)

  return s
}

function extractNameFromForm(text: string) {
  const extracted = extractFieldValue(text, ["Имя Фамилия", "Имя и Фамилия", "ФИО", "Ф.И.О", "Фамилия Имя Отчество"])
  if (!extracted.found) {
    return { ok: false as const, error: "Не найдено поле \"Имя Фамилия\" в тексте (заполните биографию по форме)" }
  }
  const value = extracted.value
  if (!value) return { ok: false as const, error: "Поле \"Имя Фамилия\" пустое" }
  if (value.includes("_")) return { ok: false as const, error: "В поле \"Имя Фамилия\" запрещены нижние подчёркивания" }

  // Strip trailing punctuation (common in forms)
  const cleanValue = value.replace(/[.!?,:;]+$/, "")

  const mm = /^([A-Za-zА-Яа-яЁё]+)\s+([A-Za-zА-Яа-яЁё]+)(?:\s+([A-Za-zА-Яа-яЁё]+))?$/u.exec(cleanValue)
  if (!mm) return { ok: false as const, error: "Поле \"Имя Фамилия\" должно содержать 2 или 3 слова (ФИО)" }
  return { ok: true as const, firstName: mm[1], lastName: mm[2], patronymic: mm[3] || undefined, raw: value }
}

function normalizeFieldLabel(label: string) {
  return label.toLowerCase().replace(/\s+/g, " ").trim()
}

function buildFieldRegex(label: string) {
  const l = normalizeFieldLabel(label)
  const escaped = l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`^(?:\\d+\\s*[).]\\s*)?${escaped}\\s*[:\-—.]\s*(.*)$`, "iu")
}

const REQUIRED_FORM_FIELDS: Array<{ key: string; labels: string[] }> = [
  { key: "Имя Фамилия", labels: ["Имя Фамилия", "Имя и Фамилия", "ФИО", "Ф.И.О", "Фамилия Имя Отчество"] },
  { key: "Пол", labels: ["Пол"] },
  { key: "Национальность", labels: ["Национальность"] },
  { key: "Возраст", labels: ["Возраст"] },
  { key: "Дата и место рождения", labels: ["Дата и место рождения", "Дата рождения и место", "Дата рождения / место"] },
  { key: "Семья", labels: ["Семья"] },
  { key: "Место текущего проживания", labels: ["Место текущего проживания", "Текущее проживание", "Проживание"] },
  { key: "Описание внешности", labels: ["Описание внешности", "Внешность"] },
  { key: "Особенности характера", labels: ["Особенности характера", "Характер"] },
  { key: "Детство", labels: ["Детство"] },
  { key: "Юность и взрослая жизнь", labels: ["Юность и взрослая жизнь", "Юность", "Взрослая жизнь", "Юность/взрослая жизнь"] },
  { key: "Настоящее время", labels: ["Настоящее время", "Настоящее"] },
  { key: "Хобби", labels: ["Хобби", "Увлечения"] },
]

function extractFieldValue(text: string, labels: string[]) {
  const rawLines = text.split(/\r?\n/).map(l => l.trim())

  // Pre-build regex list for speed
  const res = labels.map(l => buildFieldRegex(l))

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i]
    if (!line) continue

    let matchedRe: RegExp | null = null
    let match: RegExpExecArray | null = null

    for (const re of res) {
      const m = re.exec(line)
      if (m) {
        matchedRe = re
        match = m
        break
      }
    }

    if (!matchedRe || !match) continue

    const sameLineValue = String(match[1] || "").trim()
    if (sameLineValue) return { found: true as const, value: sameLineValue }

    // Value may be on the next lines. Take the next non-empty line that is not a new field header.
    for (let j = i + 1; j < rawLines.length; j++) {
      const next = rawLines[j]
      if (!next) continue

      // stop if next line looks like another field header (any required field label)
      const looksLikeHeader = REQUIRED_FORM_FIELDS.some(f =>
        f.labels.some(lbl => buildFieldRegex(lbl).test(next))
      )
      if (looksLikeHeader) return { found: true as const, value: "" }

      return { found: true as const, value: next }
    }

    return { found: true as const, value: "" }
  }

  return { found: false as const, value: "" }
}

function validateFormStructure(text: string) {
  const missing: string[] = []
  const empty: string[] = []

  for (const field of REQUIRED_FORM_FIELDS) {
    const extracted = extractFieldValue(text, field.labels)
    if (!extracted.found) {
      missing.push(field.key)
      continue
    }
    if (!extracted.value) empty.push(field.key)
  }

  return {
    ok: missing.length === 0 && empty.length === 0,
    missing,
    empty,
  }
}

// ─── Calendar Popup ──────────────────────────────────────────────────────────

const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
const DAYS_RU   = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"]

function CalendarPopup({ value, onSelect, onClose }: {
  value: Date | null
  onSelect: (date: Date) => void
  onClose: () => void
}) {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(value ? value.getFullYear()  : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(value ? value.getMonth()     : today.getMonth())

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
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
      onMouseDown={e => e.preventDefault()}
    >
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground text-lg leading-none">‹</button>
        <div className="text-sm font-semibold text-foreground">{MONTHS_RU[viewMonth]} {viewYear}</div>
        <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground text-lg leading-none">›</button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS_RU.map(d => <div key={d} className="text-center text-xs text-muted-foreground py-1">{d}</div>)}
      </div>

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
                isSelected ? "bg-primary text-primary-foreground font-semibold"
                : isToday  ? "border border-primary/50 text-primary hover:bg-primary/10"
                           : "hover:bg-accent text-foreground"
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex justify-between">
        <button type="button" onClick={() => { onSelect(today); onClose() }} className="text-xs text-primary hover:underline">Сегодня</button>
        <button type="button" onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Закрыть</button>
      </div>
    </div>
  )
}

// ─── DateInput ───────────────────────────────────────────────────────────────

function DateInput({ value, onChange, disabled, placeholder }: {
  value: string
  onChange: (val: string) => void
  disabled?: boolean
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const parsed  = parseDMY(value)
  const isValid = value === "" || parsed !== null

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "")
    let v = digits
    if (digits.length > 2 && digits.length <= 4) v = `${digits.slice(0,2)}.${digits.slice(2)}`
    else if (digits.length > 4)                  v = `${digits.slice(0,2)}.${digits.slice(2,4)}.${digits.slice(4,8)}`
    onChange(v)
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
          className={`flex-1 px-4 py-3 bg-input border-2 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${isValid ? "border-border" : "border-rose-500/60"}`}
        />
        <button
          type="button"
          onClick={() => !disabled && setOpen(o => !o)}
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
          onSelect={date => onChange(formatDMY(date))}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function BiographyValidator() {
  const [biographyTitle, setBiographyTitle] = useState("")
  const [writtenDate,    setWrittenDate]    = useState("")
  const [text,           setText]           = useState("")
  const [model,          setModel]          = useState<"llama-3.3-70b-versatile" | "openai/gpt-oss-120b">("llama-3.3-70b-versatile")
  const [debug,          setDebug]          = useState(false)
  const [useCustomApiKey,setUseCustomApiKey]= useState(false)
  const [customApiKey,   setCustomApiKey]   = useState("")
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState<string | null>(null)
  const [result,         setResult]         = useState<BiographyValidationResult | null>(null)
  const [usedDate,       setUsedDate]       = useState<string | null>(null)

  const chars            = text.length
  const charsOk          = chars >= MIN_CHARS && chars <= MAX_CHARS
  const parsedWrittenDate = useMemo(() => parseDMY(writtenDate), [writtenDate])
  const writtenDateValid  = writtenDate !== "" && parsedWrittenDate !== null

  const writtenDateISO = useMemo(() => {
    if (!parsedWrittenDate) return null
    return toISODate(parsedWrittenDate)
  }, [parsedWrittenDate])

  const writtenDateNotFuture = useMemo(() => {
    if (!writtenDateISO) return false
    return !isFutureDateISO(writtenDateISO)
  }, [writtenDateISO])

  const titleCheck = useMemo(() => validateBiographyTitle(biographyTitle), [biographyTitle])

  const formNameCheck = useMemo(() => extractNameFromForm(text), [text])

  const structureCheck = useMemo(() => validateFormStructure(text), [text])

  const titleMatchesForm = useMemo(() => {
    if (!titleCheck.ok || !formNameCheck.ok) return false

    const tFirst = normalizeNameToken(String((titleCheck as any).firstName))
    const tLast = normalizeNameToken(String((titleCheck as any).lastName))
    const fFirst = normalizeNameToken(String((formNameCheck as any).firstName))
    const fLast = normalizeNameToken(String((formNameCheck as any).lastName))

    // Handle both "Имя Фамилия" and "Фамилия Имя Отчество" formats
    const directMatch = tFirst === fFirst && tLast === fLast
    const swappedMatch = tFirst === fLast && tLast === fFirst

    return directMatch || swappedMatch
  }, [titleCheck, formNameCheck])

  const ageMismatch = useMemo(() => {
    const diff = (result as any)?.birthdate?.difference
    return typeof diff === "number" && diff > 0
  }, [result])

  const canSubmit =
    !loading &&
    charsOk &&
    writtenDateValid &&
    writtenDateNotFuture &&
    titleCheck.ok &&
    formNameCheck.ok &&
    titleMatchesForm &&
    structureCheck.ok

  async function onValidate() {
    setLoading(true)
    setError(null)
    setResult(null)

    const dateForValidation = writtenDateISO as string

    setUsedDate(dateForValidation)

    try {
      const res = await AuthService.fetchWithAuth("/api/admin/biography/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biographyText:  text,
          biographyTitle: biographyTitle.trim(),
          writtenDate:    dateForValidation,
          model,
          debug,
          apiKey: useCustomApiKey && customApiKey.trim().length ? customApiKey.trim() : undefined,
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || `Ошибка HTTP: ${res.status}`)
      setResult(data as BiographyValidationResult)
    } catch (e) {
      setError(normalizeErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  async function onCopy() {
    if (!result) return
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
  }

  return (
    <div className="w-full">
      {/* ── Form card ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Проверка RP Биографий</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Автоматическая AI-проверка на соответствие требованиям (возраст, 1-е лицо, структура, логика).
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-muted-foreground">Символов</div>
            <div className={`text-lg font-semibold ${charsOk ? "text-foreground" : "text-rose-400"}`}>{chars}</div>
            <div className="text-xs text-muted-foreground">Мин: {MIN_CHARS} | Макс: {MAX_CHARS}</div>
          </div>
        </div>

        {/* Title + Written date */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Заголовок биографии
              <span className="ml-1 text-xs text-rose-400">(обязательно)</span>
            </label>
            <input
              type="text"
              value={biographyTitle}
              onChange={e => setBiographyTitle(e.target.value)}
              disabled={loading}
              placeholder='Биография Имя Фамилия'
              maxLength={200}
              className="mt-2 w-full px-4 py-3 bg-input border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
            {!titleCheck.ok && biographyTitle.trim().length > 0 && (
              <div className="mt-1 text-xs text-rose-400">{(titleCheck as any).error}</div>
            )}
            {biographyTitle.trim().length === 0 && (
              <div className="mt-1 text-xs text-muted-foreground">Формат: &quot;Биография Имя Фамилия&quot; (без подчёркиваний).</div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Дата написания биографии
              <span className="ml-1 text-xs text-rose-400">(обязательно)</span>
            </label>
            <div className="mt-2">
              <DateInput
                value={writtenDate}
                onChange={setWrittenDate}
                disabled={loading}
                placeholder="Укажите дату написания биографии"
              />
            </div>
            <div className="mt-1.5 text-xs text-muted-foreground">
              {writtenDate && parsedWrittenDate
                ? `✓ Возраст будет проверен на дату: ${formatDMY(parsedWrittenDate)}`
                : "Укажите дату написания — она обязательна"}
            </div>

            {writtenDate !== "" && parsedWrittenDate && !writtenDateNotFuture && (
              <div className="mt-1 text-xs text-rose-400">Дата написания не может быть позже сегодняшней даты</div>
            )}
          </div>
        </div>

        {/* Model */}
        <div className="mt-5">
          <label className="text-sm font-medium text-foreground">Модель</label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={model}
              onChange={e => setModel(e.target.value as any)}
              disabled={loading}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (быстро)</option>
              <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (умнее)</option>
            </select>
            <div className="text-xs text-muted-foreground flex items-center">
              Рекомендация: если отчёт &quot;плывёт&quot; — попробуй умную модель.
            </div>
          </div>
        </div>

        {/* Debug */}
        <div className="mt-3 flex items-center gap-2">
          <input id="bio-debug" type="checkbox" checked={debug} onChange={e => setDebug(e.target.checked)} disabled={loading} />
          <label htmlFor="bio-debug" className="text-sm text-muted-foreground">
            Режим отладки (вернёт нормализованный текст и метаданные)
          </label>
        </div>

        {/* Custom API key */}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <input id="bio-custom-api" type="checkbox" checked={useCustomApiKey} onChange={e => setUseCustomApiKey(e.target.checked)} disabled={loading} />
            <label htmlFor="bio-custom-api" className="text-sm text-muted-foreground">Использовать свой Groq API ключ</label>
          </div>
          {useCustomApiKey && (
            <input
              type="password"
              value={customApiKey}
              onChange={e => setCustomApiKey(e.target.value)}
              disabled={loading}
              placeholder="gsk_..."
              className="mt-2 w-full px-4 py-3 bg-input border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              autoComplete="off"
            />
          )}
        </div>

        {/* Textarea */}
        <div className="mt-5">
          <label className="text-sm font-medium text-foreground">Биография для проверки</label>
          <textarea
            className="mt-2 w-full min-h-[220px] rounded-xl border border-border bg-input p-4 text-sm text-foreground placeholder:text-muted-foreground caret-primary outline-none focus:ring-2 focus:ring-primary/40 dark:bg-zinc-900/80 dark:text-zinc-100"
            placeholder="Вставьте биографию (13 пунктов)..."
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={MAX_CHARS}
          />
          {text.trim().length > 0 && !formNameCheck.ok && (
            <div className="mt-2 text-xs text-rose-400">{(formNameCheck as any).error}</div>
          )}
          {text.trim().length > 0 && formNameCheck.ok && titleCheck.ok && !titleMatchesForm && (
            <div className="mt-2 text-xs text-rose-400">
              Заголовок не совпадает с полем &quot;Имя Фамилия&quot; в тексте. Должно быть: &quot;Биография {(formNameCheck as any).firstName} {(formNameCheck as any).lastName}&quot;.
            </div>
          )}

          {text.trim().length > 0 && !structureCheck.ok && (
            <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
              <div className="text-xs font-semibold text-rose-200">Форма заполнена не полностью</div>
              {structureCheck.missing.length > 0 && (
                <div className="mt-1 text-xs text-rose-100/90">
                  Отсутствуют поля: {structureCheck.missing.join(", ")}
                </div>
              )}
              {structureCheck.empty.length > 0 && (
                <div className="mt-1 text-xs text-rose-100/90">
                  Пустые поля: {structureCheck.empty.join(", ")}
                </div>
              )}
            </div>
          )}
          {!charsOk && chars > 0 && (
            <div className="mt-2 text-xs text-rose-400">Текст должен быть от {MIN_CHARS} до {MAX_CHARS} символов.</div>
          )}
        </div>

        {/* Submit */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <button
            onClick={onValidate}
            disabled={!canSubmit}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg border border-transparent ${canSubmit ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
          >
            {loading ? "Проверяем..." : "Проверить биографию"}
          </button>
          <div className="text-xs text-muted-foreground">
            {loading ? "Запрос отправлен в AI. Это может занять 5-15 секунд." : ""}
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200">
            <div className="font-semibold">Ошибка</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        )}
      </div>

      {/* ── Results ───────────────────────────────────────────────────────── */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Score card */}
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div>
                {biographyTitle && (
                  <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-sm font-medium text-foreground">
                    📄 {biographyTitle}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">Общая оценка</div>
                <div className={`text-3xl font-bold ${scoreClass(result.score)}`}>{result.score}/10</div>
                <div className="mt-1 text-sm">
                  {(result as any)?.primaryVerdict === "passed" ? (
                    <span className="text-emerald-400 font-semibold">✅ Биография прошла проверку</span>
                  ) : (
                    <span className={`${result.score < 5 ? "text-rose-400" : "text-orange-400"} font-semibold`}>
                      {result.score < 5 ? "❌ Отказана" : "⚠️ Первичный вердикт: отказана"}
                    </span>
                  )}
                </div>
                {(result as any)?.primaryVerdict !== "passed" && (
                  <div className="mt-2 inline-flex items-center rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs text-orange-200">
                    {(() => {
                      const diff = (result as any)?.birthdate?.difference
                      if (typeof diff === "number" && diff > 0) return "Причина: возраст не совпадает с датой рождения"
                      if ((result as any)?.perspective?.status === "error") return "Причина: пункты 10–12 не от 1-го лица"
                      if ((result as any)?.structure?.status === "error") return "Причина: структура 1–13 заполнена не полностью"
                      return "Причина: требуются исправления"
                    })()}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                {usedDate && (
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
                    📅 Возраст проверен на:{" "}
                    <span className="font-semibold text-foreground">
                      {writtenDate && parsedWrittenDate ? formatDMY(parsedWrittenDate) : "сегодня"}
                    </span>
                  </div>
                )}
                <button
                  onClick={onCopy}
                  className="px-5 py-3 rounded-xl font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-all shadow-lg"
                >
                  Копировать JSON
                </button>
              </div>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">Модель: {model}</div>

            {(result as any)?.primaryVerdict !== "passed" ? (
              <div className="mt-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
                <div className="text-sm font-semibold text-orange-200">Коротко что не так</div>
                <ul className="mt-2 space-y-1 text-sm text-orange-100/90">
                  {(() => {
                    const items: string[] = []
                    const diff = (result as any)?.birthdate?.difference
                    if (typeof diff === "number" && diff > 0)           items.push("Возраст не совпадает с датой рождения")
                    if ((result as any)?.birthdate?.status === "error")  items.push("Ошибка в дате рождения / возрасте")
                    if ((result as any)?.perspective?.status === "error")items.push("Пункты 10–12 должны быть строго от 1-го лица")
                    if ((result as any)?.structure?.status === "error")  items.push("Не заполнены обязательные пункты 1–13")
                    if ((result as any)?.grammar?.status === "error")    items.push("Критические ошибки грамматики")
                    if ((result as any)?.logic?.status === "error")      items.push("Критические логические ошибки")
                    if (items.length === 0) items.push("Требуются исправления — проверьте детали ниже")
                    return items.map((t, i) => <li key={i} className="list-disc ml-5">{t}</li>)
                  })()}
                </ul>
              </div>
            ) : (
              <div className="mt-4 text-sm text-muted-foreground">Биография прошла проверку без замечаний.</div>
            )}
          </div>

          {/* Sections */}
          {result.sections?.length ? (
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">Проверка по пунктам (1-13)</h3>
                <div className="text-xs text-muted-foreground">Каждый пункт: ✅/⚠️/❌ + замечания</div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sections.slice().sort((a, b) => a.number - b.number).map(s => (
                  <div key={s.number} className="rounded-xl border border-border bg-background/50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-foreground">{s.number}. {s.title}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(s.status)}`}>
                        {s.ok ? "✅" : s.status === "warning" ? "⚠️" : "❌"}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{s.notes}</div>
                    {s.issues?.length ? (
                      <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                        {s.issues.map((it, idx) => <li key={idx}>{it}</li>)}
                      </ul>
                    ) : (
                      <div className="mt-2 text-sm text-emerald-400">Без замечаний.</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Debug */}
          {(result as any)?.debug?.normalizedText ? (
            <details className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
              <summary className="cursor-pointer text-sm font-semibold text-foreground">Debug</summary>
              <div className="mt-3 text-xs text-muted-foreground">Модель: {(result as any).debug.model}</div>
              <pre className="mt-3 whitespace-pre-wrap text-xs text-foreground/80 bg-background/50 border border-border rounded-xl p-4 overflow-auto">
                {(result as any).debug.normalizedText}
              </pre>
            </details>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Birthdate */}
            <div className={`rounded-2xl border bg-card/50 backdrop-blur p-6 shadow-xl ${ageMismatch ? "border-orange-500/40 bg-orange-500/5" : "border-border"}`}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">Дата рождения и возраст</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(result.birthdate.status)}`}>{result.birthdate.status}</span>
              </div>
              <div className="mt-3 text-sm text-foreground/90 space-y-1">
                <div>Дата: <span className="font-semibold">{result.birthdate.extracted ?? "—"}</span></div>
                <div>Указанный возраст: <span className="font-semibold">{result.birthdate.statedAge ?? "—"}</span></div>
                <div>
                  Рассчитанный возраст
                  {writtenDate && parsedWrittenDate && (
                    <span className="text-xs text-muted-foreground ml-1">(на {formatDMY(parsedWrittenDate)})</span>
                  )}
                  : <span className="font-semibold">{result.birthdate.calculatedAge ?? "—"}</span>
                </div>
                <div>Соответствие: <span className={`font-semibold ${result.birthdate.match ? "text-emerald-400" : "text-rose-400"}`}>{result.birthdate.match ? "✅" : "❌"}</span></div>
              </div>
              {result.birthdate.issues?.length > 0 && (
                <ul className="mt-3 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {result.birthdate.issues.map((it, idx) => <li key={idx}>{it}</li>)}
                </ul>
              )}
            </div>

            {/* Perspective */}
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">Повествование (1-е лицо)</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(result.perspective.status)}`}>{result.perspective.status}</span>
              </div>
              <div className="mt-3 text-sm text-foreground/90">
                Формат: {result.perspective.isFirstPerson
                  ? <span className="font-semibold text-emerald-400">✅ Первое лицо</span>
                  : <span className="font-semibold text-rose-400">❌ Есть нарушения</span>}
              </div>
              {result.perspective.violations?.length > 0 && (
                <div className="mt-3 space-y-3">
                  {result.perspective.violations.map((v, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-background/50 p-4">
                      <div className="text-sm font-semibold text-foreground">{v.section}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{v.issue}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Фрагмент: {v.text}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Предложение: {v.suggestion}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Structure */}
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">Структура</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(result.structure.status)}`}>{result.structure.status}</span>
              </div>
              <div className="mt-3 text-sm text-foreground/90 space-y-1">
                <div>Всего пунктов: <span className="font-semibold">{result.structure.totalSections}</span></div>
                <div>Все пункты присутствуют: <span className={`font-semibold ${result.structure.allSectionsPresent ? "text-emerald-400" : "text-rose-400"}`}>{result.structure.allSectionsPresent ? "✅" : "❌"}</span></div>
              </div>
              {(result.structure.missingSections?.length > 0 || result.structure.emptySections?.length > 0) && (
                <div className="mt-3 text-sm text-muted-foreground space-y-1">
                  {result.structure.missingSections?.length > 0 && <div>Отсутствуют: {result.structure.missingSections.join(", ")}</div>}
                  {result.structure.emptySections?.length > 0    && <div>Пустые: {result.structure.emptySections.join(", ")}</div>}
                </div>
              )}
            </div>

            {/* Grammar */}
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">Грамматика и орфография</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(result.grammar.status)}`}>{result.grammar.status}</span>
              </div>
              <div className="mt-3 text-sm text-foreground/90">Найдено ошибок: <span className="font-semibold">{result.grammar.errorsCount}</span></div>
              {result.grammar.errors?.length > 0 && (
                <div className="mt-3 space-y-3">
                  {result.grammar.errors.slice(0, 10).map((e, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-background/50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-foreground">{e.section}</div>
                        <div className="text-xs text-muted-foreground">{e.type} • {e.severity}</div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">{e.error}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Найдено: {e.original}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Исправление: {e.suggestion}</div>
                    </div>
                  ))}
                  {result.grammar.errors.length > 10 && (
                    <div className="text-xs text-muted-foreground">Показано 10 из {result.grammar.errors.length} ошибок.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Logic */}
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-foreground">Логическая связность</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(result.logic.status)}`}>{result.logic.status}</span>
            </div>
            <div className="mt-3 text-sm text-foreground/90 space-y-1">
              <div>Возрастная согласованность: <span className={`font-semibold ${result.logic.ageConsistency ? "text-emerald-400" : "text-rose-400"}`}>{result.logic.ageConsistency ? "✅" : "❌"}</span></div>
              <div>Образование ↔ карьера: <span className={`font-semibold ${result.logic.educationCareerMatch ? "text-emerald-400" : "text-rose-400"}`}>{result.logic.educationCareerMatch ? "✅" : "❌"}</span></div>
            </div>
            {(result.logic.chronologyIssues?.length > 0 || result.logic.issues?.length > 0) && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.logic.chronologyIssues?.length > 0 && (
                  <div className="rounded-xl border border-border bg-background/50 p-4">
                    <div className="text-sm font-semibold text-foreground">Хронология</div>
                    <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      {result.logic.chronologyIssues.map((it, idx) => <li key={idx}>{it}</li>)}
                    </ul>
                  </div>
                )}
                {result.logic.issues?.length > 0 && (
                  <div className="rounded-xl border border-border bg-background/50 p-4">
                    <div className="text-sm font-semibold text-foreground">Замечания</div>
                    <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      {result.logic.issues.map((it, idx) => <li key={idx}>{it}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground">Рекомендации</h3>
            {result.recommendations?.length ? (
              <ul className="mt-3 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {result.recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
              </ul>
            ) : (
              <div className="mt-3 text-sm text-muted-foreground">Нет рекомендаций.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}