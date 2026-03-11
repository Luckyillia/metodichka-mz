import type { TitleCheckResult, FormNameCheckResult, StructureCheckResult } from "../types"

// ── Name normalization ────────────────────────────────────────────────────────

export const MIN_CHARS = 800
export const MAX_CHARS = 8000

export function normalizeNameToken(token: string): string {
  const t = token.trim().toLowerCase()
  if (!t) return ""
  const hasCyr = /[а-яё]/iu.test(t)
  if (!hasCyr) return t

  // Special cases for common masculine name endings and their genitive forms
  if (t.endsWith("ий") || t.endsWith("ия")) return t.slice(0, -2) // дмитрий/дмитрия -> дмитр
  if (t.endsWith("ья") || t.endsWith("ьи")) return t.slice(0, -2) // илья/ильи -> иль

  let s = t
  if (s.endsWith("ова") || s.endsWith("ева")) s = s.slice(0, -1)
  else if (s.endsWith("иной"))                s = s.slice(0, -2)
  else if (s.endsWith("ого") || s.endsWith("его")) s = s.slice(0, -1)
  else if (s.endsWith("а")  || s.endsWith("я"))    s = s.slice(0, -1)
  if (s.endsWith("ии")) s = s.slice(0, -1)
  return s
}

// ── Title validation ──────────────────────────────────────────────────────────

export function validateBiographyTitle(title: string): TitleCheckResult {
  const t = title.trim()
  if (!t) return { ok: false, error: "Укажите заголовок темы" }
  if (t.includes("_")) return { ok: false, error: "Заголовок не должен содержать нижние подчёркивания" }
  const m = /^биография\s+([A-Za-zА-Яа-яЁё]+)\s+([A-Za-zА-Яа-яЁё]+)$/iu.exec(t)
  if (!m) return { ok: false, error: 'Формат: "Биография Имя Фамилия" (кириллица или латиница, 2 слова)' }
  return { ok: true, firstName: m[1], lastName: m[2] }
}

// ── Form field extraction ─────────────────────────────────────────────────────

export const REQUIRED_FORM_FIELDS: Array<{ key: string; labels: string[] }> = [
  { key: "Имя Фамилия",               labels: ["Имя Фамилия", "Имя и Фамилия", "ФИО", "Ф.И.О", "Фамилия Имя Отчество"] },
  { key: "Пол",                        labels: ["Пол"] },
  { key: "Национальность",             labels: ["Национальность"] },
  { key: "Возраст",                    labels: ["Возраст"] },
  { key: "Дата и место рождения",      labels: ["Дата и место рождения", "Дата рождения и место", "Дата рождения / место"] },
  { key: "Семья",                      labels: ["Семья"] },
  { key: "Место текущего проживания",  labels: ["Место текущего проживания", "Текущее проживание", "Проживание"] },
  { key: "Описание внешности",         labels: ["Описание внешности", "Внешность"] },
  { key: "Особенности характера",      labels: ["Особенности характера", "Характер"] },
  { key: "Детство",                    labels: ["Детство"] },
  { key: "Юность и взрослая жизнь",   labels: ["Юность и взрослая жизнь", "Юность", "Взрослая жизнь", "Юность/взрослая жизнь"] },
  { key: "Настоящее время",            labels: ["Настоящее время", "Настоящее"] },
  { key: "Хобби",                      labels: ["Хобби", "Увлечения"] },
]

function normalizeFieldLabel(label: string): string {
  return label.toLowerCase().replace(/\s+/g, " ").trim()
}

function buildFieldRegex(label: string): RegExp {
  const l = normalizeFieldLabel(label)
  const escaped = l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`^(?:\\d+\\s*[).]\\s*)?${escaped}\\s*[:\\-—.]\\s*(.*)$`, "iu")
}

export function extractFieldValue(
  text: string,
  labels: string[]
): { found: true; value: string } | { found: false; value: "" } {
  const rawLines = text.split(/\r?\n/).map((l) => l.trim())
  const res = labels.map((l) => buildFieldRegex(l))

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i]
    if (!line) continue

    let match: RegExpExecArray | null = null
    for (const re of res) {
      const m = re.exec(line)
      if (m) { match = m; break }
    }
    if (!match) continue

    const sameLineValue = String(match[1] || "").trim()
    if (sameLineValue) return { found: true, value: sameLineValue }

    for (let j = i + 1; j < rawLines.length; j++) {
      const next = rawLines[j]
      if (!next) continue
      const looksLikeHeader = REQUIRED_FORM_FIELDS.some((f) =>
        f.labels.some((lbl) => buildFieldRegex(lbl).test(next))
      )
      if (looksLikeHeader) return { found: true, value: "" }
      return { found: true, value: next }
    }

    return { found: true, value: "" }
  }

  return { found: false, value: "" }
}

