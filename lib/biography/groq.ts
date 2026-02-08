import Groq from "groq-sdk"
import { buildBiographyValidationPrompt, type GroqBiographyModel } from "./prompt"
import { getSectionText } from "./normalize"

export type BiographyValidationResult = {
  valid: boolean
  score: number
  primaryVerdict?: "passed" | "refused"
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

function stripCodeFences(text: string) {
  return text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim()
}

function fixCommonJsonIssues(text: string) {
  let t = text
  // Remove trailing commas before } or ]
  t = t.replace(/,\s*([}\]])/g, "$1")
  return t
}

function safeJsonParse(raw: string) {
  const cleaned = fixCommonJsonIssues(stripCodeFences(raw))
  return JSON.parse(cleaned)
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

function parseBirthdateRuText(value: string) {
  const t = value.toLowerCase().replace(/\u00a0/g, " ").trim()
  const months: Record<string, number> = {
    "января": 1,
    "февраля": 2,
    "марта": 3,
    "апреля": 4,
    "мая": 5,
    "июня": 6,
    "июля": 7,
    "августа": 8,
    "сентября": 9,
    "октября": 10,
    "ноября": 11,
    "декабря": 12,
  }

  // e.g. "8 марта 2001 года"
  const m1 = t.match(/\b([0-3]?\d)\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+(\d{4})\b/u)
  if (m1) {
    const day = Number(m1[1])
    const month = months[m1[2]]
    const year = Number(m1[3])
    if (month && day >= 1 && day <= 31) return { day, month, year }
  }

  // e.g. "08.03.2001" or "8.3.2001"
  const m2 = t.match(/\b([0-3]?\d)\.([01]?\d)\.(\d{4})\b/u)
  if (m2) {
    const day = Number(m2[1])
    const month = Number(m2[2])
    const year = Number(m2[3])
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) return { day, month, year }
  }

  return null
}

