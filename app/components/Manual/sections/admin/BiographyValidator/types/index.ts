export type Status = "success" | "warning" | "error"

export type AIModel = "llama-3.3-70b-versatile" | "openai/gpt-oss-120b"

export interface BiographySection {
  number: number
  title: string
  ok: boolean
  status: Status
  notes: string
  issues: string[]
}

export interface BiographyValidationResult {
  valid: boolean
  score: number
  primaryVerdict?: "passed" | "failed"
  sections?: BiographySection[]
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
  debug?: {
    normalizedText: string
    model: string
  }
  compare?: {
    fast: { model: AIModel; result: BiographyValidationResult }
    smart: { model: AIModel; result: BiographyValidationResult }
  }
}

export interface ValidatorFormState {
  biographyTitle: string
  writtenDate: string
  text: string
  model: AIModel
  strict: boolean
  compareBoth: boolean
  debug: boolean
  useCustomApiKey: boolean
  customApiKey: string
}

export interface TitleCheckResult {
  ok: boolean
  firstName?: string
  lastName?: string
  error?: string
}

export interface FormNameCheckResult {
  ok: boolean
  firstName?: string
  lastName?: string
  patronymic?: string
  raw?: string
  error?: string
}

export interface StructureCheckResult {
  ok: boolean
  missing: string[]
  empty: string[]
}