import { useState, useMemo, useCallback } from "react"
import { AuthService } from "@/lib/auth/auth-service"
import type { BiographyValidationResult, ValidatorFormState, AIModel } from "../types"
import {
  parseDMY,
  toISODate,
  isFutureDateISO,
  validateBiographyTitle,
  extractNameFromForm,
  validateFormStructure,
  checkTitleMatchesForm,
  normalizeErrorMessage,
  MIN_CHARS,
  MAX_CHARS,
} from "../utils"

const DEFAULT_FORM: ValidatorFormState = {
  biographyTitle: "",
  writtenDate: "",
  text: "",
  model: "llama-3.3-70b-versatile",
  strict: true,
  compareBoth: false,
  debug: false,
  useCustomApiKey: false,
  customApiKey: "",
}

export const useBiographyValidator = () => {
  const [form, setForm] = useState<ValidatorFormState>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<BiographyValidationResult | null>(null)
  const [usedDate, setUsedDate] = useState<string | null>(null)

  // ── Derived state ─────────────────────────────────────────────────────────
  const chars = form.text.length
  const charsOk = chars >= MIN_CHARS && chars <= MAX_CHARS

  const parsedWrittenDate = useMemo(() => parseDMY(form.writtenDate), [form.writtenDate])
  const writtenDateValid  = form.writtenDate !== "" && parsedWrittenDate !== null

  const writtenDateISO = useMemo(() => {
    if (!parsedWrittenDate) return null
    return toISODate(parsedWrittenDate)
  }, [parsedWrittenDate])

  const writtenDateNotFuture = useMemo(() => {
    if (!writtenDateISO) return false
    return !isFutureDateISO(writtenDateISO)
  }, [writtenDateISO])

  const titleCheck    = useMemo(() => validateBiographyTitle(form.biographyTitle), [form.biographyTitle])
  const formNameCheck = useMemo(() => extractNameFromForm(form.text),              [form.text])
  const structureCheck = useMemo(() => validateFormStructure(form.text),           [form.text])

  const titleMatchesForm = useMemo(
    () => checkTitleMatchesForm(titleCheck, formNameCheck),
    [titleCheck, formNameCheck]
  )

  const ageMismatch = useMemo(() => {
    const diff = result?.birthdate?.difference
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

  // ── Form updaters ─────────────────────────────────────────────────────────
  const updateField = useCallback(<K extends keyof ValidatorFormState>(
    key: K,
    value: ValidatorFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setForm(DEFAULT_FORM)
    setResult(null)
    setError(null)
    setUsedDate(null)
  }, [])

  // ── Validate ──────────────────────────────────────────────────────────────
  const handleValidate = useCallback(async () => {
    if (!writtenDateISO) return

    setLoading(true)
    setError(null)
    setResult(null)
    setUsedDate(writtenDateISO)

    try {
      const res = await AuthService.fetchWithAuth("/api/admin/biography/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biographyText:  form.text,
          biographyTitle: form.biographyTitle.trim(),
          writtenDate:    writtenDateISO,
          model:          form.model,
          strict:         form.strict,
          compareBoth:    form.compareBoth,
          debug:          form.debug,
          apiKey:         form.useCustomApiKey && form.customApiKey.trim().length
                            ? form.customApiKey.trim()
                            : undefined,
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
  }, [form, writtenDateISO])

  const handleValidateBoth = useCallback(async () => {
    if (!writtenDateISO) return

    setLoading(true)
    setError(null)
    setResult(null)
    setUsedDate(writtenDateISO)

    try {
      const res = await AuthService.fetchWithAuth("/api/admin/biography/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biographyText:  form.text,
          biographyTitle: form.biographyTitle.trim(),
          writtenDate:    writtenDateISO,
          model:          form.model,
          strict:         form.strict,
          compareBoth:    true,
          debug:          form.debug,
          apiKey:         form.useCustomApiKey && form.customApiKey.trim().length
                            ? form.customApiKey.trim()
                            : undefined,
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
  }, [form, writtenDateISO])

  // ── Copy result JSON ──────────────────────────────────────────────────────
  const handleCopyJSON = useCallback(async () => {
    if (!result) return
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
  }, [result])

  return {
    // Form state
    form,
    updateField,
    resetForm,

    // Derived / validation
    chars,
    charsOk,
    parsedWrittenDate,
    writtenDateValid,
    writtenDateISO,
    writtenDateNotFuture,
    titleCheck,
    formNameCheck,
    structureCheck,
    titleMatchesForm,
    ageMismatch,
    canSubmit,

    // Result state
    loading,
    error,
    result,
    usedDate,

    // Actions
    handleValidate,
    handleValidateBoth,
    handleCopyJSON,
  }
}