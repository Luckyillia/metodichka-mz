import Groq from "groq-sdk"
import { buildBiographyValidationPrompt, type GroqBiographyModel } from "./prompt"

export type BiographyValidationResult = {
  valid: boolean
  score: number
  sections?: Array<{
    number: number
    title: string
    ok: boolean
    status: "success" | "warning" | "error"
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
    status: "success" | "warning" | "error"
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
    status: "success" | "warning" | "error"
  }
  perspective: {
    isFirstPerson: boolean
    violations: Array<{
      section: string
      text: string
      issue: string
      suggestion: string
    }>
    status: "success" | "warning" | "error"
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
    status: "success" | "warning" | "error"
  }
  recommendations: string[]
  summary: string
}

function extractFirstJson(text: string) {
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI не вернул JSON")
  }
  return text.slice(start, end + 1)
}

function parseBirthdateDDMMYYYY(value: string) {
  const m = /^([0-3]\d)\.([01]\d)\.(\d{4})$/.exec(value.trim())
  if (!m) return null
  const day = Number(m[1])
  const month = Number(m[2])
  const year = Number(m[3])
  if (month < 1 || month > 12) return null
  if (day < 1 || day > 31) return null
  return { day, month, year }
}

function calcAge(params: { birth: { day: number; month: number; year: number }; now: Date }) {
  const { birth, now } = params
  let age = now.getFullYear() - birth.year
  const hasBirthdayHappened =
    now.getMonth() + 1 > birth.month ||
    (now.getMonth() + 1 === birth.month && now.getDate() >= birth.day)
  if (!hasBirthdayHappened) age -= 1
  return age
}

function extractStatedAge(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value)
  if (typeof value === "string") {
    const m = value.match(/\d{1,3}/)
    if (!m) return null
    const n = Number(m[0])
    return Number.isFinite(n) ? n : null
  }
  return null
}

export async function validateBiographyWithGroq(params: {
  biographyText: string
  currentDateISO: string
  model: GroqBiographyModel
}) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error("GROQ_API_KEY не задан")
  }

  const groq = new Groq({ apiKey })

  const messages = buildBiographyValidationPrompt({
    biographyText: params.biographyText,
    currentDateISO: params.currentDateISO,
  })

  const completion = await groq.chat.completions.create({
    model: params.model,
    messages,
    temperature: 0.2,
    max_tokens: 2500,
    top_p: 1,
  })

  const content = completion.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("Пустой ответ от AI")
  }

  const jsonText = extractFirstJson(content)
  const parsed = JSON.parse(jsonText) as BiographyValidationResult

  try {
    const extracted = parsed?.birthdate?.extracted
    const birth = typeof extracted === "string" ? parseBirthdateDDMMYYYY(extracted) : null
    const now = new Date(params.currentDateISO)
    const statedAge = extractStatedAge(parsed?.birthdate?.statedAge)

    if (birth && !Number.isNaN(now.getTime())) {
      const calculatedAge = calcAge({ birth, now })
      const difference = statedAge === null ? 0 : Math.abs(calculatedAge - statedAge)
      const match = statedAge === null ? false : difference <= 1

      parsed.birthdate = {
        ...parsed.birthdate,
        calculatedAge,
        statedAge,
        difference,
        match,
      }
    } else {
      parsed.birthdate = {
        ...parsed.birthdate,
        statedAge,
      }
    }
  } catch {
    // ignore
  }

  try {
    const issues: string[] = []

    const score = typeof parsed.score === "number" && Number.isFinite(parsed.score) ? parsed.score : 0
    let nextScore = score
    let nextValid = !!parsed.valid

    if (!Array.isArray(parsed.sections) || parsed.sections.length !== 13) {
      issues.push("Структурный отчёт sections должен содержать ровно 13 пунктов")
      nextValid = false
      nextScore = Math.min(nextScore, 5)
    }

    if (parsed.birthdate?.statedAge !== null && parsed.birthdate?.calculatedAge !== null) {
      const diff = Math.abs((parsed.birthdate.calculatedAge as number) - (parsed.birthdate.statedAge as number))
      if (diff > 2) {
        issues.push("Возраст не соответствует дате рождения (разница > 2 лет)")
        parsed.birthdate = {
          ...parsed.birthdate,
          status: "error",
          match: false,
          difference: diff,
          issues: Array.isArray(parsed.birthdate.issues)
            ? Array.from(new Set([...parsed.birthdate.issues, "Возраст не соответствует дате рождения (разница > 2 лет)"]))
            : ["Возраст не соответствует дате рождения (разница > 2 лет)"],
        }
        nextValid = false
        nextScore = Math.min(nextScore, 3)
      }
    }

    if (parsed.perspective?.status === "error" || parsed.perspective?.isFirstPerson === false) {
      issues.push("Пункты 10-12 должны быть написаны от первого лица")
      nextValid = false
      nextScore = Math.min(nextScore, 3)
    }

    if (parsed.structure?.status === "error") {
      const missing = parsed.structure?.missingSections?.length || 0
      if (missing > 3) {
        issues.push("Отсутствует более 3 обязательных пунктов")
        nextValid = false
        nextScore = Math.min(nextScore, 3)
      }
    }

    parsed.valid = nextValid
    parsed.score = Math.max(0, Math.min(10, Math.round(nextScore)))

    if (issues.length) {
      parsed.summary = parsed.summary ? `${parsed.summary} ${issues.join(". ")}.` : issues.join(". ")
    }
  } catch {
    // ignore
  }

  return parsed
}