function extractFirstInt(value: string) {
  const m = value.match(/\b(\d{1,3})\b/u)
  if (!m) return null
  const n = Number(m[1])
  return Number.isFinite(n) ? n : null
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

function clampStatusByDiff(diff: number) {
  if (diff > 2) return "error" as const
  if (diff > 1) return "warning" as const
  return "success" as const
}

function detectThirdPerson(text: string) {
  const t = text.toLowerCase()
  const markers = [
    /\bон\b/u,
    /\bона\b/u,
    /\bони\b/u,
    /\bего\b/u,
    /\bеё\b/u,
    /\bее\b/u,
    /\bему\b/u,
    /\bей\b/u,
    /\bих\b/u,
    /\bперсонаж\b/u,
  ]

  return markers.some((re) => re.test(t))
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
    // Some Groq models support OpenAI-compatible JSON mode
    response_format: { type: "json_object" } as any,
  } as any)

  const content = completion.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("Пустой ответ от AI")
  }

  let parsed: BiographyValidationResult
  try {
    const jsonText = extractFirstJson(content)
    parsed = safeJsonParse(jsonText) as BiographyValidationResult
  } catch (e: any) {
    const snippet = String(content).slice(0, 800)
    const errMsg = e?.message || "JSON parse error"
    const error: any = new Error(`Не удалось распарсить JSON от модели (${params.model}). ${errMsg}`)
    error.code = "invalid_ai_json"
    error.model = params.model
    error.snippet = snippet
    try {
      error.extractedLength = extractFirstJson(String(content)).length
    } catch {
      // ignore
    }
    throw error
  }

  try {
    const extracted = parsed?.birthdate?.extracted
    const birthFromAi = typeof extracted === "string" ? parseBirthdateDDMMYYYY(extracted) : null
    const s4 = getSectionText(params.biographyText, 4)
    const s5 = getSectionText(params.biographyText, 5)

    const statedAgeFromText = s4 ? extractFirstInt(s4) : null
    const birthFromText = s5 ? parseBirthdateRuText(s5) : null

    const birth = birthFromAi || birthFromText
    const now = new Date(params.currentDateISO)
    const statedAge = extractStatedAge(parsed?.birthdate?.statedAge) ?? statedAgeFromText

    if (birth && !Number.isNaN(now.getTime())) {
      const calculatedAge = calcAge({ birth, now })
      const difference = statedAge === null ? 0 : Math.abs(calculatedAge - statedAge)
      const match = statedAge === null ? false : difference <= 1
      const status = statedAge === null ? "warning" : clampStatusByDiff(difference)

      parsed.birthdate = {
        ...parsed.birthdate,
        calculatedAge,
        statedAge,
        difference,
        match,
        status,
      }

      // If any mismatch exists (difference > 0), cap the score to 7 and make status at least warning
      if (statedAge !== null && difference > 0) {
        parsed.birthdate = {
          ...parsed.birthdate,
          status: parsed.birthdate.status === "success" ? "warning" : parsed.birthdate.status,
        }

        parsed.score = Math.min(parsed.score ?? 10, 7)
        if (parsed.valid === true && parsed.score < 10) {
          // keep valid as decided by other rules; age mismatch alone is not critical
        }
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

    // Strict 1st-person enforcement for sections 10-12 using normalized text
    const s10 = getSectionText(params.biographyText, 10)
    const s11 = getSectionText(params.biographyText, 11)
    const s12 = getSectionText(params.biographyText, 12)
    const third10 = s10 ? detectThirdPerson(s10) : false
    const third11 = s11 ? detectThirdPerson(s11) : false
    const third12 = s12 ? detectThirdPerson(s12) : false
    const hasThirdPerson = third10 || third11 || third12

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

    if (hasThirdPerson) {
      const violations = []
      if (third10) violations.push({ section: "Пункт 10", text: s10, issue: "обнаружены маркеры третьего лица", suggestion: "Перепишите от первого лица (я/мне/мой)" })
      if (third11) violations.push({ section: "Пункт 11", text: s11, issue: "обнаружены маркеры третьего лица", suggestion: "Перепишите от первого лица (я/мне/мой)" })
      if (third12) violations.push({ section: "Пункт 12", text: s12, issue: "обнаружены маркеры третьего лица", suggestion: "Перепишите от первого лица (я/мне/мой)" })

      parsed.perspective = {
        ...parsed.perspective,
        isFirstPerson: false,
        status: "error",
        violations: Array.isArray(parsed.perspective?.violations)
          ? [...parsed.perspective.violations, ...violations]
          : violations,
      }

      issues.push("Строгая проверка: в пунктах 10-12 найдены маркеры третьего лица")
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

  // Deterministic primary verdict wording:
  // Only "passed" when everything is OK. Otherwise: "refused".
  try {
    const hasAgeMismatch = typeof parsed?.birthdate?.difference === "number" && parsed.birthdate.difference > 0
    const birthStatus = parsed?.birthdate?.status
    const grammarStatus = parsed?.grammar?.status
    const logicStatus = parsed?.logic?.status
    const structureStatus = parsed?.structure?.status
    const perspectiveStatus = parsed?.perspective?.status

    const allSuccess =
      birthStatus === "success" &&
      grammarStatus === "success" &&
      logicStatus === "success" &&
      structureStatus === "success" &&
      perspectiveStatus === "success" &&
      !hasAgeMismatch

    parsed.primaryVerdict = allSuccess && parsed.valid ? "passed" : "refused"

    if (parsed.primaryVerdict === "passed") {
      parsed.summary = "Биография прошла проверку."
    } else {
      const reasons: string[] = []
      if (hasAgeMismatch) reasons.push("проверьте дату рождения и возраст")
      if (birthStatus === "warning" || birthStatus === "error") reasons.push("проверьте данные по возрасту")
      if (perspectiveStatus === "warning" || perspectiveStatus === "error") reasons.push("пункты 10–12 строго от 1-го лица")
      if (structureStatus === "error") reasons.push("заполните все обязательные пункты 1–13")
      if (grammarStatus === "warning" || grammarStatus === "error") reasons.push("проверьте/исправьте грамматику")
      if (logicStatus === "warning" || logicStatus === "error") reasons.push("проверьте логическую связность")

      const tail = reasons.length ? ` ${reasons.join("; ")}.` : " Проверьте данные."
      parsed.summary = `Первичный вердикт: биография отказана.${tail}`
    }
  } catch {
    // ignore
  }

  return parsed
}
