import type { Order, OrderSettings } from '../types'
import { CITIES } from '../data'

type HeaderVariant = "gv" | "gv_sa"

export const buildHeader = (variant: HeaderVariant): string => {
  if (variant === "gv_sa") {
    return `[Заместитель Главного Врача {HOSPITAL_FULL} города {CITY} | {MY_NAME} Начальник Санитарной Авиации | {MY_NAME} ]`
  }
  return `[Главный Врач {HOSPITAL_FULL} города {CITY} | {MY_NAME} ]`
}

export const buildStatusLine = (variant: "default" | "dot" = "default"): string => {
  if (variant === "dot") {
    return `Состояние на данный момент: УП - {UP}/5; П - {P}/5; В - {V}/3.`
  }
  return `Состояние на данный момент: УП - {UP}/5; П - {P}/5; В - {V}/3`
}

export const trimEndNewlines = (value: string): string => {
  return value.replace(/[\n\r]+$/g, "")
}

export const joinHeaderBodyStatus = (
  header: string,
  body: string,
  status?: string
): string => {
  const normalizedHeader = trimEndNewlines(header)
  const normalizedBody = body.replace(/^[\n\r]+/, "")
  const base = `${normalizedHeader}\n\n${normalizedBody}`
  if (!status) return base
  return `${trimEndNewlines(base)}\n\n${status}`
}

export const replaceVariables = (
  content: string,
  settings: OrderSettings
): string => {
  const cityLabel = CITIES.find((c) => c.value === settings.city)?.label ?? settings.city
  const replacements: Record<string, string> = {
    HOSPITAL_FULL: settings.hospitalGen ?? settings.hospital,
    HOSPITAL: settings.hospital,
    CITY: cityLabel,
    MY_NAME: settings.myName,
    TARGET_NAME: settings.targetName,
    UP: settings.up,
    P: settings.p,
    V: settings.v,
  }

  let result = content
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value)
  }
  return result
}

export const formatPeople = (
  people: Array<{ name: string; position?: string }>
): string => {
  return people
    .map((p) => {
      if (p.position) return `${p.name}, находясь в должности ${p.position}`
      return p.name
    })
    .join("; ")
}

export const hasStateLine = (content: string): boolean => {
  return (
    /\{UP\}|\{P\}|\{V\}/.test(content) ||
    /Состояние|Текущее положение/i.test(content)
  )
}

export const sanitizeForCopy = (text: string): string => {
  let result = text.replace(/\r\n/g, "\n")

  result = result
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")

  result = result.replace(/\n{3,}/g, "\n\n")

  result = result.replace(
    /\n?(Состояние на данный момент:)/g,
    "\n\n$1"
  )

  result = result.replace(
    /Состояние на данный момент:\s*УП\s*[-–—]?\s*(\d+)\s*\/\s*5\s*;\s*П\s*[-–—]?\s*(\d+)\s*\/\s*5\s*;\s*В\s*[-–—]?\s*(\d+)\s*\/\s*3\s*\.?/g,
    "Состояние на данный момент:\nУП - $1/5\nП - $2/5\nВ - $3/3"
  )

  result = result
    .split("\n")
    .map((l) => l.trimStart())
    .join("\n")
    .trim()

  return result
}