export function extractNameFromForm(text: string): FormNameCheckResult {
  const extracted = extractFieldValue(text, ["Имя Фамилия", "Имя и Фамилия", "ФИО", "Ф.И.О", "Фамилия Имя Отчество"])
  if (!extracted.found) return { ok: false, error: 'Не найдено поле "Имя Фамилия" в тексте (заполните биографию по форме)' }
  if (!extracted.value) return { ok: false, error: 'Поле "Имя Фамилия" пустое' }
  if (extracted.value.includes("_")) return { ok: false, error: 'В поле "Имя Фамилия" запрещены нижние подчёркивания' }

  const cleanValue = extracted.value.replace(/[.!?,:;]+$/, "")
  const mm = /^([A-Za-zА-Яа-яЁё]+)\s+([A-Za-zА-Яа-яЁё]+)(?:\s+([A-Za-zА-Яа-яЁё]+))?$/u.exec(cleanValue)
  if (!mm) return { ok: false, error: 'Поле "Имя Фамилия" должно содержать 2 или 3 слова (ФИО)' }

  return { ok: true, firstName: mm[1], lastName: mm[2], patronymic: mm[3] || undefined, raw: extracted.value }
}

export function validateFormStructure(text: string): StructureCheckResult {
  const missing: string[] = []
  const empty: string[] = []

  for (const field of REQUIRED_FORM_FIELDS) {
    const extracted = extractFieldValue(text, field.labels)
    if (!extracted.found) { missing.push(field.key); continue }
    if (!extracted.value)   empty.push(field.key)
  }

  return { ok: missing.length === 0 && empty.length === 0, missing, empty }
}

export function checkTitleMatchesForm(
  titleCheck: TitleCheckResult,
  formNameCheck: FormNameCheckResult
): boolean {
  if (!titleCheck.ok || !formNameCheck.ok) return false

  const tFirst = normalizeNameToken(titleCheck.firstName ?? "")
  const tLast  = normalizeNameToken(titleCheck.lastName  ?? "")
  const fFirst = normalizeNameToken(formNameCheck.firstName ?? "")
  const fLast  = normalizeNameToken(formNameCheck.lastName  ?? "")

  return (tFirst === fFirst && tLast === fLast) || (tFirst === fLast && tLast === fFirst)
}

export function explainTitleMismatch(
  titleCheck: TitleCheckResult,
  formNameCheck: FormNameCheckResult
): string | null {
  if (!titleCheck.ok || !formNameCheck.ok) return null

  const titleFirstRaw = String(titleCheck.firstName ?? "").trim()
  const titleLastRaw  = String(titleCheck.lastName ?? "").trim()
  const formFirstRaw  = String(formNameCheck.firstName ?? "").trim()
  const formLastRaw   = String(formNameCheck.lastName ?? "").trim()

  const tFirst = normalizeNameToken(titleFirstRaw)
  const tLast  = normalizeNameToken(titleLastRaw)
  const fFirst = normalizeNameToken(formFirstRaw)
  const fLast  = normalizeNameToken(formLastRaw)

  const directMatch = tFirst === fFirst && tLast === fLast
  const swappedMatch = tFirst === fLast && tLast === fFirst
  if (directMatch || swappedMatch) return null

  const lines: string[] = []
  lines.push(`Заголовок: "${titleFirstRaw} ${titleLastRaw}"`)
  lines.push(`Поле "Имя Фамилия": "${formFirstRaw} ${formLastRaw}"`)

  const firstNormOk = tFirst === fFirst || tFirst === fLast
  const lastNormOk  = tLast === fLast  || tLast === fFirst

  const firstRawOk =
    titleFirstRaw.toLowerCase() === formFirstRaw.toLowerCase() ||
    titleFirstRaw.toLowerCase() === formLastRaw.toLowerCase()

  const lastRawOk =
    titleLastRaw.toLowerCase() === formLastRaw.toLowerCase() ||
    titleLastRaw.toLowerCase() === formFirstRaw.toLowerCase()

  if (!firstNormOk) {
    lines.push(`Не совпадает имя: "${titleFirstRaw}" vs "${formFirstRaw}"`)
  } else if (!firstRawOk) {
    lines.push(`Имя совпадает по падежу/форме: "${titleFirstRaw}" ↔ "${formFirstRaw}"`)
  }

  if (!lastNormOk) {
    lines.push(`Не совпадает фамилия: "${titleLastRaw}" vs "${formLastRaw}"`)
  } else if (!lastRawOk) {
    lines.push(`Фамилия отличается только формой/окончанием: "${titleLastRaw}" ↔ "${formLastRaw}"`)
  }

  return lines.join(". ")
}

// ── Error normalizer ──────────────────────────────────────────────────────────

export function normalizeErrorMessage(err: unknown): string {
  if (typeof err === "string") return err
  if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
    return (err as any).message
  }
  return "Ошибка запроса"
}

// ── Style helpers ─────────────────────────────────────────────────────────────

export function statusBadgeClass(status: "success" | "warning" | "error"): string {
  switch (status) {
    case "success": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    case "warning": return "bg-amber-500/15 text-amber-400 border-amber-500/30"
    case "error":   return "bg-rose-500/15 text-rose-400 border-rose-500/30"
  }
}

export function scoreClass(score: number): string {
  if (score >= 8) return "text-emerald-400"
  if (score >= 6) return "text-amber-400"
  return "text-rose-400"
}