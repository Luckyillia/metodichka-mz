export function parseDMY(value: string): Date | null {
  const m = value.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (!m) return null
  const d = Number(m[1]), mo = Number(m[2]), y = Number(m[3])
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || y < 1900 || y > 2100) return null
  const date = new Date(y, mo - 1, d)
  if (date.getMonth() !== mo - 1) return null
  return date
}

export function formatDMY(date: Date): string {
  return [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join(".")
}

export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function isFutureDateISO(iso: string): boolean {
  const d = new Date(iso + "T00:00:00")
  if (Number.isNaN(d.getTime())) return false
  const todayISO = toISODate(new Date())
  return d.getTime() > new Date(todayISO + "T00:00:00").getTime()
}

export function formatDateInput(rawDigits: string): string {
  const digits = rawDigits.replace(/\D/g, "")
  if (digits.length > 4) return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`
  if (digits.length > 2) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  return digits
}